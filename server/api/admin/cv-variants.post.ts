import type { H3Event } from 'h3'
import { createValidationError } from '../../utils/apiErrors'
import { cvVariantSchema } from '../../utils/zodSchemas'

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
  const body: unknown = await readBody(event)
  const result = cvVariantSchema.safeParse(body)
  if (!result.success) throw createValidationError(result.error)
  const parsed = result.data

  const supabase = useSupabaseServer(event)
  await assertOwnedReferences(supabase, user.id, [
    { table: 'experiences', ids: parsed.included_experience_ids },
    { table: 'projects', ids: parsed.included_project_ids },
    { table: 'skills', ids: parsed.included_skill_ids },
  ])

  const { data: existingDefaults, error: defaultsError } = await supabase
    .from('cv_variants')
    .select('id')
    .eq('owner_id', user.id)
    .eq('is_default', true)
  if (defaultsError) throw createError({ statusCode: 500, statusMessage: 'Unable to load CV defaults' })

  const isDefault = parsed.is_default === true || (existingDefaults ?? []).length === 0
  if (isDefault && (existingDefaults ?? []).length > 0) {
    const { error } = await supabase
      .from('cv_variants')
      .update({ is_default: false })
      .eq('owner_id', user.id)
      .eq('is_default', true)
    if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to update CV default' })
  }

  const { data, error } = await supabase
    .from('cv_variants')
    .insert({ ...parsed, is_default: isDefault, owner_id: user.id })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to save CV variant' })
  return data
})
