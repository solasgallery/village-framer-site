import { NextRequest, NextResponse } from 'next/server'
import { AuditStore } from '@/lib/intake/audit'
import { getIntakeConfig } from '@/lib/intake/config'
import { processRecord } from '@/lib/intake/processor'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const config = getIntakeConfig()
  if (
    !config.cronSecret ||
    request.headers.get('authorization') !== `Bearer ${config.cronSecret}`
  ) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
  }

  const store = new AuditStore(config.redisUrl, config.redisToken)
  const ids = await store.retryIds(10)
  const results: Array<{ submission_id: string; status: string }> = []

  for (const submissionId of ids) {
    const locked = await store.acquireLock(submissionId)
    if (!locked) {
      results.push({ submission_id: submissionId, status: 'locked' })
      continue
    }

    try {
      const record = await store.get(submissionId)
      if (!record) {
        await store.removeRetry(submissionId)
        results.push({ submission_id: submissionId, status: 'missing' })
      } else if (record.status === 'completed') {
        await store.removeRetry(submissionId)
        results.push({ submission_id: submissionId, status: 'completed' })
      } else {
        await processRecord(record, store, config)
        results.push({ submission_id: submissionId, status: 'completed' })
      }
    } catch {
      results.push({ submission_id: submissionId, status: 'retry_pending' })
    } finally {
      await store.releaseLock(submissionId)
    }
  }

  return NextResponse.json({ processed: results.length, results })
}
