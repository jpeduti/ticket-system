<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNavBar />
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Tickets</h1>
            <p class="text-gray-600">Gestiona todos los tickets del sistema</p>
          </div>
          <Button @click="$router.push('/tickets/create')">
            <Plus class="h-4 w-4 mr-2" />
            Crear Ticket
          </Button>
        </div>

        <!-- Filters -->
        <Card class="mb-6">
          <CardContent class="p-6">
            <div class="flex flex-wrap gap-4 items-center">
              <div class="flex-1 min-w-[200px]">
                <Input
                  v-model="searchTerm"
                  placeholder="Buscar por título o cliente..."
                  class="w-full"
                />
              </div>
              
              <Select v-model="statusFilter">
                <SelectTrigger class="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="open">Abiertos</SelectItem>
                  <SelectItem value="in_progress">En Progreso</SelectItem>
                  <SelectItem value="closed">Cerrados</SelectItem>
                </SelectContent>
              </Select>

              <Select v-model="priorityFilter">
                <SelectTrigger class="w-[180px]">
                  <SelectValue placeholder="Filtrar por prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <!-- Tickets Table -->
        <Card>
          <CardHeader>
            <CardTitle>Lista de Tickets</CardTitle>
            <CardDescription>
              {{ filteredTickets.length }} tickets encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="ticketsStore.loading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
            
            <div v-else-if="filteredTickets.length === 0" class="text-center py-8 text-gray-500">
              No se encontraron tickets
            </div>
            
            <div v-else class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow 
                    v-for="ticket in filteredTickets" 
                    :key="ticket.id"
                    class="hover:bg-gray-50 cursor-pointer"
                    @click="$router.push(`/tickets/${ticket.id}`)"
                  >
                    <TableCell class="font-medium">
                      #{{ ticket.id }}
                    </TableCell>
                    <TableCell>
                      <div class="max-w-[200px] truncate">
                        {{ ticket.title }}
                      </div>
                    </TableCell>
                    <TableCell>
                      {{ ticket.client?.name || 'Cliente desconocido' }}
                    </TableCell>
                    <TableCell>
                      <Badge :variant="getStatusVariant(ticket.status)">
                        {{ getStatusLabel(ticket.status) }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge :variant="getPriorityVariant(ticket.priority)">
                        {{ getPriorityLabel(ticket.priority) }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {{ formatDate(ticket.created_at) }}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" class="h-8 w-8 p-0">
                            <span class="sr-only">Abrir menú</span>
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem @click="$router.push(`/tickets/${ticket.id}`)">
                            <Eye class="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem @click="editTicket(ticket)">
                            <Edit class="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            @click="deleteTicket(ticket.id)"
                            class="text-red-600"
                          >
                            <Trash2 class="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTicketsStore } from '@/stores/tickets'
import { toast } from 'vue-sonner'
import { Plus, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-vue-next'

import AdminNavBar from '@/components/AdminNavBar.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const ticketsStore = useTicketsStore()
const searchTerm = ref('')
const statusFilter = ref('all')
const priorityFilter = ref('all')

const filteredTickets = computed(() => {
  let filtered = ticketsStore.tickets

  // Filtrar por búsqueda
  if (searchTerm.value) {
    filtered = filtered.filter(ticket => 
      ticket.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      ticket.client?.name?.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  // Filtrar por estado
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(ticket => ticket.status === statusFilter.value)
  }

  // Filtrar por prioridad
  if (priorityFilter.value !== 'all') {
    filtered = filtered.filter(ticket => ticket.priority === priorityFilter.value)
  }

  return filtered
})

onMounted(() => {
  ticketsStore.fetchTickets()
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

const editTicket = (ticket) => {
  // Aquí podrías abrir un modal o navegar a una página de edición
  console.log('Editar ticket:', ticket)
}

const deleteTicket = async (ticketId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
    const result = await ticketsStore.deleteTicket(ticketId)
    if (result.success) {
      toast.success('Ticket eliminado correctamente')
    } else {
      toast.error(result.error || 'Error al eliminar el ticket')
    }
  }
}
</script> 