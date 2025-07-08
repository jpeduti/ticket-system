import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Obtener las variables de entorno
const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY

// Detectar si estamos en modo demo
const isMockMode: boolean = !supabaseUrl || 
                   supabaseUrl === 'TU_SUPABASE_URL' || 
                   !supabaseAnonKey || 
                   supabaseAnonKey === 'TU_SUPABASE_ANON_KEY'

if (isMockMode) {
  console.log('🚀 Modo Demo Activo - Usando datos de prueba locales')
  console.log('📋 Para usar Supabase real, configura las variables de entorno:')
  console.log('   VITE_SUPABASE_URL=tu-url-de-supabase')
  console.log('   VITE_SUPABASE_ANON_KEY=tu-clave-anonima')
} else {
  console.log('🔗 Conectando a Supabase...')
}

// Crear cliente solo si no estamos en modo demo
export const supabase: SupabaseClient | null = isMockMode 
  ? null 
  : createClient(supabaseUrl!, supabaseAnonKey!)

// Exportar el estado del modo
export const isDemo: boolean = isMockMode 