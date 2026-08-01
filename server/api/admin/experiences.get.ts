import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const supabase = useSupabaseServer(event)
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('owner_id', user.id)
    .order('sort_order', { ascending: true })

  if (error) throwAdminDatabaseError(error)
  return data
})
