import type { H3Event } from 'h3'
import { getRequestHeader, getRequestIP, readBody } from 'h3'
import { contactPayloadSchema, honeypotSchema } from '../utils/zodSchemas'
import { createInternalServerError, createRateLimitError, createValidationError } from '../utils/apiErrors'
import { rateLimit } from '../utils/rateLimit'

const MAX_CONTACT_BODY_BYTES = 16_384
type ContactResponse = { success: true }

const successResponse: ContactResponse = { success: true }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isWithinBodyLimit = (value: unknown): boolean => {
  const serialized = JSON.stringify(value)
  return serialized !== undefined && new TextEncoder().encode(serialized).byteLength <= MAX_CONTACT_BODY_BYTES
}

export default defineEventHandler(async (event: H3Event): Promise<ContactResponse> => {
  const contentLengthHeader = getRequestHeader(event, 'content-length')
  if (contentLengthHeader !== undefined) {
    const contentLength = Number(contentLengthHeader)
    if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
    }
    if (contentLength > MAX_CONTACT_BODY_BYTES) {
      throw createError({ statusCode: 413, statusMessage: 'Payload too large' })
    }
  }

  let rawBody: unknown
  try {
    rawBody = await readBody(event)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
  }

  if (!isWithinBodyLimit(rawBody) || !isRecord(rawBody)) {
    throw createError({ statusCode: 413, statusMessage: 'Payload too large' })
  }

  // Honeypot is validated separately so it never reaches the database schema.
  if (typeof rawBody.hp === 'string' && rawBody.hp.length > 0) {
    return successResponse
  }

  const honeypotResult = honeypotSchema.safeParse({ hp: rawBody.hp })
  if (!honeypotResult.success) {
    throw createValidationError(honeypotResult.error)
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const { allowed, retryAfter } = rateLimit(`contact:${ip}`, 5, 60_000)
  if (!allowed) {
    throw createRateLimitError(retryAfter)
  }

  const { hp: _honeypot, ...payload } = rawBody
  const payloadResult = contactPayloadSchema.safeParse(payload)
  if (!payloadResult.success) {
    throw createValidationError(payloadResult.error)
  }

  const supabase = useSupabasePublic()
  try {
    const { error } = await supabase.from('contact_messages').insert({
      name: payloadResult.data.name,
      email: payloadResult.data.email,
      message: payloadResult.data.message,
    })

    if (error) {
      throw createInternalServerError()
    }
  } catch {
    throw createInternalServerError()
  }

  return successResponse
})
