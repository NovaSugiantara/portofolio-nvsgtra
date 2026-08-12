import { createClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { Database } from '~/types/database'

// Service-role Supabase client - SERVER ONLY.
// Bypasses RLS, so every write MUST be scoped to the validated owner_id in code.
// Never import this in app/ (client) or expose the key to the browser.
export const useSupabaseAdmin = () => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey

  if (import.meta.client) {
    throw new Error('The service-role Supabase client is server-only')
  }

  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase service configuration is incomplete',
    })
  }

  return createClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  )
}
