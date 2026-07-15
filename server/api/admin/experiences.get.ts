import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  await requireOwner(event)
  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
