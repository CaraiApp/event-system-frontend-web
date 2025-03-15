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
  
  // Dashboard Overview - Obtiene datos reales
  getDashboardOverview: async () => {
    try {
      console.log('Solicitando datos reales del dashboard');
      const response = await api.get('/api/v1/dashboard/admin/overview');
      return response;
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error);
      return {
        data: {
          success: true,
          data: {
            userCount: 0,
            newUsers: 0,
            totalEvents: 0,
            activeEventCount: 0,
            pendingEventCount: 0,
            bookingCount: 0,
            totalRevenue: 0,
            popularCategories: [],
            systemHealth: 0,
            recentEvents: [],
            revenueByMonth: {},
            userGrowth: {},
            dataNotAvailable: true, // Flag para indicar que no hay datos reales
            error: error.response?.data?.message || 'No se pudieron cargar los datos, por favor actualice más tarde'
          }
        }
      };
    }
  },
  
  // Usuarios
  getUsers: async (params) => {
    try {
      console.log('Solicitando lista de usuarios con parámetros:', params);
      const response = await api.get('/api/v1/dashboard/admin/users', { params });
      return response;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return {
        data: {
          success: true,
          data: {
            users: [],
            totalCount: 0,
            page: params?.page || 1,
            limit: params?.limit || 10,
            dataNotAvailable: true,
            error: error.response?.data?.message || 'No se pudieron cargar los usuarios'
          }
        }
      };
    }
  },
  
  getOrganizers: async (params) => {
    try {
      console.log('Solicitando lista de organizadores con parámetros:', params);
      // Añadimos role=organizer para filtrar solo organizadores
      const queryParams = { ...params, role: 'organizer' };
      const response = await api.get('/api/v1/dashboard/admin/organizers', { params: queryParams });
      return response;
    } catch (error) {
      console.error('Error al obtener organizadores:', error);
      return {
        data: {
          success: true,
          data: {
            users: [],
            totalCount: 0,
            page: params?.page || 1,
            limit: params?.limit || 10,
            dataNotAvailable: true,
            error: error.response?.data?.message || 'No se pudieron cargar los organizadores'
          }
        }
      };
    }
  },
  
  updateUser: (userId, userData) => api.patch(`/api/v1/dashboard/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/api/v1/dashboard/admin/users/${userId}`),
  
  // Eventos
  getEvents: async (params) => {
    try {
      console.log('Solicitando lista de eventos con parámetros:', params);
      const response = await api.get('/api/v1/dashboard/admin/events', { params });
      return response;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      return {
        data: {
          success: true,
          data: {
            events: [],
            totalCount: 0,
            page: params?.page || 1,
            limit: params?.limit || 10,
            dataNotAvailable: true,
            error: error.response?.data?.message || 'No se pudieron cargar los eventos'
          }
        }
      };
    }
  },
  
  updateEventStatus: (eventId, status) => api.patch(`/api/v1/dashboard/admin/events/${eventId}/status`, { status }),
  toggleEventFeatured: (eventId, featured) => api.patch(`/api/v1/dashboard/admin/events/${eventId}/featured`, { featured }),
  deleteEvent: (eventId) => api.delete(`/api/v1/dashboard/admin/events/${eventId}`),
  
  // Categorías
  getCategories: async () => {
    try {
      console.log('Solicitando lista de categorías');
      const response = await api.get('/api/v1/dashboard/admin/categories');
      return response;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      
      // Intentamos obtener categorías a través de la API general
      try {
        console.log('Intentando obtener categorías a través de la API general');
        const generalResponse = await api.get('/api/v1/categories');
        // Transformar la respuesta al formato esperado por el admin dashboard
        if (generalResponse.data && generalResponse.data.data) {
          const formattedCategories = generalResponse.data.data.map(cat => ({
            id: cat._id || cat.id,
            name: cat.name,
            eventCount: cat.eventCount || 0,
            icon: cat.icon || 'category'
          }));
          
          return {
            data: {
              success: true,
              data: formattedCategories
            }
          };
        }
      } catch (secondError) {
        console.error('Error en segundo intento de obtener categorías:', secondError);
      }
      
      // Si ambos intentos fallan, devolver lista vacía con mensaje
      return {
        data: {
          success: true,
          data: [],
          dataNotAvailable: true,
          error: error.response?.data?.message || 'No se pudieron cargar las categorías'
        }
      };
    }
  },
  
  // Informes
  getReports: (params) => api.get('/api/v1/dashboard/admin/reports', { params }),
  getActivityLog: (params) => api.get('/api/v1/dashboard/admin/activity-log', { params }),
  getSystemPerformance: () => api.get('/api/v1/dashboard/admin/performance'),
  
  // Configuración del sistema
  getSystemSettings: async () => {
    try {
      console.log('Solicitando configuración del sistema');
      const response = await api.get('/api/v1/dashboard/admin/settings');
      return response;
    } catch (error) {
      console.error('Error al obtener configuración del sistema:', error);
      
      // Valores por defecto con mensaje de error
      return {
        data: {
          success: true,
          data: {
            siteName: 'EntradasMelilla',
            contactEmail: '',
            supportPhone: '',
            logoUrl: '/logo.png',
            primaryColor: '#3795d6',
            secondaryColor: '#2A2A35',
            comissionRate: 0,
            taxRate: 21,
            allowNewRegistrations: true,
            requireEmailVerification: true,
            maintenanceMode: false,
            currencySymbol: '€',
            defaultLanguage: 'es',
            allowedFileTypes: 'jpg,jpeg,png,pdf',
            maxFileSize: 5,
            timeZone: 'Europe/Madrid',
            dataNotAvailable: true,
            error: error.response?.data?.message || 'No se pudo cargar la configuración del sistema'
          }
        }
      };
    }
  },
  
  updateSystemSettings: (settings) => api.put('/api/v1/dashboard/admin/settings', settings),
  
  // Configuración de correo electrónico
  getEmailSettings: async () => {
    try {
      console.log('Solicitando configuración de correo electrónico');
      const response = await api.get('/api/v1/dashboard/admin/settings/email');
      return response;
    } catch (error) {
      console.error('Error al obtener configuración de correo:', error);
      
      // Valores por defecto con mensaje de error
      return {
        data: {
          success: true,
          data: {
            provider: '',
            host: '',
            port: 587,
            username: '',
            password: '',
            encryption: 'tls',
            fromName: 'EntradasMelilla',
            fromEmail: '',
            replyToEmail: '',
            templates: {
              welcome: { subject: '', enabled: false },
              orderConfirmation: { subject: '', enabled: false },
              passwordReset: { subject: '', enabled: false },
              eventReminder: { subject: '', enabled: false },
            },
            dataNotAvailable: true,
            error: error.response?.data?.message || 'No se pudo cargar la configuración de correo electrónico'
          }
        }
      };
    }
  },
  
  updateEmailSettings: (settings) => api.put('/api/v1/dashboard/admin/settings/email', settings),
  sendTestEmail: (emailData) => api.post('/api/v1/dashboard/admin/send-test-email', emailData),
  
  // Comunicaciones
  getCommunications: (params) => api.get('/api/v1/dashboard/admin/communications', { params }),
  sendCommunication: (data) => api.post('/api/v1/dashboard/admin/communications', data),

  // Configuración UI - Usando directamente el endpoint que funciona correctamente sin intentar otros
  getUiConfig: async (route) => {
    try {
      console.log(`Solicitando configuración UI para ruta: ${route} usando endpoint verificado`);
      
      // Usar directamente el endpoint que funciona correctamente sin intentar primero el que falla
      const response = await api.get('/api/templates/ui-config');
      console.log('✅ UI Config recibida correctamente:', response.data);
      
      // Devolver los datos con elementos de navegación para el admin dashboard
      return {
        data: {
          success: true,
          data: {
            hideHeader: true,
            hideFooter: true,
            isDashboard: true,
            dashboardType: 'admin',
            ...response.data,
            // Asegurar que siempre se tenga la navegación correcta
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
    } catch (error) {
      console.error('Error al obtener configuración UI:', error);
      
      // Usar configuración estática en caso de error
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
    }
  },
};

export default adminApi;