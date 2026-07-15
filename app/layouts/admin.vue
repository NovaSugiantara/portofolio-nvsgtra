<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <div class="flex min-h-screen">
      <aside class="w-64 border-r bg-white p-6 hidden md:block">
        <h1 class="text-xl font-bold mb-6">Admin</h1>
        <nav class="space-y-2 text-sm">
          <NuxtLink to="/admin/dashboard" class="block rounded px-3 py-2 hover:bg-gray-100">Dashboard</NuxtLink>
          <NuxtLink to="/admin/profile" class="block rounded px-3 py-2 hover:bg-gray-100">Profile</NuxtLink>
          <NuxtLink to="/admin/projects" class="block rounded px-3 py-2 hover:bg-gray-100">Projects</NuxtLink>
          <NuxtLink to="/admin/experiences" class="block rounded px-3 py-2 hover:bg-gray-100">Experiences</NuxtLink>
          <NuxtLink to="/admin/skills" class="block rounded px-3 py-2 hover:bg-gray-100">Skills</NuxtLink>
          <NuxtLink to="/admin/blog" class="block rounded px-3 py-2 hover:bg-gray-100">Blog</NuxtLink>
          <NuxtLink to="/admin/cv" class="block rounded px-3 py-2 hover:bg-gray-100">CV</NuxtLink>
        </nav>
      </aside>
      <main class="flex-1 p-6 md:p-10">
        <slot />
      </main>
    </div>
  </div>
</template>
