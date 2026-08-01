import { z } from 'zod'

const MAX_TEXT_LENGTH = 5000
const MAX_ARRAY_ITEMS = 50

const textSchema = (max = MAX_TEXT_LENGTH) =>
  z.string().trim().min(1).max(max)

const optionalTextSchema = (max = MAX_TEXT_LENGTH) =>
  z.string().trim().max(max).nullable().optional()

const httpUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .url()
  .refine((value) => {
    try {
      const protocol = new URL(value).protocol
      return protocol === 'http:' || protocol === 'https:'
    } catch {
      return false
    }
  }, 'URL must use HTTP or HTTPS')

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase kebab-case')

const stringArraySchema = (itemMax = 200) =>
  z.array(textSchema(itemMax)).max(MAX_ARRAY_ITEMS).default([])

const sortOrderSchema = z.number().int().min(0).max(100_000).optional()
const dateSchema = z.string().date()
const nullableDateSchema = dateSchema.nullable().optional()
const idArraySchema = z
  .array(z.uuid())
  .max(MAX_ARRAY_ITEMS)
  .refine((ids) => new Set(ids).size === ids.length, 'IDs must be unique')
  .default([])

export const profileSchema = z.object({
  full_name: textSchema(200),
  headline: textSchema(300),
  summary: optionalTextSchema(),
  location: optionalTextSchema(200),
  email: z.string().trim().email().max(320).nullable().optional(),
  phone: optionalTextSchema(50),
  linkedin_url: httpUrlSchema.nullable().optional(),
  website_url: httpUrlSchema.nullable().optional(),
  avatar_url: httpUrlSchema.nullable().optional(),
  is_published: z.boolean().optional(),
}).strict()

export const projectSchema = z.object({
  slug: slugSchema,
  title: textSchema(200),
  description: optionalTextSchema(),
  tech_stack: stringArraySchema(100),
  role: optionalTextSchema(200),
  project_url: httpUrlSchema.nullable().optional(),
  repo_url: httpUrlSchema.nullable().optional(),
  cover_image_url: httpUrlSchema.nullable().optional(),
  sort_order: sortOrderSchema,
  is_published: z.boolean().optional(),
}).strict()

export const experienceSchema = z
  .object({
    company: textSchema(200),
    role: textSchema(200),
    location: optionalTextSchema(200),
    start_date: dateSchema,
    end_date: nullableDateSchema,
    bullets: stringArraySchema(1000),
    sort_order: sortOrderSchema,
    is_published: z.boolean().optional(),
  })
  .strict()
  .refine(
    ({ start_date, end_date }) => !end_date || end_date >= start_date,
    { path: ['end_date'], message: 'End date must not precede start date' },
  )

export const skillSchema = z.object({
  category: textSchema(100),
  name: textSchema(100),
  sort_order: sortOrderSchema,
  is_published: z.boolean().optional(),
}).strict()

export const blogPostSchema = z.object({
  slug: slugSchema,
  title: textSchema(200),
  excerpt: optionalTextSchema(1000),
  content: textSchema(100_000),
  cover_image_url: httpUrlSchema.nullable().optional(),
  tags: stringArraySchema(50),
  published_at: z.iso.datetime().nullable().optional(),
  sort_order: sortOrderSchema,
  is_published: z.boolean().optional(),
}).strict()

export const honeypotSchema = z.object({
  // The route short-circuits non-empty values. Empty is the only value that a
  // real form may submit, while keeping the request schema strict.
  hp: z.string().max(0).optional(),
}).strict()

export const contactPayloadSchema = z.object({
  name: textSchema(200),
  email: z.string().trim().email().max(320),
  message: textSchema(5000),
}).strict()

// Keep honeypot validation separate, then compose it for the existing handler.
export const contactSchema = contactPayloadSchema
  .extend(honeypotSchema.shape)
  .strict()

export const cvVariantSchema = z.object({
  name: textSchema(200),
  is_default: z.boolean().optional(),
  included_experience_ids: idArraySchema,
  included_project_ids: idArraySchema,
  included_skill_ids: idArraySchema,
}).strict()

export const educationSchema = z
  .object({
    institution: textSchema(200),
    degree: textSchema(200),
    start_date: nullableDateSchema,
    end_date: nullableDateSchema,
    is_expected: z.boolean().optional(),
    sort_order: sortOrderSchema,
    is_published: z.boolean().optional(),
  })
  .strict()
  .refine(
    ({ start_date, end_date }) => !start_date || !end_date || end_date >= start_date,
    { path: ['end_date'], message: 'End date must not precede start date' },
  )

export const certificationSchema = z.object({
  name: textSchema(200),
  issuer: textSchema(200),
  issued_date: nullableDateSchema,
  credential_url: httpUrlSchema.nullable().optional(),
  sort_order: sortOrderSchema,
  is_published: z.boolean().optional(),
}).strict()

export const contactMessageReadStateSchema = z.object({
  is_read: z.boolean(),
}).strict()

export const uuidSchema = z.uuid()
