<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-gray-900">
              🎫 Sistema de Tickets
            </h1>
            <!-- Indicador de modo demo -->
            <Badge v-if="authStore.isMockMode" variant="secondary" class="ml-3 text-xs">
              🚀 MODO DEMO
            </Badge>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <RouterLink
              to="/dashboard"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              active-class="border-primary-500 text-primary-600"
            >
              Dashboard
            </RouterLink>
            <RouterLink
              to="/tickets"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              active-class="border-primary-500 text-primary-600"
            >
              Tickets
            </RouterLink>
            <RouterLink
              to="/clients"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              active-class="border-primary-500 text-primary-600"
            >
              Clientes
            </RouterLink>
          </div>
        </div>

        <!-- User menu -->
        <div class="flex items-center space-x-4">
          <!-- Create ticket button -->
          <Button @click="$router.push('/tickets/create')" size="sm">
            <Plus class="h-4 w-4 mr-2" />
            Nuevo Ticket
          </Button>

          <!-- User dropdown -->
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" class="relative h-8 w-8 rounded-full">
                <Avatar class="h-8 w-8">
                  <AvatarImage v-if="userAvatar" :src="userAvatar" />
                  <AvatarFallback>{{ userInitials }}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56" align="end">
              <div class="flex items-center justify-start gap-2 p-2">
                <div class="flex flex-col space-y-1 leading-none">
                  <p class="font-medium">{{ userEmail }}</p>
                  <p class="w-[200px] truncate text-sm text-muted-foreground">
                    {{ userEmail }}
                  </p>
                  <p v-if="authStore.isMockMode" class="text-xs text-blue-600 font-medium">
                    🚀 Modo Demo Activo
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout">
                <LogOut class="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <Button variant="ghost" size="sm" @click="mobileMenuOpen = !mobileMenuOpen">
              <Menu class="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
        <RouterLink
          to="/dashboard"
          class="text-gray-500 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
          active-class="text-primary-600 bg-primary-50"
          @click="mobileMenuOpen = false"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          to="/tickets"
          class="text-gray-500 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
          active-class="text-primary-600 bg-primary-50"
          @click="mobileMenuOpen = false"
        >
          Tickets
        </RouterLink>
        <RouterLink
          to="/clients"
          class="text-gray-500 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
          active-class="text-primary-600 bg-primary-50"
          @click="mobileMenuOpen = false"
        >
          Clientes
        </RouterLink>
        
        <!-- Indicador de modo demo en mobile -->
        <div v-if="authStore.isMockMode" class="px-3 py-2">
          <Badge variant="secondary" class="text-xs">
            🚀 MODO DEMO - Usando datos de prueba
          </Badge>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import { Plus, LogOut, Menu } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const userEmail = computed(() => authStore.user?.email || '')
const userInitials = computed(() => {
  if (!authStore.user?.email) return 'U'
  return authStore.user.email.charAt(0).toUpperCase()
})
const userAvatar = computed(() => {
  // Puedes usar un servicio como Gravatar o una URL de avatar personalizada
  return null
})

const handleLogout = async () => {
  const result = await authStore.logout()
  if (result.success) {
    if (authStore.isMockMode) {
      toast.success('Sesión demo cerrada correctamente')
    } else {
      toast.success('Sesión cerrada correctamente')
    }
    router.push('/login')
  } else {
    toast.error('Error al cerrar sesión')
  }
}
</script> 