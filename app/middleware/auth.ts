export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return
  if (to.path === '/admin/login') return

  const { fetchUser } = useAuth()
  const currentUser = await fetchUser()

  if (!currentUser) {
    return navigateTo(
      {
        path: '/admin/login',
        query: { redirect: to.fullPath },
      },
      { replace: true },
    )
  }
})
