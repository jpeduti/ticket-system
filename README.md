# 🎫 Sistema de Tickets

Un sistema completo de gestión de tickets para clientes construido con **Vue.js 3**, **Supabase** y **Shadcn/vue**.

## ✨ Características

- 🔐 **Autenticación completa** con Supabase Auth
- 📊 **Dashboard con estadísticas** en tiempo real
- 🎫 **Gestión completa de tickets** (CRUD)
- 👥 **Administración de clientes**
- 🎨 **Interfaz moderna** con Shadcn/vue y Tailwind CSS
- 📱 **Diseño responsive** para móviles y desktop
- 🔍 **Búsqueda y filtros** avanzados
- 📈 **Prioridades y estados** de tickets
- 🔔 **Notificaciones** con Sonner

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd ticket-system
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Supabase

#### 3.1 Crear proyecto en Supabase
1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Espera a que se complete la configuración

#### 3.2 Configurar la base de datos
1. Ve a **SQL Editor** en tu dashboard de Supabase
2. Copia y pega el contenido del archivo `supabase-setup.sql`
3. Ejecuta el script para crear las tablas

#### 3.3 Configurar variables de entorno
1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega las siguientes variables:

```env
# Configuración de Supabase
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-anonima-aqui
```

**¿Dónde encuentro estas variables?**
- Ve a **Settings** → **API** en tu dashboard de Supabase
- Copia la **URL** y la **anon/public key**

#### 3.4 Actualizar configuración del cliente
Edita el archivo `src/lib/supabase.js` y reemplaza:
```javascript
const supabaseUrl = 'TU_SUPABASE_URL'
const supabaseAnonKey = 'TU_SUPABASE_ANON_KEY'
```

Con:
```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

### 4. Ejecutar el proyecto
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

## 📋 Estructura del Proyecto

```
ticket-system/
├── src/
│   ├── components/
│   │   ├── ui/           # Componentes de Shadcn/vue
│   │   └── NavBar.vue    # Barra de navegación
│   ├── stores/
│   │   ├── auth.js       # Store de autenticación
│   │   ├── tickets.js    # Store de tickets
│   │   └── clients.js    # Store de clientes
│   ├── views/
│   │   ├── LoginView.vue         # Vista de login
│   │   ├── DashboardView.vue     # Panel principal
│   │   ├── TicketsView.vue       # Lista de tickets
│   │   ├── TicketDetailView.vue  # Detalle de ticket
│   │   ├── CreateTicketView.vue  # Crear ticket
│   │   └── ClientsView.vue       # Gestión de clientes
│   ├── lib/
│   │   └── supabase.js   # Configuración de Supabase
│   └── router/
│       └── index.js      # Configuración de rutas
├── supabase-setup.sql    # Script de configuración de BD
└── README.md
```

## 🎯 Uso del Sistema

### 1. Registro e Inicio de Sesión
- Accede a `/login` para iniciar sesión
- Puedes registrar nuevos usuarios desde la misma pantalla
- Una vez autenticado, serás redirigido al dashboard

### 2. Dashboard
- Visualiza estadísticas de tickets
- Ve los tickets más recientes
- Accede rápidamente a crear nuevo ticket

### 3. Gestión de Tickets
- **Ver todos los tickets**: `/tickets`
- **Crear nuevo ticket**: `/tickets/create`
- **Ver detalle**: `/tickets/:id`
- Filtrar por estado y prioridad
- Buscar por título o cliente

### 4. Gestión de Clientes
- **Ver todos los clientes**: `/clients`
- Crear, editar y eliminar clientes
- Buscar clientes por nombre, email o empresa

## 🔧 Tecnologías Utilizadas

- **Frontend**: Vue.js 3 + Composition API
- **Backend**: Supabase (PostgreSQL + Auth)
- **UI**: Shadcn/vue + Tailwind CSS
- **Estado**: Pinia
- **Routing**: Vue Router
- **Iconos**: Lucide Vue
- **Notificaciones**: Vue Sonner
- **Build**: Vite

## 📊 Modelo de Datos

### Tabla `clients`
```sql
- id (BIGINT, Primary Key)
- name (VARCHAR, NOT NULL)
- email (VARCHAR, UNIQUE, NOT NULL)
- phone (VARCHAR, Opcional)
- company (VARCHAR, Opcional)
- address (TEXT, Opcional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabla `tickets`
```sql
- id (BIGINT, Primary Key)
- title (VARCHAR, NOT NULL)
- description (TEXT, NOT NULL)
- status (ENUM: 'open', 'in_progress', 'closed')
- priority (ENUM: 'low', 'medium', 'high')
- client_id (BIGINT, Foreign Key → clients.id)
- assigned_to (UUID, Foreign Key → auth.users.id)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔒 Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- **Autenticación requerida** para todas las operaciones
- **Políticas de acceso** configuradas para usuarios autenticados
- **Validación de datos** en frontend y backend

## 🚀 Despliegue

### Netlify / Vercel
1. Conecta tu repositorio
2. Configura las variables de entorno
3. Despliega automáticamente

### Variables de entorno para producción:
```env
VITE_SUPABASE_URL=tu-url-de-produccion
VITE_SUPABASE_ANON_KEY=tu-clave-de-produccion
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🐛 Problemas Conocidos

- Si tienes problemas con las variables de entorno, reinicia el servidor de desarrollo
- Asegúrate de que la URL de Supabase no tenga barra final
- Los datos de ejemplo se insertan automáticamente, puedes eliminarlos del SQL si no los necesitas

## 📞 Soporte

Si tienes algún problema o pregunta, no dudes en:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

¡Gracias por usar nuestro sistema de tickets! 🎉 