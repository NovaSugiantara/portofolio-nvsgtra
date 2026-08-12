import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const supabase = useSupabaseServer(event)
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('owner_id', user.id)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to load education' })
  return data ?? []
})
