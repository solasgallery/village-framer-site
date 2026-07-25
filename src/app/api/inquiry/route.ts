import { NextRequest, NextResponse } from 'next/server'
import { AuditStore } from '@/lib/intake/audit'
import { getIntakeConfig } from '@/lib/intake/config'
import { calculateFollowUpDue } from '@/lib/intake/follow-up'
import { processRecord } from '@/lib/intake/processor'
import { IntakeError, type AuditRecord } from '@/lib/intake/types'
import { hashValue, parseInquiry } from '@/lib/intake/validation'
import { verifyTurnstile } from '@/lib/intake/turnstile'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function clientIp(request: NextRequest) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

function errorResponse(error: unknown, submissionId?: string) {
  const intakeError =
    error instanceof IntakeError
      ? error
      : new IntakeError('Unexpected intake failure', true)
  console.error('SVF intake failure', {
    submissionId,
    retryable: intakeError.retryable,
    error: intakeError.message,
  })
  return NextResponse.json(
    {
      success: false,
      submission_id: submissionId,
      error: intakeError.publicMessage,
      retryable: intakeError.retryable,
    },
    { status: intakeError.retryable ? 503 : 422 }
  )
}

export async function POST(request: NextRequest) {
  let submissionId: string | undefined
  let store: AuditStore | undefined
  let lockAcquired = false

  try {
    const config = getIntakeConfig()
    store = new AuditStore(config.redisUrl, config.redisToken)
    const ip = clientIp(request)
    const ipHash = hashValue(ip, config.hashSecret)
    const contentLength = Number(request.headers.get('content-length') || '0')
    if (contentLength > 20_000) {
      submissionId = crypto.randomUUID()
      await store.reject({
        submissionId,
        status: 'rejected',
        reason: 'payload_too_large',
        ipHash,
        createdAt: new Date().toISOString(),
      })
      throw new IntakeError('Inquiry payload exceeds 20 KB', false)
    }
    const body = await request.json()
    const parsed = parseInquiry(body)
    const resolvedSubmissionId =
      parsed.inquiry?.submissionId || crypto.randomUUID()
    submissionId = resolvedSubmissionId
    const email =
      typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    const rate = await store.rateLimit(ipHash)
    if (!rate.allowed) {
      await store.reject({
        submissionId: resolvedSubmissionId,
        status: 'rejected',
        reason: 'rate_limited',
        ipHash,
        emailHash: email ? hashValue(email, config.hashSecret) : undefined,
        createdAt: new Date().toISOString(),
      })
      return NextResponse.json(
        {
          success: false,
          submission_id: resolvedSubmissionId,
          error: 'Please wait a few minutes before trying again.',
        },
        { status: 429 }
      )
    }

    if (parsed.honeypot || parsed.errors.length || !parsed.inquiry) {
      await store.reject({
        submissionId: resolvedSubmissionId,
        status: 'rejected',
        reason: parsed.honeypot ? 'honeypot' : parsed.errors.join(' '),
        ipHash,
        emailHash: email ? hashValue(email, config.hashSecret) : undefined,
        createdAt: new Date().toISOString(),
      })
      throw new IntakeError(
        parsed.honeypot ? 'Honeypot triggered' : parsed.errors.join(' '),
        false,
        parsed.honeypot
          ? 'We could not verify this submission.'
          : parsed.errors[0] || 'Please check the form and try again.'
      )
    }

    let turnstile
    try {
      turnstile = await verifyTurnstile({
        token: parsed.turnstileToken,
        ip,
        submissionId: resolvedSubmissionId,
        secret: config.turnstileSecret,
        allowedHostnames: config.allowedHostnames,
      })
    } catch (error) {
      if (error instanceof IntakeError && !error.retryable) {
        await store.reject({
          submissionId: resolvedSubmissionId,
          status: 'rejected',
          reason: 'turnstile_failed',
          ipHash,
          emailHash: hashValue(parsed.inquiry.email, config.hashSecret),
          createdAt: new Date().toISOString(),
        })
      }
      throw error
    }

    lockAcquired = await store.acquireLock(resolvedSubmissionId)
    if (!lockAcquired) {
      throw new IntakeError('Submission is already processing', true)
    }

    const existing = await store.get(resolvedSubmissionId)
    if (existing?.status === 'completed') {
      return NextResponse.json({ success: true, submission_id: resolvedSubmissionId })
    }
    if (
      existing &&
      (existing.inquiry.email !== parsed.inquiry.email ||
        existing.inquiry.sourceUrl !== parsed.inquiry.sourceUrl)
    ) {
      throw new IntakeError('Submission ID payload mismatch', false)
    }

    const now = new Date().toISOString()
    const record: AuditRecord =
      existing || {
        submissionId: resolvedSubmissionId,
        status: 'processing',
        inquiry: parsed.inquiry,
        ipHash,
        turnstile: {
          success: true,
          hostname: turnstile.hostname,
          action: turnstile.action,
        },
        createdAt: now,
        updatedAt: now,
        attempts: 0,
        followUpDue: calculateFollowUpDue(
          new Date(parsed.inquiry.submittedAt)
        ).toISOString(),
        steps: {
          nimble_contact: { status: 'pending' },
          nimble_opportunity: { status: 'pending' },
          nimble_task: { status: 'pending' },
          brevo_acknowledgment: { status: 'pending' },
          brevo_notification: { status: 'pending' },
        },
      }

    const completed = await processRecord(record, store, config)
    return NextResponse.json({
      success: completed.status === 'completed',
      submission_id: resolvedSubmissionId,
    })
  } catch (error) {
    return errorResponse(error, submissionId)
  } finally {
    if (store && lockAcquired && submissionId) {
      await store.releaseLock(submissionId).catch((error) => {
        console.error('Failed to release intake lock', { submissionId, error })
      })
    }
  }
}
