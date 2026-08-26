import { describe, expect, it } from 'vitest'
import { parseInquiry } from './validation'

const now = Date.parse('2026-07-25T16:00:00.000Z')

function valid(overrides: Record<string, unknown> = {}) {
  return {
    submission_id: '73f7d434-862c-4c6a-b385-baa6064bd634',
    submitted_at: '2026-07-25T16:00:00.000Z',
    started_at: now - 10_000,
    brand: 'Salado Village Framer',
    form_name: 'SVF contact',
    inquiry_type: 'Framing inquiry',
    source_channel: 'website',
    source_url: 'https://www.saladovillageframer.com/contact?utm_source=test',
    name: 'Ada Lovelace',
    email: 'ADA@example.com',
    phone: '(254) 555-0100',
    message: 'I need a frame.',
    turnstile_token: 'token',
    marketing_consent: false,
    website: '',
    ...overrides,
  }
}

describe('parseInquiry', () => {
  it('normalizes a valid inquiry without granting marketing consent', () => {
    const result = parseInquiry(valid(), now)
    expect(result.errors).toEqual([])
    expect(result.inquiry).toMatchObject({
      email: 'ada@example.com',
      marketingConsent: false,
      brand: 'Salado Village Framer',
    })
  })

  it.each([
    [{ name: '' }, 'Name is required.'],
    [{ email: 'not-an-email' }, 'A valid email is required.'],
    [{ started_at: now - 500 }, 'Invalid form completion time.'],
    [{ source_url: 'https://attacker.example/contact' }, 'Invalid source URL.'],
    [{ email: 'person@mailinator.com' }, 'Please use a permanent email address.'],
    [{ marketing_consent: true }, 'Invalid consent value.'],
  ])('rejects invalid input %o', (override, expected) => {
    expect(parseInquiry(valid(override), now).errors).toContain(expected)
  })

  it('returns the honeypot separately for rejection auditing', () => {
    expect(parseInquiry(valid({ website: 'https://spam.example' }), now).honeypot)
      .toBe('https://spam.example')
  })
})
