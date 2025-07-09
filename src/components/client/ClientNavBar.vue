<template>
  <nav class="bg-indigo-600 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-white">
              🎫 Portal Cliente
            </h1>
            <!-- Indicador de modo demo -->
            <Badge v-if="authStore.isMockMode" variant="secondary" class="ml-3 text-xs bg-white text-indigo-600">
              🚀 DEMO
            </Badge>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <RouterLink
              to="/client/dashboard"
              class="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-white bg-indigo-700"
            >
              Dashboard
            </RouterLink>
            <RouterLink
              to="/client/tickets"
              class="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-white bg-indigo-700"
            >
              Mis Tickets
            </RouterLink>
            <RouterLink
              to="/client/tickets/create"
              class="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-white bg-indigo-700"
            >
              Crear Ticket
            </RouterLink>
            <RouterLink
              to="/client/profile"
              class="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-white bg-indigo-700"
            >
              Mi Perfil
            </RouterLink>
          </div>
        </div>

        <!-- User menu -->
        <div class="flex items-center space-x-4">
          <!-- User dropdown -->
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" class="relative h-8 w-8 rounded-full bg-indigo-500 hover:bg-indigo-400">
                <Avatar class="h-8 w-8">
                  <AvatarFallback class="bg-indigo-400 text-white">{{ userInitials }}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56" align="end">
              <div class="flex items-center justify-start gap-2 p-2">
                <div class="flex flex-col space-y-1 leading-none">
                  <p class="font-medium">{{ clientName }}</p>
                  <p class="w-[200px] truncate text-sm text-muted-foreground">
                    {{ clientEmail }}
                  </p>
                  <p v-if="clientCompany" class="text-xs text-gray-500">
                    {{ clientCompany }}
                  </p>
                  <p v-if="authStore.isMockMode" class="text-xs text-blue-600 font-medium">
                    🚀 Modo Demo
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="$router.push('/client/profile')">
                <User class="mr-2 h-4 w-4" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout">
                <LogOut class="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <Button variant="ghost" size="sm" @click="mobileMenuOpen = !mobileMenuOpen" class="text-white">
              <Menu class="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-indigo-700">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <RouterLink
          to="/client/dashboard"
          class="text-indigo-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          active-class="text-white bg-indigo-800"
          @click="mobileMenuOpen = false"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          to="/client/tickets"
          class="text-indigo-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          active-class="text-white bg-indigo-800"
          @click="mobileMenuOpen = false"
        >
          Mis Tickets
        </RouterLink>
        <RouterLink
          to="/client/tickets/create"
          class="text-indigo-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          active-class="text-white bg-indigo-800"
          @click="mobileMenuOpen = false"
        >
          Crear Ticket
        </RouterLink>
        <RouterLink
          to="/client/profile"
          class="text-indigo-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          active-class="text-white bg-indigo-800"
          @click="mobileMenuOpen = false"
        >
          Mi Perfil
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import { LogOut, Menu, User } from 'lucide-vue-next'
import type { ClientUser } from '@/types'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

// Información del cliente
const clientUser = computed(() => authStore.user as ClientUser)
const clientName = computed(() => clientUser.value?.client_data?.name || clientUser.value?.user_metadata?.name || 'Cliente')
const clientEmail = computed(() => clientUser.value?.email || '')
const clientCompany = computed(() => clientUser.value?.client_data?.company?.name || '')

const userInitials = computed(() => {
  const name = clientName.value
  if (name) {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
  }
  return clientEmail.value.charAt(0).toUpperCase()
})

const handleLogout = async () => {
  const result = await authStore.logout()
  if (result.success) {
    toast.success('Sesión cerrada correctamente')
    router.push('/client/login')
  } else {
    toast.error('Error al cerrar sesión')
  }
}
</script> 