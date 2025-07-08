import type { Client, Ticket, MockUser, ClientUser } from '@/types'

// Datos de prueba para el sistema de tickets
export const mockClients: Client[] = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@empresa-a.com',
    phone: '+34 123 456 789',
    company: 'Empresa A S.L.',
    address: 'Calle Principal 123, 28001 Madrid',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria.garcia@techcorp.com',
    phone: '+34 987 654 321',
    company: 'TechCorp Solutions',
    address: 'Avenida Tecnológica 456, 08001 Barcelona',
    created_at: '2024-01-20T14:15:00Z',
    updated_at: '2024-02-10T16:45:00Z'
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos.lopez@freelancer.com',
    phone: '+34 555 123 456',
    company: 'Freelancer Independiente',
    address: 'Plaza Mayor 789, 46001 Valencia',
    created_at: '2024-02-01T09:20:00Z',
    updated_at: '2024-02-01T09:20:00Z'
  },
  {
    id: 4,
    name: 'Ana Martínez',
    email: 'ana.martinez@startup.es',
    phone: '+34 666 777 888',
    company: 'StartUp Innovadora',
    address: 'Calle Innovación 321, 41001 Sevilla',
    created_at: '2024-02-15T11:30:00Z',
    updated_at: '2024-03-01T13:15:00Z'
  },
  {
    id: 5,
    name: 'Roberto Sánchez',
    email: 'roberto.sanchez@consulting.com',
    phone: '+34 444 555 666',
    company: 'Consulting Pro',
    address: 'Paseo Consultoría 654, 29001 Málaga',
    created_at: '2024-03-01T08:45:00Z',
    updated_at: '2024-03-01T08:45:00Z'
  }
]

export const mockTickets: Ticket[] = [
  {
    id: 1,
    title: 'Sistema de facturación no genera PDFs',
    description: 'Desde ayer el sistema de facturación no está generando los archivos PDF correctamente. Los clientes están reportando que no pueden descargar sus facturas. Es urgente porque afecta a todos los usuarios.',
    status: 'open',
    priority: 'high',
    client_id: 1,
    assigned_to: null,
    created_at: '2024-07-03T08:30:00Z',
    updated_at: '2024-07-03T08:30:00Z',
    client: mockClients[0]
  },
  {
    id: 2,
    title: 'Solicitud de reporte de ventas mensuales',
    description: 'Necesitamos agregar un nuevo reporte que muestre las ventas por mes y por producto. El reporte debe incluir gráficos interactivos y la posibilidad de exportar a Excel.',
    status: 'in_progress',
    priority: 'medium',
    client_id: 2,
    assigned_to: 'user-123',
    created_at: '2024-07-01T14:20:00Z',
    updated_at: '2024-07-02T16:45:00Z',
    client: mockClients[1],
    assigned_user: { email: 'desarrollador@empresa.com' }
  },
  {
    id: 3,
    title: 'Error 404 en página de contacto',
    description: 'La página de contacto está devolviendo error 404. Los usuarios no pueden enviar mensajes a través del formulario web.',
    status: 'open',
    priority: 'low',
    client_id: 3,
    assigned_to: null,
    created_at: '2024-07-02T11:15:00Z',
    updated_at: '2024-07-02T11:15:00Z',
    client: mockClients[2]
  },
  {
    id: 4,
    title: 'Migración a nueva versión del sistema',
    description: 'Actualizar el sistema a la versión 2.0 con las nuevas funcionalidades solicitadas. Incluye migración de datos y pruebas completas.',
    status: 'closed',
    priority: 'medium',
    client_id: 1,
    assigned_to: 'user-456',
    created_at: '2024-06-15T09:00:00Z',
    updated_at: '2024-06-30T17:30:00Z',
    client: mockClients[0],
    assigned_user: { email: 'admin@empresa.com' }
  },
  {
    id: 5,
    title: 'Optimización de base de datos',
    description: 'Las consultas están siendo muy lentas en horas pico. Necesitamos optimizar las consultas más pesadas y revisar los índices.',
    status: 'in_progress',
    priority: 'high',
    client_id: 4,
    assigned_to: 'user-789',
    created_at: '2024-07-01T15:45:00Z',
    updated_at: '2024-07-03T09:20:00Z',
    client: mockClients[3],
    assigned_user: { email: 'dba@empresa.com' }
  },
  {
    id: 6,
    title: 'Integración con API externa',
    description: 'Implementar integración con la API de pagos para automatizar el proceso de facturación y cobro.',
    status: 'open',
    priority: 'medium',
    client_id: 5,
    assigned_to: null,
    created_at: '2024-07-02T08:15:00Z',
    updated_at: '2024-07-02T08:15:00Z',
    client: mockClients[4]
  },
  {
    id: 7,
    title: 'Problema con envío de emails',
    description: 'Los emails de notificación no se están enviando. Los usuarios no reciben confirmaciones de sus acciones.',
    status: 'open',
    priority: 'high',
    client_id: 2,
    assigned_to: 'user-101',
    created_at: '2024-07-03T12:30:00Z',
    updated_at: '2024-07-03T12:30:00Z',
    client: mockClients[1],
    assigned_user: { email: 'support@empresa.com' }
  },
  {
    id: 8,
    title: 'Actualización de seguridad',
    description: 'Aplicar las últimas actualizaciones de seguridad y parches críticos al sistema.',
    status: 'closed',
    priority: 'high',
    client_id: 3,
    assigned_to: 'user-202',
    created_at: '2024-06-28T16:20:00Z',
    updated_at: '2024-07-01T14:45:00Z',
    client: mockClients[2],
    assigned_user: { email: 'security@empresa.com' }
  }
]

// Usuarios mock para autenticación
export const mockAdminUser: MockUser = {
  id: 'mock-admin-123',
  email: 'admin@sistema-tickets.com',
  role: 'admin',
  user_metadata: {
    name: 'Usuario Admin'
  }
}

export const mockClientUsers: ClientUser[] = [
  {
    id: 'mock-client-1',
    email: 'juan.perez@empresa-a.com',
    role: 'client',
    client_id: 1,
    client_data: mockClients[0],
    user_metadata: {
      name: 'Juan Pérez'
    }
  },
  {
    id: 'mock-client-2', 
    email: 'maria.garcia@techcorp.com',
    role: 'client',
    client_id: 2,
    client_data: mockClients[1],
    user_metadata: {
      name: 'María García'
    }
  },
  {
    id: 'mock-client-3',
    email: 'carlos.lopez@freelancer.com', 
    role: 'client',
    client_id: 3,
    client_data: mockClients[2],
    user_metadata: {
      name: 'Carlos López'
    }
  }
]

// Para compatibilidad hacia atrás
export const mockUser = mockAdminUser

// Funciones utilitarias para el modo mock
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms))

export const shouldSimulateError = (): boolean => Math.random() < 0.05 // 5% de probabilidad

export const generateId = (): number => Date.now() + Math.floor(Math.random() * 1000) 