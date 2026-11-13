import { createError } from 'h3'
import type { ZodError } from 'zod'

export const createRateLimitError = (retryAfter: number) => {
  const safeRetryAfter = Number.isFinite(retryAfter)
    ? Math.max(1, Math.ceil(retryAfter))
    : 1

  return createError({
    statusCode: 429,
    statusMessage: 'Too many requests',
    data: { retryAfter: safeRetryAfter },
  })
}

export const createValidationError = (error: ZodError) =>
  createError({
    statusCode: 422,
    statusMessage: 'Invalid request',
    data: {
      issues: error.issues.map(({ path, message }) => ({ path, message })),
    },
  })

export const createInternalServerError = () =>
  createError({ statusCode: 500, statusMessage: 'Internal server error' })
