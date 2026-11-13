import type { SeedBlogPost } from '~~/server/data/portfolio'

type BlogListItem = Omit<SeedBlogPost, 'content'> & { reading_minutes: number }
type BlogPostDetail = Omit<SeedBlogPost, 'content'> & { content_html: string }

export const useBlogPosts = () =>
  useFetch<BlogListItem[]>('/api/blog', {
    key: 'blog-posts',
    default: () => [],
  })

export const useBlogPost = (slug: string) =>
  useFetch<BlogPostDetail>(`/api/blog/${encodeURIComponent(slug)}`, {
    key: `blog-post-${slug}`,
  })
