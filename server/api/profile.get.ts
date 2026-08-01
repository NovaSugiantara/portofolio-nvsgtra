import type { Tables } from '~/types/database'
import { createInternalServerError } from '../utils/apiErrors'

type PublicProfile = Pick<
  Tables<'profiles'>,
  | 'id'
  | 'full_name'
  | 'headline'
  | 'summary'
  | 'location'
  | 'email'
  | 'phone'
  | 'linkedin_url'
  | 'website_url'
  | 'avatar_url'
>

export default defineEventHandler(async (): Promise<PublicProfile> => {
  const supabase = useSupabasePublic()
  const { data, error } = await supabase
    .from('profiles')
    .select('id,full_name,headline,summary,location,email,phone,linkedin_url,website_url,avatar_url')
    .eq('is_published', true)
    .limit(1)
    .maybeSingle()

  if (error) {
    throw createInternalServerError()
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
  }

  return {
    id: data.id,
    full_name: data.full_name,
    headline: data.headline,
    summary: data.summary,
    location: data.location,
    email: data.email,
    phone: data.phone,
    linkedin_url: data.linkedin_url,
    website_url: data.website_url,
    avatar_url: data.avatar_url,
  }
})
