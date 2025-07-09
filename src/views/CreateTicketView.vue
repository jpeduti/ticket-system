<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNavBar />
    
    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center space-x-4">
            <Button variant="ghost" @click="$router.push('/tickets')">
              <ArrowLeft class="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Crear Nuevo Ticket</h1>
              <p class="text-gray-600">Completa la información del ticket</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <Card>
          <CardHeader>
            <CardTitle>Información del Ticket</CardTitle>
            <CardDescription>
              Llena todos los campos requeridos para crear el ticket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="createTicket" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Título -->
                <div class="md:col-span-2">
                  <Label for="title">Título *</Label>
                  <Input
                    id="title"
                    v-model="form.title"
                    required
                    placeholder="Describe brevemente el problema"
                    class="mt-1"
                  />
                </div>

                <!-- Cliente -->
                <div>
                  <Label for="client">Cliente *</Label>
                  <Select v-model="form.client_id" required>
                    <SelectTrigger class="mt-1">
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem 
                        v-for="client in clientsStore.clients" 
                        :key="client.id" 
                        :value="client.id"
                      >
                        {{ client.name }} - {{ client.email }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p class="text-sm text-gray-500 mt-1">
                    ¿No encuentras el cliente? 
                    <Button 
                      variant="link" 
                      size="sm" 
                      @click="showCreateClient = true"
                      class="p-0 h-auto"
                    >
                      Crear nuevo cliente
                    </Button>
                  </p>
                </div>

                <!-- Prioridad -->
                <div>
                  <Label for="priority">Prioridad *</Label>
                  <Select v-model="form.priority" required>
                    <SelectTrigger class="mt-1">
                      <SelectValue placeholder="Selecciona la prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Descripción -->
                <div class="md:col-span-2">
                  <Label for="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    v-model="form.description"
                    required
                    placeholder="Describe detalladamente el problema o solicitud"
                    class="mt-1 min-h-[100px]"
                  />
                </div>
              </div>

              <!-- Botones -->
              <div class="flex justify-end space-x-4">
                <Button type="button" variant="outline" @click="$router.push('/tickets')">
                  Cancelar
                </Button>
                <Button type="submit" :disabled="loading">
                  <span v-if="loading">Creando...</span>
                  <span v-else>Crear Ticket</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>

    <!-- Modal para crear cliente -->
    <Dialog v-model:open="showCreateClient">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cliente</DialogTitle>
          <DialogDescription>
            Agrega un nuevo cliente al sistema
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="createClient" class="space-y-4">
          <div class="space-y-2">
            <Label for="client-name">Nombre *</Label>
            <Input
              id="client-name"
              v-model="newClient.name"
              required
              placeholder="Nombre del cliente"
            />
          </div>
          <div class="space-y-2">
            <Label for="client-email">Email *</Label>
            <Input
              id="client-email"
              v-model="newClient.email"
              type="email"
              required
              placeholder="email@ejemplo.com"
            />
          </div>
          <div class="space-y-2">
            <Label for="client-phone">Teléfono</Label>
            <Input
              id="client-phone"
              v-model="newClient.phone"
              placeholder="Número de teléfono"
            />
          </div>
          <div class="space-y-2">
            <Label for="client-company">Empresa</Label>
            <Input
              id="client-company"
              v-model="newClient.company"
              placeholder="Nombre de la empresa"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="showCreateClient = false">
              Cancelar
            </Button>
            <Button type="submit" :disabled="clientsStore.loading">
              <span v-if="clientsStore.loading">Creando...</span>
              <span v-else>Crear Cliente</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets'
import { useClientsStore } from '@/stores/clients'
import { toast } from 'vue-sonner'
import { ArrowLeft } from 'lucide-vue-next'

import AdminNavBar from '@/components/AdminNavBar.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const router = useRouter()
const ticketsStore = useTicketsStore()
const clientsStore = useClientsStore()
const loading = ref(false)
const showCreateClient = ref(false)

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  client_id: null
})

const newClient = reactive({
  name: '',
  email: '',
  phone: '',
  company: ''
})

onMounted(() => {
  clientsStore.fetchClients()
})

const createTicket = async () => {
  loading.value = true
  
  try {
    const result = await ticketsStore.createTicket(form)
    
    if (result.success) {
      toast.success('Ticket creado exitosamente')
      router.push('/tickets')
    } else {
      toast.error(result.error || 'Error al crear el ticket')
    }
  } catch (error) {
    toast.error('Error al crear el ticket')
  } finally {
    loading.value = false
  }
}

const createClient = async () => {
  try {
    const result = await clientsStore.createClient(newClient)
    
    if (result.success) {
      toast.success('Cliente creado exitosamente')
      form.client_id = result.data.id
      showCreateClient.value = false
      
      // Limpiar formulario
      newClient.name = ''
      newClient.email = ''
      newClient.phone = ''
      newClient.company = ''
    } else {
      toast.error(result.error || 'Error al crear el cliente')
    }
  } catch (error) {
    toast.error('Error al crear el cliente')
  }
}
</script> 