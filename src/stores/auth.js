import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { mockUser, delay, shouldSimulateError } from '@/lib/mockData'

// Detectar si estamos en modo mock (Supabase no configurado)
const isMockMode = import.meta.env.VITE_SUPABASE_URL === 'TU_SUPABASE_URL' || 
                   !import.meta.env.VITE_SUPABASE_URL ||
                   import.meta.env.VITE_SUPABASE_URL === undefined

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  // Inicializar la sesión
  const initAuth = async () => {
    loading.value = true
    try {
      if (isMockMode) {
        // Modo mock: verificar si hay usuario guardado en localStorage
        const savedUser = localStorage.getItem('mockUser')
        if (savedUser) {
          user.value = JSON.parse(savedUser)
        }
      } else {
        // Modo real con Supabase
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          user.value = session.user
        }
      }
    } catch (error) {
      console.error('Error inicializando autenticación:', error)
    } finally {
      loading.value = false
    }
  }

  // Login
  const login = async (email, password) => {
    loading.value = true
    try {
      if (isMockMode) {
        // Modo mock: simular autenticación
        await delay(800) // Simular latencia de red
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        // Validación simple para demo
        if (email && password) {
          const mockUserWithEmail = { ...mockUser, email }
          user.value = mockUserWithEmail
          localStorage.setItem('mockUser', JSON.stringify(mockUserWithEmail))
          return { success: true }
        } else {
          throw new Error('Email y contraseña son requeridos')
        }
      } else {
        // Modo real con Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        user.value = data.user
        return { success: true }
      }
    } catch (error) {
      console.error('Error en login:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // Registro
  const register = async (email, password, metadata = {}) => {
    loading.value = true
    try {
      if (isMockMode) {
        // Modo mock: simular registro
        await delay(1200) // Simular latencia de red
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        // En modo mock, el registro siempre es exitoso
        if (email && password && email.includes('@')) {
          return { 
            success: true, 
            data: { 
              user: { ...mockUser, email, ...metadata },
              message: 'Registro exitoso en modo demo. En producción se enviaría email de verificación.'
            }
          }
        } else {
          throw new Error('Email válido y contraseña son requeridos')
        }
      } else {
        // Modo real con Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata
          }
        })
        
        if (error) throw error
        
        return { success: true, data }
      }
    } catch (error) {
      console.error('Error en registro:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    loading.value = true
    try {
      if (isMockMode) {
        // Modo mock: limpiar localStorage
        await delay(300)
        localStorage.removeItem('mockUser')
        user.value = null
        return { success: true }
      } else {
        // Modo real con Supabase
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        
        user.value = null
        return { success: true }
      }
    } catch (error) {
      console.error('Error en logout:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // Escuchar cambios de autenticación (solo en modo real)
  if (!isMockMode) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        user.value = session.user
      } else {
        user.value = null
      }
    })
  }

  return {
    user,
    loading,
    isAuthenticated,
    initAuth,
    login,
    register,
    logout,
    isMockMode: computed(() => isMockMode)
  }
}) 