<template>
  <div class="min-h-screen bg-gray-50">
    <ClientNavBar />
    
    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p class="text-gray-600">Información de tu cuenta y empresa</p>
        </div>

        <!-- Información del perfil -->
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Datos de tu cuenta en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label class="text-sm font-medium text-gray-700">Nombre</Label>
                <p class="mt-1 text-sm text-gray-900">{{ clientData?.name || 'No disponible' }}</p>
              </div>
              
              <div>
                <Label class="text-sm font-medium text-gray-700">Email</Label>
                <p class="mt-1 text-sm text-gray-900">{{ clientData?.email || 'No disponible' }}</p>
              </div>
              
              <div>
                <Label class="text-sm font-medium text-gray-700">Teléfono</Label>
                <p class="mt-1 text-sm text-gray-900">{{ clientData?.phone || 'No registrado' }}</p>
              </div>
              
              <div>
                <Label class="text-sm font-medium text-gray-700">Empresa</Label>
                <p class="mt-1 text-sm text-gray-900">{{ clientData?.company || 'No registrada' }}</p>
              </div>
              
              <div class="md:col-span-2">
                <Label class="text-sm font-medium text-gray-700">Dirección</Label>
                <p class="mt-1 text-sm text-gray-900">{{ clientData?.address || 'No registrada' }}</p>
              </div>
              
              <div>
                <Label class="text-sm font-medium text-gray-700">Cliente desde</Label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(clientData?.created_at) }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Estadísticas del cliente -->
        <Card class="mt-6">
          <CardHeader>
            <CardTitle>Mis Estadísticas</CardTitle>
            <CardDescription>
              Resumen de tu actividad en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ stats?.total || 0 }}</div>
                <div class="text-sm text-blue-600">Total Tickets</div>
              </div>
              
              <div class="text-center p-4 bg-yellow-50 rounded-lg">
                <div class="text-2xl font-bold text-yellow-600">{{ stats?.in_progress || 0 }}</div>
                <div class="text-sm text-yellow-600">En Progreso</div>
              </div>
              
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ stats?.closed || 0 }}</div>
                <div class="text-sm text-green-600">Resueltos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Información de modo demo -->
        <div v-if="authStore.isMockMode" class="mt-6">
          <Card class="border-blue-200 bg-blue-50">
            <CardContent class="p-4">
              <div class="flex items-center">
                <div class="text-2xl mr-3">🚀</div>
                <div>
                  <h3 class="font-medium text-blue-800">Modo Demo Activo</h3>
                  <p class="text-sm text-blue-600 mt-1">
                    Esta información es de prueba. En el sistema real podrías editar tu perfil contactando al administrador.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTicketsStore } from '@/stores/tickets'
import type { Client, TicketStats, ClientUser, Ticket } from '@/types'

import ClientNavBar from '@/components/client/ClientNavBar.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const authStore = useAuthStore()
const ticketsStore = useTicketsStore()

const stats = ref<TicketStats | null>(null)

// Información del cliente logueado
const clientUser = computed(() => authStore.user as ClientUser)
const clientData = computed(() => clientUser.value?.client_data)

// Cargar estadísticas del cliente
onMounted(async () => {
  if (clientUser.value?.client_id) {
    // Cargar tickets del cliente para estadísticas
    const clientTickets: Ticket[] = await ticketsStore.fetchTicketsByClient(clientUser.value.client_id)
    
    // Calcular estadísticas
    stats.value = {
      total: clientTickets.length,
      open: clientTickets.filter(t => t.status === 'open').length,
      in_progress: clientTickets.filter(t => t.status === 'in_progress').length,
      closed: clientTickets.filter(t => t.status === 'closed').length,
      high_priority: clientTickets.filter(t => t.priority === 'high').length,
      medium_priority: clientTickets.filter(t => t.priority === 'medium').length,
      low_priority: clientTickets.filter(t => t.priority === 'low').length,
    }
  }
})

const formatDate = (dateString?: string) => {
  if (!dateString) return 'No disponible'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 