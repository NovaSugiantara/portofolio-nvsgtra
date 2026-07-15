<template>
  <div class="container mx-auto px-4 max-w-4xl py-12">
    <div v-if="post?.data && pending" class="space-y-6">
      <h1 class="text-4xl font-bold">{{ post.data.title }}</h1>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in post.data.tags"
          :key="tag"
          class="rounded-full bg-gray-100 px-3 py-1 text-xs"
        >
          {{ tag }}
        </span>
      </div>
      <p v-if="post.data.published_at" class="text-sm text-gray-600">
        {{ new Date(post.data.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
      </p>
      <hr class="my-4" />
      <!-- content_html already sanitized server-side (SRS §8.11) — safe for v-html -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <article class="prose max-w-none" v-html="post.data.content_html" />
    </div>
    <p v-else class="text-gray-600">Loading post...</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: post, status } = useBlogPost(route.params.slug as string)
const pending = computed(() => status.value === 'idle' || status.value === 'pending')

useSeoMeta({
  title: () => post?.value?.title ?? 'Blog Post',
  description: () => post?.value?.excerpt?.slice(0, 160) ?? '',
})
</script>
