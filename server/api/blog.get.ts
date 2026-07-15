import type { H3Event } from 'h3'

export default defineEventHandler(async (_event: H3Event) => {
  const supabase = useSupabasePublic()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id,slug,title,excerpt,tags,published_at,cover_image_url,sort_order')
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsLast: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
