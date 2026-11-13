import type { Session } from '@supabase/supabase-js'

export type AccessState =
  | 'signed-out'
  | 'needs-mfa' // password accepted, authenticator code still required
  | 'not-owner' // signed in, but not listed in site_owners
  | 'ready'

/**
 * Works out what the current visitor may do. This only drives navigation; the database
 * enforces the same rules through RLS, and server routes re-check the token themselves.
 */
export const useOwnerSession = () => {
  const supabase = useSupabase()
  const state = useState<AccessState | null>('access-state', () => null)
  const session = useState<Session | null>('session', () => null)

  const refresh = async (): Promise<AccessState> => {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    if (!data.session) return (state.value = 'signed-out')

    const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aalError) return (state.value = 'signed-out')
    if (aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') return (state.value = 'needs-mfa')

    const { data: owner, error } = await supabase
      .from('site_owners')
      .select('user_id')
      .eq('user_id', data.session.user.id)
      .maybeSingle()
    if (error || !owner) return (state.value = 'not-owner')
    return (state.value = 'ready')
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    state.value = 'signed-out'
    session.value = null
    await navigateTo('/login')
  }

  /** Bearer header for the admin's own server routes. */
  const authHeaders = async (): Promise<Record<string, string>> => {
    const { data } = await supabase.auth.getSession()
    return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {}
  }

  return { state, session, refresh, signOut, authHeaders }
}
