import type { H3Event } from 'h3'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '#shared/database'

export interface OwnerContext {
  userId: string
  /** Client acting as the owner: every query still goes through RLS. */
  supabase: SupabaseClient<Database>
}

const deny = (statusCode: 401 | 403, statusMessage: string): never => {
  throw createError({ statusCode, statusMessage })
}

/**
 * Validates the caller independently of anything the browser claims:
 *   1. the bearer token is a live Supabase session (checked by Supabase Auth),
 *   2. the session reached the assurance level the account requires (aal2 once TOTP is enrolled),
 *   3. the user is listed in site_owners (readable only by that same user under RLS).
 * No service role key is involved; the returned client carries the owner's own token.
 */
export const requireOwner = async (event: H3Event): Promise<OwnerContext> => {
  const header = getHeader(event, 'authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!token || token.length > 4096) deny(401, 'Sign in required')

  const { supabaseUrl, supabasePublishableKey } = useRuntimeConfig(event)
  if (!supabaseUrl || !supabasePublishableKey) {
    console.error('[admin] SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is not set')
    throw createError({ statusCode: 503, statusMessage: 'Admin is not configured' })
  }

  const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) deny(401, 'Session expired')
  const userId = userData.user!.id

  const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel(token)
  if (aalError || (aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2')) deny(403, 'Authenticator code required')

  const { data: owner, error: ownerError } = await supabase
    .from('site_owners')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (ownerError || !owner) deny(403, 'Not allowed')

  return { userId, supabase }
}
