import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { mockTickets, mockClients, delay, shouldSimulateError, generateId } from '@/lib/mockData'

// Detectar si estamos en modo mock
const isMockMode = import.meta.env.VITE_SUPABASE_URL === 'TU_SUPABASE_URL' || 
                   !import.meta.env.VITE_SUPABASE_URL ||
                   import.meta.env.VITE_SUPABASE_URL === undefined

export const useTicketsStore = defineStore('tickets', () => {
  const tickets = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Datos locales para modo mock
  let localTickets = [...mockTickets]

  // Función para obtener datos locales desde localStorage
  const getLocalTickets = () => {
    const saved = localStorage.getItem('mockTickets')
    if (saved) {
      try {
        localTickets = JSON.parse(saved)
      } catch (err) {
        console.warn('Error parsing saved tickets, using default mock data:', err)
        localTickets = [...mockTickets]
        saveLocalTickets(localTickets)
      }
    } else {
      // Si no hay datos guardados, usar los datos mock por defecto
      localTickets = [...mockTickets]
      saveLocalTickets(localTickets)
    }
    return localTickets
  }

  // Función para guardar datos locales en localStorage
  const saveLocalTickets = (ticketsData) => {
    localTickets = ticketsData
    localStorage.setItem('mockTickets', JSON.stringify(ticketsData))
  }

  // Obtener todos los tickets
  const fetchTickets = async () => {
    loading.value = true
    error.value = null
    try {
      if (isMockMode) {
        // Modo mock
        await delay(600) // Simular latencia
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        const ticketsData = getLocalTickets()
        // Asegurar que cada ticket tenga su cliente asociado
        const ticketsWithClients = ticketsData.map(ticket => ({
          ...ticket,
          client: mockClients.find(c => c.id === ticket.client_id)
        }))
        
        tickets.value = ticketsWithClients
      } else {
        // Modo real con Supabase
        const { data, error: fetchError } = await supabase
          .from('tickets')
          .select(`
            *,
            client:client_id(name, email),
            assigned_user:assigned_to(email)
          `)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        
        tickets.value = data || []
      }
    } catch (err) {
      error.value = err.message
      console.error('Error obteniendo tickets:', err)
    } finally {
      loading.value = false
    }
  }

  // Obtener tickets por cliente
  const fetchTicketsByClient = async (clientId) => {
    loading.value = true
    error.value = null
    try {
      if (isMockMode) {
        // Modo mock
        await delay(400)
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        const ticketsData = getLocalTickets()
        const clientTickets = ticketsData
          .filter(ticket => ticket.client_id === clientId)
          .map(ticket => ({
            ...ticket,
            client: mockClients.find(c => c.id === ticket.client_id)
          }))
        
        return clientTickets
      } else {
        // Modo real con Supabase
        const { data, error: fetchError } = await supabase
          .from('tickets')
          .select(`
            *,
            client:client_id(name, email),
            assigned_user:assigned_to(email)
          `)
          .eq('client_id', clientId)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        
        return data || []
      }
    } catch (err) {
      error.value = err.message
      console.error('Error obteniendo tickets por cliente:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Obtener tickets por empresa (todos los tickets de clientes de una empresa)
  const fetchTicketsByCompany = async (companyId) => {
    loading.value = true
    error.value = null
    try {
      if (isMockMode) {
        // Modo mock
        await delay(200)
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        const ticketsData = getLocalTickets()
        
        // Obtener todos los clientes de la empresa
        const companyClients = mockClients.filter(client => client.company_id === companyId)
        const companyClientIds = companyClients.map(client => client.id)
        
        // Filtrar tickets que pertenecen a clientes de esta empresa
        const companyTickets = ticketsData
          .filter(ticket => companyClientIds.includes(ticket.client_id))
          .map(ticket => ({
            ...ticket,
            client: mockClients.find(c => c.id === ticket.client_id)
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        
        return companyTickets
      } else {
        // Modo real con Supabase
        // Primero obtener todos los clientes de la empresa
        const { data: companyClients, error: clientsError } = await supabase
          .from('clients')
          .select('id')
          .eq('company_id', companyId)

        if (clientsError) throw clientsError

        const clientIds = companyClients.map(client => client.id)
        
        if (clientIds.length === 0) {
          return [] // No hay clientes en esta empresa
        }

        // Obtener tickets de todos los clientes de la empresa
        const { data, error: fetchError } = await supabase
          .from('tickets')
          .select(`
            *,
            client:client_id(name, email, company_id),
            assigned_user:assigned_to(email)
          `)
          .in('client_id', clientIds)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        
        return data || []
      }
    } catch (err) {
      error.value = err.message
      console.error('Error obteniendo tickets por empresa:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Crear nuevo ticket
  const createTicket = async (ticketData) => {
    loading.value = true
    error.value = null
    try {
      if (isMockMode) {
        // Modo mock
        await delay(800)
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        const now = new Date().toISOString()
        const newTicket = {
          id: generateId(),
          title: ticketData.title,
          description: ticketData.description,
          priority: ticketData.priority || 'medium',
          status: 'open',
          client_id: ticketData.client_id,
          assigned_to: ticketData.assigned_to || null,
          created_at: now,
          updated_at: now,
          client: mockClients.find(c => c.id === ticketData.client_id)
        }

        const currentTickets = getLocalTickets()
        const updatedTickets = [newTicket, ...currentTickets]
        saveLocalTickets(updatedTickets)
        
        await fetchTickets() // Refrescar la lista
        return { success: true, data: newTicket }
      } else {
        // Modo real con Supabase
        const { data, error: createError } = await supabase
          .from('tickets')
          .insert([{
            title: ticketData.title,
            description: ticketData.description,
            priority: ticketData.priority || 'medium',
            status: 'open',
            client_id: ticketData.client_id,
            assigned_to: ticketData.assigned_to || null,
          }])
          .select()

        if (createError) throw createError

        await fetchTickets() // Refrescar la lista
        return { success: true, data: data[0] }
      }
    } catch (err) {
      error.value = err.message
      console.error('Error creando ticket:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Actualizar ticket
  const updateTicket = async (ticketId, updates) => {
    loading.value = true
    error.value = null
    try {
      if (isMockMode) {
        // Modo mock
        await delay(600)
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        const currentTickets = getLocalTickets()
        const ticketIndex = currentTickets.findIndex(t => t.id === ticketId)
        
        if (ticketIndex === -1) {
          throw new Error('Ticket no encontrado')
        }

        const updatedTicket = {
          ...currentTickets[ticketIndex],
          ...updates,
          updated_at: new Date().toISOString()
        }

        currentTickets[ticketIndex] = updatedTicket
        saveLocalTickets(currentTickets)
        
        await fetchTickets() // Refrescar la lista
        return { success: true, data: updatedTicket }
      } else {
        // Modo real con Supabase
        const { data, error: updateError } = await supabase
          .from('tickets')
          .update(updates)
          .eq('id', ticketId)
          .select()

        if (updateError) throw updateError

        await fetchTickets() // Refrescar la lista
        return { success: true, data: data[0] }
      }
    } catch (err) {
      error.value = err.message
      console.error('Error actualizando ticket:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Eliminar ticket
  const deleteTicket = async (ticketId) => {
    loading.value = true
    error.value = null
    try {
      if (isMockMode) {
        // Modo mock
        await delay(500)
        
        if (shouldSimulateError()) {
          throw new Error('Error de conexión simulado')
        }

        const currentTickets = getLocalTickets()
        const filteredTickets = currentTickets.filter(t => t.id !== ticketId)
        
        if (filteredTickets.length === currentTickets.length) {
          throw new Error('Ticket no encontrado')
        }

        saveLocalTickets(filteredTickets)
        await fetchTickets() // Refrescar la lista
        return { success: true }
      } else {
        // Modo real con Supabase
        const { error: deleteError } = await supabase
          .from('tickets')
          .delete()
          .eq('id', ticketId)

        if (deleteError) throw deleteError

        await fetchTickets() // Refrescar la lista
        return { success: true }
      }
    } catch (err) {
      error.value = err.message
      console.error('Error eliminando ticket:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Obtener estadísticas de tickets
  const getTicketStats = async () => {
    try {
      if (isMockMode) {
        // Modo mock
        const ticketsData = getLocalTickets()
        
        const stats = {
          total: ticketsData.length,
          open: ticketsData.filter(t => t.status === 'open').length,
          in_progress: ticketsData.filter(t => t.status === 'in_progress').length,
          closed: ticketsData.filter(t => t.status === 'closed').length,
          high_priority: ticketsData.filter(t => t.priority === 'high').length,
          medium_priority: ticketsData.filter(t => t.priority === 'medium').length,
          low_priority: ticketsData.filter(t => t.priority === 'low').length,
        }

        return stats
      } else {
        // Modo real con Supabase
        const { data, error: statsError } = await supabase
          .from('tickets')
          .select('status, priority')

        if (statsError) throw statsError

        const stats = {
          total: data.length,
          open: data.filter(t => t.status === 'open').length,
          in_progress: data.filter(t => t.status === 'in_progress').length,
          closed: data.filter(t => t.status === 'closed').length,
          high_priority: data.filter(t => t.priority === 'high').length,
          medium_priority: data.filter(t => t.priority === 'medium').length,
          low_priority: data.filter(t => t.priority === 'low').length,
        }

        return stats
      }
    } catch (err) {
      console.error('Error obteniendo estadísticas:', err)
      return null
    }
  }

  // Obtener estadísticas de tickets por empresa
  const getTicketStatsByCompany = async (companyId) => {
    try {
      if (isMockMode) {
        // Modo mock
        const ticketsData = getLocalTickets()
        // Obtener todos los clientes de la empresa
        const companyClients = mockClients.filter(client => client.company_id === companyId)
        const companyClientIds = companyClients.map(client => client.id)
        
        // Filtrar tickets que pertenecen a clientes de esta empresa
        const companyTickets = ticketsData.filter(ticket => companyClientIds.includes(ticket.client_id))
        
        const stats = {
          total: companyTickets.length,
          open: companyTickets.filter(t => t.status === 'open').length,
          in_progress: companyTickets.filter(t => t.status === 'in_progress').length,
          closed: companyTickets.filter(t => t.status === 'closed').length,
          high_priority: companyTickets.filter(t => t.priority === 'high').length,
          medium_priority: companyTickets.filter(t => t.priority === 'medium').length,
          low_priority: companyTickets.filter(t => t.priority === 'low').length,
        }

        return stats
      } else {
        // Modo real con Supabase
        // Primero obtener todos los clientes de la empresa
        const { data: companyClients, error: clientsError } = await supabase
          .from('clients')
          .select('id')
          .eq('company_id', companyId)

        if (clientsError) throw clientsError

        const clientIds = companyClients.map(client => client.id)
        
        if (clientIds.length === 0) {
          return {
            total: 0,
            open: 0,
            in_progress: 0,
            closed: 0,
            high_priority: 0,
            medium_priority: 0,
            low_priority: 0,
          }
        }

        // Obtener tickets de todos los clientes de la empresa
        const { data, error: statsError } = await supabase
          .from('tickets')
          .select('status, priority')
          .in('client_id', clientIds)

        if (statsError) throw statsError

        const stats = {
          total: data.length,
          open: data.filter(t => t.status === 'open').length,
          in_progress: data.filter(t => t.status === 'in_progress').length,
          closed: data.filter(t => t.status === 'closed').length,
          high_priority: data.filter(t => t.priority === 'high').length,
          medium_priority: data.filter(t => t.priority === 'medium').length,
          low_priority: data.filter(t => t.priority === 'low').length,
        }

        return stats
      }
    } catch (err) {
      console.error('Error obteniendo estadísticas por empresa:', err)
      return null
    }
  }

  // Inicializar datos mock inmediatamente si es necesario
  if (isMockMode) {
    const initializeData = () => {
      // Forzar actualización de datos para cargar los 100 tickets nuevos
      console.log('Forzando actualización de datos mock con 100 tickets...')
      localStorage.removeItem('mockTickets') // Limpiar datos antiguos
      saveLocalTickets(mockTickets)
      console.log('Datos mock actualizados, total tickets:', mockTickets.length)
    }
    initializeData()
  }

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    fetchTicketsByClient,
    fetchTicketsByCompany,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketStats,
    getTicketStatsByCompany,
    isMockMode
  }
}) 