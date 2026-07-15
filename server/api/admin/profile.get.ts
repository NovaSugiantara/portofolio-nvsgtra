import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  await requireOwner(event)
  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
