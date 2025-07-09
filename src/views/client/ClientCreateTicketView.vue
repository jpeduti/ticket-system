<template>
  <div class="min-h-screen bg-gray-50">
    <ClientNavBar />
    
    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center space-x-4">
            <Button variant="ghost" @click="$router.push('/client/tickets')">
              <ArrowLeft class="h-4 w-4 mr-2" />
              Volver a Mis Tickets
            </Button>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Crear Nuevo Ticket</h1>
              <p class="text-gray-600">Describe tu problema o solicitud</p>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <Card>
          <CardHeader>
            <CardTitle>Información del Ticket</CardTitle>
            <CardDescription>
              Completa los siguientes campos para crear tu ticket de soporte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Información del solicitante (solo lectura) -->
              <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 class="text-sm font-medium text-blue-800 mb-2">Solicitante</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-blue-700">Nombre:</span> {{ clientName }}
                  </div>
                  <div>
                    <span class="font-medium text-blue-700">Email:</span> {{ clientEmail }}
                  </div>
                  <div class="md:col-span-2">
                    <span class="font-medium text-blue-700">Empresa:</span> {{ clientCompany }}
                  </div>
                </div>
              </div>

              <!-- Título del ticket -->
              <div class="space-y-2">
                <Label for="title">Título del Ticket *</Label>
                <Input
                  id="title"
                  v-model="form.title"
                  placeholder="Describe brevemente tu problema o solicitud"
                  required
                  :disabled="loading"
                />
              </div>

              <!-- Categoría del ticket -->
              <div class="space-y-2">
                <Label for="category">Categoría del Ticket *</Label>
                <Select v-model="form.category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la categoría del problema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="login_problem">
                      <div class="flex items-center space-x-2">
                        <span>🔐</span>
                        <span>Problemas de ingreso de cuenta</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="new_user">
                      <div class="flex items-center space-x-2">
                        <span>👤</span>
                        <span>Creación nuevo usuario</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="user_modification">
                      <div class="flex items-center space-x-2">
                        <span>✏️</span>
                        <span>Modificación usuario existente</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="usability_problem">
                      <div class="flex items-center space-x-2">
                        <span>🖥️</span>
                        <span>Problema de usabilidad de aplicación</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="technical_issue">
                      <div class="flex items-center space-x-2">
                        <span>⚙️</span>
                        <span>Problema técnico general</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="feature_request">
                      <div class="flex items-center space-x-2">
                        <span>💡</span>
                        <span>Solicitud de nueva funcionalidad</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div class="flex items-center space-x-2">
                        <span>📋</span>
                        <span>Otro</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Usuario que reporta el problema -->
              <div class="space-y-2">
                <Label for="affected_user">Usuario con el Problema</Label>
                <Input
                  id="affected_user"
                  v-model="form.affected_user"
                  placeholder="Ingresa el usuario/email que tiene el problema (puede ser diferente al tuyo)"
                  :disabled="loading"
                />
                <p class="text-sm text-gray-500">
                  Si reportas un problema de otra persona, indica aquí su usuario o email
                </p>
              </div>

              <!-- Información técnica -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Sistema Operativo -->
                <div class="space-y-2">
                  <Label for="operating_system">Sistema Operativo</Label>
                  <Select v-model="form.operating_system">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu SO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="windows_11">
                        <div class="flex items-center space-x-2">
                          <span>🪟</span>
                          <span>Windows 11</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="windows_10">
                        <div class="flex items-center space-x-2">
                          <span>🪟</span>
                          <span>Windows 10</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="windows_8">
                        <div class="flex items-center space-x-2">
                          <span>🪟</span>
                          <span>Windows 8/8.1</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="macos">
                        <div class="flex items-center space-x-2">
                          <span>🍎</span>
                          <span>macOS</span>
                        </div>
                      
                      </SelectItem>
                      <SelectItem value="ubuntu">
                        <div class="flex items-center space-x-2">
                          <span>🐧</span>
                          <span> Linux</span>
                        </div>
                      </SelectItem>
                      
                    </SelectContent>
                  </Select>
                </div>

                <!-- Navegador -->
                <div class="space-y-2">
                  <Label for="browser">Navegador</Label>
                  <Select v-model="form.browser">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu navegador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chrome">
                        <div class="flex items-center space-x-2">
                          <span>🔵</span>
                          <span>Google Chrome</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="firefox">
                        <div class="flex items-center space-x-2">
                          <span>🦊</span>
                          <span>Mozilla Firefox</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="safari">
                        <div class="flex items-center space-x-2">
                          <span>🧭</span>
                          <span>Safari</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="edge">
                        <div class="flex items-center space-x-2">
                          <span>🌐</span>
                          <span>Microsoft Edge</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="opera">
                        <div class="flex items-center space-x-2">
                          <span>🎭</span>
                          <span>Opera</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="brave">
                        <div class="flex items-center space-x-2">
                          <span>🦁</span>
                          <span>Brave</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="vivaldi">
                        <div class="flex items-center space-x-2">
                          <span>🎨</span>
                          <span>Vivaldi</span>
                        </div>
                      </SelectItem>
                      
                    
                      <SelectItem value="other_browser">
                        <div class="flex items-center space-x-2">
                          <span>🌍</span>
                          <span>Otro navegador</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <!-- Prioridad -->
              <div class="space-y-2">
                <Label for="priority">Prioridad *</Label>
                <Select v-model="form.priority" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Baja - No urgente</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Media - Normal</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Alta - Urgente</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Descripción -->
              <div class="space-y-2">
                <Label for="description">Descripción Detallada *</Label>
                <Textarea
                  id="description"
                  v-model="form.description"
                  placeholder="Describe detalladamente tu problema, error o solicitud. Incluye cualquier información que pueda ayudar a resolver tu caso..."
                  rows="6"
                  required
                  :disabled="loading"
                />
                <p class="text-sm text-gray-500">
                  Incluye detalles como: pasos para reproducir el problema, mensajes de error, 
                  qué esperabas que ocurriera, etc.
                </p>
              </div>

              <!-- Botones -->
              <div class="flex items-center justify-end space-x-4 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  @click="$router.push('/client/tickets')"
                  :disabled="loading"
                >
                  Cancelar
                </Button>
                <Button type="submit" :disabled="!isFormValid || loading">
                  <Plus class="h-4 w-4 mr-2" v-if="!loading" />
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" v-if="loading"></div>
                  {{ loading ? 'Creando...' : 'Crear Ticket' }}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <!-- Información adicional -->
        <Card class="mt-6">
          <CardContent class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-3">💡 Consejos para crear un buen ticket</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-start space-x-2">
                <span class="text-blue-500">•</span>
                <span><strong>Título claro:</strong> Resume el problema en pocas palabras</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="text-blue-500">•</span>
                <span><strong>Categoría correcta:</strong> Selecciona la categoría que mejor describe tu problema</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="text-blue-500">•</span>
                <span><strong>Usuario afectado:</strong> Si reportas por otra persona, especifica su usuario</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="text-blue-500">•</span>
                <span><strong>Información técnica:</strong> El SO y navegador ayudan a diagnosticar problemas</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="text-blue-500">•</span>
                <span><strong>Descripción detallada:</strong> Explica paso a paso lo que ocurre</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="text-blue-500">•</span>
                <span><strong>Prioridad adecuada:</strong> Selecciona según la urgencia real</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="text-blue-500">•</span>
                <span><strong>Información del error:</strong> Incluye mensajes o códigos de error si los hay</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTicketsStore } from '@/stores/tickets'
import { toast } from 'vue-sonner'
import { ArrowLeft, Plus } from 'lucide-vue-next'
import type { ClientUser, CreateTicketData } from '@/types'

import ClientNavBar from '@/components/client/ClientNavBar.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const router = useRouter()
const authStore = useAuthStore()
const ticketsStore = useTicketsStore()

const loading = ref(false)

// Información del cliente logueado
const clientUser = computed(() => authStore.user as ClientUser)
const clientName = computed(() => clientUser.value?.client_data?.name || 'Cliente')
const clientEmail = computed(() => clientUser.value?.email || '')
const clientCompany = computed(() => clientUser.value?.client_data?.company?.name || '')

// Formulario
const form = ref({
  title: '',
  description: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  category: '',
  affected_user: '',
  operating_system: '',
  browser: ''
})

// Validación del formulario
const isFormValid = computed(() => {
  return form.value.title.trim() !== '' && 
         form.value.description.trim() !== '' && 
         form.value.category !== ''
})

// Manejar envío del formulario
const handleSubmit = async () => {
  if (!isFormValid.value || !clientUser.value?.client_id) {
    return
  }

  loading.value = true

  try {
    const ticketData: CreateTicketData = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      priority: form.value.priority,
      client_id: clientUser.value.client_id
    }

    // Añadir campos opcionales solo si tienen valores
    if (form.value.category.trim()) {
      ticketData.category = form.value.category.trim()
    }
    if (form.value.affected_user.trim()) {
      ticketData.affected_user = form.value.affected_user.trim()
    }
    if (form.value.operating_system.trim()) {
      ticketData.operating_system = form.value.operating_system.trim()
    }
    if (form.value.browser.trim()) {
      ticketData.browser = form.value.browser.trim()
    }

    const result = await ticketsStore.createTicket(ticketData)

    if (result.success) {
      toast.success('¡Ticket creado exitosamente!')
      router.push('/client/tickets')
    } else {
      toast.error(result.error || 'Error al crear el ticket')
    }
  } catch (error) {
    console.error('Error creating ticket:', error)
    toast.error('Error inesperado al crear el ticket')
  } finally {
    loading.value = false
  }
}
</script> 