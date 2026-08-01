import type { H3Event } from 'h3'
import { createValidationError } from '../../utils/apiErrors'
import { educationSchema } from '../../utils/zodSchemas'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const body: unknown = await readBody(event)
  const result = educationSchema.safeParse(body)
  if (!result.success) throw createValidationError(result.error)

  const supabase = useSupabaseServer(event)
  const { data, error } = await supabase
    .from('education')
    .insert({ ...result.data, owner_id: user.id })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to save education' })
  return data
})
