import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '~/types/database'

// Browser-side Supabase client for the admin auth flow (login/logout/session).
// Uses the publishable (anon) key only - never the service role.
export const useSupabaseBrowser = () => {
  const config = useRuntimeConfig()

  return createBrowserClient<Database>(
    config.public.supabaseUrl,
    config.public.supabasePublishableKey,
  )
}
