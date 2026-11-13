import { z } from 'zod'

const bodySchema = z.object({ site: z.enum(['portfolio', 'forgebyte']) }).strict()

/**
 * Rebuilds a public site by calling its Vercel deploy hook. The hook URL is a secret
 * (anyone holding it can trigger builds), so it lives only in server runtime config.
 */
export default defineEventHandler(async (event) => {
  const { userId } = await requireOwner(event)
  enforceRateLimit(`publish:${userId}`, 3, 5 * 60_000)

  const parsed = bodySchema.safeParse(await readBody(event).catch(() => null))
  if (!parsed.success) throw createError({ statusCode: 422, statusMessage: 'Invalid site' })

  const config = useRuntimeConfig(event)
  const hook = parsed.data.site === 'portfolio' ? config.deployHookPortfolio : config.deployHookForgebyte
  if (!hook) throw createError({ statusCode: 503, statusMessage: 'Deploy hook is not configured for this site' })

  const response = await fetch(hook, { method: 'POST' }).catch((error: unknown) => {
    console.error('[publish] deploy hook request failed', error instanceof Error ? error.message : error)
    return null
  })
  if (!response?.ok) {
    console.error('[publish] deploy hook rejected', response?.status)
    throw createError({ statusCode: 502, statusMessage: 'Vercel did not accept the publish request' })
  }

  return { ok: true, requestedAt: new Date().toISOString() }
})
