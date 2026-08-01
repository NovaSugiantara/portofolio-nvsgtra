import type { Tables } from '~/types/database'
import { createInternalServerError } from '../utils/apiErrors'

type PublicBlogListItem = Pick<
  Tables<'blog_posts'>,
  'id' | 'slug' | 'title' | 'excerpt' | 'tags' | 'published_at' | 'cover_image_url' | 'sort_order'
>

export default defineEventHandler(async (): Promise<PublicBlogListItem[]> => {
  const supabase = useSupabasePublic()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id,slug,title,excerpt,tags,published_at,cover_image_url,sort_order')
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsLast: true })

  if (error) {
    throw createInternalServerError()
  }

  return (data ?? []).map((post): PublicBlogListItem => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    published_at: post.published_at,
    cover_image_url: post.cover_image_url,
    sort_order: post.sort_order,
  }))
})
