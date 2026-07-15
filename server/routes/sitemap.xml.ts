export default defineEventHandler(async (_event) => {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl

  // Fetch published blog posts for sitemap
  const supabase = useSupabasePublic()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug,updated_at')
    .eq('is_published', true)

  const baseUrl = 'https://novasugiantara.web.id'

  const urls = [
    { loc: '/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '1.0' },
    { loc: '/projects', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.9' },
    { loc: '/blog', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '0.8' },
    { loc: '/contact', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.6' },
    ...(posts ?? []).map((p: { slug: string; updated_at: string }) => ({
      loc: `/blog/${p.slug}`,
      lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      changefreq: 'monthly' as const,
      priority: '0.7',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  setHeader(_event, 'Content-Type', 'application/xml')
  return xml
})
