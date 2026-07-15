<template>
  <nav
    class="bg-white/95 supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 border-b w-full"
  >
    <div class="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
      <div class="flex items-center gap-2 md:gap-6">
        <NuxtLink
          to="/"
          class="text-lg font-semibold transition hover:text-blue-600"
          active-class="text-blue-600"
          aria-label="Home"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="text-lg font-semibold transition hover:text-blue-600"
          active-class="text-blue-600"
          aria-label="Portofolio"
        >
          Portofolio
        </NuxtLink>
        <NuxtLink
          to="/blog"
          class="text-lg font-semibold transition hover:text-blue-600"
          active-class="text-blue-600"
          aria-label="Blog"
        >
          Blog
        </NuxtLink>
        <NuxtLink
          to="/contact"
          class="text-lg font-semibold transition hover:text-blue-600"
          active-class="text-blue-600"
          aria-label="Contact"
        >
          Contact
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
