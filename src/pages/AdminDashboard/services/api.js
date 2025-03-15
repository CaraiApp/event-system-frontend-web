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
  
  // Dashboard Overview
  getDashboardOverview: () => api.get('/api/v1/dashboard/admin/overview'),
  
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

  // Configuración UI
  getUiConfig: async (route) => {
    try {
      // Intentar con la ruta principal
      return await api.get('/api/v1/dashboard/ui-config', { params: { route } });
    } catch (error) {
      console.log(`Error al obtener configuración UI para ${route}:`, error.message);
      
      // Si falla, intentar con una ruta alternativa
      try {
        return await api.get('/api/v1/templates/ui-config');
      } catch (altError) {
        console.log('Error también en ruta alternativa:', altError.message);
        
        // Como último recurso, devolver una configuración por defecto
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
      }
    }
  },
};

export default adminApi;