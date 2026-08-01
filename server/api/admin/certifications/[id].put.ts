import type { H3Event } from 'h3'
import { createValidationError } from '../../../utils/apiErrors'
import { certificationSchema, uuidSchema } from '../../../utils/zodSchemas'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const idResult = uuidSchema.safeParse(getRouterParam(event, 'id'))
  if (!idResult.success) throw createValidationError(idResult.error)
  const body: unknown = await readBody(event)
  const result = certificationSchema.partial().safeParse(body)
  if (!result.success) throw createValidationError(result.error)

  const supabase = useSupabaseServer(event)
  const { data: existing, error: existingError } = await supabase
    .from('certifications')
    .select('*')
    .eq('id', idResult.data)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (existingError) throw createError({ statusCode: 500, statusMessage: 'Unable to load certification' })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  const mergedResult = certificationSchema.safeParse({
    name: result.data.name ?? existing.name,
    issuer: result.data.issuer ?? existing.issuer,
    issued_date: result.data.issued_date === undefined ? existing.issued_date : result.data.issued_date,
    credential_url: result.data.credential_url === undefined ? existing.credential_url : result.data.credential_url,
    sort_order: result.data.sort_order ?? existing.sort_order,
    is_published: result.data.is_published ?? existing.is_published,
  })
  if (!mergedResult.success) throw createValidationError(mergedResult.error)

  const { data, error } = await supabase
    .from('certifications')
    .update(result.data)
    .eq('id', idResult.data)
    .eq('owner_id', user.id)
    .select()
    .single()
  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to save certification' })
  return data
})
