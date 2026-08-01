import type { H3Event } from 'h3'
import { createValidationError } from '../../../utils/apiErrors'
import { renderSanitizedMarkdown } from '../../../utils/sanitizeMarkdown'
import { blogPostSchema, uuidSchema } from '../../../utils/zodSchemas'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const idResult = uuidSchema.safeParse(getRouterParam(event, 'id'))
  if (!idResult.success) throw createValidationError(idResult.error)
  const body: unknown = await readBody(event)
  const result = blogPostSchema.partial().safeParse(body)
  if (!result.success) throw createValidationError(result.error)

  const supabase = useSupabaseServer(event)
  const { data: existing, error: existingError } = await supabase
    .from('blog_posts')
    .select('is_published,published_at')
    .eq('id', idResult.data)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (existingError) throw createError({ statusCode: 500, statusMessage: 'Unable to load blog post' })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  if (result.data.content !== undefined) {
    try {
      renderSanitizedMarkdown(result.data.content)
    } catch {
      throw createError({ statusCode: 422, statusMessage: 'Invalid Markdown content' })
    }
  }

  const isPublished = result.data.is_published ?? existing.is_published
  const publishedAt = isPublished
    ? result.data.published_at ?? existing.published_at ?? new Date().toISOString()
    : null
  const parsed = { ...result.data, is_published: isPublished, published_at: publishedAt }
  const { data, error } = await supabase
    .from('blog_posts')
    .update(parsed)
    .eq('id', idResult.data)
    .eq('owner_id', user.id)
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: error.code === '23505' ? 409 : 500,
      statusMessage: error.code === '23505' ? 'Blog post already exists' : 'Unable to save blog post',
    })
  }
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return data
})
