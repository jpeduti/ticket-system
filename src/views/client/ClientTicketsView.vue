<template>
  <div class="min-h-screen bg-gray-50">
    <ClientNavBar />
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Tickets de {{ clientCompany }}</h1>
              <p class="text-gray-600">Revisa el estado de todos los tickets de soporte de tu empresa</p>
            </div>
            <Button @click="$router.push('/client/tickets/create')" class="bg-indigo-600 hover:bg-indigo-700">
              <Plus class="h-4 w-4 mr-2" />
              Nuevo Ticket
            </Button>
          </div>
        </div>

        <!-- Lista de tickets -->
        <Card>
          <CardHeader>
            <CardTitle>Todos los tickets de {{ clientCompany }}</CardTitle>
            <CardDescription>
              {{ companyTickets.length }} tickets encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="loading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
            
            <div v-else-if="companyTickets.length === 0" class="text-center py-12 text-gray-500">
              <div class="text-6xl mb-4">🎫</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No hay tickets registrados para tu empresa</h3>
              <p class="text-sm mb-6">¡Crea tu primer ticket de soporte para comenzar!</p>
              <Button @click="$router.push('/client/tickets/create')" class="bg-indigo-600 hover:bg-indigo-700">
                <Plus class="h-4 w-4 mr-2" />
                Crear mi primer ticket
              </Button>
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="ticket in sortedTickets" 
                :key="ticket.id"
                class="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                @click="$router.push(`/client/tickets/${ticket.id}`)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-900">
                      #{{ ticket.id }} - {{ ticket.title }}
                    </h3>
                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                      {{ ticket.description }}
                    </p>
                    <div class="flex items-center mt-2 space-x-4">
                      <span class="text-xs text-gray-500">
                        Cliente: {{ ticket.client?.name || 'N/A' }}
                      </span>
                      <Badge :variant="getStatusVariant(ticket.status)">
                        {{ getStatusLabel(ticket.status) }}
                      </Badge>
                      <Badge :variant="getPriorityVariant(ticket.priority)">
                        {{ getPriorityLabel(ticket.priority) }}
                      </Badge>
                      <span class="text-xs text-gray-500">
                        {{ formatDate(ticket.created_at) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTicketsStore } from '@/stores/tickets'
import type { Ticket, ClientUser } from '@/types'

import ClientNavBar from '@/components/client/ClientNavBar.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'

const authStore = useAuthStore()
const ticketsStore = useTicketsStore()

const loading = ref(false)
const companyTickets = ref<Ticket[]>([])

// Información del cliente logueado
const clientUser = computed(() => authStore.user as ClientUser)
const clientCompany = computed(() => clientUser.value?.client_data?.company?.name || 'Tu Empresa')

// Tickets ordenados por fecha (más recientes primero)
const sortedTickets = computed(() => {
  return companyTickets.value
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

// Cargar tickets de la empresa
onMounted(async () => {
  if (clientUser.value?.client_data?.company_id) {
    loading.value = true
    try {
      companyTickets.value = await ticketsStore.fetchTicketsByCompany(clientUser.value.client_data.company_id)
    } finally {
      loading.value = false
    }
  }
})

// Funciones utilitarias
const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case 'high': return 'destructive'
    case 'medium': return 'default'
    case 'low': return 'secondary'
    default: return 'default'
  }
}

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'high': return 'Alta'
    case 'medium': return 'Media'
    case 'low': return 'Baja'
    default: return 'Media'
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'open': return 'default'
    case 'in_progress': return 'secondary'
    case 'closed': return 'outline'
    default: return 'default'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'open': return 'Abierto'
    case 'in_progress': return 'En Progreso'
    case 'closed': return 'Cerrado'
    default: return 'Abierto'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script> 