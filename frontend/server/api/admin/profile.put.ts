import type { H3Event } from 'h3'
import { profileSchema } from '../../utils/zodSchemas'
import { readAdminBody, throwAdminDatabaseError, throwAdminNotFound } from '../../utils/adminRoute'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const parsed = await readAdminBody(event, profileSchema)

  const supabase = useSupabaseServer(event)
  const { data: existing, error: existingError } = await supabase
    .from('profiles')
    .select('id')
    .eq('owner_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existingError) throwAdminDatabaseError(existingError)
  if (!existing) throwAdminNotFound('Profile')

  const { data, error } = await supabase
    .from('profiles')
    .update(parsed)
    .eq('id', existing.id)
    .eq('owner_id', user.id)
    .select()
    .maybeSingle()

  if (error) throwAdminDatabaseError(error)
  if (!data) throwAdminNotFound('Profile')

  return data
})
