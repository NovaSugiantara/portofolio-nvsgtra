import { blogPosts } from '../data/portfolio'

export default defineEventHandler(async () => {
  return [...blogPosts]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(({ id, slug, title, excerpt, tags, published_at, cover_image_url, sort_order }) => ({
      id,
      slug,
      title,
      excerpt,
      tags,
      published_at,
      cover_image_url,
      sort_order,
    }))
})
