<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="text-center">
          <h1 class="text-4xl font-bold text-indigo-600 mb-2">🎫</h1>
          <h2 class="text-3xl font-extrabold text-gray-900">
            Portal de Clientes
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Accede para revisar tus tickets
          </p>
        </div>
        
        <!-- Alerta de modo demo -->
        <div v-if="authStore.isMockMode" class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <span class="text-2xl">🚀</span>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Modo Demo - Portal Cliente
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>Prueba el portal de clientes con estas credenciales:</p>
                <ul class="list-disc list-inside mt-2 space-y-1 text-xs">
                  <li><strong>juan.perez@empresa-a.com</strong> / cualquier contraseña</li>
                  <li><strong>maria.garcia@techcorp.com</strong> / cualquier contraseña</li>
                  <li><strong>carlos.lopez@freelancer.com</strong> / cualquier contraseña</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Card class="p-6">
        <CardHeader>
          <CardTitle class="text-center">
            Iniciar Sesión Cliente
          </CardTitle>
          <CardDescription class="text-center">
            Ingresa con tu email registrado para ver tus tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                required
                :placeholder="authStore.isMockMode ? 'juan.perez@empresa-a.com' : 'tu@email.com'"
                :disabled="authStore.loading"
                class="text-center"
              />
            </div>
            
            <div class="space-y-2">
              <Label for="password">Contraseña</Label>
              <Input
                id="password"
                v-model="form.password"
                type="password"
                required
                :placeholder="authStore.isMockMode ? 'cualquier-contraseña' : 'Tu contraseña'"
                :disabled="authStore.loading"
                class="text-center"
              />
            </div>
            
            <Button 
              type="submit" 
              class="w-full" 
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading">Iniciando sesión...</span>
              <span v-else>Acceder a mis Tickets</span>
            </Button>
          </form>
          
          <!-- Botones de acceso rápido para demo -->
          <div v-if="authStore.isMockMode" class="mt-4 pt-4 border-t space-y-2">
            <p class="text-xs text-gray-500 text-center mb-3">Acceso rápido al demo:</p>
            <div class="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                @click="quickLogin('juan.perez@empresa-a.com')"
                :disabled="authStore.loading"
                class="text-xs"
              >
                👤 Juan Pérez (Empresa A)
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                @click="quickLogin('maria.garcia@techcorp.com')"
                :disabled="authStore.loading"
                class="text-xs"
              >
                👤 María García (TechCorp)
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                @click="quickLogin('carlos.lopez@freelancer.com')"
                :disabled="authStore.loading"
                class="text-xs"
              >
                👤 Carlos López (Freelancer)
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter class="flex flex-col space-y-2">
          <div class="text-center text-xs text-gray-500">
            ¿Eres administrador? 
            <RouterLink 
              to="/admin/login"
              class="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Acceder al Panel Admin
            </RouterLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  const result = await authStore.loginClient(form.email, form.password)
  
  if (result.success) {
    toast.success('¡Bienvenido! Acceso al portal de clientes exitoso')
    router.push('/client/dashboard')
  } else {
    toast.error(result.error || 'Email no encontrado o credenciales incorrectas')
  }
}

const quickLogin = async (email: string) => {
  form.email = email
  form.password = 'demo123'
  await handleLogin()
}
</script> 