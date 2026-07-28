import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const body = await readBody(event)
  const parsed = cvVariantSchema.parse(body)

  const supabase = useSupabaseAdmin()

  // If this variant is marked default, unset any existing default first.
  if (parsed.is_default) {
    await supabase.from('cv_variants').update({ is_default: false }).eq('owner_id', user.id)
  }

  const { data, error } = await supabase
    .from('cv_variants')
    .insert({ ...parsed, owner_id: user.id })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
