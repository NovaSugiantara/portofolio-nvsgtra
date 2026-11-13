<template>
  <section class="site-container py-16 lg:py-24" aria-labelledby="blog-title">
    <header class="space-y-4 border-b border-[var(--border-subtle)] pb-10">
      <p class="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary)]">Writing</p>
      <h1 id="blog-title" class="max-w-2xl text-pretty font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--foreground-primary)] sm:text-5xl lg:text-6xl">
        Blog
      </h1>
      <p class="max-w-2xl text-base leading-8 text-[var(--foreground-secondary)] sm:text-lg">
        Notes from building and running web products: what worked, what broke, and what I would do again.
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
      <li v-for="post in posts" :key="post.id">
        <article class="group grid min-w-0 gap-3 py-10 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12">
          <p class="flex flex-wrap gap-x-3 gap-y-1 pt-1.5 font-mono text-xs text-[var(--foreground-muted)] lg:flex-col">
            <time v-if="post.published_at" :datetime="post.published_at">{{ formatPublishedDate(post.published_at) }}</time>
            <span>{{ post.reading_minutes }} min read</span>
          </p>
          <div class="min-w-0 max-w-3xl">
            <h2 class="text-pretty font-heading text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
              <NuxtLink :to="`/blog/${post.slug}`" class="text-[var(--foreground-primary)] no-underline transition-colors group-hover:text-[var(--accent-primary)]">{{ post.title }}</NuxtLink>
            </h2>
            <p v-if="post.excerpt" class="mt-3 text-base leading-7 text-[var(--foreground-secondary)]">{{ post.excerpt }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <NuxtLink :to="`/blog/${post.slug}`" class="link-accent" tabindex="-1" aria-hidden="true">Read article <Icon name="ph:arrow-right" size="1.125rem" aria-hidden="true" class="transition-transform motion-safe:group-hover:translate-x-1" /></NuxtLink>
              <p v-if="post.tags?.length" class="font-mono text-xs text-[var(--foreground-muted)]">{{ post.tags.join(' · ') }}</p>
            </div>
          </div>
        </article>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const { data: posts, status, error, refresh } = useBlogPosts()
const toAbsolute = useSiteUrl()

const isLoading = computed(() => status.value === 'idle' || status.value === 'pending')
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const formatPublishedDate = (value: string) => dateFormatter.format(new Date(value))

usePageSeo({
  title: 'Blog · Nova Sugiantara',
  description: 'Notes from Nova Sugiantara on building and running web products: booking flows, payment integrations, and keeping a site fast.',
  path: '/blog',
  schema: () => ({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Nova Sugiantara · Blog',
    url: toAbsolute('/blog'),
    author: { '@type': 'Person', name: 'Nova Sugiantara', url: toAbsolute('/') },
    blogPost: (posts.value ?? []).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: toAbsolute(`/blog/${post.slug}`),
      ...(post.published_at ? { datePublished: post.published_at } : {}),
    })),
  }),
})
</script>
