import type { H3Event } from 'h3'

export default defineEventHandler(async (_event: H3Event) => {
  const supabase = useSupabasePublic()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_published', true)
    .limit(1)
    .single()

  if (error) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
  }

  return data
})
