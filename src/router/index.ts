import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Vistas de Admin
const LoginView = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const TicketsView = () => import('@/views/TicketsView.vue')
const TicketDetailView = () => import('@/views/TicketDetailView.vue')
const CreateTicketView = () => import('@/views/CreateTicketView.vue')
const ClientsView = () => import('@/views/ClientsView.vue')

// Vistas de Cliente
const ClientLoginView = () => import('@/views/client/ClientLoginView.vue')
const ClientDashboardView = () => import('@/views/client/ClientDashboardView.vue')
const ClientTicketsView = () => import('@/views/client/ClientTicketsView.vue')
const ClientProfileView = () => import('@/views/client/ClientProfileView.vue')

const routes: RouteRecordRaw[] = [
  // Redirección por defecto al portal de clientes
  {
    path: '/',
    redirect: '/client/login'
  },

  // ====================
  // RUTAS DEL PORTAL DE CLIENTES
  // ====================
  {
    path: '/client/login',
    name: 'client-login',
    component: ClientLoginView,
    meta: { requiresAuth: false, userType: 'client' }
  },
  {
    path: '/client/dashboard',
    name: 'client-dashboard',
    component: ClientDashboardView,
    meta: { requiresAuth: true, userType: 'client' }
  },
  {
    path: '/client/tickets',
    name: 'client-tickets',
    component: ClientTicketsView,
    meta: { requiresAuth: true, userType: 'client' }
  },
  {
    path: '/client/tickets/:id',
    name: 'client-ticket-detail',
    component: TicketDetailView, // Reutilizamos la vista existente
    meta: { requiresAuth: true, userType: 'client' },
    props: true
  },
  {
    path: '/client/profile',
    name: 'client-profile',
    component: ClientProfileView,
    meta: { requiresAuth: true, userType: 'client' }
  },

  // ====================
  // RUTAS DEL PORTAL ADMIN
  // ====================
  {
    path: '/admin/login',
    name: 'admin-login',
    component: LoginView,
    meta: { requiresAuth: false, userType: 'admin' }
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: '/admin/tickets',
    name: 'admin-tickets',
    component: TicketsView,
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: '/admin/tickets/create',
    name: 'admin-create-ticket',
    component: CreateTicketView,
    meta: { requiresAuth: true, userType: 'admin' }
  },
  {
    path: '/admin/tickets/:id',
    name: 'admin-ticket-detail',
    component: TicketDetailView,
    meta: { requiresAuth: true, userType: 'admin' },
    props: true
  },
  {
    path: '/admin/clients',
    name: 'admin-clients',
    component: ClientsView,
    meta: { requiresAuth: true, userType: 'admin' }
  },

  // ====================
  // RUTAS DE COMPATIBILIDAD (redirigen a admin)
  // ====================
  {
    path: '/login',
    redirect: '/admin/login'
  },
  {
    path: '/dashboard',
    redirect: '/admin/dashboard'
  },
  {
    path: '/tickets',
    redirect: '/admin/tickets'
  },
  {
    path: '/clients',
    redirect: '/admin/clients'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de navegación global
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Inicializar autenticación si no está inicializada
  if (!authStore.user && !authStore.loading) {
    await authStore.initAuth()
  }
  
  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthenticated = authStore.isAuthenticated
  const userType = to.meta.userType as string
  
  if (requiresAuth && !isAuthenticated) {
    // Redirigir al login correspondiente según el tipo de ruta
    if (userType === 'admin') {
      next('/admin/login')
    } else {
      next('/client/login')
    }
  } else if (isAuthenticated) {
    // Usuario autenticado tratando de acceder a login
    if (to.path === '/admin/login' || to.path === '/client/login') {
      // Redirigir al dashboard correspondiente según el rol del usuario
      if (authStore.isAdmin) {
        next('/admin/dashboard')
      } else if (authStore.isClient) {
        next('/client/dashboard')
      } else {
        // Fallback a cliente
        next('/client/dashboard')
      }
    }
    // Verificar que el usuario tiene acceso al tipo de ruta
    else if (userType === 'admin' && !authStore.isAdmin) {
      next('/client/dashboard') // Admin intentando acceder a cliente → redirigir a cliente
    } else if (userType === 'client' && !authStore.isClient) {
      next('/admin/dashboard') // Cliente intentando acceder a admin → redirigir a admin
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 