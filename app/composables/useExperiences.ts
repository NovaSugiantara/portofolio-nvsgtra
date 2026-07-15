import type { Database } from '~/types/database'

type Experience = Database['public']['Tables']['experiences']['Row']

export const useExperiences = () =>
  useFetch<Experience[]>('/api/experiences', {
    key: 'experiences',
    default: () => [],
  })
