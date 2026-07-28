// Minimal in-memory sliding-window rate limiter.
// Scope: single-owner portfolio, single Nuxt instance. For multi-instance
// (serverless scaling) swap the Map for a shared store (Upstash/Redis).
// ponytail: process-local token bucket — upgrade only if deployed multi-region.

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
  const now = Date.now()
  const bucket = store.get(key)

  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfter: 0 }
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count += 1
  return { allowed: true, retryAfter: 0 }
}
