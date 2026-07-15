<template>
  <div class="container mx-auto px-4 max-w-5xl py-12 space-y-20">
    <!-- About Section -->
    <section>
      <h2 class="text-3xl font-bold mb-6">About</h2>
      <div v-if="profile" class="prose max-w-none text-gray-600 leading-relaxed">
        <p>{{ profile.summary }}</p>
        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div v-if="profile.email">
            <span class="font-medium">Email:</span>
            <a :href="`mailto:${profile.email}`" class="ml-1 underline">{{ profile.email }}</a>
          </div>
          <div v-if="profile.location">
            <span class="font-medium">Location:</span> {{ profile.location }}
          </div>
          <div v-if="profile.linkedin_url">
            <span class="font-medium">LinkedIn:</span>
            <a :href="profile.linkedin_url" target="_blank" rel="noopener" class="ml-1 underline">linkedin.com/in/novasugiantara</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section>
      <h2 class="text-3xl font-bold mb-6">Technical Skills</h2>
      <div v-if="skills" class="space-y-4">
        <div v-for="(skillList, category) in skills" :key="category">
          <h3 class="text-lg font-semibold mb-2">{{ category }}</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="s in skillList"
              :key="s.id"
              class="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-gray-100"
            >
              {{ s.name }}
            </span>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-600 text-sm">Loading skills...</p>
    </section>

    <!-- Experience Timeline -->
    <section>
      <h2 class="text-3xl font-bold mb-6">Experience</h2>
      <div v-if="experiences" class="space-y-8">
        <div v-for="exp in experiences" :key="exp.id" class="border-l-2 pl-6 relative">
          <h3 class="text-xl font-semibold">{{ exp.role }}</h3>
          <p class="text-gray-600">
            {{ exp.company }}
            <span v-if="exp.location">— {{ exp.location }}</span>
          </p>
          <p class="text-sm text-gray-600">
            {{ new Date(exp.start_date).getFullYear() }} – {{ exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present' }}
          </p>
          <ul v-if="exp.bullets?.length" class="mt-2 list-disc list-inside space-y-1 text-gray-600 text-sm">
            <li v-for="(bullet, i) in exp.bullets" :key="i">{{ bullet }}</li>
          </ul>
        </div>
      </div>
      <p v-else class="text-gray-600 text-sm">Loading experience...</p>
    </section>

    <!-- Projects Grid -->
    <section>
      <h2 class="text-3xl font-bold mb-6">Projects</h2>
      <div v-if="projectsResult" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="project in projectsResult"
          :key="project.id"
          :to="`/projects/${project.slug}`"
          class="rounded-xl border p-6 transition hover:shadow-md group"
        >
          <h3 class="text-lg font-semibold group-hover:text-blue-600 transition">{{ project.title }}</h3>
          <p class="mt-2 text-sm text-gray-600 line-clamp-3">{{ project.description }}</p>
          <div v-if="project.tech_stack?.length" class="mt-3 flex flex-wrap gap-1">
            <span
              v-for="tech in project.tech_stack"
              :key="tech"
              class="rounded-full bg-gray-100 px-2 py-0.5 text-xs"
            >
              {{ tech }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Education & Certifications -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- ponytail: education/certs fetched inline via SSR, separate composable unnecessary until shared across multiple pages -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetch } from '#app'

const { data: profile } = useProfile()
const { data: skills } = useSkills()
const { data: experiences } = useExperiences()
const { data: projectsResult } = useProjects()

// ponytail: education & certs fetched inline, no dedicated composable yet
const { data: education } = useFetch('/api/education', { key: 'education', default: () => [] })
const { data: certifications } = useFetch('/api/certifications', { key: 'certifications', default: () => [] })

useSeoMeta({
  title: 'Portofolio — Nova Sugiantara',
  description: 'Skills, experience, projects, and education of Nova Sugiantara.',
})
</script>
