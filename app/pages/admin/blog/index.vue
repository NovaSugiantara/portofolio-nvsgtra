<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Blog Posts</h1>
      <NuxtLink to="/admin/blog/new" class="rounded bg-blue-600 px-4 py-2 text-white text-sm">+ New</NuxtLink>
    </div>

    <p v-if="pending" class="text-gray-600">Loading...</p>
    <table v-else class="w-full border text-sm">
      <thead>
        <tr class="bg-gray-50 text-left">
          <th class="p-2">Title</th>
          <th class="p-2">Slug</th>
          <th class="p-2">Published</th>
          <th class="p-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in posts" :key="p.id" class="border-t">
          <td class="p-2">{{ p.title }}</td>
          <td class="p-2 text-gray-600">{{ p.slug }}</td>
          <td class="p-2">{{ p.is_published ? 'Yes' : 'No' }}</td>
          <td class="p-2 text-right">
            <NuxtLink :to="`/admin/blog/${p.id}`" class="text-blue-600 mr-3">Edit</NuxtLink>
            <button class="text-red-600" @click="remove(p)">Delete</button>
          </td>
        </tr>
        <tr v-if="!posts.length"><td colspan="4" class="p-4 text-center text-gray-500">No posts yet</td></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface Post { id: string; title: string; slug: string; is_published: boolean }
const { data: posts, pending, refresh } = await useFetch<Post[]>('/api/admin/blog-posts')

const remove = async (p: Post) => {
  if (!confirm(`Delete "${p.title}"?`)) return
  await $fetch(`/api/admin/blog-posts/${p.id}`, { method: 'DELETE' })
  await refresh()
}
</script>
