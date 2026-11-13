import { z } from 'zod'
import { MEDIA_BUCKET, MEDIA_RULES } from '#shared/media'

const bodySchema = z.object({
  path: z.string().regex(/^(portfolio|forgebyte)\/(image|video)s\/\d{4}-\d{2}\/[0-9a-f-]{36}\.(webp|webm|mp4)$/),
}).strict()

/**
 * Reads the first bytes of an uploaded object and compares them with the extension the
 * server assigned. A mismatch or an oversized file is deleted and reported.
 */
export default defineEventHandler(async (event) => {
  const { userId, supabase } = await requireOwner(event)
  enforceRateLimit(`verify:${userId}`, 30, 60_000)

  const parsed = bodySchema.safeParse(await readBody(event).catch(() => null))
  if (!parsed.success) throw createError({ statusCode: 422, statusMessage: 'Invalid path' })
  const { path } = parsed.data
  const kind = path.split('/')[1] === 'videos' ? 'video' : 'image'
  const extension = path.split('.').pop()!
  const expectedType = Object.entries(MEDIA_RULES[kind].types).find(([, ext]) => ext === extension)?.[0]

  const bucket = supabase.storage.from(MEDIA_BUCKET)
  const { data: publicUrl } = bucket.getPublicUrl(path)

  const response = await fetch(publicUrl.publicUrl, { headers: { Range: 'bytes=0-63' } }).catch(() => null)
  const head = response?.ok ? new Uint8Array(await response.arrayBuffer()).slice(0, 64) : null
  const totalSize = Number(response?.headers.get('content-range')?.split('/')[1] ?? response?.headers.get('content-length') ?? 0)

  const detected = head ? sniffMedia(head) : null
  if (!head || detected !== expectedType || totalSize > MEDIA_RULES[kind].maxBytes) {
    const { error } = await bucket.remove([path])
    if (error) console.error('[media] could not remove rejected upload', path, error.message)
    console.warn('[media] rejected upload', { path, detected, totalSize })
    throw createError({ statusCode: 415, statusMessage: 'The file content does not match an allowed type' })
  }

  return { url: publicUrl.publicUrl }
})
