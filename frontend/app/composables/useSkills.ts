import type { Database } from '~/types/database'

type Skill = Database['public']['Tables']['skills']['Row']
type GroupedSkills = Record<string, Skill[]>

export const useSkills = () =>
  useFetch<GroupedSkills>('/api/skills', {
    key: 'skills',
  })
