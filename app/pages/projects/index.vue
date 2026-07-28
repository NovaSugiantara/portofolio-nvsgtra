<template>
  <div class="mx-auto max-w-7xl space-y-24 px-4 py-16 md:px-6 lg:px-12">
    <!-- About -->
    <section class="max-w-3xl">
      <h2 class="mb-6 text-3xl font-bold tracking-tight font-heading text-[var(--foreground-primary)]">About</h2>
      <div v-if="profile" class="space-y-5 leading-relaxed text-[var(--foreground-secondary)]">
        <p>{{ profile.summary }}</p>
        <div class="grid gap-3 text-sm sm:grid-cols-2">
          <div v-if="profile.email">
            <span class="font-semibold text-[var(--foreground-primary)]">Email</span>
            <a :href="`mailto:${profile.email}`" class="ml-2 underline decoration-[var(--accent-primary)] decoration-2 underline-offset-4">{{ profile.email }}</a>
          </div>
          <div v-if="profile.location">
            <span class="font-semibold text-[var(--foreground-primary)]">Location</span>
            <span class="ml-2">{{ profile.location }}</span>
          </div>
          <div v-if="profile.linkedin_url">
            <span class="font-semibold text-[var(--foreground-primary)]">LinkedIn</span>
            <a :href="profile.linkedin_url" target="_blank" rel="noopener" class="ml-2 underline decoration-[var(--accent-primary)] decoration-2 underline-offset-4">linkedin.com/in/novasugiantara</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills — DESIGN §6.2 chip badges in mono -->
    <section>
      <h2 class="mb-6 text-3xl font-bold tracking-tight font-heading text-[var(--foreground-primary)]">Technical Skills</h2>
      <div v-if="skills" class="space-y-5">
        <div v-for="(list, category) in skills" :key="category">
          <h3 class="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">{{ category }}</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="s in list"
              :key="s.id"
              class="inline-flex items-center rounded-md border px-3 py-1 text-sm font-mono"
              :style="{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--background-card)',
                color: 'var(--foreground-primary)',
              }"
            >
              {{ s.name }}
            </span>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-[var(--foreground-muted)]">Loading skills...</p>
    </section>

    <!-- Experience Timeline — DESIGN §6.3 -->
    <section>
      <h2 class="mb-8 text-3xl font-bold tracking-tight font-heading text-[var(--foreground-primary)]">Experience</h2>
      <div v-if="experiences" class="relative">
        <!-- Vertical connector -->
        <div
          class="absolute left-[18px] top-2 bottom-2 hidden w-px md:block"
          style="background: var(--border-subtle)"
        />
        <div v-for="exp in experiences" :key="exp.id" class="relative pb-10 last:pb-0">
          <!-- Glow dot -->
          <div
            class="absolute left-[18px] top-2 z-10 hidden h-2 w-2 -translate-x-1/2 rounded-full md:block"
            style="background-color: var(--accent-primary)"
          />
          <div class="grid gap-2 md:grid-cols-[0.45fr_1fr] md:gap-8 pl-8 md:pl-12">
            <!-- Left: dates + company -->
            <div class="space-y-1">
              <p class="text-sm font-mono font-semibold text-[var(--accent-primary)]">
                {{ new Date(exp.start_date).getFullYear() }} — {{ exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present' }}
              </p>
              <h3 class="text-base font-semibold font-heading text-[var(--foreground-primary)]">{{ exp.company }}</h3>
              <p v-if="exp.location" class="text-sm text-[var(--foreground-muted)]">{{ exp.location }}</p>
            </div>
            <!-- Right: role + bullets -->
            <div class="space-y-3">
              <p class="text-lg font-semibold font-heading text-[var(--foreground-primary)]">{{ exp.role }}</p>
              <ul v-if="exp.bullets?.length" class="space-y-1.5 text-sm leading-relaxed text-[var(--foreground-secondary)] ml-4 list-disc">
                <li v-for="(b, i) in exp.bullets" :key="i">{{ b }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-[var(--foreground-muted)]">Loading experience...</p>
    </section>

    <!-- Projects Grid — DESIGN §6.2 -->
    <section>
      <h2 class="mb-6 text-3xl font-bold tracking-tight font-heading text-[var(--foreground-primary)]">Projects</h2>
      <div v-if="projectsResult" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="project in projectsResult"
          :key="project.id"
          :to="`/projects/${project.slug}`"
          class="group block rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1"
          :style="{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--background-card)',
            boxShadow: 'var(--shadow-md)',
          }"
        >
          <h3 class="text-lg font-semibold font-heading text-[var(--foreground-primary)] group-hover:text-[var(--accent-primary)]">{{ project.title }}</h3>
          <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--foreground-secondary)]">{{ project.description }}</p>
          <div v-if="project.tech_stack?.length" class="mt-3 flex flex-wrap gap-1.5">
            <span
              v-for="tech in project.tech_stack"
              :key="tech"
              class="inline-flex rounded-md px-2 py-0.5 font-mono text-xs"
              :style="{
                backgroundColor: 'var(--background-muted)',
                color: 'var(--foreground-secondary)',
              }"
            >
              {{ tech }}
            </span>
          </div>
        </NuxtLink>
      </div>
      <p v-else class="text-sm text-[var(--foreground-muted)]">Loading projects...</p>
    </section>

    <!-- Education & Certifications -->
    <div v-if="education && certifications" class="grid gap-12 md:grid-cols-2">
      <section>
        <h2 class="mb-4 text-2xl font-bold font-heading text-[var(--foreground-primary)]">Education</h2>
        <ul class="space-y-4">
          <li v-for="e in education" :key="e.id">
            <p class="text-sm font-mono text-[var(--accent-primary)]">{{ e.start_date ? new Date(e.start_date).getFullYear() : '' }} — {{ e.end_date ? new Date(e.end_date).getFullYear() : e.is_expected ? 'Expected' : 'Present' }}</p>
            <p class="font-semibold font-heading text-[var(--foreground-primary)]">{{ e.degree }}</p>
            <p class="text-sm text-[var(--foreground-secondary)]">{{ e.institution }}</p>
          </li>
        </ul>
      </section>
      <section v-if="certifications.length">
        <h2 class="mb-4 text-2xl font-bold font-heading text-[var(--foreground-primary)]">Certifications</h2>
        <ul class="space-y-3">
          <li v-for="c in certifications" :key="c.id">
            <p class="font-semibold font-heading text-[var(--foreground-primary)]">{{ c.name }}</p>
            <p class="text-sm text-[var(--foreground-secondary)]">{{ c.issuer }}</p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: profile } = useProfile()
const { data: skills } = useSkills()
const { data: experiences } = useExperiences()
const { data: projectsResult } = useProjects()

const { data: education } = useFetch<{ id: string; institution: string; degree: string; start_date?: string; end_date?: string; is_expected?: boolean }[]>('/api/education', { key: 'education' })
const { data: certifications } = useFetch<{ id: string; name: string; issuer: string }[]>('/api/certifications', { key: 'certifications' })

useSeoMeta({
  title: 'Portofolio — Nova Sugiantara',
  description: 'Skills, experience, projects, education, and certifications.',
})
</script>
