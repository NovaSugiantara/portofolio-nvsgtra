import type { SeedProfile } from '~~/server/data/portfolio'

export const useProfile = () =>
  useFetch<SeedProfile>('/api/profile', {
    key: 'profile',
  })
