export default defineNuxtRouteMiddleware(async (to) => {
  const { refresh } = useOwnerSession()
  const access = await refresh()

  if (to.path === '/login') {
    if (access === 'ready') return navigateTo('/')
    return
  }
  if (access !== 'ready') return navigateTo({ path: '/login', query: to.fullPath !== '/' ? { next: to.fullPath } : undefined })
})
