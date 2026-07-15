export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return
  if (to.path === '/admin/login') return

  const supabase = useSupabaseBrowser()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return navigateTo('/admin/login')
  }
})
