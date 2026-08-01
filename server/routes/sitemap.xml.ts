type SitemapEntry = {
  loc: string
  lastmod?: string
  changefreq: 'monthly' | 'weekly'
  priority: string
}

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
}[character] ?? character))

export default defineEventHandler(async (_event) => {
  const supabase = useSupabasePublic()
  const [{ data: posts }, { data: projects }] = await Promise.all([
    supabase.from('blog_posts').select('slug,updated_at').eq('is_published', true),
    supabase.from('projects').select('slug,updated_at').eq('is_published', true),
  ])

  const baseUrl = 'https://novasugiantara.web.id'
  const today = new Date().toISOString().split('T')[0]

  const urls: SitemapEntry[] = [
    { loc: '/', lastmod: today, changefreq: 'monthly', priority: '1.0' },
    { loc: '/projects', lastmod: today, changefreq: 'monthly', priority: '0.9' },
    { loc: '/blog', lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { loc: '/contact', lastmod: today, changefreq: 'monthly', priority: '0.6' },
    ...(projects ?? []).map((project) => ({
      loc: `/projects/${project.slug}`,
      ...(project.updated_at ? { lastmod: new Date(project.updated_at).toISOString().split('T')[0] } : {}),
      changefreq: 'monthly' as const,
      priority: '0.7',
    })),
    ...(posts ?? []).map((post) => ({
      loc: `/blog/${post.slug}`,
      ...(post.updated_at ? { lastmod: new Date(post.updated_at).toISOString().split('T')[0] } : {}),
      changefreq: 'monthly' as const,
      priority: '0.7',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
      (entry) => `  <url>
    <loc>${escapeXml(`${baseUrl}${entry.loc}`)}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  setHeader(_event, 'Content-Type', 'application/xml')
  return xml
})
