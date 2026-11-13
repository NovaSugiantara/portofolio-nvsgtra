import type { H3Event } from 'h3'
import { createError, getRequestIP, readRawBody } from 'h3'
import { contactPayloadSchema } from '../utils/zodSchemas'
import { createValidationError } from '../utils/apiErrors'
import { enforceRateLimit } from '../utils/rateLimit'
import { PROJECT_TYPES, START_TIMES, labelFor } from '#shared/contactOptions'

const MAX_BODY_BYTES = 12_000

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character] ?? character))

/**
 * Public contact form. Validates the payload, then forwards it to the owner's inbox through Resend.
 *
 * Abuse controls: body size cap, per-IP rate limit (per function instance), and a honeypot field
 * that bots fill in. A filled honeypot gets a normal-looking success so bots learn nothing.
 * When delivery is not configured the endpoint returns 503 instead of claiming success,
 * so a visitor is never told a message was sent when it was dropped.
 */
export default defineEventHandler(async (event: H3Event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  enforceRateLimit(`contact:${ip}`, 5, 10 * 60_000)

  const raw = await readRawBody(event, 'utf8').catch(() => undefined)
  if (!raw || Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Message too large' })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
  }

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
  }

  const { hp, ...payload } = body as Record<string, unknown>
  if (typeof hp === 'string' && hp.trim()) {
    return { success: true }
  }

  const result = contactPayloadSchema.safeParse(payload)
  if (!result.success) {
    throw createValidationError(result.error)
  }

  const config = useRuntimeConfig(event)
  if (!config.resendApiKey || !config.contactToEmail) {
    console.error('[contact] Delivery is not configured: set RESEND_API_KEY and CONTACT_TO_EMAIL.')
    throw createError({ statusCode: 503, statusMessage: 'Contact form unavailable' })
  }

  const { name, email, message, project_type, start_time } = result.data
  const details = [
    ['Project type', labelFor(PROJECT_TYPES, project_type)],
    ['Start', labelFor(START_TIMES, start_time)],
  ].filter((row): row is [string, string] => Boolean(row[1]))
  const detailsText = details.map(([key, value]) => `${key}: ${value}`).join('\n')
  const detailsHtml = details.map(([key, value]) => `<br><strong>${key}:</strong> ${escapeHtml(value)}`).join('')
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.contactFromEmail,
      to: [config.contactToEmail],
      reply_to: email,
      subject: `Portfolio enquiry from ${name.slice(0, 80)}${project_type ? ` (${labelFor(PROJECT_TYPES, project_type)})` : ''}`,
      text: `Name: ${name}\nEmail: ${email}${detailsText ? `\n${detailsText}` : ''}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}${detailsHtml}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }),
  }).catch((error: unknown) => {
    console.error('[contact] Resend request failed', error instanceof Error ? error.message : error)
    return null
  })

  if (!response?.ok) {
    if (response) console.error('[contact] Resend rejected the message', response.status, await response.text().catch(() => ''))
    throw createError({ statusCode: 502, statusMessage: 'Message could not be delivered' })
  }

  return { success: true }
})
