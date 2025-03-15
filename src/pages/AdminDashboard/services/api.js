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
  getDashboardOverview: async () => {
    try {
      console.log('Realizando petición a /api/v1/dashboard/admin/overview');
      const response = await api.get('/api/v1/dashboard/admin/overview');
      console.log('Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('Error en getDashboardOverview:', error);
      
      // Intentamos con una ruta alternativa en caso de error
      try {
        console.log('Intentando ruta alternativa...');
        const fallbackResponse = await api.get('/api/v1/dashboard/admin');
        console.log('Respuesta alternativa recibida:', fallbackResponse);
        return fallbackResponse;
      } catch (fallbackError) {
        console.error('Error también en ruta alternativa:', fallbackError);
        throw error; // Lanzamos el error original
      }
    }
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

  // Configuración UI
  getUiConfig: async (route) => {
    console.log(`Iniciando obtención de configuración UI para ruta: ${route}`);
    
    // Array de posibles rutas a intentar en orden
    const routesToTry = [
      { url: '/api/v1/dashboard/ui-config', params: { route } },
      { url: '/api/v1/dashboard', params: { config: 'ui', route } },
      { url: '/api/v1/templates/ui-config', params: {} },
      { url: '/api/v1/dashboard/admin/settings', params: { type: 'ui' } }
    ];
    
    // Configuración por defecto como último recurso
    const defaultConfig = {
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
    
    // Intentar cada ruta secuencialmente
    for (const routeConfig of routesToTry) {
      try {
        console.log(`Intentando obtener configuración UI desde: ${routeConfig.url}`, routeConfig.params);
        const response = await api.get(routeConfig.url, { params: routeConfig.params });
        console.log(`Configuración UI obtenida exitosamente desde ${routeConfig.url}:`, response);
        return response;
      } catch (error) {
        console.log(`Error al obtener configuración UI desde ${routeConfig.url}:`, error.message);
        // Continuar con la siguiente ruta
      }
    }
    
    // Si todas las rutas fallan, devolver la configuración por defecto
    console.log('Todas las rutas fallaron, usando configuración por defecto');
    return defaultConfig;
  },
};

export default adminApi;