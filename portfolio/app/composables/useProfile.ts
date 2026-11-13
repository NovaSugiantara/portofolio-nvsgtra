import type { PublicProfile } from '~~/server/utils/content'

export type { PublicProfile }

export const useProfile = () =>
  useFetch<PublicProfile>('/api/profile', {
    key: 'profile',
  })
