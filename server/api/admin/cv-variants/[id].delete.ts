import type { H3Event } from 'h3'
import { createValidationError } from '../../../utils/apiErrors'
import { uuidSchema } from '../../../utils/zodSchemas'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const idResult = uuidSchema.safeParse(getRouterParam(event, 'id'))
  if (!idResult.success) throw createValidationError(idResult.error)

  const supabase = useSupabaseServer(event)
  const { data: existing, error: existingError } = await supabase
    .from('cv_variants')
    .select('id,is_default')
    .eq('id', idResult.data)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (existingError) throw createError({ statusCode: 500, statusMessage: 'Unable to load CV variant' })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  if (existing.is_default) {
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
    if (replacement) {
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
  }

  const { data, error } = await supabase
    .from('cv_variants')
    .delete()
    .eq('id', idResult.data)
    .eq('owner_id', user.id)
    .select('id')
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to delete CV variant' })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { success: true }
})
