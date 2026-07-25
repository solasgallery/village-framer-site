import type { AuditStore } from './audit'
import type { getIntakeConfig } from './config'
import {
  createNimbleOpportunity,
  createNimbleTask,
  findOrCreateNimbleContact,
  sendAcknowledgment,
  sendInternalNotification,
} from './providers'
import {
  IntakeError,
  type AuditRecord,
  type IntakeStep,
  type StepState,
} from './types'

type Config = ReturnType<typeof getIntakeConfig>

function completed(externalId: string, detail?: string): StepState {
  return {
    status: 'completed',
    externalId,
    detail,
    completedAt: new Date().toISOString(),
  }
}

async function runStep(
  record: AuditRecord,
  store: AuditStore,
  step: IntakeStep,
  operation: () => Promise<{ externalId: string; detail?: string }>
) {
  if (record.steps[step].status === 'completed') {
    return record.steps[step].externalId as string
  }

  try {
    const result = await operation()
    record.steps[step] = completed(result.externalId, result.detail)
    await store.save(record)
    return result.externalId
  } catch (error) {
    record.steps[step] = {
      status: 'failed',
      detail: error instanceof Error ? error.message : String(error),
    }
    throw error
  }
}

export async function processRecord(
  record: AuditRecord,
  store: AuditStore,
  config: Config
): Promise<AuditRecord> {
  record.status = 'processing'
  record.attempts += 1
  record.lastError = undefined
  await store.save(record)

  try {
    const contactId = await runStep(
      record,
      store,
      'nimble_contact',
      async () => {
        const result = await findOrCreateNimbleContact({
          inquiry: record.inquiry,
          accessToken: config.nimbleAccessToken,
          ownerId: config.nimbleOwnerId,
        })
        return { externalId: result.contactId, detail: result.match }
      }
    )

    const opportunityId = await runStep(
      record,
      store,
      'nimble_opportunity',
      async () => ({
        externalId: await createNimbleOpportunity({
          inquiry: record.inquiry,
          contactId,
          accessToken: config.nimbleAccessToken,
          ownerId: config.nimbleOwnerId,
          pipelineId: config.nimblePipelineId,
          stageId: config.nimbleStageId,
        }),
      })
    )

    await runStep(record, store, 'nimble_task', async () => ({
      externalId: await createNimbleTask({
        inquiry: record.inquiry,
        contactId,
        opportunityId,
        followUpDue: record.followUpDue,
        accessToken: config.nimbleAccessToken,
        ownerId: config.nimbleOwnerId,
        endpoint: config.nimbleTaskEndpoint,
      }),
    }))

    await runStep(record, store, 'brevo_acknowledgment', async () => ({
      externalId: await sendAcknowledgment({
        inquiry: record.inquiry,
        followUpDue: record.followUpDue,
        apiKey: config.brevoApiKey,
        senderEmail: config.brevoSenderEmail,
        senderName: config.brevoSenderName,
      }),
    }))

    await runStep(record, store, 'brevo_notification', async () => ({
      externalId: await sendInternalNotification({
        inquiry: record.inquiry,
        followUpDue: record.followUpDue,
        opportunityId,
        apiKey: config.brevoApiKey,
        senderEmail: config.brevoSenderEmail,
        senderName: config.brevoSenderName,
        notificationEmail: config.notificationEmail,
      }),
    }))

    record.status = 'completed'
    await store.removeRetry(record.submissionId)
    await store.save(record)
    return record
  } catch (error) {
    record.status = 'retry_pending'
    record.lastError = error instanceof Error ? error.message : String(error)
    await store.enqueueRetry(record.submissionId)
    await store.save(record)
    throw error instanceof IntakeError
      ? error
      : new IntakeError(record.lastError, true)
  }
}
