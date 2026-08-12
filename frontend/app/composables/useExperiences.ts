import type { Database } from '~/types/database'

export type PublicExperience = Pick<
  Database['public']['Tables']['experiences']['Row'],
  'id' | 'company' | 'role' | 'location' | 'start_date' | 'end_date' | 'bullets' | 'sort_order'
>

export const useExperiences = () =>
  useFetch<PublicExperience[]>('/api/experiences', {
    key: 'experiences',
  })
