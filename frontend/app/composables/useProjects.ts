import type { Database } from '~/types/database'

import { computed } from 'vue'

export type PublicProject = Pick<
  Database['public']['Tables']['projects']['Row'],
  | 'id'
  | 'slug'
  | 'title'
  | 'description'
  | 'tech_stack'
  | 'role'
  | 'project_url'
  | 'repo_url'
  | 'cover_image_url'
  | 'sort_order'
>

export const useProjects = () =>
  useFetch<PublicProject[]>('/api/projects', {
    key: 'projects',
  })

export const useProjectBySlug = (slug: string) => {
  const result = useProjects()

  return {
    ...result,
    data: computed(() => result.data.value?.find((project) => project.slug === slug) ?? null),
  }
}
