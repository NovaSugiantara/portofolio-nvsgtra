import type { H3Event } from 'h3'
import { projectSchema } from '../../utils/zodSchemas'
import { readAdminBody, throwAdminDatabaseError } from '../../utils/adminRoute'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const parsed = await readAdminBody(event, projectSchema)

  const supabase = useSupabaseServer(event)
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...parsed, owner_id: user.id })
    .select()
    .single()

  if (error) throwAdminDatabaseError(error)
  return data
})
