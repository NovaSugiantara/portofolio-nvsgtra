import type { H3Event } from 'h3'

export default defineEventHandler(async (_event: H3Event) => {
  const supabase = useSupabasePublic()

  // Group skills by category — do the grouping here so client doesn't need to
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  const grouped: Record<string, typeof data> = {}
  for (const skill of data) {
    if (!grouped[skill.category]) grouped[skill.category] = []
    grouped[skill.category].push(skill)
  }

  return grouped
})
