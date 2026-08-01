import type { Tables } from '~/types/database'
import { createInternalServerError } from '../utils/apiErrors'

type PublicProject = Pick<
  Tables<'projects'>,
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

export default defineEventHandler(async (): Promise<PublicProject[]> => {
  const supabase = useSupabasePublic()
  const { data, error } = await supabase
    .from('projects')
    .select('id,slug,title,description,tech_stack,role,project_url,repo_url,cover_image_url,sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    throw createInternalServerError()
  }

  return (data ?? []).map((project): PublicProject => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    tech_stack: project.tech_stack,
    role: project.role,
    project_url: project.project_url,
    repo_url: project.repo_url,
    cover_image_url: project.cover_image_url,
    sort_order: project.sort_order,
  }))
})
