import { createServerClient } from '@supabase/ssr'
import type { H3Event } from 'h3'
import { createError, parseCookies, setCookie, setResponseHeader } from 'h3'
import type { Database } from '~/types/database'

// Server-side Supabase client bound to the request auth cookies.
// A new client must be created for every request so auth state never crosses users.
// Never uses the service role key - RLS still applies.
export const useSupabaseServer = (event: H3Event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabasePublishableKey = config.public.supabasePublishableKey

  if (!supabaseUrl || !supabasePublishableKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase server configuration is incomplete',
    })
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return Object.entries(parseCookies(event)).map(([name, value]) => ({
            name,
            value,
          }))
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value, options } of cookiesToSet) {
            setCookie(event, name, value, options)
          }

          // Supabase supplies cache headers whenever auth cookies change. Without
          // them a proxy can cache one user's refreshed session for another user.
          for (const [name, value] of Object.entries(headers ?? {})) {
            setResponseHeader(event, name, value)
          }
        },
      },
    },
  )
}
