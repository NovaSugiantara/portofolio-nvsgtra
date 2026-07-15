<template>
  <div class="mx-auto max-w-md py-20 px-4">
    <div class="rounded-2xl border bg-white p-8 shadow-sm">
      <h1 class="text-2xl font-bold mb-2">Admin Login</h1>
      <p class="text-sm text-gray-600 mb-6">Use the owner account only.</p>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label for="email" class="mb-1 block text-sm font-medium">Email</label>
          <input id="email" v-model="email" type="email" class="w-full rounded border px-3 py-2" required />
        </div>
        <div>
          <label for="password" class="mb-1 block text-sm font-medium">Password</label>
          <input id="password" v-model="password" type="password" class="w-full rounded border px-3 py-2" required />
        </div>
        <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
        <button class="rounded bg-blue-600 px-4 py-2 text-white" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: [] })

const { login, user } = useAuth()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const router = useRouter()

const onSubmit = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    await login(email.value, password.value)
    if (user.value) await navigateTo('/admin/dashboard')
  } catch (error) {
    errorMsg.value = error instanceof Error ? error.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
