import type { H3Event } from 'h3'
import { z } from 'zod'
import type { Tables } from '~/types/database'
import { createInternalServerError } from '../../utils/apiErrors'

type PublicBlogPost = Pick<
  Tables<'blog_posts'>,
  'id' | 'slug' | 'title' | 'excerpt' | 'tags' | 'published_at' | 'cover_image_url' | 'sort_order'
> & { content_html: string }

const routeSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug')

export default defineEventHandler(async (event: H3Event): Promise<PublicBlogPost> => {
  const parsedSlug = routeSlugSchema.safeParse(getRouterParam(event, 'slug'))
  if (!parsedSlug.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid slug' })
  }

  const supabase = useSupabasePublic()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id,slug,title,excerpt,content,tags,published_at,cover_image_url,sort_order')
    .eq('slug', parsedSlug.data)
    .eq('is_published', true)
    .maybeSingle()

  if (error) {
    throw createInternalServerError()
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  let contentHtml: string
  try {
    contentHtml = renderSanitizedMarkdown(data.content)
  } catch {
    throw createInternalServerError()
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    tags: data.tags,
    published_at: data.published_at,
    cover_image_url: data.cover_image_url,
    sort_order: data.sort_order,
    content_html: contentHtml,
  }
})
