import type { H3Event } from 'h3'
import { projectSchema } from '../../../utils/zodSchemas'
import { getAdminRouteUuid, readAdminPatch, throwAdminDatabaseError, throwAdminNotFound } from '../../../utils/adminRoute'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const id = getAdminRouteUuid(event)
  const parsed = await readAdminPatch(event, projectSchema.partial())

  const supabase = useSupabaseServer(event)
  const { data, error } = await supabase
    .from('projects')
    .update(parsed)
    .eq('id', id)
    .eq('owner_id', user.id)
    .select()
    .maybeSingle()

  if (error) throwAdminDatabaseError(error)
  if (!data) throwAdminNotFound('Project')
  return data
})
