import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const id = getRouterParam(event, 'id')

  const supabase = useSupabaseAdmin()
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { success: true }
})
