import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { mockClients, delay, shouldSimulateError, generateId } from '@/lib/mockData'

// Detectar si estamos en modo mock
const isMockMode = import.meta.env.VITE_SUPABASE_URL === 'TU_SUPABASE_URL' || 
                   !import.meta.env.VITE_SUPABASE_URL ||
                   import.meta.env.VITE_SUPABASE_URL === undefined

export const useClientsStore = defineStore('clients', () => {
  const clients = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Datos locales para modo mock
  let localClients = [...mockClients]

  // Función para obtener datos locales desde localStorage
  const getLocalClients = () => {
    const saved = localStorage.getItem('mockClients')
    if (saved) {
      localClients = JSON.parse(saved)
    }
    return localClients
  }

  // Función para guardar datos locales en localStorage
  const saveLocalClients = (clientsData) => {
    localClients = clientsData
    localStorage.setItem('mockClients', JSON.stringify(clientsData))
  }

  // Obtener todos los clientes
  const fetchClients = async () => {
    loading.value = true
    error.value = null
    try {
      if (isMockMode) {
        // Modo mock
        await delay(500) // Simular latencia
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        const clientsData = getLocalClients()
        clients.value = clientsData
      } else {
        // Modo real con Supabase
        const { data, error: fetchError } = await supabase
          .from('clients')
          .select('*')
          .order('name', { ascending: true })

        if (fetchError) throw fetchError
        
        clients.value = data || []
      }
    } catch (err) {
      error.value = err.message
      console.error('Error obteniendo clientes:', err)
    } finally {
      loading.value = false
    }
  }

  // Crear nuevo cliente
  const createClient = async (clientData) => {
    loading.value = true
    error.value = null
    try {
      if (isMockMode) {
        // Modo mock
        await delay(700)
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        // Verificar si el email ya existe
        const currentClients = getLocalClients()
        if (currentClients.some(c => c.email === clientData.email)) {
          throw new Error('Ya existe un cliente con este email')
        }

        const now = new Date().toISOString()
        const newClient = {
          id: generateId(),
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone || null,
          company: clientData.company || null,
          address: clientData.address || null,
          created_at: now,
          updated_at: now
        }

        const updatedClients = [...currentClients, newClient]
        saveLocalClients(updatedClients)
        
        await fetchClients() // Refrescar la lista
        return { success: true, data: newClient }
      } else {
        // Modo real con Supabase
        const { data, error: createError } = await supabase
          .from('clients')
          .insert([{
            name: clientData.name,
            email: clientData.email,
            phone: clientData.phone || null,
            company: clientData.company || null,
            address: clientData.address || null,
          }])
          .select()

        if (createError) throw createError

        await fetchClients() // Refrescar la lista
        return { success: true, data: data[0] }
      }
    } catch (err) {
      error.value = err.message
      console.error('Error creando cliente:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Actualizar cliente
  const updateClient = async (clientId, updates) => {
    loading.value = true
    error.value = null
    try {
      if (isMockMode) {
        // Modo mock
        await delay(600)
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        const currentClients = getLocalClients()
        const clientIndex = currentClients.findIndex(c => c.id === clientId)
        
        if (clientIndex === -1) {
          throw new Error('Cliente no encontrado')
        }

        // Verificar email único si se está actualizando
        if (updates.email && updates.email !== currentClients[clientIndex].email) {
          if (currentClients.some(c => c.id !== clientId && c.email === updates.email)) {
            throw new Error('Ya existe un cliente con este email')
          }
        }

        const updatedClient = {
          ...currentClients[clientIndex],
          ...updates,
          updated_at: new Date().toISOString()
        }

        currentClients[clientIndex] = updatedClient
        saveLocalClients(currentClients)
        
        await fetchClients() // Refrescar la lista
        return { success: true, data: updatedClient }
      } else {
        // Modo real con Supabase
        const { data, error: updateError } = await supabase
          .from('clients')
          .update(updates)
          .eq('id', clientId)
          .select()

        if (updateError) throw updateError

        await fetchClients() // Refrescar la lista
        return { success: true, data: data[0] }
      }
    } catch (err) {
      error.value = err.message
      console.error('Error actualizando cliente:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Eliminar cliente
  const deleteClient = async (clientId) => {
    loading.value = true
    error.value = null
    try {
      if (isMockMode) {
        // Modo mock
        await delay(500)
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        // Verificar si el cliente tiene tickets activos
        const savedTickets = localStorage.getItem('mockTickets')
        if (savedTickets) {
          const tickets = JSON.parse(savedTickets)
          const activeTickets = tickets.filter(t => 
            t.client_id === clientId && 
            (t.status === 'open' || t.status === 'in_progress')
          )
          
          if (activeTickets.length > 0) {
            throw new Error('No se puede eliminar un cliente con tickets activos')
          }
        }

        const currentClients = getLocalClients()
        const filteredClients = currentClients.filter(c => c.id !== clientId)
        
        if (filteredClients.length === currentClients.length) {
          throw new Error('Cliente no encontrado')
        }

        saveLocalClients(filteredClients)
        await fetchClients() // Refrescar la lista
        return { success: true }
      } else {
        // Modo real con Supabase
        // Verificar si el cliente tiene tickets activos
        const { data: tickets } = await supabase
          .from('tickets')
          .select('id')
          .eq('client_id', clientId)
          .in('status', ['open', 'in_progress'])

        if (tickets && tickets.length > 0) {
          throw new Error('No se puede eliminar un cliente con tickets activos')
        }

        const { error: deleteError } = await supabase
          .from('clients')
          .delete()
          .eq('id', clientId)

        if (deleteError) throw deleteError

        await fetchClients() // Refrescar la lista
        return { success: true }
      }
    } catch (err) {
      error.value = err.message
      console.error('Error eliminando cliente:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Buscar cliente por email
  const findClientByEmail = async (email) => {
    try {
      if (isMockMode) {
        // Modo mock
        const clientsData = getLocalClients()
        return clientsData.find(c => c.email === email) || null
      } else {
        // Modo real con Supabase
        const { data, error: searchError } = await supabase
          .from('clients')
          .select('*')
          .eq('email', email)
          .single()

        if (searchError && searchError.code !== 'PGRST116') throw searchError
        
        return data
      }
    } catch (err) {
      console.error('Error buscando cliente:', err)
      return null
    }
  }

  // Inicializar datos mock si es necesario
  if (isMockMode && !localStorage.getItem('mockClients')) {
    saveLocalClients(mockClients)
  }

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    findClientByEmail,
    isMockMode
  }
}) 