<template>
  <div id="app">
    <RouterView />
    <Toaster />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: #f8fafc;
}
</style>
