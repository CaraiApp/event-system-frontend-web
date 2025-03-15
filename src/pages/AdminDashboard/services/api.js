import axios from 'axios';

// Crear una instancia de axios con la configuración base
// No usamos una URL base personalizada para aprovechar el proxy configurado en vite.config.js
const api = axios.create({
  withCredentials: true, // Importante para mantener las cookies de sesión
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores de autenticación (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login?redirect=/admin';
    }
    return Promise.reject(error);
  }
);

// Servicios para el dashboard de administrador
const adminApi = {
  // Autenticación
  login: (credentials) => api.post('/api/v1/auth/login', credentials),
  logout: () => api.post('/api/v1/auth/logout'),
  
  // Dashboard Overview - datos estáticos para evitar problemas
  getDashboardOverview: async () => {
    console.log('Solicitados datos del dashboard - USANDO DATOS ESTÁTICOS');
    
    return {
      data: {
        success: true,
        data: {
          userCount: 250,
          newUsers: 28,
          totalEvents: 68,
          activeEventCount: 45,
          pendingEventCount: 23,
          bookingCount: 583,
          totalRevenue: 38450,
          popularCategories: [
            { name: 'Conciertos', count: 18 },
            { name: 'Deportes', count: 15 },
            { name: 'Teatro', count: 12 },
            { name: 'Festivales', count: 10 },
            { name: 'Conferencias', count: 8 }
          ],
          systemHealth: 98,
          recentEvents: [
            { id: 1, title: 'Concierto Local', organizer: 'Promotor Musical', date: "2023-09-15", attendees: 123, capacity: 200, status: 'active' },
            { id: 2, title: 'Partido Amistoso', organizer: 'Club Deportivo', date: "2023-09-18", attendees: 450, capacity: 500, status: 'active' },
            { id: 3, title: 'Obra de Teatro', organizer: 'Teatro Municipal', date: "2023-09-22", attendees: 87, capacity: 150, status: 'active' },
            { id: 4, title: 'Carrera Solidaria', organizer: 'ONG Local', date: "2023-09-25", attendees: 320, capacity: 400, status: 'active' },
            { id: 5, title: 'Exposición de Arte', organizer: 'Galería Central', date: "2023-09-28", attendees: 64, capacity: 100, status: 'active' }
          ],
          revenueByMonth: {
            'Ene': 5200, 'Feb': 4800, 'Mar': 6300, 'Abr': 7200, 
            'May': 8600, 'Jun': 9400, 'Jul': 12500, 'Ago': 10500
          },
          userGrowth: {
            'Ene': 18, 'Feb': 22, 'Mar': 25, 'Abr': 30, 
            'May': 28, 'Jun': 35, 'Jul': 42, 'Ago': 50
          }
        }
      }
    };
  },
  
  // Usuarios
  getUsers: async (params) => {
    console.log('Solicitando lista de usuarios con parámetros:', params);
    // Implementación con datos estáticos para desarrollo
    return {
      data: {
        success: true,
        data: {
          users: Array(10).fill(null).map((_, i) => ({
            id: `user-${i+1}`,
            username: `usuario${i+1}`,
            email: `usuario${i+1}@example.com`,
            role: i % 5 === 0 ? 'admin' : i % 3 === 0 ? 'organizer' : 'user',
            fullName: `Usuario Ejemplo ${i+1}`,
            createdAt: new Date(Date.now() - (i * 86400000)).toISOString(),
            status: i % 4 === 0 ? 'inactive' : 'active'
          })),
          totalCount: 48,
          page: params?.page || 1,
          limit: params?.limit || 10
        }
      }
    };
  },
  
  getOrganizers: async (params) => {
    console.log('Solicitando lista de organizadores con parámetros:', params);
    // Datos de ejemplo para organizadores
    return {
      data: {
        success: true,
        data: {
          users: Array(8).fill(null).map((_, i) => ({
            id: `org-${i+1}`,
            username: `organizador${i+1}`,
            email: `organizador${i+1}@example.com`,
            role: 'organizer',
            fullName: `Organizador ${i+1}`,
            companyName: `Empresa Organizadora ${i+1}`,
            createdAt: new Date(Date.now() - (i * 86400000)).toISOString(),
            eventsCount: Math.floor(Math.random() * 10) + 1,
            status: i % 5 === 0 ? 'inactive' : 'active'
          })),
          totalCount: 32,
          page: params?.page || 1,
          limit: params?.limit || 10
        }
      }
    };
  },
  
  updateUser: (userId, userData) => api.patch(`/api/v1/dashboard/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/api/v1/dashboard/admin/users/${userId}`),
  
  // Eventos
  getEvents: async (params) => {
    console.log('Solicitando lista de eventos con parámetros:', params);
    // Datos de ejemplo para eventos
    return {
      data: {
        success: true,
        data: {
          events: Array(12).fill(null).map((_, i) => ({
            id: `event-${i+1}`,
            title: `Evento de ejemplo ${i+1}`,
            organizerId: `org-${(i % 8) + 1}`,
            organizerName: `Organizador ${(i % 8) + 1}`,
            date: new Date(Date.now() + (i * 86400000 * 3)).toISOString(),
            price: (Math.floor(Math.random() * 50) + 10) * 100,
            location: `Ubicación ejemplo ${i+1}`,
            category: ['Conciertos', 'Deportes', 'Teatro', 'Festivales', 'Conferencias'][i % 5],
            status: i % 7 === 0 ? 'cancelled' : i % 5 === 0 ? 'pending' : 'active',
            featured: i % 4 === 0,
            totalSeats: (i + 1) * 100,
            bookingsCount: Math.floor(Math.random() * ((i + 1) * 100)),
            image: `https://picsum.photos/seed/${i+1}/300/200`
          })),
          totalCount: 78,
          page: params?.page || 1,
          limit: params?.limit || 10
        }
      }
    };
  },
  
  updateEventStatus: (eventId, status) => api.patch(`/api/v1/dashboard/admin/events/${eventId}/status`, { status }),
  toggleEventFeatured: (eventId, featured) => api.patch(`/api/v1/dashboard/admin/events/${eventId}/featured`, { featured }),
  deleteEvent: (eventId) => api.delete(`/api/v1/dashboard/admin/events/${eventId}`),
  
  // Categorías
  getCategories: async () => {
    // Datos de ejemplo para categorías
    return {
      data: {
        success: true,
        data: [
          { id: 'cat-1', name: 'Conciertos', eventCount: 18, icon: 'music_note' },
          { id: 'cat-2', name: 'Deportes', eventCount: 15, icon: 'sports_soccer' },
          { id: 'cat-3', name: 'Teatro', eventCount: 12, icon: 'theater_comedy' },
          { id: 'cat-4', name: 'Festivales', eventCount: 10, icon: 'festival' },
          { id: 'cat-5', name: 'Conferencias', eventCount: 8, icon: 'record_voice_over' },
          { id: 'cat-6', name: 'Exposiciones', eventCount: 6, icon: 'palette' },
        ]
      }
    };
  },
  
  // Informes
  getReports: (params) => api.get('/api/v1/dashboard/admin/reports', { params }),
  getActivityLog: (params) => api.get('/api/v1/dashboard/admin/activity-log', { params }),
  getSystemPerformance: () => api.get('/api/v1/dashboard/admin/performance'),
  
  // Configuración del sistema
  getSystemSettings: async () => {
    // Datos de ejemplo para configuración del sistema
    return {
      data: {
        success: true,
        data: {
          siteName: 'EntradasMelilla',
          contactEmail: 'info@entradasmelilla.com',
          supportPhone: '+34 600 123 456',
          logoUrl: '/logo.png',
          primaryColor: '#4caf50',
          secondaryColor: '#2196f3',
          comissionRate: 5,
          taxRate: 21,
          allowNewRegistrations: true,
          requireEmailVerification: true,
          maintenanceMode: false,
          currencySymbol: '€',
          defaultLanguage: 'es',
          allowedFileTypes: 'jpg,jpeg,png,pdf',
          maxFileSize: 5,
          timeZone: 'Europe/Madrid'
        }
      }
    };
  },
  
  updateSystemSettings: (settings) => api.put('/api/v1/dashboard/admin/settings', settings),
  
  // Configuración de correo electrónico
  getEmailSettings: async () => {
    // Datos de ejemplo para configuración de email
    return {
      data: {
        success: true,
        data: {
          provider: 'smtp',
          host: 'smtp.example.com',
          port: 587,
          username: 'notifications@entradasmelilla.com',
          password: '********',
          encryption: 'tls',
          fromName: 'EntradasMelilla',
          fromEmail: 'notifications@entradasmelilla.com',
          replyToEmail: 'info@entradasmelilla.com',
          templates: {
            welcome: { subject: 'Bienvenido a EntradasMelilla', enabled: true },
            orderConfirmation: { subject: 'Confirmación de tu compra', enabled: true },
            passwordReset: { subject: 'Restablecimiento de contraseña', enabled: true },
            eventReminder: { subject: 'Recordatorio: Tu evento se acerca', enabled: true },
          }
        }
      }
    };
  },
  
  updateEmailSettings: (settings) => api.put('/api/v1/dashboard/admin/settings/email', settings),
  sendTestEmail: (emailData) => api.post('/api/v1/dashboard/admin/send-test-email', emailData),
  
  // Comunicaciones
  getCommunications: (params) => api.get('/api/v1/dashboard/admin/communications', { params }),
  sendCommunication: (data) => api.post('/api/v1/dashboard/admin/communications', data),

  // Configuración UI - completamente estática
  getUiConfig: async (route) => {
    console.log(`Solicitada configuración UI para ruta: ${route} - USANDO CONFIGURACIÓN ESTÁTICA`);
    
    // CONFIGURACIÓN ESTÁTICA - Sin llamadas API
    return {
      data: {
        success: true,
        data: {
          hideHeader: true,
          hideFooter: true,
          isDashboard: true,
          dashboardType: 'admin',
          navItems: [
            { path: '/admin/overview', label: 'Dashboard', icon: 'dashboard' },
            { path: '/admin/users', label: 'Usuarios', icon: 'people' },
            { path: '/admin/organizers', label: 'Organizadores', icon: 'business' },
            { path: '/admin/events', label: 'Eventos', icon: 'event' },
            { path: '/admin/categories', label: 'Categorías', icon: 'category' },
            { path: '/admin/reports', label: 'Informes', icon: 'bar_chart' },
            { path: '/admin/settings', label: 'Configuración', icon: 'settings' }
          ]
        }
      }
    };
  },
};

export default adminApi;