import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  await requireOwner(event)
  const id = getRouterParam(event, 'id')
  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle()
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return data
})
