import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { mockAdminUser, mockClientUsers, delay, shouldSimulateError } from '@/lib/mockData'
import type { User, AuthResponse, ClientUser, AdminUser } from '@/types'

// Detectar si estamos en modo mock (Supabase no configurado)
const isMockMode = import.meta.env.VITE_SUPABASE_URL === 'TU_SUPABASE_URL' || 
                   !import.meta.env.VITE_SUPABASE_URL ||
                   import.meta.env.VITE_SUPABASE_URL === undefined

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isClient = computed(() => user.value?.role === 'client')

  // Inicializar la sesión
  const initAuth = async (): Promise<void> => {
    loading.value = true
    try {
      if (isMockMode) {
        // Modo mock: verificar si hay usuario guardado en localStorage
        const savedUser = localStorage.getItem('mockUser')
        if (savedUser) {
          user.value = JSON.parse(savedUser)
        }
             } else if (supabase) {
         // Modo real con Supabase
         const { data: { session } } = await supabase.auth.getSession()
         if (session) {
           user.value = {
             id: session.user.id,
             email: session.user.email!,
             role: 'admin', // Por defecto admin en Supabase
             user_metadata: session.user.user_metadata
           }
         }
       }
    } catch (error) {
      console.error('Error inicializando autenticación:', error)
    } finally {
      loading.value = false
    }
  }

  // Login para administradores
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    loading.value = true
    try {
      if (isMockMode) {
        // Modo mock: simular autenticación admin
        await delay(800)
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        // Validación simple para demo
        if (email && password) {
          const mockUserWithEmail: AdminUser = { 
            ...mockAdminUser, 
            email,
            role: 'admin'
          }
          user.value = mockUserWithEmail
          localStorage.setItem('mockUser', JSON.stringify(mockUserWithEmail))
          return { success: true }
        } else {
          throw new Error('Email y contraseña son requeridos')
        }
             } else if (supabase) {
         // Modo real con Supabase
         const { data, error } = await supabase.auth.signInWithPassword({
           email,
           password,
         })
         
         if (error) throw error
         
         user.value = {
           id: data.user.id,
           email: data.user.email!,
           role: 'admin',
           user_metadata: data.user.user_metadata
         }
         return { success: true }
       } else {
         throw new Error('Supabase no está configurado')
       }
    } catch (error) {
      console.error('Error en login:', error)
      return { success: false, error: (error as Error).message }
    } finally {
      loading.value = false
    }
  }

  // Login para clientes
  const loginClient = async (email: string, password: string): Promise<AuthResponse> => {
    loading.value = true
    try {
      if (isMockMode) {
        // Modo mock: buscar cliente por email
        await delay(800)
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        const clientUser = mockClientUsers.find(client => client.email === email)
        if (clientUser && password) {
          user.value = clientUser
          localStorage.setItem('mockUser', JSON.stringify(clientUser))
          return { success: true }
        } else {
          throw new Error('Email no encontrado o credenciales incorrectas')
        }
      } else {
        // Modo real con Supabase: buscar cliente en la tabla
        // TODO: Implementar autenticación de clientes en Supabase
        // Por ahora usar la misma lógica mock
        throw new Error('Autenticación de clientes no implementada en modo Supabase')
      }
    } catch (error) {
      console.error('Error en login de cliente:', error)
      return { success: false, error: (error as Error).message }
    } finally {
      loading.value = false
    }
  }

  // Registro
  const register = async (email: string, password: string, metadata = {}): Promise<AuthResponse> => {
    loading.value = true
    try {
      if (isMockMode) {
        // Modo mock: simular registro
        await delay(1200)
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        // En modo mock, el registro siempre es exitoso
        if (email && password && email.includes('@')) {
                   return { 
           success: true, 
           data: { 
             message: 'Registro exitoso en modo demo. En producción se enviaría email de verificación.'
           }
         }
        } else {
          throw new Error('Email válido y contraseña son requeridos')
        }
             } else if (supabase) {
         // Modo real con Supabase
         const { data, error } = await supabase.auth.signUp({
           email,
           password,
           options: {
             data: metadata
           }
         })
         
         if (error) throw error
         
         return { success: true, data: { message: 'Registro exitoso' } }
       } else {
         throw new Error('Supabase no está configurado')
       }
    } catch (error) {
      console.error('Error en registro:', error)
      return { success: false, error: (error as Error).message }
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async (): Promise<AuthResponse> => {
    loading.value = true
    try {
      if (isMockMode) {
        // Modo mock: limpiar localStorage
        await delay(300)
        localStorage.removeItem('mockUser')
        user.value = null
        return { success: true }
             } else if (supabase) {
         // Modo real con Supabase
         const { error } = await supabase.auth.signOut()
         if (error) throw error
         
         user.value = null
         return { success: true }
       } else {
         throw new Error('Supabase no está configurado')
       }
    } catch (error) {
      console.error('Error en logout:', error)
      return { success: false, error: (error as Error).message }
    } finally {
      loading.value = false
    }
  }

  // Escuchar cambios de autenticación (solo en modo real)
  if (!isMockMode && supabase) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        user.value = {
          id: session.user.id,
          email: session.user.email!,
          role: 'admin', // Por defecto admin
          user_metadata: session.user.user_metadata
        }
      } else {
        user.value = null
      }
    })
  }

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isClient,
    initAuth,
    login,
    loginClient,
    register,
    logout,
    isMockMode: computed(() => isMockMode)
  }
}) 