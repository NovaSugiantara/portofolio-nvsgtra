<template>
  <div class="container mx-auto px-4 max-w-5xl py-12">
    <h1 class="text-3xl font-bold mb-8">Blog</h1>
    <div v-if="posts?.data" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="post in posts.data"
        :key="post.id"
        :to="`/blog/${post.slug}`"
        class="rounded-xl border p-6 transition hover:shadow-md group"
      >
        <h2 class="text-lg font-semibold group-hover:text-blue-600 transition">{{ post.title }}</h2>
        <p v-if="post.excerpt" class="mt-2 text-sm text-gray-600 line-clamp-3">{{ post.excerpt }}</p>
        <p v-if="post.published_at" class="mt-3 text-xs text-gray-600">
          {{ new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}
        </p>
        <div v-if="post.tags?.length" class="mt-3 flex flex-wrap gap-1">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="rounded-full bg-gray-100 px-2 py-0.5 text-xs"
          >
            {{ tag }}
          </span>
        </div>
      </NuxtLink>
    </div>
    <p v-else class="text-gray-600 text-sm">Loading posts...</p>
  </div>
</template>

<script setup lang="ts">
const { data: posts } = useBlogPosts()

useSeoMeta({
  title: 'Blog — Nova Sugiantara',
  description: 'Blog posts by Nova Sugiantara about web development, AI, and tech.',
})
</script>
