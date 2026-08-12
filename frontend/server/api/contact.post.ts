import type { H3Event } from 'h3'
import { readBody } from 'h3'
import { contactPayloadSchema } from '../utils/zodSchemas'
import { createValidationError } from '../utils/apiErrors'

/**
 * Contact submissions are handled and persisted by the backend service on
 * port 8001 (which owns POST /api/contact). This handler exists as a
 * self-contained fallback so the Nuxt server never depends on external state:
 * it validates the payload and acknowledges receipt.
 */
export default defineEventHandler(async (event: H3Event) => {
  const rawBody = await readBody(event).catch(() => null)

  if (rawBody && typeof rawBody === 'object' && typeof (rawBody as Record<string, unknown>).hp === 'string' && (rawBody as Record<string, unknown>).hp) {
    return { success: true }
  }

  const { hp: _hp, ...payload } = (rawBody ?? {}) as Record<string, unknown>
  const result = contactPayloadSchema.safeParse(payload)
  if (!result.success) {
    throw createValidationError(result.error)
  }

  return { success: true }
})
