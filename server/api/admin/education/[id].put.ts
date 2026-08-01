import type { H3Event } from 'h3'
import { createValidationError } from '../../../utils/apiErrors'
import { educationSchema, uuidSchema } from '../../../utils/zodSchemas'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const idResult = uuidSchema.safeParse(getRouterParam(event, 'id'))
  if (!idResult.success) throw createValidationError(idResult.error)
  const body: unknown = await readBody(event)
  const result = educationSchema.partial().safeParse(body)
  if (!result.success) throw createValidationError(result.error)

  const supabase = useSupabaseServer(event)
  const { data: existing, error: existingError } = await supabase
    .from('education')
    .select('*')
    .eq('id', idResult.data)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (existingError) throw createError({ statusCode: 500, statusMessage: 'Unable to load education' })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  const mergedResult = educationSchema.safeParse({
    institution: result.data.institution ?? existing.institution,
    degree: result.data.degree ?? existing.degree,
    start_date: result.data.start_date === undefined ? existing.start_date : result.data.start_date,
    end_date: result.data.end_date === undefined ? existing.end_date : result.data.end_date,
    is_expected: result.data.is_expected ?? existing.is_expected,
    sort_order: result.data.sort_order ?? existing.sort_order,
    is_published: result.data.is_published ?? existing.is_published,
  })
  if (!mergedResult.success) throw createValidationError(mergedResult.error)

  const { data, error } = await supabase
    .from('education')
    .update(result.data)
    .eq('id', idResult.data)
    .eq('owner_id', user.id)
    .select()
    .single()
  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to save education' })
  return data
})
