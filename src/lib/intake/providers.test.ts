import { afterEach, describe, expect, it, vi } from 'vitest'
import { findOrCreateNimbleContact, sendAcknowledgment } from './providers'
import type { Inquiry } from './types'

const inquiry: Inquiry = {
  submissionId: '73f7d434-862c-4c6a-b385-baa6064bd634',
  submittedAt: '2026-07-25T16:00:00.000Z',
  startedAt: Date.parse('2026-07-25T15:59:50.000Z'),
  brand: 'Salado Village Framer',
  formName: 'SVF contact',
  inquiryType: 'Framing inquiry',
  sourceChannel: 'website',
  sourceUrl: 'https://www.saladovillageframer.com/contact',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '',
  message: 'Please frame my print.',
  marketingConsent: false,
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
}

afterEach(() => vi.restoreAllMocks())

describe('Nimble conservative matching', () => {
  it('uses one exact email match without updating identity fields', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ resources: [{ id: 'contact-1' }] }), {
          status: 200,
        })
      )

    await expect(
      findOrCreateNimbleContact({
        inquiry,
        accessToken: 'token',
        ownerId: 'cherie',
      })
    ).resolves.toEqual({ contactId: 'contact-1', match: 'email' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][1]?.method).toBeUndefined()
  })

  it('stops for ambiguous exact matches and does not create a contact', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ resources: [{ id: 'contact-1' }, { id: 'contact-2' }] }),
        { status: 200 }
      )
    )

    await expect(
      findOrCreateNimbleContact({
        inquiry,
        accessToken: 'token',
        ownerId: 'cherie',
      })
    ).rejects.toThrow('Ambiguous Nimble contact match')
  })
})

describe('Brevo acknowledgment', () => {
  it('sends a transactional message without adding a marketing list', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ messageId: 'brevo-message-1' }), {
        status: 201,
      })
    )

    await expect(
      sendAcknowledgment({
        inquiry,
        followUpDue: '2026-07-25T18:00:00.000Z',
        apiKey: 'key',
        senderEmail: 'cherie@solasgallery.com',
        senderName: 'Salado Village Framer',
      })
    ).resolves.toBe('brevo-message-1')

    const request = JSON.parse(fetchMock.mock.calls[0][1]?.body as string)
    expect(request.listIds).toBeUndefined()
    expect(request.to).toEqual([{ email: inquiry.email, name: inquiry.name }])
    expect(request.headers['Idempotency-Key']).toContain(inquiry.submissionId)
  })
})
