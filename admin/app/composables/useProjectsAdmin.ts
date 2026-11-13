import type { Database } from '#shared/database'

export type ProjectRow = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']

/** Friendly text for the database errors the forms can actually trigger. */
export const describeDbError = (error: { code?: string, message: string } | null): string => {
  if (!error) return ''
  if (error.code === '23505') return 'Another project already uses this slug.'
  if (error.code === '23514') return 'One of the values is not allowed. Check URLs (https:// or /path) and lengths.'
  if (error.code === '42501' || error.code === 'PGRST301') return 'Your session is not allowed to do this. Sign in again.'
  return 'Could not save. Try again.'
}

export const useProjectsAdmin = (site: 'portfolio' | 'forgebyte' = 'portfolio') => {
  const supabase = useSupabase()
  // shallowRef: rows contain a recursive Json column that deep refs cannot type; updates replace rows.
  const projects = shallowRef<ProjectRow[]>([])
  const loading = ref(true)
  const error = ref('')

  const load = async () => {
    loading.value = true
    const { data, error: loadError } = await supabase
      .from('projects')
      .select('*')
      .eq('site', site)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
    loading.value = false
    if (loadError) {
      error.value = 'Could not load projects.'
      return
    }
    error.value = ''
    projects.value = data
  }

  const setPublished = async (project: ProjectRow, isPublished: boolean) => {
    const { error: updateError } = await supabase.from('projects').update({ is_published: isPublished }).eq('id', project.id)
    if (updateError) throw new Error(describeDbError(updateError))
    projects.value = projects.value.map((item) => (item.id === project.id ? { ...item, is_published: isPublished } : item))
  }

  /** Moves a project one place and rewrites sort_order as 1..n so gaps never accumulate. */
  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= projects.value.length) return
    const reordered = [...projects.value]
    const [item] = reordered.splice(index, 1)
    reordered.splice(target, 0, item!)
    const renumbered = reordered.map((project, position) => ({ ...project, sort_order: position + 1 }))
    const changed = renumbered.filter((project, position) => reordered[position]!.sort_order !== project.sort_order)
    for (const project of changed) {
      const { error: updateError } = await supabase.from('projects').update({ sort_order: project.sort_order }).eq('id', project.id)
      if (updateError) {
        await load()
        throw new Error(describeDbError(updateError))
      }
    }
    projects.value = renumbered
  }

  const remove = async (project: ProjectRow) => {
    const { error: deleteError } = await supabase.from('projects').delete().eq('id', project.id)
    if (deleteError) throw new Error(describeDbError(deleteError))
    projects.value = projects.value.filter((item) => item.id !== project.id)
  }

  return { projects, loading, error, load, setPublished, move, remove }
}
