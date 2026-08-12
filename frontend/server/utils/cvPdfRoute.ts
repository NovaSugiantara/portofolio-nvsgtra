import type { H3Event } from 'h3'
import { createError, getQuery, isError } from 'h3'
import { buildCvPdf, type CvData } from './buildCvPdf'
import {
  profile,
  experiences,
  projects,
  skills,
  education,
  certifications,
} from '../data/portfolio'

/**
 * CV generation now builds directly from the static portfolio seed data.
 * The `variant` query param is accepted for backwards compatibility but the
 * public CV always renders the full published profile.
 */
export const parseCvVariantQuery = (event: H3Event): string | undefined => {
  const raw = getQuery(event).variant
  return typeof raw === 'string' ? raw : undefined
}

export const parseCvVariantBody = async (): Promise<string | undefined> => undefined

const buildCvData = (): CvData => {
  const groupedSkills: Record<string, string[]> = {}
  for (const skill of [...skills].sort((a, b) => a.sort_order - b.sort_order)) {
    groupedSkills[skill.category] ??= []
    groupedSkills[skill.category].push(skill.name)
  }

  return {
    profile: {
      full_name: profile.full_name,
      headline: profile.headline,
      summary: profile.summary,
      email: profile.email,
      phone: profile.phone,
      linkedin_url: profile.linkedin_url,
      website_url: profile.website_url,
      location: profile.location,
    },
    experiences: [...experiences]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((e) => ({
        company: e.company,
        role: e.role,
        location: e.location,
        start_date: e.start_date,
        end_date: e.end_date,
        bullets: e.bullets,
      })),
    projects: [...projects]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => ({
        title: p.title,
        description: p.description,
        role: p.role,
        tech_stack: p.tech_stack,
      })),
    skills: groupedSkills,
    education: [...education]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((ed) => ({
        institution: ed.institution,
        degree: ed.degree,
        start_date: ed.start_date,
        end_date: ed.end_date,
        is_expected: ed.is_expected,
      })),
    certifications: [...certifications]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => ({
        name: c.name,
        issuer: c.issuer,
        issued_date: c.issued_date,
      })),
  }
}

export const generateCvPdf = async (
  _event: H3Event,
  _requestedVariant?: string,
): Promise<Uint8Array> => {
  try {
    return buildCvPdf(buildCvData())
  } catch (error) {
    if (isError(error)) throw error
    throw createError({ statusCode: 500, statusMessage: 'Unable to generate CV' })
  }
}
