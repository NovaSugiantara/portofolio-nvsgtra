import type { SeedEarlierWork, SeedProject } from '~~/server/data/portfolio'

export type PublicProject = SeedProject
export type EarlierWork = SeedEarlierWork

export const useProjects = () =>
  useFetch<PublicProject[]>('/api/projects', {
    key: 'projects',
    default: () => [],
  })

export const useEarlierWork = () =>
  useFetch<EarlierWork[]>('/api/earlier-work', {
    key: 'earlier-work',
    default: () => [],
  })

/** Awaited so a page can decide on a 404 during server rendering. */
export const useProjectBySlug = async (slug: string) => {
  const result = await useProjects()

  return {
    ...result,
    data: computed(() => result.data.value?.find((project) => project.slug === slug) ?? null),
  }
}
