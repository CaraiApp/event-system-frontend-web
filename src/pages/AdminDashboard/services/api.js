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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios para el dashboard de administrador
const adminApi = {
  // Autenticación
  login: (credentials) => api.post('/api/v1/auth/login', credentials),
  logout: () => api.post('/api/v1/auth/logout'),
  
  // Dashboard Overview - completamente estático, sin llamadas API
  getDashboardOverview: async () => {
    console.log('Solicitados datos del dashboard - USANDO DATOS ESTÁTICOS');
    
    // DATOS ESTÁTICOS - Sin llamadas API
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
  getUsers: (params) => api.get('/api/v1/dashboard/admin/users', { params }),
  getOrganizers: (params) => api.get('/api/v1/dashboard/admin/organizers', { params }),
  updateUser: (userId, userData) => api.patch(`/api/v1/dashboard/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/api/v1/dashboard/admin/users/${userId}`),
  
  // Eventos
  getEvents: (params) => api.get('/api/v1/dashboard/admin/events', { params }),
  updateEventStatus: (eventId, status) => api.patch(`/api/v1/dashboard/admin/events/${eventId}/status`, { status }),
  toggleEventFeatured: (eventId, featured) => api.patch(`/api/v1/dashboard/admin/events/${eventId}/featured`, { featured }),
  deleteEvent: (eventId) => api.delete(`/api/v1/dashboard/admin/events/${eventId}`),
  
  // Categorías
  getCategories: () => api.get('/api/v1/dashboard/admin/categories'),
  
  // Informes
  getReports: (params) => api.get('/api/v1/dashboard/admin/reports', { params }),
  getActivityLog: (params) => api.get('/api/v1/dashboard/admin/activity-log', { params }),
  getSystemPerformance: () => api.get('/api/v1/dashboard/admin/performance'),
  
  // Configuración del sistema
  getSystemSettings: () => api.get('/api/v1/dashboard/admin/settings'),
  updateSystemSettings: (settings) => api.put('/api/v1/dashboard/admin/settings', settings),
  
  // Configuración de correo electrónico
  getEmailSettings: () => api.get('/api/v1/dashboard/admin/settings/email'),
  updateEmailSettings: (settings) => api.put('/api/v1/dashboard/admin/settings/email', settings),
  sendTestEmail: (emailData) => api.post('/api/v1/dashboard/admin/send-test-email', emailData),
  
  // Comunicaciones
  getCommunications: (params) => api.get('/api/v1/dashboard/admin/communications', { params }),
  sendCommunication: (data) => api.post('/api/v1/dashboard/admin/communications', data),

  // Configuración UI - completamente estática, sin llamadas API
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
            { path: '/admin/overview', label: 'Panel de Control', icon: 'dashboard' },
            { path: '/admin/users', label: 'Usuarios', icon: 'people' },
            { path: '/admin/organizers', label: 'Organizadores', icon: 'business' },
            { path: '/admin/events', label: 'Eventos', icon: 'event' },
            { path: '/admin/settings', label: 'Configuración', icon: 'settings' }
          ]
        }
      }
    };
  },
};

export default adminApi;