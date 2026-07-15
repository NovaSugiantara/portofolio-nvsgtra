import type { Database } from '~/types/database'

type Project = Database['public']['Tables']['projects']['Row']

export const useProjects = () =>
  useFetch<Project[]>('/api/projects', {
    key: 'projects',
    default: () => [],
  })
