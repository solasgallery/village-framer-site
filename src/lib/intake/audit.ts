import { Redis } from '@upstash/redis'
import type { AuditRecord, RejectedAuditRecord } from './types'

const RECORD_TTL_SECONDS = 90 * 24 * 60 * 60
const REJECTED_TTL_SECONDS = 30 * 24 * 60 * 60

export class AuditStore {
  private readonly redis: Redis

  constructor(url: string, token: string) {
    this.redis = new Redis({ url, token })
  }

  async rateLimit(ipHash: string, limit = 5, windowSeconds = 15 * 60) {
    const bucket = Math.floor(Date.now() / (windowSeconds * 1000))
    const key = `intake:rate:${ipHash}:${bucket}`
    const count = await this.redis.incr(key)
    if (count === 1) await this.redis.expire(key, windowSeconds + 60)
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) }
  }

  async acquireLock(submissionId: string): Promise<boolean> {
    const result = await this.redis.set(`intake:lock:${submissionId}`, '1', {
      nx: true,
      ex: 90,
    })
    return result === 'OK'
  }

  async releaseLock(submissionId: string) {
    await this.redis.del(`intake:lock:${submissionId}`)
  }

  async get(submissionId: string): Promise<AuditRecord | null> {
    return this.redis.get<AuditRecord>(`intake:submission:${submissionId}`)
  }

  async save(record: AuditRecord) {
    record.updatedAt = new Date().toISOString()
    await this.redis.set(`intake:submission:${record.submissionId}`, record, {
      ex: RECORD_TTL_SECONDS,
    })
  }

  async reject(record: RejectedAuditRecord) {
    await this.redis.set(`intake:rejected:${record.submissionId}`, record, {
      ex: REJECTED_TTL_SECONDS,
    })
  }

  async enqueueRetry(submissionId: string) {
    await this.redis.sadd('intake:retry', submissionId)
  }

  async removeRetry(submissionId: string) {
    await this.redis.srem('intake:retry', submissionId)
  }

  async retryIds(limit = 10): Promise<string[]> {
    const ids = await this.redis.smembers<string[]>('intake:retry')
    return ids.slice(0, limit)
  }
}
