import type { H3Event } from 'h3'
import { createValidationError } from '../../../utils/apiErrors'
import { uuidSchema } from '../../../utils/zodSchemas'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const idResult = uuidSchema.safeParse(getRouterParam(event, 'id'))
  if (!idResult.success) throw createValidationError(idResult.error)

  const supabase = useSupabaseServer(event)
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('id', idResult.data)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to load education' })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return data
})
