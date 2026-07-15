import { z } from 'zod'

export const profileSchema = z.object({
  full_name: z.string().min(1),
  headline: z.string().min(1),
  summary: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  linkedin_url: z.string().url().nullable().optional(),
  website_url: z.string().url().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  is_published: z.boolean().optional(),
}).strict()

export const projectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  tech_stack: z.array(z.string()).default([]),
  role: z.string().nullable().optional(),
  project_url: z.string().url().nullable().optional(),
  repo_url: z.string().url().nullable().optional(),
  cover_image_url: z.string().url().nullable().optional(),
  sort_order: z.number().int().optional(),
  is_published: z.boolean().optional(),
}).strict()

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().nullable().optional(),
  start_date: z.string().date(),
  end_date: z.string().date().nullable().optional(),
  bullets: z.array(z.string()).default([]),
  sort_order: z.number().int().optional(),
  is_published: z.boolean().optional(),
}).strict()

export const skillSchema = z.object({
  category: z.string().min(1),
  name: z.string().min(1),
  sort_order: z.number().int().optional(),
  is_published: z.boolean().optional(),
}).strict()

export const blogPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(1),
  cover_image_url: z.string().url().nullable().optional(),
  tags: z.array(z.string()).default([]),
  published_at: z.string().datetime().nullable().optional(),
  sort_order: z.number().int().optional(),
  is_published: z.boolean().optional(),
}).strict()
