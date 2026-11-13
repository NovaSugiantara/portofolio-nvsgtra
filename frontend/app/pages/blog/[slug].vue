<template>
  <div class="site-container py-12 sm:py-16 lg:py-20">
    <div v-if="isLoading" class="mx-auto max-w-3xl space-y-6" aria-busy="true" aria-label="Loading article">
      <div class="h-3 w-28 animate-pulse rounded bg-[var(--background-muted)]" />
      <div class="h-12 w-4/5 animate-pulse rounded bg-[var(--background-muted)]" />
      <div class="h-5 w-full max-w-xl animate-pulse rounded bg-[var(--background-muted)]" />
      <div class="h-64 animate-pulse rounded-[var(--radius-lg)] bg-[var(--background-muted)]" />
    </div>

    <section v-else-if="error" class="mx-auto max-w-3xl border-y border-[var(--border-subtle)] py-8" role="alert" aria-labelledby="article-error-title">
      <h1 id="article-error-title" class="font-heading text-2xl font-semibold text-[var(--foreground-primary)]">Article unavailable</h1>
      <p class="mt-2 max-w-xl text-sm leading-6 text-[var(--foreground-secondary)]">
        This article could not be loaded or is no longer published.
      </p>
      <NuxtLink
        to="/blog"
        class="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-[var(--accent-primary)] px-4 text-sm font-semibold text-page transition-colors hover:bg-[var(--accent-hover)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
      >
        <Icon name="ph:arrow-left" size="1.125rem" aria-hidden="true" />Back to blog
      </NuxtLink>
      <button
        type="button"
        class="mt-5 ml-3 inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--border-subtle)] px-4 text-sm font-semibold text-[var(--foreground-primary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
        @click="refresh()"
      >
        <Icon name="ph:arrow-clockwise" size="1.125rem" aria-hidden="true" />Try again
      </button>
    </section>

    <section v-else-if="!post" class="mx-auto max-w-3xl border-y border-[var(--border-subtle)] py-8" role="status" aria-labelledby="article-empty-title">
      <h1 id="article-empty-title" class="font-heading text-2xl font-semibold text-[var(--foreground-primary)]">Article not found</h1>
      <p class="mt-2 max-w-xl text-sm leading-6 text-[var(--foreground-secondary)]">
        The requested article does not have published content.
      </p>
      <NuxtLink
        to="/blog"
        class="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--border-subtle)] px-4 text-sm font-semibold text-[var(--foreground-primary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
      >
        <Icon name="ph:arrow-left" size="1.125rem" aria-hidden="true" />Browse the blog
      </NuxtLink>
    </section>

    <article v-else class="mx-auto max-w-3xl" aria-labelledby="article-title">
      <NuxtLink
        to="/blog"
        class="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] underline decoration-[var(--accent-primary)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--border-focus)]"
      >
        <Icon name="ph:arrow-left" size="1.125rem" aria-hidden="true" />Back to blog
      </NuxtLink>

      <header class="mt-10 space-y-5 border-b border-[var(--border-subtle)] pb-10">
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary)]">Article</p>
        <h1 id="article-title" class="max-w-3xl text-pretty font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--foreground-primary)] sm:text-5xl lg:text-6xl">{{ post.title }}</h1>
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--foreground-muted)]" aria-label="Article metadata">
          <time v-if="post.published_at" :datetime="post.published_at" class="font-mono">
            <span class="inline-flex items-center gap-2"><Icon name="ph:calendar-blank" size="1rem" aria-hidden="true" />{{ formatPublishedDate(post.published_at) }}</span>
          </time>
          <span v-if="post.published_at && post.tags?.length" aria-hidden="true">·</span>
          <span v-if="post.tags?.length" class="inline-flex items-center gap-2 break-words font-mono text-xs"><Icon name="ph:tag" size="1rem" aria-hidden="true" />{{ post.tags.join(', ') }}</span>
        </div>
        <p v-if="post.excerpt" class="max-w-2xl text-lg leading-8 text-[var(--foreground-secondary)] sm:text-xl">{{ post.excerpt }}</p>
      </header>

      <img
        v-if="post.cover_image_url"
        :src="post.cover_image_url"
        :alt="`${post.title} cover image`"
        width="1200"
        height="675"
        fetchpriority="high"
        decoding="async"
        class="mt-10 aspect-video w-full rounded-[var(--radius-lg)] border border-[var(--border-subtle)] object-cover"
      />

      <!-- content_html is rendered only after server-side Markdown sanitization. -->
      <div class="article-copy mt-10 max-w-[45rem] text-base leading-8 text-[var(--foreground-secondary)]" v-html="post.content_html" />

      <aside class="mt-16 rounded-lg border border-line bg-soft p-6 sm:p-8" aria-labelledby="article-cta-title" data-wa-cta>
        <h2 id="article-cta-title" class="text-xl font-semibold tracking-[-0.02em]">Need a website or web app built this way?</h2>
        <p class="mt-2 max-w-[60ch] leading-7 text-secondary">I build custom websites and web apps for businesses in Indonesia and abroad. Tell me what you need and I will reply with questions or a rough plan.</p>
        <div class="mt-5 flex flex-wrap gap-3">
          <a v-if="waUrl" class="btn btn-whatsapp" :href="waUrl" target="_blank" rel="noopener noreferrer"><Icon name="ph:whatsapp-logo" size="1.25rem" aria-hidden="true" />Chat on WhatsApp<span class="sr-only"> (opens in a new tab)</span></a>
          <NuxtLink class="btn" :class="waUrl ? 'btn-secondary' : 'btn-primary'" to="/contact">Send a message</NuxtLink>
        </div>
      </aside>

      <nav v-if="nextPost" class="mt-12 border-t border-line pt-8" aria-label="Next article">
        <p class="text-sm text-faint">Read next</p>
        <NuxtLink :to="`/blog/${nextPost.slug}`" class="group mt-2 flex items-start justify-between gap-4 no-underline">
          <span class="text-xl font-semibold tracking-[-0.02em] text-primary group-hover:text-accent">{{ nextPost.title }}</span>
          <Icon name="ph:arrow-right" size="1.25rem" aria-hidden="true" class="mt-1 shrink-0 text-accent transition-transform motion-safe:group-hover:translate-x-1" />
        </NuxtLink>
      </nav>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug)
const { data: post, status, error, refresh } = await useBlogPost(slug)
const toAbsolute = useSiteUrl()
const waUrl = useWhatsAppLink()
const { data: allPosts } = useBlogPosts()
const nextPost = computed(() => {
  const list = allPosts.value ?? []
  const index = list.findIndex((item) => item.slug === slug)
  return list.length > 1 ? list[(index + 1) % list.length] : null
})
const isLoading = computed(() => status.value === 'idle' || status.value === 'pending')

// Unknown slugs are a real 404 so search engines drop them instead of indexing an empty page.
if (error.value?.statusCode === 404 || error.value?.statusCode === 400) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
const formatPublishedDate = (value: string) => dateFormatter.format(new Date(value))

usePageSeo({
  title: () => post.value?.title ? `${post.value.title} · Nova Sugiantara` : 'Article · Nova Sugiantara',
  description: () => post.value?.excerpt?.slice(0, 160) ?? 'An article by Nova Sugiantara on building and running web products.',
  path: `/blog/${slug}`,
  type: 'article',
  image: () => post.value?.cover_image_url,
  schema: () => post.value
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.value.title,
        ...(post.value.excerpt ? { description: post.value.excerpt } : {}),
        image: toAbsolute(post.value.cover_image_url || '/og.jpg'),
        ...(post.value.published_at ? { datePublished: post.value.published_at, dateModified: post.value.published_at } : {}),
        ...(post.value.tags?.length ? { keywords: post.value.tags.join(', ') } : {}),
        author: { '@type': 'Person', name: 'Nova Sugiantara', url: toAbsolute('/') },
        mainEntityOfPage: toAbsolute(`/blog/${slug}`),
        inLanguage: 'en',
      }
    : null,
})

useSeoMeta({
  articlePublishedTime: () => post.value?.published_at ?? undefined,
  articleAuthor: () => [toAbsolute('/')],
})
</script>

<style scoped>
.article-copy :deep(h2),
.article-copy :deep(h3),
.article-copy :deep(h4),
.article-copy :deep(h5),
.article-copy :deep(h6) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  color: var(--foreground-primary);
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.3;
  scroll-margin-top: 6rem;
}

.article-copy :deep(h2) {
  font-size: 1.5rem;
}

.article-copy :deep(h3) {
  font-size: 1.125rem;
}

.article-copy :deep(p),
.article-copy :deep(ul),
.article-copy :deep(ol),
.article-copy :deep(blockquote),
.article-copy :deep(pre),
.article-copy :deep(table),
.article-copy :deep(hr),
.article-copy :deep(img) {
  margin-top: 1rem;
}

.article-copy :deep(ul),
.article-copy :deep(ol) {
  padding-left: 1.5rem;
}

.article-copy :deep(ul) {
  list-style: disc;
}

.article-copy :deep(ol) {
  list-style: decimal;
}

.article-copy :deep(a) {
  color: var(--accent-primary);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

.article-copy :deep(a:hover) {
  color: var(--accent-hover);
}

.article-copy :deep(a:focus-visible) {
  outline: 2px solid var(--border-focus);
  outline-offset: 4px;
}

.article-copy :deep(blockquote) {
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  padding: 1rem 0;
  color: var(--foreground-primary);
}

.article-copy :deep(code) {
  border-radius: var(--radius-sm);
  background: var(--background-muted);
  padding: 0.125rem 0.375rem;
  font-family: var(--font-mono);
  font-size: 0.875em;
}

.article-copy :deep(pre) {
  overflow-x: auto;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: var(--background-muted);
  padding: 1rem;
}

.article-copy :deep(pre code) {
  background: transparent;
  padding: 0;
}

.article-copy :deep(table) {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
  white-space: nowrap;
}

.article-copy :deep(th),
.article-copy :deep(td) {
  border: 1px solid var(--border-subtle);
  padding: 0.625rem 0.75rem;
  text-align: left;
  vertical-align: top;
}

.article-copy :deep(th) {
  color: var(--foreground-primary);
  font-weight: 600;
}

.article-copy :deep(img) {
  height: auto;
  max-width: 100%;
  border-radius: var(--radius-md);
}

.article-copy :deep(hr) {
  border: 0;
  border-top: 1px solid var(--border-subtle);
}
</style>
