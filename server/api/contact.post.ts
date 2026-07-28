import type { H3Event } from 'h3'
import { getRequestIP } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  // 1. Honeypot — hidden field bots auto-fill. Humans never see/touch it.
  const raw = await readBody(event)
  if (raw && typeof raw.hp === 'string' && raw.hp.length > 0) {
    // Pretend success to waste bot effort, but store nothing.
    return { success: true }
  }

  // 2. Rate limit by IP (single-owner, low volume).
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const { allowed, retryAfter } = rateLimit(`contact:${ip}`, 5, 60_000)
  if (!allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many requests',
      data: { retryAfter },
    })
  }

  // 3. Validate with zod (reject unknown fields via .strict in schema).
  const parsed = contactSchema.parse(raw)

  // 4. Insert via anon client — RLS permits anon INSERT on contact_messages.
  const supabase = useSupabasePublic()
  const { error } = await supabase.from('contact_messages').insert({
    name: parsed.name,
    email: parsed.email,
    message: parsed.message,
  })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { success: true }
})
