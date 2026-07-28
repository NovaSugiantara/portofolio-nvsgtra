import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const parsed = cvVariantSchema.partial().parse(body)

  const supabase = useSupabaseAdmin()

  if (parsed.is_default) {
    await supabase.from('cv_variants').update({ is_default: false }).eq('owner_id', user.id)
  }

  const { data, error } = await supabase
    .from('cv_variants')
    .update(parsed)
    .eq('id', id)
    .eq('owner_id', user.id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return data
})
