import { z } from 'zod'

/** Mirrors the CHECK constraints in the projects table, so mistakes show up before saving. */
const safeUrl = z.string().trim().max(2048)
  .refine((value) => value === '' || /^https:\/\/\S+$/.test(value) || /^\/[^/\s]\S*$/.test(value), 'Use an https:// link or a /path')

const lines = (max: number, maxItems: number) => z.string()
  .transform((value) => value.split('\n').map((line) => line.trim()).filter(Boolean))
  .pipe(z.array(z.string().max(max)).max(maxItems, `At most ${maxItems} items`))

export const projectFormSchema = z.object({
  title: z.string().trim().min(1, 'Required').max(120),
  slug: z.string().trim().max(80).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Lowercase letters, numbers and single dashes'),
  kind: z.enum(['work', 'challenge']),
  summary: z.string().trim().min(1, 'Required').max(400),
  description: z.string().trim().max(4000),
  contributions: lines(300, 12),
  team_note: z.string().trim().max(400),
  tech_stack: z.string()
    .transform((value) => value.split(',').map((item) => item.trim()).filter(Boolean))
    .pipe(z.array(z.string().max(40)).max(20, 'At most 20 items')),
  role: z.string().trim().max(120),
  project_url: safeUrl,
  project_url_label: z.string().trim().max(60),
  repo_url: safeUrl,
  cover_image_url: z.string().nullable(),
  cover_alt: z.string().trim().max(200),
  is_published: z.boolean(),
  challenge_platform: z.string().trim().max(60),
  challenge_profile_url: z.string().trim(),
  challenge_format: z.enum(['duel', 'brawl']),
  challenge_rank: z.coerce.number<string | number>().int().min(1),
  challenge_entrants: z.coerce.number<string | number>().int().min(1),
  challenge_score: z.coerce.number<string | number>().min(0).max(100),
  challenge_submitted_at: z.string(),
}).superRefine((value, ctx) => {
  if (value.cover_image_url && !value.cover_alt) {
    ctx.addIssue({ code: 'custom', path: ['cover_alt'], message: 'Describe the screenshot for screen reader users' })
  }
  if (value.kind !== 'challenge') return
  if (!value.challenge_platform) ctx.addIssue({ code: 'custom', path: ['challenge_platform'], message: 'Required' })
  if (!/^https:\/\/\S+$/.test(value.challenge_profile_url)) ctx.addIssue({ code: 'custom', path: ['challenge_profile_url'], message: 'Use an https:// link' })
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.challenge_submitted_at)) ctx.addIssue({ code: 'custom', path: ['challenge_submitted_at'], message: 'Pick a date' })
  if (value.challenge_rank > value.challenge_entrants) ctx.addIssue({ code: 'custom', path: ['challenge_rank'], message: 'Rank cannot exceed the number of entrants' })
})

export type ProjectFormInput = z.input<typeof projectFormSchema>

export const slugify = (value: string) => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80)
  .replace(/-+$/, '')
