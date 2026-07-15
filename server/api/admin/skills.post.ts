import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const user = await requireOwner(event)
  const body = await readBody(event)
  const parsed = skillSchema.parse(body)

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase
    .from('skills')
    .insert({ ...parsed, owner_id: user.id })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})
