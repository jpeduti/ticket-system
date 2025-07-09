<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <div class="flex items-center space-x-2">
              <div class="text-xl font-bold text-gray-800">🎫 Sistema Tickets</div>
              <Badge variant="outline" class="bg-gray-100 text-gray-700">
                👨‍💼 ADMIN
              </Badge>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              to="/admin/dashboard"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
              active-class="border-gray-500 text-gray-900"
            >
              Dashboard
            </router-link>
            <router-link
              to="/admin/tickets"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
              active-class="border-gray-500 text-gray-900"
            >
              Tickets
            </router-link>
            <router-link
              to="/admin/clients"
              class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
              active-class="border-gray-500 text-gray-900"
            >
              Clientes
            </router-link>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
          <!-- Modo Demo Badge -->
          <Badge v-if="authStore.isMockMode" variant="secondary" class="bg-green-100 text-green-800">
            🚀 MODO DEMO
          </Badge>
          
          <!-- User Menu -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="relative h-8 w-8 rounded-full">
                <Avatar class="h-8 w-8">
                  <AvatarFallback class="bg-gray-500 text-white text-xs">
                    {{ adminInitials }}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56" align="end">
              <DropdownMenuLabel class="font-normal">
                <div class="flex flex-col space-y-1">
                  <p class="text-sm font-medium leading-none">{{ adminName }}</p>
                  <p class="text-xs leading-none text-muted-foreground">{{ adminEmail }}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="logout" class="text-red-600 cursor-pointer">
                <LogOut class="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LogOut } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const router = useRouter()
const authStore = useAuthStore()

// Información del admin
const adminName = computed(() => authStore.user?.user_metadata?.name || 'Admin')
const adminEmail = computed(() => authStore.user?.email || 'admin@sistema.com')
const adminInitials = computed(() => {
  const name = adminName.value
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
})

const logout = async () => {
  await authStore.logout()
  router.push('/admin/login')
}
</script> 