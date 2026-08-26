import { IntakeError } from './types'

interface TurnstileResult {
  success: boolean
  hostname?: string
  action?: string
  'error-codes'?: string[]
}

export async function verifyTurnstile(input: {
  token: string
  ip?: string
  submissionId: string
  secret: string
  allowedHostnames: string[]
}): Promise<TurnstileResult & { success: true }> {
  const form = new FormData()
  form.set('secret', input.secret)
  form.set('response', input.token)
  form.set('idempotency_key', input.submissionId)
  if (input.ip) form.set('remoteip', input.ip)

  let response: Response
  try {
    response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: form, signal: AbortSignal.timeout(8000) }
    )
  } catch (error) {
    throw new IntakeError(`Turnstile unavailable: ${String(error)}`, true)
  }

  if (!response.ok) {
    throw new IntakeError(`Turnstile returned HTTP ${response.status}`, true)
  }

  const result = (await response.json()) as TurnstileResult
  if (
    !result.success ||
    result.action !== 'svf_contact' ||
    !result.hostname ||
    !input.allowedHostnames.includes(result.hostname.toLowerCase())
  ) {
    throw new IntakeError(
      `Turnstile rejected request: ${(result['error-codes'] || []).join(',') || 'context mismatch'}`,
      false,
      'Verification failed. Please refresh the form and try again.'
    )
  }

  return { ...result, success: true }
}
