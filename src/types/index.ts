// ================================
// TIPOS DEL DOMINIO
// ================================

export interface Client {
  id: number
  name: string
  email: string
  phone?: string | null
  company?: string | null
  address?: string | null
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: number
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  client_id: number
  assigned_to?: string | null
  created_at: string
  updated_at: string
  // Relaciones
  client?: Client
  assigned_user?: { email: string }
}

export type TicketStatus = 'open' | 'in_progress' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high'

// ================================
// TIPOS PARA FORMULARIOS
// ================================

export interface CreateClientData {
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
}

export interface CreateTicketData {
  title: string
  description: string
  priority: TicketPriority
  client_id: number
  assigned_to?: string | null
}

export interface UpdateTicketData {
  title?: string
  description?: string
  status?: TicketStatus
  priority?: TicketPriority
  assigned_to?: string | null
}

// ================================
// TIPOS PARA AUTENTICACIÓN
// ================================

export type UserRole = 'admin' | 'client'

export interface User {
  id: string
  email: string
  role: UserRole
  user_metadata?: {
    name?: string
  }
}

export interface AdminUser extends User {
  role: 'admin'
}

export interface ClientUser extends User {
  role: 'client'
  client_id: number // Referencia al ID en la tabla clients
  client_data?: Client // Datos del cliente asociado
}

export interface AuthResponse {
  success: boolean
  error?: string
  data?: {
    user?: User
    message?: string
  }
}

// ================================
// TIPOS PARA STORES/SERVICIOS
// ================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface TicketStats {
  total: number
  open: number
  in_progress: number
  closed: number
  high_priority: number
  medium_priority: number
  low_priority: number
}

// ================================
// TIPOS PARA MOCK DATA
// ================================

export interface MockData {
  clients: Client[]
  tickets: Ticket[]
}

export interface MockUser extends User {
  email: string
}

// ================================
// UTILIDADES
// ================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>> 