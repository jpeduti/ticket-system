<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar dinámico según el tipo de usuario -->
    <AdminNavBar v-if="isAdminPortal" />
    <ClientNavBar v-else />
    
    <main class="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-8">
          <div class="flex items-center space-x-4">
            <Button variant="ghost" @click="goBack">
              <ArrowLeft class="h-4 w-4 mr-2" />
              Volver a Tickets
            </Button>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                Ticket #{{ $route.params.id }}
              </h1>
              <p class="text-gray-600">Detalle del ticket</p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent class="p-6">
            <p class="text-gray-600">Vista de detalle del ticket en construcción...</p>
            <p class="text-sm text-gray-500 mt-2">
              Portal: {{ isAdminPortal ? 'Admin' : 'Cliente' }}
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ArrowLeft } from 'lucide-vue-next'

// Importaciones condicionales de navbars
import AdminNavBar from '@/components/AdminNavBar.vue'
import ClientNavBar from '@/components/client/ClientNavBar.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Detectar si estamos en el portal admin basándose en la ruta
const isAdminPortal = computed(() => {
  return route.path.startsWith('/admin/')
})

// Función para volver según el contexto
const goBack = () => {
  if (isAdminPortal.value) {
    router.push('/admin/tickets')
  } else {
    router.push('/client/tickets')
  }
}
</script> 