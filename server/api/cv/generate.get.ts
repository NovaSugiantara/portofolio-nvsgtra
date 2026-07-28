import type { H3Event } from 'h3'

// GET /api/cv/generate?variant=<id OR 'default'>
export default defineEventHandler(async (event: H3Event) => {
  const variantId = getQuery(event).variant as string | undefined

  // Public route — if a variant is specified, validate it's the default or
  // the caller is authenticated as the owner. For simplicity in a single-owner
  // app, the public route only serves the default variant.
  if (variantId && variantId !== 'default') {
    const supabase = useSupabaseServer(event)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Login required for non-default variants' })
    }
  }

  const admin = useSupabaseAdmin()

  // Determine which content IDs to include
  let includeExpIds: string[] | null = null
  let includeProjIds: string[] | null = null
  let includeSkillIds: string[] | null = null

  if (variantId === 'default') {
    const { data: def } = await admin
      .from('cv_variants')
      .select('*')
      .eq('is_default', true)
      .maybeSingle()
    if (def) {
      includeExpIds = def.included_experience_ids ?? null
      includeProjIds = def.included_project_ids ?? null
      includeSkillIds = def.included_skill_ids ?? null
    }
    // No variant found? Include everything.
  }

  // Fetch data
  const [profileR, expR, projR, skillR, eduR, certR] = await Promise.all([
    admin.from('profiles').select('*').limit(1).single(),
    includeExpIds
      ? admin.from('experiences').select('*').in('id', includeExpIds)
      : admin.from('experiences').select('*').eq('is_published', true).order('sort_order'),
    includeProjIds
      ? admin.from('projects').select('*').in('id', includeProjIds)
      : admin.from('projects').select('*').eq('is_published', true).order('sort_order'),
    includeSkillIds
      ? admin.from('skills').select('*').in('id', includeSkillIds)
      : admin.from('skills').select('*').eq('is_published', true).order('sort_order'),
    admin.from('education').select('*').eq('is_published', true).order('sort_order'),
    admin.from('certifications').select('*').eq('is_published', true).order('sort_order'),
  ])

  if (profileR.error) throw createError({ statusCode: 404, statusMessage: 'Profile not found' })

  const profile = profileR.data
  const skillsGrouped: Record<string, string[]> = {}
  for (const s of skillR.data ?? []) {
    if (!skillsGrouped[s.category]) skillsGrouped[s.category] = []
    skillsGrouped[s.category].push(s.name)
  }

  const pdfBytes = await buildCvPdf({
    profile: {
      full_name: profile.full_name,
      headline: profile.headline,
      summary: profile.summary,
      email: profile.email,
      phone: profile.phone,
      linkedin_url: profile.linkedin_url,
      location: profile.location,
    },
    experiences: (expR.data ?? []).map((e) => ({
      company: e.company, role: e.role, start_date: e.start_date,
      end_date: e.end_date, bullets: e.bullets,
    })),
    projects: (projR.data ?? []).map((p) => ({
      title: p.title, description: p.description, tech_stack: p.tech_stack,
    })),
    skills: skillsGrouped,
    education: (eduR.data ?? []).map((e) => ({
      institution: e.institution, degree: e.degree,
      start_date: e.start_date, end_date: e.end_date, is_expected: e.is_expected,
    })),
    certifications: (certR.data ?? []).map((c) => ({
      name: c.name, issuer: c.issuer,
    })),
  })

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="CV-NovaSugiantara.pdf"`)
  return pdfBytes
})
