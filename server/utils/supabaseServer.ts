import { createServerClient } from '@supabase/ssr'
import type { H3Event } from 'h3'
import { parseCookies, setCookie } from 'h3'
import type { Database } from '~/types/database'

// Server-side Supabase client bound to the request auth cookies.
// Reads the authenticated user session in middleware + admin API routes.
// Never uses the service role key - RLS still applies.
export const useSupabaseServer = (event: H3Event) => {
  const config = useRuntimeConfig()

  return createServerClient<Database>(
    config.public.supabaseUrl,
    config.public.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return parseCookies(event) as { name: string; value: string }[]
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            setCookie(event, name, value, options)
          }
        },
      },
    },
  )
}
