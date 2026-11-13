// Minimal in-memory fixed-window rate limiter.
// Scope: single-owner portfolio, single Nuxt instance. For multi-instance
// (serverless scaling) swap the Map for a shared store (Upstash/Redis).
// ponytail: process-local token bucket — upgrade only if deployed multi-region.

import { createRateLimitError } from './apiErrors'

interface Bucket {
  count: number
  resetAt: number
}

const store = new Map<string, Bucket>()

export const rateLimit = (
  key: string,
  limit = 5,
  windowMs = 60_000,
): { allowed: boolean; retryAfter: number } => {
  if (!key.trim() || !Number.isInteger(limit) || limit < 1 || !Number.isFinite(windowMs) || windowMs <= 0) {
    throw new RangeError('Invalid rate-limit configuration')
  }

  const now = Date.now()
  for (const [storedKey, storedBucket] of store) {
    if (now >= storedBucket.resetAt) store.delete(storedKey)
  }

  const bucket = store.get(key)

  if (!bucket || now >= bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfter: 0 }
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) }
  }

  bucket.count += 1
  return { allowed: true, retryAfter: 0 }
}

export const enforceRateLimit = (
  key: string,
  limit = 5,
  windowMs = 60_000,
): void => {
  const result = rateLimit(key, limit, windowMs)
  if (!result.allowed) throw createRateLimitError(result.retryAfter)
}
