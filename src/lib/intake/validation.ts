import { createHmac } from 'crypto'
import type { Inquiry, ParsedInquiry } from './types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.com',
  'throwawaymail.com',
  'yopmail.com',
])

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function exact(value: unknown, expected: string): boolean {
  return typeof value === 'string' && value === expected
}

export function parseInquiry(body: unknown, now = Date.now()): ParsedInquiry {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { honeypot: '', turnstileToken: '', errors: ['Invalid request body.'] }
  }

  const input = body as Record<string, unknown>
  const submissionId = text(input.submission_id, 36)
  const submittedAt = text(input.submitted_at, 40)
  const startedAt =
    typeof input.started_at === 'number' && Number.isFinite(input.started_at)
      ? input.started_at
      : 0
  const name = text(input.name, 120)
  const email = text(input.email, 254).toLowerCase()
  const phone = text(input.phone, 40)
  const message = text(input.message, 5000)
  const sourceUrl = text(input.source_url, 500)
  const turnstileToken = text(input.turnstile_token, 2048)
  const honeypot = text(input.website, 200)
  const errors: string[] = []

  if (!UUID_PATTERN.test(submissionId)) errors.push('Invalid submission ID.')
  if (!submittedAt || Number.isNaN(Date.parse(submittedAt))) {
    errors.push('Invalid submission time.')
  } else if (Math.abs(now - Date.parse(submittedAt)) > 24 * 60 * 60 * 1000) {
    errors.push('Submission time is outside the accepted window.')
  }
  if (!startedAt || now - startedAt < 3000 || now - startedAt > 24 * 60 * 60 * 1000) {
    errors.push('Invalid form completion time.')
  }
  if (!exact(input.brand, 'Salado Village Framer')) errors.push('Invalid brand.')
  if (!exact(input.form_name, 'SVF contact')) errors.push('Invalid form.')
  if (!exact(input.inquiry_type, 'Framing inquiry')) errors.push('Invalid inquiry type.')
  if (!exact(input.source_channel, 'website')) errors.push('Invalid source channel.')
  if (input.marketing_consent !== false) errors.push('Invalid consent value.')
  if (name.length < 2) errors.push('Name is required.')
  if (typeof input.name === 'string' && input.name.trim().length > 120) {
    errors.push('Name is too long.')
  }
  if (!EMAIL_PATTERN.test(email)) errors.push('A valid email is required.')
  if (typeof input.email === 'string' && input.email.trim().length > 254) {
    errors.push('Email is too long.')
  }
  if (typeof input.phone === 'string' && input.phone.trim().length > 40) {
    errors.push('Phone number is too long.')
  }
  if (phone && !/^[+()\d.\-\s]{7,40}$/.test(phone)) errors.push('Invalid phone number.')
  if (typeof input.message === 'string' && input.message.trim().length > 5000) {
    errors.push('Message is too long.')
  }
  if (typeof input.source_url === 'string' && input.source_url.trim().length > 500) {
    errors.push('Source URL is too long.')
  }
  if (!turnstileToken) errors.push('Verification is required.')

  try {
    const url = new URL(sourceUrl)
    if (!['saladovillageframer.com', 'www.saladovillageframer.com', 'localhost'].includes(url.hostname)) {
      errors.push('Invalid source URL.')
    }
  } catch {
    errors.push('Invalid source URL.')
  }

  const domain = email.split('@')[1]
  const configuredDisposable = (process.env.DISPOSABLE_EMAIL_DOMAINS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  if (domain && (DISPOSABLE_DOMAINS.has(domain) || configuredDisposable.includes(domain))) {
    errors.push('Please use a permanent email address.')
  }

  if (errors.length) {
    return { honeypot, turnstileToken, errors }
  }

  const inquiry: Inquiry = {
    submissionId,
    submittedAt: new Date(submittedAt).toISOString(),
    startedAt,
    brand: 'Salado Village Framer',
    formName: 'SVF contact',
    inquiryType: 'Framing inquiry',
    sourceChannel: 'website',
    sourceUrl,
    name,
    email,
    phone,
    message,
    marketingConsent: false,
    utmSource: text(input.utm_source, 200),
    utmMedium: text(input.utm_medium, 200),
    utmCampaign: text(input.utm_campaign, 200),
  }

  return { inquiry, honeypot, turnstileToken, errors: [] }
}

export function hashValue(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex')
}

export function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/)
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  }
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return phone.trim()
}
