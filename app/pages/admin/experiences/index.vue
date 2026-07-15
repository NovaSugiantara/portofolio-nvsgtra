<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Experiences</h1>
      <NuxtLink to="/admin/experiences/new" class="rounded bg-blue-600 px-4 py-2 text-white text-sm">+ New</NuxtLink>
    </div>

    <p v-if="pending" class="text-gray-600">Loading...</p>
    <table v-else class="w-full border text-sm">
      <thead>
        <tr class="bg-gray-50 text-left">
          <th class="p-2">Role</th>
          <th class="p-2">Company</th>
          <th class="p-2">Published</th>
          <th class="p-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in items" :key="e.id" class="border-t">
          <td class="p-2">{{ e.role }}</td>
          <td class="p-2 text-gray-600">{{ e.company }}</td>
          <td class="p-2">{{ e.is_published ? 'Yes' : 'No' }}</td>
          <td class="p-2 text-right">
            <NuxtLink :to="`/admin/experiences/${e.id}`" class="text-blue-600 mr-3">Edit</NuxtLink>
            <button class="text-red-600" @click="remove(e)">Delete</button>
          </td>
        </tr>
        <tr v-if="!items.length"><td colspan="4" class="p-4 text-center text-gray-500">No experiences yet</td></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

interface Exp { id: string; role: string; company: string; is_published: boolean }
const { data: items, pending, refresh } = await useFetch<Exp[]>('/api/admin/experiences')

const remove = async (e: Exp) => {
  if (!confirm(`Delete "${e.role}"?`)) return
  await $fetch(`/api/admin/experiences/${e.id}`, { method: 'DELETE' })
  await refresh()
}
</script>
