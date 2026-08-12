import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const supabase = useSupabaseServer(event)
  const { data, error } = await supabase
    .from('cv_variants')
    .select('*')
    .eq('owner_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true })
    .order('id', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to load CV variants' })
  return data ?? []
})
