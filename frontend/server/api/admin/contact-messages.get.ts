import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  await requireOwner(event)
  const supabase = useSupabaseServer(event)
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to load contact messages' })
  return data ?? []
})
