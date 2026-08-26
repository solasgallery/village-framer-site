import { IntakeError } from './types'

export async function fetchJson<T>(
  url: string,
  init: RequestInit,
  operation: string,
  attempts = 3
): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(10000),
      })

      const body = await response.text()
      if (!response.ok) {
        const retryable = response.status === 429 || response.status >= 500
        throw new IntakeError(
          `${operation} failed (${response.status}): ${body.slice(0, 500)}`,
          retryable
        )
      }

      return (body ? JSON.parse(body) : {}) as T
    } catch (error) {
      lastError = error
      const retryable = error instanceof IntakeError ? error.retryable : true
      if (!retryable || attempt === attempts) break
      await new Promise((resolve) => setTimeout(resolve, attempt * 150))
    }
  }

  if (lastError instanceof IntakeError) throw lastError
  throw new IntakeError(`${operation} failed: ${String(lastError)}`, true)
}
