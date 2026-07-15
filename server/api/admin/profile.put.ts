import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const body = await readBody(event)
  const parsed = profileSchema.parse(body)

  const supabase = useSupabaseAdmin()

  // find existing profile by owner_id
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle()

  let result
  if (existing) {
    const { data, error } = await supabase
      .from('profiles')
      .update(parsed)
      .eq('owner_id', user.id)
      .select()
      .single()
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    result = data
  } else {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ ...parsed, owner_id: user.id })
      .select()
      .single()
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    result = data
  }

  return result
})