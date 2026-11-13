import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import type { Database } from '#shared/database'
import { profile as staticProfile, projects as staticProjects } from '../data/portfolio'
import type { SeedChallenge, SeedProfile, SeedProject } from '../data/portfolio'

export type HeroMedia = 'video' | 'photo'

export interface PublicProfile extends SeedProfile {
  hero_media: HeroMedia
  hero_video_url: string | null
  hero_poster_url: string | null
  avatar_alt: string | null
}

const SITE = 'portfolio'

const challengeSchema = z.object({
  platform: z.string().min(1).max(60),
  profile_url: z.url(),
  format: z.enum(['duel', 'brawl']),
  rank: z.number().int().positive(),
  entrants: z.number().int().positive(),
  score: z.number().min(0).max(100),
  submitted_at: z.string().date(),
})

const fallbackProfile: PublicProfile = {
  ...staticProfile,
  hero_media: 'video',
  hero_video_url: '/video/hero-bg.webm',
  hero_poster_url: '/video/hero-poster.webp',
  avatar_alt: null,
}

/**
 * Supabase client for public reads, or null when the site is built without a database.
 *
 * Public pages are prerendered, so these reads happen at build time. Without
 * SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY the site falls back to the static
 * content in server/data/portfolio.ts. With them set, a failed query throws so
 * the build fails and the previous deployment stays live, instead of shipping
 * an empty portfolio.
 */
const publicClient = () => {
  const { supabaseUrl, supabasePublishableKey } = useRuntimeConfig()
  if (!supabaseUrl || !supabasePublishableKey) return null
  return createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

const fail = (what: string, message: string): never => {
  console.error(`[content] Could not load ${what}: ${message}`)
  throw createError({ statusCode: 502, statusMessage: `Could not load ${what}` })
}

export const getProfile = async (): Promise<PublicProfile> => {
  const client = publicClient()
  if (!client) return fallbackProfile

  const { data, error } = await client
    .from('site_profiles')
    .select('*')
    .eq('site', SITE)
    .maybeSingle()

  if (error) return fail('profile', error.message)
  if (!data) return fail('profile', `no site_profiles row for "${SITE}"`)

  return {
    id: `profile-${SITE}`,
    full_name: data.full_name,
    headline: data.headline,
    summary: data.summary,
    location: data.location,
    email: data.email,
    phone: null,
    linkedin_url: data.linkedin_url,
    website_url: data.website_url,
    hero_media: data.hero_media === 'photo' && data.avatar_url ? 'photo' : 'video',
    hero_video_url: data.hero_video_url,
    hero_poster_url: data.hero_poster_url,
    avatar_url: data.avatar_url,
    avatar_alt: data.avatar_alt,
  }
}

export const getProjects = async (): Promise<SeedProject[]> => {
  const client = publicClient()
  if (!client) return [...staticProjects].sort((a, b) => a.sort_order - b.sort_order)

  // select('*') with an explicit mapping below: the typed select-string parser chokes on long
  // column lists, and the extra columns (site, timestamps) are a few bytes per row.
  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('site', SITE)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) return fail('projects', error.message)

  return data.map((row) => {
    let challenge: SeedChallenge | null = null
    if (row.kind === 'challenge') {
      const parsed = challengeSchema.safeParse(row.challenge)
      if (parsed.success) challenge = parsed.data
      else console.warn(`[content] Ignoring malformed challenge data on project "${row.slug}"`)
    }
    return {
      id: row.id,
      slug: row.slug,
      kind: row.kind === 'challenge' && challenge ? 'challenge' : 'work',
      title: row.title,
      summary: row.summary,
      description: row.description,
      contributions: row.contributions,
      team_note: row.team_note,
      tech_stack: row.tech_stack,
      role: row.role,
      project_url: row.project_url,
      project_url_label: row.project_url_label,
      repo_url: row.repo_url,
      cover_image_url: row.cover_image_url,
      cover_alt: row.cover_alt,
      challenge,
      sort_order: row.sort_order,
    }
  })
}
