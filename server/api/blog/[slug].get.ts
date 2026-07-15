import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
  }

  const supabase = useSupabasePublic()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  // Render markdown → sanitized HTML server-side (SRS §8.11)
  const html = renderSanitizedMarkdown(data.content)

  return {
    ...data,
    content_html: html,
  }
})
