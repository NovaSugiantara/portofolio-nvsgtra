import type { H3Event } from 'h3'
import { getAdminRouteUuid, throwAdminDatabaseError, throwAdminNotFound } from '../../../utils/adminRoute'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const id = getAdminRouteUuid(event)

  const supabase = useSupabaseServer(event)
  const { data, error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)
    .select('id')
    .maybeSingle()

  if (error) throwAdminDatabaseError(error)
  if (!data) throwAdminNotFound('Experience')
  return { success: true }
})
