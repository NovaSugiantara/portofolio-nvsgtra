import type { H3Event } from 'h3'
import { createError, getQuery, isError, readBody } from 'h3'
import { z } from 'zod'
import { buildCvPdf, type CvData } from './buildCvPdf'
import { createValidationError } from './apiErrors'
import { requireOwner } from './requireOwner'
import { useSupabaseAdmin } from './supabaseAdmin'

const variantValueSchema = z.union([z.literal('default'), z.uuid()])
const noMatchUuid = '00000000-0000-0000-0000-000000000000'

export const parseCvVariantQuery = (event: H3Event): string | undefined => {
  const rawVariant = getQuery(event).variant
  const result = variantValueSchema.optional().safeParse(rawVariant)
  if (!result.success) throw createValidationError(result.error)
  return result.data
}

export const parseCvVariantBody = async (event: H3Event): Promise<string | undefined> => {
  let rawBody: unknown
  try {
    rawBody = await readBody(event)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
  }

  const body = rawBody === undefined || rawBody === null ? {} : rawBody
  const result = z.object({ variant: variantValueSchema.optional() }).strict().safeParse(body)
  if (!result.success) throw createValidationError(result.error)
  return result.data.variant
}

const throwGenerationError = (): never => {
  throw createError({ statusCode: 500, statusMessage: 'Unable to generate CV' })
}

const requireQuerySuccess = <T>(result: { data: T; error: unknown }): T => {
  if (result.error) throwGenerationError()
  return result.data
}

/**
 * Loads the requested CV scope and delegates only the rendering work to the
 * pure-ish PDF builder. Public requests are restricted to published content;
 * owner requests are restricted by the verified owner ID.
 */
export const generateCvPdf = async (
  event: H3Event,
  requestedVariant?: string,
): Promise<Uint8Array> => {
  const isPublicDefault = !requestedVariant || requestedVariant === 'default'
  const configuredOwnerId = useRuntimeConfig().supabaseOwnerId?.trim()
  const ownerId = isPublicDefault
    ? configuredOwnerId
    : (await requireOwner(event)).id

  if (!ownerId) {
    throw createError({ statusCode: 500, statusMessage: 'CV owner is not configured' })
  }

  const admin = useSupabaseAdmin()

  try {
    const variantResult = isPublicDefault
      ? await admin
        .from('cv_variants')
        .select('id, owner_id, is_default, included_experience_ids, included_project_ids, included_skill_ids')
        .eq('owner_id', ownerId)
        .eq('is_default', true)
        .order('created_at', { ascending: true })
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle()
      : await admin
        .from('cv_variants')
        .select('id, owner_id, is_default, included_experience_ids, included_project_ids, included_skill_ids')
        .eq('owner_id', ownerId)
        .eq('id', requestedVariant ?? noMatchUuid)
        .maybeSingle()
    if (variantResult.error) throwGenerationError()
    if (!variantResult.data) {
      throw createError({ statusCode: 404, statusMessage: 'CV variant not found' })
    }

    const variant = variantResult.data
    const experienceIds = variant.included_experience_ids ?? []
    const projectIds = variant.included_project_ids ?? []
    const skillIds = variant.included_skill_ids ?? []
    const profileQuery = admin
      .from('profiles')
      .select('full_name, headline, summary, location, email, phone, linkedin_url, website_url')
      .eq('owner_id', ownerId)
    const experienceQuery = admin
      .from('experiences')
      .select('company, role, location, start_date, end_date, bullets')
      .eq('owner_id', ownerId)
      .order('sort_order', { ascending: true })
      .order('start_date', { ascending: false })
    const projectQuery = admin
      .from('projects')
      .select('title, description, role, tech_stack')
      .eq('owner_id', ownerId)
      .order('sort_order', { ascending: true })
    const skillQuery = admin
      .from('skills')
      .select('category, name')
      .eq('owner_id', ownerId)
      .order('sort_order', { ascending: true })
    const educationQuery = admin
      .from('education')
      .select('institution, degree, start_date, end_date, is_expected')
      .eq('owner_id', ownerId)
      .order('sort_order', { ascending: true })
    const certificationQuery = admin
      .from('certifications')
      .select('name, issuer, issued_date')
      .eq('owner_id', ownerId)
      .order('sort_order', { ascending: true })

    if (isPublicDefault) profileQuery.eq('is_published', true).limit(1)
    if (isPublicDefault) experienceQuery.eq('is_published', true)
    if (isPublicDefault) projectQuery.eq('is_published', true)
    if (isPublicDefault) skillQuery.eq('is_published', true)
    if (isPublicDefault) educationQuery.eq('is_published', true)
    if (isPublicDefault) certificationQuery.eq('is_published', true)

    if (experienceIds.length) experienceQuery.in('id', experienceIds)
    else experienceQuery.eq('id', noMatchUuid)
    if (projectIds.length) projectQuery.in('id', projectIds)
    else projectQuery.eq('id', noMatchUuid)
    if (skillIds.length) skillQuery.in('id', skillIds)
    else skillQuery.eq('id', noMatchUuid)

    const [profileResult, experienceResult, projectResult, skillResult, educationResult, certificationResult] =
      await Promise.all([
        profileQuery.maybeSingle(),
        experienceQuery,
        projectQuery,
        skillQuery,
        educationQuery,
        certificationQuery,
      ])

    const profile = requireQuerySuccess(profileResult)
    if (!profile) throw createError({ statusCode: 404, statusMessage: 'Published profile not found' })
    const experiences = requireQuerySuccess(experienceResult)
    const projects = requireQuerySuccess(projectResult)
    const skills = requireQuerySuccess(skillResult)
    const education = requireQuerySuccess(educationResult)
    const certifications = requireQuerySuccess(certificationResult)

    const groupedSkills: Record<string, string[]> = {}
    for (const skill of skills ?? []) {
      const category = skill.category.trim()
      const name = skill.name.trim()
      if (!category || !name) continue
      groupedSkills[category] ??= []
      groupedSkills[category].push(name)
    }

    const data: CvData = {
      profile,
      experiences,
      projects,
      skills: groupedSkills,
      education,
      certifications,
    }
    return buildCvPdf(data)
  } catch (error) {
    if (isError(error)) throw error
    throwGenerationError()
  }
}
