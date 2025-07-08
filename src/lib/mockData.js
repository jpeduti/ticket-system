// Datos de prueba para el sistema de tickets
export const mockClients = [
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

export const mockTickets = [
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
    title: 'Optimización de rendimiento en consultas',
    description: 'Las consultas a la base de datos están tardando mucho tiempo. Necesitamos optimizar las queries más lentas y revisar los índices.',
    status: 'in_progress',
    priority: 'high',
    client_id: 4,
    assigned_to: 'user-789',
    created_at: '2024-06-28T13:45:00Z',
    updated_at: '2024-07-01T10:20:00Z',
    client: mockClients[3],
    assigned_user: { email: 'dba@empresa.com' }
  },
  {
    id: 6,
    title: 'Integración con API de terceros',
    description: 'Implementar integración con la API de pagos de Stripe para procesar pagos en línea de forma segura.',
    status: 'open',
    priority: 'medium',
    client_id: 5,
    assigned_to: null,
    created_at: '2024-06-25T16:30:00Z',
    updated_at: '2024-06-25T16:30:00Z',
    client: mockClients[4]
  },
  {
    id: 7,
    title: 'Backup automático no funciona',
    description: 'El sistema de backup automático falló ayer por la noche. Necesitamos revisar la configuración y asegurar que los backups se realicen correctamente.',
    status: 'open',
    priority: 'high',
    client_id: 2,
    assigned_to: null,
    created_at: '2024-07-03T07:15:00Z',
    updated_at: '2024-07-03T07:15:00Z',
    client: mockClients[1]
  },
  {
    id: 8,
    title: 'Actualización de diseño responsive',
    description: 'Mejorar el diseño responsive de la aplicación para que funcione mejor en dispositivos móviles y tablets.',
    status: 'closed',
    priority: 'low',
    client_id: 3,
    assigned_to: 'user-321',
    created_at: '2024-05-20T12:00:00Z',
    updated_at: '2024-06-15T14:30:00Z',
    client: mockClients[2],
    assigned_user: { email: 'frontend@empresa.com' }
  }
]

// Usuario mock para autenticación
export const mockUser = {
  id: 'mock-user-123',
  email: 'demo@sistema-tickets.com',
  user_metadata: {
    name: 'Usuario Demo'
  }
}

// Función para simular delay de red
export const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

// Función para generar nuevo ID
export const generateId = () => Math.max(...mockTickets.map(t => t.id), ...mockClients.map(c => c.id)) + 1

// Función para simular errores ocasionales
export const shouldSimulateError = () => Math.random() < 0.05 // 5% de probabilidad de error 