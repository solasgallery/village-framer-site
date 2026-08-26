import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuditRecord } from './types'

const providerMocks = vi.hoisted(() => ({
  findOrCreateNimbleContact: vi.fn(),
  createNimbleOpportunity: vi.fn(),
  createNimbleTask: vi.fn(),
  sendAcknowledgment: vi.fn(),
  sendInternalNotification: vi.fn(),
}))

vi.mock('./providers', () => providerMocks)

import { processRecord } from './processor'

const record = (): AuditRecord => ({
  submissionId: '73f7d434-862c-4c6a-b385-baa6064bd634',
  status: 'processing',
  inquiry: {
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
    message: '',
    marketingConsent: false,
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
  },
  ipHash: 'hash',
  turnstile: { success: true },
  createdAt: '2026-07-25T16:00:00.000Z',
  updatedAt: '2026-07-25T16:00:00.000Z',
  attempts: 0,
  followUpDue: '2026-07-25T18:00:00.000Z',
  steps: {
    nimble_contact: { status: 'pending' },
    nimble_opportunity: { status: 'pending' },
    nimble_task: { status: 'pending' },
    brevo_acknowledgment: { status: 'pending' },
    brevo_notification: { status: 'pending' },
  },
})

const config = {
  nimbleAccessToken: 'nimble',
  nimbleOwnerId: 'cherie',
  nimblePipelineId: 'pipeline',
  nimbleStageId: 'stage',
  nimbleTaskEndpoint: 'https://app.nimble.com/api/v1/tasks',
  brevoApiKey: 'brevo',
  brevoSenderEmail: 'cherie@solasgallery.com',
  brevoSenderName: 'Salado Village Framer',
  notificationEmail: 'cherie@solasgallery.com',
}

function store() {
  return {
    save: vi.fn(),
    enqueueRetry: vi.fn(),
    removeRetry: vi.fn(),
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  providerMocks.findOrCreateNimbleContact.mockResolvedValue({
    contactId: 'contact',
    match: 'email',
  })
  providerMocks.createNimbleOpportunity.mockResolvedValue('opportunity')
  providerMocks.createNimbleTask.mockResolvedValue('task')
  providerMocks.sendAcknowledgment.mockResolvedValue('ack')
  providerMocks.sendInternalNotification.mockResolvedValue('notification')
})

describe('processRecord', () => {
  it('marks success only after every required external step is confirmed', async () => {
    const audit = store()
    const result = await processRecord(
      record(),
      audit as never,
      config as never
    )

    expect(result.status).toBe('completed')
    expect(Object.values(result.steps).every((step) => step.status === 'completed'))
      .toBe(true)
    expect(audit.removeRetry).toHaveBeenCalledWith(result.submissionId)
  })

  it('keeps a durable retry state when acknowledgment fails', async () => {
    providerMocks.sendAcknowledgment.mockRejectedValue(
      new Error('Brevo unavailable')
    )
    const audit = store()
    const submission = record()

    await expect(
      processRecord(submission, audit as never, config as never)
    ).rejects.toThrow('Brevo unavailable')
    expect(submission.status).toBe('retry_pending')
    expect(submission.steps.brevo_acknowledgment.status).toBe('failed')
    expect(submission.steps.brevo_notification.status).toBe('pending')
    expect(audit.enqueueRetry).toHaveBeenCalledWith(submission.submissionId)
  })

  it('does not repeat already-confirmed steps on reconciliation', async () => {
    const submission = record()
    submission.steps.nimble_contact = {
      status: 'completed',
      externalId: 'existing-contact',
    }
    const audit = store()

    await processRecord(submission, audit as never, config as never)
    expect(providerMocks.findOrCreateNimbleContact).not.toHaveBeenCalled()
    expect(providerMocks.createNimbleOpportunity).toHaveBeenCalledWith(
      expect.objectContaining({ contactId: 'existing-contact' })
    )
  })
})
