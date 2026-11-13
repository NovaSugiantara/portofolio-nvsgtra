import type { H3Event } from 'h3'
import { z } from 'zod'
import { blogPosts } from '../../data/portfolio'
import { createInternalServerError } from '../../utils/apiErrors'

const routeSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug')

export default defineEventHandler(async (event: H3Event) => {
  const parsedSlug = routeSlugSchema.safeParse(getRouterParam(event, 'slug'))
  if (!parsedSlug.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid slug' })
  }

  const post = blogPosts.find((p) => p.slug === parsedSlug.data)
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  let contentHtml: string
  try {
    contentHtml = renderSanitizedMarkdown(post.content)
  } catch {
    throw createInternalServerError()
  }

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    published_at: post.published_at,
    cover_image_url: post.cover_image_url,
    sort_order: post.sort_order,
    content_html: contentHtml,
  }
})
