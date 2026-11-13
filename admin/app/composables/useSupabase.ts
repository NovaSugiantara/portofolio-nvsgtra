import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '#shared/database'

let client: SupabaseClient<Database> | null = null

/**
 * The one browser client. It holds the owner's session in localStorage and sends it on every
 * request, so every read and write is checked by owner-only RLS in the database.
 */
export const useSupabase = (): SupabaseClient<Database> => {
  if (client) return client
  const { supabaseUrl, supabasePublishableKey } = useRuntimeConfig().public
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY for the admin app.')
  }
  client = createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  })
  return client
}
