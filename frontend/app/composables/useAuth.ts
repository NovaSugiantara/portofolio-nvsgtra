import type { User } from '@supabase/supabase-js'

// Client auth is a navigation aid only. Server routes still call requireOwner.
export const useAuth = () => {
  const supabase = useSupabaseBrowser()
  const user = useState<User | null>('auth-user', () => null)
  const loading = useState('auth-loading', () => true)
  const listenerStarted = useState('auth-listener-started', () => false)

  const fetchUser = async (): Promise<User | null> => {
    loading.value = true

    try {
      const { data, error } = await supabase.auth.getUser()
      user.value = error ? null : data.user ?? null
      return user.value
    } catch {
      user.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const login = async (email: string, password: string): Promise<User> => {
    loading.value = true

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) throw error

      const verifiedUser = await fetchUser()
      if (!verifiedUser) throw new Error('Unable to verify the sign-in session')

      return verifiedUser
    } catch (error) {
      user.value = null
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const getSafeAuthMessage = (error: unknown): string => {
    const message = error instanceof Error ? error.message.toLowerCase() : ''

    if (message.includes('invalid login credentials') || message.includes('invalid_credentials')) {
      return 'The email or password is incorrect.'
    }

    if (message.includes('rate limit') || message.includes('too many')) {
      return 'Too many sign-in attempts. Please wait a moment and try again.'
    }

    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return 'The sign-in service is unavailable. Check your connection and try again.'
    }

    return 'Unable to sign in. Please check your details and try again.'
  }

  if (import.meta.client && !listenerStarted.value) {
    listenerStarted.value = true

    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        user.value = null
        loading.value = false
        return
      }

      loading.value = true
      window.setTimeout(() => {
        void fetchUser()
      }, 0)
    })
  }

  return { user, loading, fetchUser, login, logout, getSafeAuthMessage }
}
