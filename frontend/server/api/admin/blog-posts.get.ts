import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const supabase = useSupabaseServer(event)
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('owner_id', user.id)
    .order('published_at', { ascending: false, nullsFirst: false })

  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to load blog posts' })
  return data ?? []
})
