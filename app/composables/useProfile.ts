import type { Database } from '~/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export const useProfile = () =>
  useFetch<Profile>('/api/profile', {
    key: 'profile',
  })
