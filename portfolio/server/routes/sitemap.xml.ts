import { blogPosts } from '../data/portfolio'
import { getProjects } from '../utils/content'

type SitemapEntry = {
  loc: string
  lastmod?: string
}

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
}[character] ?? character))

const toDate = (value: string | null | undefined) => value ? new Date(value).toISOString().split('T')[0] : undefined

/**
 * Built from the same data the pages use (Supabase or the static fallback), so every public detail page is listed.
 * `lastmod` only appears when a real date exists; a date that changes on every build
 * teaches search engines to ignore it. changefreq and priority are omitted because Google ignores them.
 */
export default defineEventHandler(async (event) => {
  const projects = await getProjects()
  const siteUrl = String(useRuntimeConfig(event).public.siteUrl || 'https://novasugiantara.web.id').replace(/\/+$/, '')
  const latestPost = blogPosts.map((post) => post.published_at).filter(Boolean).sort().at(-1)
  const latestChallenge = projects.map((project) => project.challenge?.submitted_at).filter(Boolean).sort().at(-1)

  const urls: SitemapEntry[] = [
    { loc: '/' },
    { loc: '/projects', lastmod: toDate(latestChallenge) },
    { loc: '/blog', lastmod: toDate(latestPost) },
    { loc: '/contact' },
    ...projects.map((project) => ({
      loc: `/projects/${project.slug}`,
      lastmod: toDate(project.challenge?.submitted_at),
    })),
    ...blogPosts.map((post) => ({
      loc: `/blog/${post.slug}`,
      lastmod: toDate(post.published_at),
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((entry) => `  <url>
    <loc>${escapeXml(`${siteUrl}${entry.loc}`)}</loc>${entry.lastmod ? `
    <lastmod>${entry.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>
`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return xml
})
