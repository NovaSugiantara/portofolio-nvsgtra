import { blogPosts } from '../data/portfolio'

/** Roughly 220 words a minute, never less than one minute. */
const readingMinutes = (markdown: string) =>
  Math.max(1, Math.round(markdown.split(/\s+/).filter(Boolean).length / 220))

export default defineEventHandler(async () => {
  return [...blogPosts]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(({ id, slug, title, excerpt, tags, published_at, cover_image_url, sort_order, content }) => ({
      id,
      slug,
      title,
      excerpt,
      tags,
      published_at,
      cover_image_url,
      sort_order,
      reading_minutes: readingMinutes(content),
    }))
})
