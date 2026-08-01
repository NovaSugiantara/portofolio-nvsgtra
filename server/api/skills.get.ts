import type { Tables } from '~/types/database'
import { createInternalServerError } from '../utils/apiErrors'

type PublicSkill = Pick<Tables<'skills'>, 'id' | 'category' | 'name' | 'sort_order'>
type PublicSkillsByCategory = Record<string, PublicSkill[]>

export default defineEventHandler(async (): Promise<PublicSkillsByCategory> => {
  const supabase = useSupabasePublic()

  const { data, error } = await supabase
    .from('skills')
    .select('id,category,name,sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    throw createInternalServerError()
  }

  const grouped = new Map<string, PublicSkill[]>()
  for (const skill of data ?? []) {
    const publicSkill: PublicSkill = {
      id: skill.id,
      category: skill.category,
      name: skill.name,
      sort_order: skill.sort_order,
    }
    grouped.set(skill.category, [...(grouped.get(skill.category) ?? []), publicSkill])
  }

  return Object.fromEntries(grouped) as PublicSkillsByCategory
})
