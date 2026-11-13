import type { SeedSkill } from '~~/server/data/portfolio'

type GroupedSkills = Record<string, SeedSkill[]>

export const useSkills = () =>
  useFetch<GroupedSkills>('/api/skills', {
    key: 'skills',
  })
