import type { H3Event } from 'h3'

export default defineEventHandler(async (_event: H3Event) => {
  const supabase = useSupabasePublic()
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
