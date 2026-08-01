import type { Tables } from '~/types/database'
import { createInternalServerError } from '../utils/apiErrors'

type PublicEducation = Pick<
  Tables<'education'>,
  'id' | 'institution' | 'degree' | 'start_date' | 'end_date' | 'is_expected' | 'sort_order'
>

export default defineEventHandler(async (): Promise<PublicEducation[]> => {
  const supabase = useSupabasePublic()
  const { data, error } = await supabase
    .from('education')
    .select('id,institution,degree,start_date,end_date,is_expected,sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    throw createInternalServerError()
  }

  return (data ?? []).map((education): PublicEducation => ({
    id: education.id,
    institution: education.institution,
    degree: education.degree,
    start_date: education.start_date,
    end_date: education.end_date,
    is_expected: education.is_expected,
    sort_order: education.sort_order,
  }))
})
