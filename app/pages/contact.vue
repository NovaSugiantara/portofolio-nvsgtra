<template>
  <div class="container mx-auto max-w-4xl px-4 py-16 md:py-20">
    <div class="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
      <section class="space-y-6">
        <div class="space-y-3">
          <p class="text-sm font-medium uppercase tracking-[0.24em] text-[#43637E]">Contact</p>
          <h1 class="text-4xl font-extrabold tracking-tight text-[#321E48] md:text-5xl">
            Let's start a project.
          </h1>
          <p class="max-w-xl text-base leading-7 text-[#43637E]">
            Send a message for freelance work, collaboration, or a quick question.
          </p>
        </div>

        <div class="rounded-2xl border border-[#CCEBE2] bg-white p-6 shadow-sm">
          <form class="space-y-5" @submit.prevent="submitForm" novalidate>
            <div class="grid gap-5 sm:grid-cols-2">
              <div class="space-y-2">
                <label for="name" class="block text-sm font-medium text-[#321E48]">Name</label>
                <input
                  id="name"
                  v-model.trim="form.name"
                  type="text"
                  autocomplete="name"
                  class="w-full rounded-md border border-[#CCEBE2] bg-[#D9FFF4] px-3 py-2 text-[#321E48] placeholder:text-[#43637E] focus:border-[#2D9C96] focus:outline-none focus:ring-2 focus:ring-[#65DCD5]/30"
                  placeholder="Your name"
                  required
                />
              </div>
              <div class="space-y-2">
                <label for="email" class="block text-sm font-medium text-[#321E48]">Email</label>
                <input
                  id="email"
                  v-model.trim="form.email"
                  type="email"
                  autocomplete="email"
                  class="w-full rounded-md border border-[#CCEBE2] bg-[#D9FFF4] px-3 py-2 text-[#321E48] placeholder:text-[#43637E] focus:border-[#2D9C96] focus:outline-none focus:ring-2 focus:ring-[#65DCD5]/30"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="message" class="block text-sm font-medium text-[#321E48]">Message</label>
              <textarea
                id="message"
                v-model.trim="form.message"
                rows="6"
                class="w-full rounded-md border border-[#CCEBE2] bg-[#D9FFF4] px-3 py-2 text-[#321E48] placeholder:text-[#43637E] focus:border-[#2D9C96] focus:outline-none focus:ring-2 focus:ring-[#65DCD5]/30"
                placeholder="Tell me about the project, timeline, or context."
                required
              />
            </div>

            <input v-model="form.hp" type="text" name="hp" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                :disabled="status === 'loading'"
                class="inline-flex h-11 items-center justify-center rounded-full bg-[#65DCD5] px-5 text-sm font-semibold text-[#321E48] transition hover:bg-[#4BBDB6] focus:outline-none focus:ring-2 focus:ring-[#2D9C96] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ status === 'loading' ? 'Sending…' : 'Send message' }}
              </button>

              <p v-if="status === 'success'" class="text-sm font-medium text-[#2D9C96]" role="status" aria-live="polite">
                Message sent. Nova will reply by email.
              </p>
              <p v-else-if="status === 'error'" class="text-sm font-medium text-red-700" role="alert">
                {{ errorMessage }}
              </p>
            </div>
          </form>
        </div>
      </section>

      <aside class="space-y-4 rounded-2xl border border-[#CCEBE2] bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-[#321E48]">Direct contact</h2>
        <div v-if="profile" class="space-y-3 text-sm text-[#43637E]">
          <p v-if="profile.email">
            <span class="font-medium text-[#321E48]">Email:</span>
            <a :href="`mailto:${profile.email}`" class="ml-1 underline decoration-[#65DCD5] decoration-2 underline-offset-4">
              {{ profile.email }}
            </a>
          </p>
          <p v-if="profile.linkedin_url">
            <span class="font-medium text-[#321E48]">LinkedIn:</span>
            <a :href="profile.linkedin_url" target="_blank" rel="noopener noreferrer" class="ml-1 underline decoration-[#65DCD5] decoration-2 underline-offset-4">
              linkedin.com/in/novasugiantara
            </a>
          </p>
          <p v-if="profile.phone">
            <span class="font-medium text-[#321E48]">WhatsApp:</span>
            <span class="ml-1">{{ profile.phone }}</span>
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: profile } = useProfile()
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const errorMessage = ref('')
const form = reactive({ name: '', email: '', message: '', hp: '' })

const submitForm = async () => {
  status.value = 'loading'
  errorMessage.value = ''

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        message: form.message,
        hp: form.hp,
      },
    })

    status.value = 'success'
    form.name = ''
    form.email = ''
    form.message = ''
    form.hp = ''
  } catch (error) {
    status.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Failed to send message'
  }
}

useSeoMeta({
  title: 'Contact — Nova Sugiantara',
  description: 'Contact Nova Sugiantara for freelance work, collaborations, and questions.',
})
</script>
