const hits = new Map<string, number[]>()

/** Per-instance sliding window. Enough to stop a double click or a loop; not a global quota. */
export const enforceRateLimit = (key: string, limit: number, windowMs: number) => {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs)
  if (recent.length >= limit) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests, wait a moment' })
  }
  recent.push(now)
  hits.set(key, recent)
}
