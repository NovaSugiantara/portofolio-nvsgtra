import type { Tables } from '~/types/database'
import { createInternalServerError } from '../utils/apiErrors'

type PublicExperience = Pick<
  Tables<'experiences'>,
  'id' | 'company' | 'role' | 'location' | 'start_date' | 'end_date' | 'bullets' | 'sort_order'
>

export default defineEventHandler(async (): Promise<PublicExperience[]> => {
  const supabase = useSupabasePublic()
  const { data, error } = await supabase
    .from('experiences')
    .select('id,company,role,location,start_date,end_date,bullets,sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    throw createInternalServerError()
  }

  return (data ?? []).map((experience): PublicExperience => ({
    id: experience.id,
    company: experience.company,
    role: experience.role,
    location: experience.location,
    start_date: experience.start_date,
    end_date: experience.end_date,
    bullets: experience.bullets,
    sort_order: experience.sort_order,
  }))
})
