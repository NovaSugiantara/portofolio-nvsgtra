<template>
  <div class="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-20">
    <h1 class="mb-8 text-4xl font-extrabold tracking-tight font-heading text-[var(--foreground-primary)]">Blog</h1>

    <div v-if="posts?.data" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="post in posts.data"
        :key="post.id"
        class="group flex flex-col rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1"
        :style="{
          borderColor: 'var(--border-subtle)',
          backgroundColor: 'var(--background-card)',
          boxShadow: 'var(--shadow-sm)',
        }"
      >
        <time
          v-if="post.published_at"
          class="mb-2 font-mono text-xs text-[var(--foreground-muted)] uppercase tracking-[0.12em]"
        >
          {{ new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}
        </time>
        <NuxtLink :to="`/blog/${post.slug}`" class="block">
          <h2 class="text-lg font-semibold font-heading text-[var(--foreground-primary)] group-hover:text-[var(--accent-primary)] transition">{{ post.title }}</h2>
        </NuxtLink>
        <p v-if="post.excerpt" class="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--foreground-secondary)] flex-1">{{ post.excerpt }}</p>
        <div v-if="post.tags?.length" class="mt-3 flex flex-wrap gap-1.5">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="rounded-md px-2 py-0.5 font-mono text-xs"
            :style="{
              backgroundColor: 'var(--background-muted)',
              color: 'var(--foreground-secondary)',
            }"
          >{{ tag }}</span>
        </div>
      </article>
    </div>
    <p v-else class="text-sm text-[var(--foreground-muted)]">Loading posts...</p>
  </div>
</template>

<script setup lang="ts">
const { data: posts } = useBlogPosts()
useSeoMeta({
  title: 'Blog — Nova Sugiantara',
  description: 'Blog posts by Nova Sugiantara about web development and tech.',
})
</script>
