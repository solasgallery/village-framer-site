import { IntakeError } from './types'

function required(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new IntakeError(`Missing required configuration: ${name}`, false)
  }
  return value
}

export function getIntakeConfig() {
  return {
    turnstileSecret: required('TURNSTILE_SECRET_KEY'),
    allowedHostnames: (process.env.TURNSTILE_ALLOWED_HOSTNAMES ||
      'saladovillageframer.com,www.saladovillageframer.com')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
    redisUrl: required('INTAKE_REDIS_REST_URL'),
    redisToken: required('INTAKE_REDIS_REST_TOKEN'),
    hashSecret: required('INTAKE_HASH_SECRET'),
    nimbleAccessToken: required('NIMBLE_ACCESS_TOKEN'),
    nimbleOwnerId: required('NIMBLE_CHERIE_OWNER_ID'),
    nimblePipelineId: required('NIMBLE_SOLAS_PIPELINE_ID'),
    nimbleStageId: required('NIMBLE_NEW_INQUIRY_STAGE_ID'),
    nimbleTaskEndpoint:
      process.env.NIMBLE_TASK_ENDPOINT?.trim() ||
      'https://app.nimble.com/api/v1/tasks',
    brevoApiKey: required('BREVO_API_KEY'),
    brevoSenderEmail:
      process.env.BREVO_SVF_SENDER_EMAIL?.trim() || 'cherie@solasgallery.com',
    brevoSenderName:
      process.env.BREVO_SVF_SENDER_NAME?.trim() || 'Salado Village Framer',
    notificationEmail:
      process.env.INTAKE_NOTIFICATION_EMAIL?.trim() || 'cherie@solasgallery.com',
    cronSecret: process.env.CRON_SECRET?.trim() || '',
  }
}
