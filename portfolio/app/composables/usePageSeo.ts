import type { MaybeRefOrGetter } from 'vue'

interface PageSeoOptions {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  /** Path on this site, e.g. `/projects`. Always resolved against the configured site URL. */
  path: MaybeRefOrGetter<string>
  /** Site-relative or absolute image. Falls back to the shared social card. */
  image?: MaybeRefOrGetter<string | null | undefined>
  imageAlt?: MaybeRefOrGetter<string | null | undefined>
  type?: 'website' | 'article' | 'profile'
  /** JSON-LD objects for this page. */
  schema?: MaybeRefOrGetter<Record<string, unknown> | Record<string, unknown>[] | null | undefined>
}

const DEFAULT_IMAGE = '/og.jpg'
const DEFAULT_IMAGE_ALT = 'Nova Sugiantara, full stack web developer'

/** Absolute URL on the public site. Pages are prerendered, so the request origin cannot be trusted. */
export const useSiteUrl = () => {
  const siteUrl = String(useRuntimeConfig().public.siteUrl || 'https://novasugiantara.web.id').replace(/\/+$/, '')
  return (path = '/') => new URL(path, `${siteUrl}/`).toString()
}

/** Escapes characters that could close the surrounding script tag. */
export const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026')

/**
 * Sets title, description, canonical, Open Graph, Twitter, and optional JSON-LD for a public page.
 * Every page gets an image, so shared links never render as a bare card.
 */
export const usePageSeo = (options: PageSeoOptions) => {
  const toAbsolute = useSiteUrl()
  const canonical = computed(() => toAbsolute(toValue(options.path)))
  const image = computed(() => toAbsolute(toValue(options.image) || DEFAULT_IMAGE))
  const imageAlt = computed(() => toValue(options.imageAlt) || DEFAULT_IMAGE_ALT)

  useSeoMeta({
    title: () => toValue(options.title),
    description: () => toValue(options.description),
    ogTitle: () => toValue(options.title),
    ogDescription: () => toValue(options.description),
    ogUrl: canonical,
    ogType: options.type ?? 'website',
    ogImage: image,
    ogImageAlt: imageAlt,
    twitterCard: 'summary_large_image',
    twitterTitle: () => toValue(options.title),
    twitterDescription: () => toValue(options.description),
    twitterImage: image,
    twitterImageAlt: imageAlt,
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
    script: options.schema
      ? [{
          key: 'page-jsonld',
          type: 'application/ld+json',
          innerHTML: () => {
            const schema = toValue(options.schema)
            return schema ? serializeJsonLd(schema) : ''
          },
        }]
      : [],
  })

  return { canonical, toAbsolute }
}
