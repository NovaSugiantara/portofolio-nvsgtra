import type { Database } from '~/types/database'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']
type BlogListItem = Pick<
  BlogPost,
  'id' | 'slug' | 'title' | 'excerpt' | 'tags' | 'published_at' | 'cover_image_url' | 'sort_order'
>
type BlogPostDetail = BlogPost & { content_html: string }

export const useBlogPosts = () =>
  useFetch<BlogListItem[]>('/api/blog', {
    key: 'blog-posts',
    default: () => [],
  })

export const useBlogPost = (slug: string) =>
  useFetch<BlogPostDetail>(`/api/blog/${encodeURIComponent(slug)}`, {
    key: `blog-post-${slug}`,
  })
