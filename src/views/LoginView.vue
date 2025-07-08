<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sistema de Tickets
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Iniciar sesión en tu cuenta
        </p>
        
        <!-- Alerta de modo demo -->
        <div v-if="authStore.isMockMode" class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <span class="text-2xl">🚀</span>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Modo Demo Activo
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>Estás usando una versión de demostración con datos de prueba.</p>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li>Todos los datos son simulados</li>
                  <li>Los cambios se guardan localmente</li>
                  <li>Puedes usar cualquier email y contraseña</li>
                </ul>
              </div>
              <div class="mt-3">
                <Badge variant="secondary" class="text-xs">
                  No se requiere configuración de Supabase
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Card class="p-6">
        <CardHeader>
          <CardTitle class="text-center">
            {{ authStore.isMockMode ? 'Acceso Demo' : 'Iniciar Sesión' }}
          </CardTitle>
          <CardDescription v-if="authStore.isMockMode" class="text-center">
            Usa cualquier email y contraseña para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <Label for="email">Correo electrónico</Label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                required
                :placeholder="authStore.isMockMode ? 'demo@ejemplo.com' : 'tu@email.com'"
                :disabled="authStore.loading"
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
              />
            </div>
            
            <Button 
              type="submit" 
              class="w-full" 
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading">Cargando...</span>
              <span v-else>
                {{ authStore.isMockMode ? 'Acceder al Demo' : 'Iniciar Sesión' }}
              </span>
            </Button>
          </form>
          
          <!-- Botón de acceso rápido para demo -->
          <div v-if="authStore.isMockMode" class="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              class="w-full" 
              @click="quickDemoLogin"
              :disabled="authStore.loading"
            >
              🚀 Acceso Rápido al Demo
            </Button>
          </div>
        </CardContent>
        
        <CardFooter v-if="!authStore.isMockMode">
          <div class="text-center text-sm text-gray-600">
            ¿No tienes cuenta? 
            <Button 
              variant="link" 
              @click="showRegister = !showRegister"
              class="p-0 h-auto"
            >
              Regístrate aquí
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <!-- Formulario de Registro (solo en modo real) -->
      <Card v-if="showRegister && !authStore.isMockMode" class="p-6">
        <CardHeader>
          <CardTitle class="text-center">Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div class="space-y-2">
              <Label for="register-email">Correo electrónico</Label>
              <Input
                id="register-email"
                v-model="registerForm.email"
                type="email"
                required
                placeholder="tu@email.com"
                :disabled="authStore.loading"
              />
            </div>
            
            <div class="space-y-2">
              <Label for="register-password">Contraseña</Label>
              <Input
                id="register-password"
                v-model="registerForm.password"
                type="password"
                required
                placeholder="Tu contraseña"
                :disabled="authStore.loading"
              />
            </div>
            
            <div class="space-y-2">
              <Label for="register-name">Nombre completo</Label>
              <Input
                id="register-name"
                v-model="registerForm.name"
                type="text"
                required
                placeholder="Tu nombre completo"
                :disabled="authStore.loading"
              />
            </div>
            
            <Button 
              type="submit" 
              class="w-full" 
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading">Registrando...</span>
              <span v-else>Registrarse</span>
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <!-- Información adicional del demo -->
      <div v-if="authStore.isMockMode" class="text-center">
        <Card class="p-4">
          <CardContent class="space-y-3">
            <h4 class="font-medium text-gray-900">¿Qué puedes probar en el demo?</h4>
            <div class="grid grid-cols-1 gap-2 text-sm text-gray-600">
              <div class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Ver dashboard con estadísticas
              </div>
              <div class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Crear, editar y eliminar tickets
              </div>
              <div class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Gestionar clientes completos
              </div>
              <div class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Filtrar y buscar contenido
              </div>
              <div class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Interfaz responsive y moderna
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const router = useRouter()
const authStore = useAuthStore()
const showRegister = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  email: '',
  password: '',
  name: ''
})

const handleLogin = async () => {
  const result = await authStore.login(form.email, form.password)
  
  if (result.success) {
    if (authStore.isMockMode) {
      toast.success('¡Bienvenido al demo! Explora todas las funcionalidades')
    } else {
      toast.success('¡Bienvenido! Sesión iniciada correctamente')
    }
    router.push('/dashboard')
  } else {
    toast.error(result.error || 'Error al iniciar sesión')
  }
}

const quickDemoLogin = async () => {
  form.email = 'demo@sistema-tickets.com'
  form.password = 'demo123'
  await handleLogin()
}

const handleRegister = async () => {
  const result = await authStore.register(
    registerForm.email, 
    registerForm.password, 
    { name: registerForm.name }
  )
  
  if (result.success) {
    toast.success('¡Registro exitoso! Revisa tu correo para verificar tu cuenta')
    showRegister.value = false
    
    // Limpiar formulario
    registerForm.email = ''
    registerForm.password = ''
    registerForm.name = ''
  } else {
    toast.error(result.error || 'Error al registrarse')
  }
}
</script> 