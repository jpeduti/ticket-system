<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNavBar />
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p class="text-gray-600">Bienvenido al sistema de tickets</p>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="px-4 py-6 sm:px-0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <Ticket class="h-6 w-6" />
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-500">Total Tickets</div>
                  <div class="text-2xl font-bold text-gray-900">{{ stats.total || 0 }}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                    <CheckCircle class="h-6 w-6" />
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-500">Abiertos</div>
                  <div class="text-2xl font-bold text-gray-900">{{ stats.open || 0 }}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                    <Clock class="h-6 w-6" />
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-500">En Progreso</div>
                  <div class="text-2xl font-bold text-gray-900">{{ stats.in_progress || 0 }}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                    <AlertCircle class="h-6 w-6" />
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-500">Alta Prioridad</div>
                  <div class="text-2xl font-bold text-gray-900">{{ stats.high_priority || 0 }}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Recent Tickets -->
      <div class="px-4 py-6 sm:px-0">
        <Card>
          <CardHeader>
            <CardTitle>Tickets Recientes</CardTitle>
            <CardDescription>
              Los últimos tickets creados en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="ticketsStore.loading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
            
            <div v-else-if="recentTickets.length === 0" class="text-center py-8 text-gray-500">
              No hay tickets recientes
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="ticket in recentTickets" 
                :key="ticket.id"
                class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                @click="$router.push(`/tickets/${ticket.id}`)"
              >
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <Badge 
                      :variant="getPriorityVariant(ticket.priority)"
                      class="text-xs"
                    >
                      {{ getPriorityLabel(ticket.priority) }}
                    </Badge>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ ticket.title }}</div>
                    <div class="text-sm text-gray-500">
                      {{ ticket.client?.name || 'Cliente desconocido' }}
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <Badge 
                    :variant="getStatusVariant(ticket.status)"
                    class="text-xs"
                  >
                    {{ getStatusLabel(ticket.status) }}
                  </Badge>
                  <div class="text-sm text-gray-500 mt-1">
                    {{ formatDate(ticket.created_at) }}
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

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTicketsStore } from '@/stores/tickets'
import { Ticket, CheckCircle, Clock, AlertCircle } from 'lucide-vue-next'

import AdminNavBar from '@/components/AdminNavBar.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const ticketsStore = useTicketsStore()
const stats = ref({})

const recentTickets = computed(() => {
  return ticketsStore.tickets.slice(0, 5)
})

onMounted(async () => {
  await ticketsStore.fetchTickets()
  stats.value = await ticketsStore.getTicketStats()
})

const getPriorityVariant = (priority) => {
  switch (priority) {
    case 'high': return 'destructive'
    case 'medium': return 'default'
    case 'low': return 'secondary'
    default: return 'default'
  }
}

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'high': return 'Alta'
    case 'medium': return 'Media'
    case 'low': return 'Baja'
    default: return 'Media'
  }
}

const getStatusVariant = (status) => {
  switch (status) {
    case 'open': return 'default'
    case 'in_progress': return 'secondary'
    case 'closed': return 'outline'
    default: return 'default'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'open': return 'Abierto'
    case 'in_progress': return 'En Progreso'
    case 'closed': return 'Cerrado'
    default: return 'Abierto'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script> 