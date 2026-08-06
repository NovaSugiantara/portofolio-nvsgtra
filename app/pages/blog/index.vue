<template>
  <section class="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24" aria-labelledby="blog-title">
    <header class="max-w-3xl space-y-4 border-b border-[var(--border-subtle)] pb-10">
      <p class="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary)]">Writing</p>
      <h1 id="blog-title" class="max-w-2xl text-pretty font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--foreground-primary)] sm:text-5xl lg:text-6xl">
        Blog
      </h1>
      <p class="max-w-2xl text-base leading-8 text-[var(--foreground-secondary)] sm:text-lg">
        Notes on building useful, resilient web products.
      </p>
    </header>

    <div v-if="isLoading" class="divide-y divide-[var(--border-subtle)]" aria-busy="true" aria-label="Loading published posts">
      <div v-for="placeholder in 3" :key="placeholder" class="grid gap-5 py-8 first:pt-10 lg:grid-cols-[minmax(0,1fr)_12rem]">
        <div class="space-y-4">
          <div class="h-3 w-32 animate-pulse rounded bg-[var(--background-muted)]" />
          <div class="h-8 w-4/5 animate-pulse rounded bg-[var(--background-muted)]" />
          <div class="h-4 w-full max-w-xl animate-pulse rounded bg-[var(--background-muted)]" />
        </div>
        <div class="h-4 w-24 animate-pulse rounded bg-[var(--background-muted)] lg:justify-self-end" />
      </div>
    </div>

    <section v-else-if="error" class="mt-10 border-y border-[var(--border-subtle)] py-8" role="alert" aria-labelledby="blog-error-title">
      <h2 id="blog-error-title" class="font-heading text-xl font-semibold text-[var(--foreground-primary)]">Posts are unavailable</h2>
      <p class="mt-2 max-w-xl text-sm leading-6 text-[var(--foreground-secondary)]">
        The blog could not be loaded. Try again in a moment.
      </p>
      <button
        type="button"
        class="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--accent-primary)] px-4 text-sm font-semibold text-[var(--color-mint)] transition-colors hover:bg-[var(--accent-hover)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
        @click="refresh()"
      >
        <Icon name="ph:arrow-clockwise" size="1.125rem" aria-hidden="true" />Try again
      </button>
    </section>

    <section v-else-if="posts.length === 0" class="mt-10 border-y border-[var(--border-subtle)] py-8" role="status" aria-labelledby="blog-empty-title">
      <h2 id="blog-empty-title" class="font-heading text-xl font-semibold text-[var(--foreground-primary)]">No published posts yet</h2>
      <p class="mt-2 max-w-xl text-sm leading-6 text-[var(--foreground-secondary)]">
        New writing will appear here when it is published.
      </p>
    </section>

    <ul v-else class="mt-2 divide-y divide-[var(--border-subtle)]">
      <li
        v-for="post in posts"
        :key="post.id"
        class="group grid min-w-0 gap-6 py-8 first:pt-10 last:pb-0 lg:grid-cols-[minmax(0,1fr)_12rem] lg:gap-12"
      >
        <div class="min-w-0">
          <time
            v-if="post.published_at"
            :datetime="post.published_at"
            class="font-mono text-xs uppercase tracking-[0.12em] text-[var(--foreground-muted)]"
          >
            <span class="inline-flex items-center gap-2"><Icon name="ph:calendar-blank" size="1rem" aria-hidden="true" />{{ formatPublishedDate(post.published_at) }}</span>
          </time>
          <NuxtLink
            :to="`/blog/${post.slug}`"
            class="mt-3 block w-fit max-w-full rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--border-focus)]"
          >
            <h2 class="max-w-3xl text-pretty font-heading text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground-primary)] transition-colors duration-[180ms] group-hover:text-[var(--accent-primary)] sm:text-3xl">
              {{ post.title }}
            </h2>
          </NuxtLink>
          <p v-if="post.excerpt" class="mt-3 max-w-2xl text-base leading-7 text-[var(--foreground-secondary)]">
            {{ post.excerpt }}
          </p>
          <p v-if="post.tags?.length" class="mt-5 break-words font-mono text-xs leading-5 text-[var(--foreground-muted)]" aria-label="Post topics">
            <Icon name="ph:tag" size="1rem" aria-hidden="true" class="mr-2 inline-block" />{{ post.tags.join(', ') }}
          </p>
        </div>
        <NuxtLink
          :to="`/blog/${post.slug}`"
          class="inline-flex min-h-11 w-fit items-center self-start text-sm font-semibold text-[var(--accent-primary)] underline decoration-[var(--accent-primary)] decoration-2 underline-offset-4 transition-colors duration-[180ms] hover:text-[var(--accent-hover)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--border-focus)] lg:justify-self-end"
        >
          Read article<span class="sr-only">: {{ post.title }}</span><Icon name="ph:arrow-right" size="1.125rem" aria-hidden="true" class="ml-2" />
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const { data: posts, status, error, refresh } = useBlogPosts()

const isLoading = computed(() => status.value === 'idle' || status.value === 'pending')
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const formatPublishedDate = (value: string) => dateFormatter.format(new Date(value))
const siteOrigin = useRequestURL().origin
const blogImageUrl = computed(() => {
  const image = posts.value?.find((post) => post.cover_image_url)?.cover_image_url
  return image ? new URL(image, siteOrigin).toString() : undefined
})
const blogCollectionSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Blog - Nova Sugiantara',
  url: `${siteOrigin}/blog`,
  ...(posts.value?.length ? {
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.value.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: post.title,
        url: `${siteOrigin}/blog/${post.slug}`,
      })),
    },
  } : {}),
}))
const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026')

useSeoMeta({
  title: 'Blog - Nova Sugiantara',
  description: 'Blog posts by Nova Sugiantara about web development and tech.',
  ogType: 'website',
  ogTitle: 'Blog - Nova Sugiantara',
  ogDescription: 'Blog posts by Nova Sugiantara about web development and tech.',
  ogUrl: `${siteOrigin}/blog`,
  ogSiteName: 'Nova Sugiantara Portfolio',
  ogImage: blogImageUrl,
  ogImageAlt: 'Nova Sugiantara blog posts',
  twitterTitle: 'Blog - Nova Sugiantara',
  twitterDescription: 'Blog posts by Nova Sugiantara about web development and tech.',
  twitterImage: blogImageUrl,
  twitterCard: 'summary',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteOrigin}/blog` }],
  script: [{
    key: 'blog-collection-jsonld',
    type: 'application/ld+json',
    children: () => serializeJsonLd(blogCollectionSchema.value),
  }],
})
</script>
