<template>
  <article class="mx-auto max-w-3xl px-4 py-16 md:px-6 lg:py-20">
    <div v-if="pending" class="text-sm text-[var(--foreground-muted)]">Loading post...</div>
    <div v-else-if="post" class="space-y-8">
      <div class="space-y-4">
        <h1 class="text-4xl font-extrabold tracking-tight font-heading text-[var(--foreground-primary)]">{{ post.title }}</h1>
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <time v-if="post.published_at" class="font-mono text-[var(--foreground-muted)]">
            {{ new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </time>
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="rounded-md bg-[var(--background-muted)] px-2 py-0.5 font-mono text-xs text-[var(--foreground-secondary)]"
          >{{ tag }}</span>
        </div>
      </div>

      <hr class="border-[var(--border-subtle)]" />

      <div
        class="prose max-w-none leading-loose text-[var(--foreground-secondary)]"
        v-html="post.content_html"
        :style="{
          '--tw-prose-headings': 'var(--foreground-primary)',
          '--tw-prose-links': 'var(--accent-primary)',
          background: 'unset',
        }"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: post, status } = useBlogPost(route.params.slug as string)
const pending = computed(() => status.value === 'idle' || status.value === 'pending')

const siteUrl = computed(() => {
  const u = useRequestURL()
  return `${u.protocol}//${u.host}`
})
const ogImage = computed(() =>
  post.value?.cover_image_url
    ? post.value.cover_image_url
    : `${siteUrl.value}/og-default.png`,
)

useSeoMeta({
  title: () => post.value?.title ?? 'Blog Post',
  description: () => post.value?.excerpt?.slice(0, 160) ?? '',
  ogType: 'article',
  ogTitle: () => post.value?.title ?? 'Blog Post',
  ogDescription: () => post.value?.excerpt?.slice(0, 160) ?? '',
  ogImage: () => ogImage.value,
  ogUrl: () => `${siteUrl.value}/blog/${route.params.slug}`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => post.value?.title ?? 'Blog Post',
  twitterDescription: () => post.value?.excerpt?.slice(0, 160) ?? '',
  twitterImage: () => ogImage.value,
})
</script>
