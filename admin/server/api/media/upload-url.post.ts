import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { MEDIA_BUCKET, MEDIA_RULES } from '#shared/media'

const bodySchema = z.object({
  site: z.enum(['portfolio', 'forgebyte']),
  kind: z.enum(['image', 'video']),
  contentType: z.string().max(40),
  size: z.number().int().positive(),
}).strict()

/**
 * Hands the browser a one-time signed upload URL for a path the server chose.
 * The file goes straight to Storage (Vercel functions cap request bodies at 4.5 MB);
 * /api/media/verify then checks the bytes that actually arrived.
 */
export default defineEventHandler(async (event) => {
  const { userId, supabase } = await requireOwner(event)
  enforceRateLimit(`upload:${userId}`, 20, 60_000)

  const parsed = bodySchema.safeParse(await readBody(event).catch(() => null))
  if (!parsed.success) throw createError({ statusCode: 422, statusMessage: 'Invalid upload request' })

  const { site, kind, contentType, size } = parsed.data
  const rules = MEDIA_RULES[kind]
  const extension = (rules.types as Record<string, string>)[contentType]
  if (!extension) throw createError({ statusCode: 415, statusMessage: `Unsupported ${kind} type` })
  if (size > rules.maxBytes) throw createError({ statusCode: 413, statusMessage: `File is larger than ${rules.maxBytes / 1024 / 1024} MB` })

  const month = new Date().toISOString().slice(0, 7)
  const path = `${site}/${kind}s/${month}/${randomUUID()}.${extension}`

  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).createSignedUploadUrl(path)
  if (error || !data) {
    console.error('[media] createSignedUploadUrl failed', error?.message)
    throw createError({ statusCode: 502, statusMessage: 'Could not prepare the upload' })
  }
  return { path: data.path, token: data.token }
})
