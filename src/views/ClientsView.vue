<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNavBar />
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Clientes</h1>
            <p class="text-gray-600">Gestiona todos los clientes del sistema</p>
          </div>
          <Button @click="showCreateClient = true">
            <Plus class="h-4 w-4 mr-2" />
            Crear Cliente
          </Button>
        </div>

        <!-- Search -->
        <Card class="mb-6">
          <CardContent class="p-6">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <Input
                  v-model="searchTerm"
                  placeholder="Buscar por nombre, email o empresa..."
                  class="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Clients Table -->
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              {{ filteredClients.length }} clientes encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="clientsStore.loading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
            
            <div v-else-if="filteredClients.length === 0" class="text-center py-8 text-gray-500">
              No se encontraron clientes
            </div>
            
            <div v-else class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow 
                    v-for="client in filteredClients" 
                    :key="client.id"
                    class="hover:bg-gray-50"
                  >
                    <TableCell class="font-medium">
                      {{ client.name }}
                    </TableCell>
                    <TableCell>
                      {{ client.email }}
                    </TableCell>
                    <TableCell>
                      {{ client.phone || 'No especificado' }}
                    </TableCell>
                    <TableCell>
                      {{ client.company || 'No especificado' }}
                    </TableCell>
                    <TableCell>
                      {{ formatDate(client.created_at) }}
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
                          <DropdownMenuItem @click="editClient(client)">
                            <Edit class="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem @click="viewClientTickets(client)">
                            <Eye class="mr-2 h-4 w-4" />
                            Ver tickets
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            @click="deleteClient(client.id)"
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

    <!-- Modal para crear/editar cliente -->
    <Dialog v-model:open="showCreateClient">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {{ editingClient ? 'Editar Cliente' : 'Crear Nuevo Cliente' }}
          </DialogTitle>
          <DialogDescription>
            {{ editingClient ? 'Actualiza la información del cliente' : 'Agrega un nuevo cliente al sistema' }}
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="saveClient" class="space-y-4">
          <div class="space-y-2">
            <Label for="client-name">Nombre *</Label>
            <Input
              id="client-name"
              v-model="clientForm.name"
              required
              placeholder="Nombre del cliente"
            />
          </div>
          <div class="space-y-2">
            <Label for="client-email">Email *</Label>
            <Input
              id="client-email"
              v-model="clientForm.email"
              type="email"
              required
              placeholder="email@ejemplo.com"
            />
          </div>
          <div class="space-y-2">
            <Label for="client-phone">Teléfono</Label>
            <Input
              id="client-phone"
              v-model="clientForm.phone"
              placeholder="Número de teléfono"
            />
          </div>
          <div class="space-y-2">
            <Label for="client-company">Empresa</Label>
            <Input
              id="client-company"
              v-model="clientForm.company"
              placeholder="Nombre de la empresa"
            />
          </div>
          <div class="space-y-2">
            <Label for="client-address">Dirección</Label>
            <Textarea
              id="client-address"
              v-model="clientForm.address"
              placeholder="Dirección del cliente"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="closeModal">
              Cancelar
            </Button>
            <Button type="submit" :disabled="clientsStore.loading">
              <span v-if="clientsStore.loading">
                {{ editingClient ? 'Actualizando...' : 'Creando...' }}
              </span>
              <span v-else>
                {{ editingClient ? 'Actualizar' : 'Crear Cliente' }}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientsStore } from '@/stores/clients'
import { useTicketsStore } from '@/stores/tickets'
import { toast } from 'vue-sonner'
import { Plus, MoreHorizontal, Edit, Eye, Trash2 } from 'lucide-vue-next'

import AdminNavBar from '@/components/AdminNavBar.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const router = useRouter()
const clientsStore = useClientsStore()
const ticketsStore = useTicketsStore()
const searchTerm = ref('')
const showCreateClient = ref(false)
const editingClient = ref(null)

const clientForm = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  address: ''
})

const filteredClients = computed(() => {
  if (!searchTerm.value) return clientsStore.clients
  
  return clientsStore.clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

onMounted(() => {
  clientsStore.fetchClients()
})

const editClient = (client) => {
  editingClient.value = client
  clientForm.name = client.name
  clientForm.email = client.email
  clientForm.phone = client.phone || ''
  clientForm.company = client.company || ''
  clientForm.address = client.address || ''
  showCreateClient.value = true
}

const saveClient = async () => {
  try {
    let result
    
    if (editingClient.value) {
      result = await clientsStore.updateClient(editingClient.value.id, clientForm)
    } else {
      result = await clientsStore.createClient(clientForm)
    }
    
    if (result.success) {
      toast.success(editingClient.value ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente')
      closeModal()
    } else {
      toast.error(result.error || 'Error al guardar el cliente')
    }
  } catch (error) {
    toast.error('Error al guardar el cliente')
  }
}

const deleteClient = async (clientId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
    const result = await clientsStore.deleteClient(clientId)
    if (result.success) {
      toast.success('Cliente eliminado correctamente')
    } else {
      toast.error(result.error || 'Error al eliminar el cliente')
    }
  }
}

const viewClientTickets = async (client) => {
  // Navegar a tickets filtrados por cliente
  router.push({
    name: 'tickets',
    query: { client: client.id }
  })
}

const closeModal = () => {
  showCreateClient.value = false
  editingClient.value = null
  clientForm.name = ''
  clientForm.email = ''
  clientForm.phone = ''
  clientForm.company = ''
  clientForm.address = ''
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script> 