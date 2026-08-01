import type { H3Event } from 'h3'
import { createError } from 'h3'
import type { User } from '@supabase/supabase-js'

// Re-validates the session server-side for every /api/admin/** call.
// SRS §6 item 3: client-side route guards are UX only, not a security boundary.
// Returns the authenticated owner user, or throws 401/403.
export const requireOwner = async (event: H3Event): Promise<User> => {
  const supabase = useSupabaseServer(event)

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user || user.is_anonymous) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const configuredOwnerId = useRuntimeConfig().supabaseOwnerId?.trim()
  if (!configuredOwnerId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Owner identity is not configured',
    })
  }

  // A profile row alone is not an owner allowlist: any authenticated identity
  // could otherwise create its own row under a permissive INSERT policy.
  if (user.id !== configuredOwnerId) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // Confirm the configured identity still owns the profile through RLS.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('owner_id')
    .eq('owner_id', configuredOwnerId)
    .maybeSingle()

  if (profileError) {
    throw createError({ statusCode: 500, statusMessage: 'Owner validation failed' })
  }

  if (!profile || profile.owner_id !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  return user
}
