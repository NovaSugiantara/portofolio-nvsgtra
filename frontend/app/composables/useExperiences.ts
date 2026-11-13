import type { SeedExperience } from '~~/server/data/portfolio'

export type PublicExperience = SeedExperience

export const useExperiences = () =>
  useFetch<PublicExperience[]>('/api/experiences', {
    key: 'experiences',
    default: () => [],
  })
