import type { H3Event } from 'h3'
import { createValidationError } from '../../utils/apiErrors'
import { renderSanitizedMarkdown } from '../../utils/sanitizeMarkdown'
import { blogPostSchema } from '../../utils/zodSchemas'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const body: unknown = await readBody(event)
  const result = blogPostSchema.safeParse(body)
  if (!result.success) throw createValidationError(result.error)

  try {
    renderSanitizedMarkdown(result.data.content)
  } catch {
    throw createError({ statusCode: 422, statusMessage: 'Invalid Markdown content' })
  }

  const parsed = result.data
  const isPublished = parsed.is_published ?? false
  const payload = {
    ...parsed,
    is_published: isPublished,
    published_at: isPublished
      ? parsed.published_at ?? new Date().toISOString()
      : null,
  }

  const supabase = useSupabaseServer(event)
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({ ...payload, owner_id: user.id })
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: error.code === '23505' ? 409 : 500,
      statusMessage: error.code === '23505' ? 'Blog post already exists' : 'Unable to save blog post',
    })
  }
  return data
})
