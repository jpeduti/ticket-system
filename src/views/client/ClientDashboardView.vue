<template>
  <div class="min-h-screen bg-gray-50">
    <ClientNavBar />
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header de bienvenida -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {{ clientName }}!
          </h1>
          <p class="text-gray-600">
            {{ clientCompany ? `${clientCompany} - ` : '' }}{{ clientEmail }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            Aquí puedes revisar el estado de todos los tickets de soporte de tu empresa
          </p>
        </div>

        <!-- Estadísticas de tickets de la empresa -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                    📋
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Total Tickets
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats?.total || 0 }}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-8 w-8 rounded-md bg-yellow-500 text-white">
                    🔄
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      En Progreso
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats?.in_progress || 0 }}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-8 w-8 rounded-md bg-green-500 text-white">
                    ✅
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Resueltos
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats?.closed || 0 }}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-8 w-8 rounded-md bg-red-500 text-white">
                    🔴
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Alta Prioridad
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats?.high_priority || 0 }}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Métricas por Categoría -->
        <div class="mb-8">
          <CategoryMetrics 
            :category-stats="categoryStats"
            @refresh="refreshCategoryStats"
          />
        </div>

        <!-- Tickets recientes de la empresa -->
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>Tickets Recientes de {{ clientCompany }}</CardTitle>
                <CardDescription>
                  Los últimos tickets de tu empresa
                </CardDescription>
              </div>
              <Button @click="$router.push('/client/tickets')">
                Ver Todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div v-if="ticketsStore.loading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
            
            <div v-else-if="recentTickets.length === 0" class="text-center py-8 text-gray-500">
              <div class="text-4xl mb-4">🎫</div>
              <p>No hay tickets registrados para tu empresa</p>
              <p class="text-sm mt-2">Los tickets de tu empresa aparecerán aquí</p>
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="ticket in recentTickets" 
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
                        Prioridad {{ getPriorityLabel(ticket.priority) }}
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
import type { Ticket, TicketStats, ClientUser } from '@/types'

import ClientNavBar from '@/components/client/ClientNavBar.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Ticket as TicketIcon, Users, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-vue-next'
import CategoryMetrics from '@/components/CategoryMetrics.vue'

const authStore = useAuthStore()
const ticketsStore = useTicketsStore()

const stats = ref<TicketStats | null>(null)
const companyTickets = ref<Ticket[]>([])
const categoryStats = ref<Record<string, number> | null>(null)

// Información del cliente logueado
const clientUser = computed(() => authStore.user as ClientUser)
const clientName = computed(() => clientUser.value?.client_data?.name || clientUser.value?.user_metadata?.name || 'Cliente')
const clientEmail = computed(() => clientUser.value?.email || '')
const clientCompany = computed(() => clientUser.value?.client_data?.company?.name || '')

// Tickets recientes (últimos 5)
const recentTickets = computed(() => {
  return companyTickets.value
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
})

const loadCategoryStats = async () => {
  if (clientUser.value?.client_data?.company_id) {
    try {
      categoryStats.value = await ticketsStore.getTicketStatsByCategoryForCompany(clientUser.value.client_data.company_id)
    } catch (error) {
      console.error('Error cargando estadísticas por categoría:', error)
    }
  }
}

const refreshCategoryStats = async () => {
  await loadCategoryStats()
}

// Cargar datos de la empresa
onMounted(async () => {
  if (clientUser.value?.client_data?.company_id) {
    // Cargar tickets de la empresa
    companyTickets.value = await ticketsStore.fetchTicketsByCompany(clientUser.value.client_data.company_id)
    
    // Obtener estadísticas de la empresa
    stats.value = await ticketsStore.getTicketStatsByCompany(clientUser.value.client_data.company_id)
    
    // Cargar estadísticas por categoría
    await loadCategoryStats()
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