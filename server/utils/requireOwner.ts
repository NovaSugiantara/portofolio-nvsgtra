import type { H3Event } from 'h3'
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

  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Confirm this user is the profile owner (single-owner app).
  const { data: profile } = await supabase
    .from('profiles')
    .select('owner_id')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!profile) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  return user
}
