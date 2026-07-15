import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

// Service-role Supabase client - SERVER ONLY.
// Bypasses RLS, so every write MUST be scoped to the validated owner_id in code.
// Never import this in app/ (client) or expose the key to the browser.
export const useSupabaseAdmin = () => {
  const config = useRuntimeConfig()

  return createClient<Database>(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
