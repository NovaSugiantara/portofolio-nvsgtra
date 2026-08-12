import type { H3Event } from 'h3'
import { createValidationError } from '../../../utils/apiErrors'
import { contactMessageReadStateSchema, uuidSchema } from '../../../utils/zodSchemas'

export default defineEventHandler(async (event: H3Event) => {
  await requireOwner(event)
  const idResult = uuidSchema.safeParse(getRouterParam(event, 'id'))
  if (!idResult.success) throw createValidationError(idResult.error)

  const body: unknown = await readBody(event)
  const result = contactMessageReadStateSchema.safeParse(body)
  if (!result.success) throw createValidationError(result.error)

  const supabase = useSupabaseServer(event)
  const { data, error } = await supabase
    .from('contact_messages')
    .update(result.data)
    .eq('id', idResult.data)
    .select('*')
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to update contact message' })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return data
})
