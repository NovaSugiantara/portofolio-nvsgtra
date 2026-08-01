import type { H3Event } from 'h3'
import { createValidationError } from '../../../utils/apiErrors'
import { cvVariantSchema, uuidSchema } from '../../../utils/zodSchemas'

const assertOwnedReferences = async (
  supabase: ReturnType<typeof useSupabaseServer>,
  ownerId: string,
  references: { table: 'experiences' | 'projects' | 'skills'; ids: string[] }[],
) => {
  for (const reference of references) {
    if (reference.ids.length === 0) continue
    const uniqueIds = [...new Set(reference.ids)]
    const { data, error } = await supabase
      .from(reference.table)
      .select('id')
      .eq('owner_id', ownerId)
      .in('id', uniqueIds)

    if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to validate CV references' })
    if ((data ?? []).length !== uniqueIds.length) {
      throw createError({ statusCode: 422, statusMessage: 'CV references must belong to the owner' })
    }
  }
}

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const idResult = uuidSchema.safeParse(getRouterParam(event, 'id'))
  if (!idResult.success) throw createValidationError(idResult.error)
  const body: unknown = await readBody(event)
  const result = cvVariantSchema.partial().safeParse(body)
  if (!result.success) throw createValidationError(result.error)

  const supabase = useSupabaseServer(event)
  const { data: existing, error: existingError } = await supabase
    .from('cv_variants')
    .select('*')
    .eq('id', idResult.data)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (existingError) throw createError({ statusCode: 500, statusMessage: 'Unable to load CV variant' })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  await assertOwnedReferences(supabase, user.id, [
    { table: 'experiences', ids: result.data.included_experience_ids ?? existing.included_experience_ids },
    { table: 'projects', ids: result.data.included_project_ids ?? existing.included_project_ids },
    { table: 'skills', ids: result.data.included_skill_ids ?? existing.included_skill_ids },
  ])

  if (result.data.is_default === true) {
    const { error } = await supabase
      .from('cv_variants')
      .update({ is_default: false })
      .eq('owner_id', user.id)
      .eq('is_default', true)
    if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to update CV default' })
  } else if (result.data.is_default === false && existing.is_default) {
    const { data: replacement, error: replacementError } = await supabase
      .from('cv_variants')
      .select('id')
      .eq('owner_id', user.id)
      .neq('id', idResult.data)
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle()
    if (replacementError) throw createError({ statusCode: 500, statusMessage: 'Unable to choose CV default' })
    if (!replacement) throw createError({ statusCode: 422, statusMessage: 'At least one CV variant must remain default' })
    const { error: clearError } = await supabase
      .from('cv_variants')
      .update({ is_default: false })
      .eq('id', idResult.data)
      .eq('owner_id', user.id)
    if (clearError) throw createError({ statusCode: 500, statusMessage: 'Unable to update CV default' })
    const { error } = await supabase
      .from('cv_variants')
      .update({ is_default: true })
      .eq('id', replacement.id)
      .eq('owner_id', user.id)
    if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to choose CV default' })
  }

  const parsed = result.data
  const { data, error } = await supabase
    .from('cv_variants')
    .update(parsed)
    .eq('id', idResult.data)
    .eq('owner_id', user.id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to save CV variant' })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return data
})
