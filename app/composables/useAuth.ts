import type { User } from '@supabase/supabase-js'

// Admin auth composable - wraps the browser Supabase client for the
// single-owner login flow. Session persists in cookies via @supabase/ssr.
export const useAuth = () => {
  const supabase = useSupabaseBrowser()
  const user = useState<User | null>('auth-user', () => null)
  const loading = ref(true)

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser()
    user.value = data.user ?? null
    loading.value = false
    return user.value
  }

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const { data } = await supabase.auth.getUser()
    user.value = data.user ?? null
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  return { user, loading, fetchUser, login, logout }
}
