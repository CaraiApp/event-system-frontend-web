import { 
  api, 
  apiRequestWithFallback, 
  normalizeResponse, 
  getUsers as getUsersHelper, 
  getOrganizers as getOrganizersHelper,
  getAdminDashboardOverview as getDashboardOverviewHelper,
  getCategories as getCategoriesHelper 
} from '../../../utils/apiHelper';

// Servicios optimizados para el dashboard de administrador
const adminApi = {
  // Autenticación
  login: (credentials) => api.post('/api/v1/auth/login', credentials),
  logout: () => api.post('/api/v1/auth/logout'),
  
  // Dashboard Overview - Obtiene datos reales usando el helper optimizado
  getDashboardOverview: async () => {
    console.log('Solicitando datos del dashboard admin con helper optimizado');
    return getDashboardOverviewHelper();
  },
  
  // Usuarios - Usando el helper optimizado
  getUsers: async (params) => {
    console.log('Solicitando lista de usuarios con parámetros:', params);
    return getUsersHelper(params);
  },
  
  // Organizadores - Usando el helper optimizado
  getOrganizers: async (params) => {
    console.log('Solicitando lista de organizadores con parámetros:', params);
    return getOrganizersHelper(params);
  },
  
  // Operaciones CRUD para usuarios
  updateUser: async (userId, userData) => {
    try {
      // Usar el helper avanzado para manejar rutas alternativas
      const primaryEndpoint = `/api/v1/dashboard/admin/users/${userId}`;
      const fallbackEndpoints = [
        `/api/v1/users/${userId}`,
        `/api/users/${userId}`,
        `/api/v1/admin/users/${userId}`
      ];
      
      const response = await apiRequestWithFallback(
        primaryEndpoint, 
        fallbackEndpoints, 
        { method: 'patch', data: userData }
      );
      
      return normalizeResponse(response);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },
  
  deleteUser: async (userId) => {
    try {
      // Usar el helper avanzado para manejar rutas alternativas
      const primaryEndpoint = `/api/v1/dashboard/admin/users/${userId}`;
      const fallbackEndpoints = [
        `/api/v1/users/${userId}`,
        `/api/users/${userId}`,
        `/api/v1/admin/users/${userId}`
      ];
      
      const response = await apiRequestWithFallback(
        primaryEndpoint, 
        fallbackEndpoints, 
        { method: 'delete' }
      );
      
      return normalizeResponse(response);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  },
  
  // Eventos - Optimizado para usar múltiples endpoints
  getEvents: async (params = {}) => {
    try {
      console.log('Solicitando lista de eventos con parámetros:', params);
      
      // Definir endpoints por orden de prioridad
      const primaryEndpoint = '/api/v1/dashboard/admin/events';
      const fallbackEndpoints = [
        '/api/v1/events/getAllEvents',
        '/api/v1/events',
        '/api/events'
      ];
      
      const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints, { params });
      
      // Normalizar la respuesta usando la función utilitaria
      return normalizeResponse(response, 'events');
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
            error: error.message || 'No se pudieron cargar los eventos'
          }
        }
      };
    }
  },
  
  // Operaciones CRUD para eventos
  updateEventStatus: async (eventId, status) => {
    try {
      const primaryEndpoint = `/api/v1/dashboard/admin/events/${eventId}/status`;
      const fallbackEndpoints = [
        `/api/v1/events/${eventId}/status`,
        `/api/events/${eventId}/status`
      ];
      
      const response = await apiRequestWithFallback(
        primaryEndpoint, 
        fallbackEndpoints, 
        { method: 'patch', data: { status } }
      );
      
      return normalizeResponse(response);
    } catch (error) {
      console.error('Error al actualizar estado del evento:', error);
      throw error;
    }
  },
  
  toggleEventFeatured: async (eventId, featured) => {
    try {
      const primaryEndpoint = `/api/v1/dashboard/admin/events/${eventId}/featured`;
      const fallbackEndpoints = [
        `/api/v1/events/${eventId}/featured`,
        `/api/events/${eventId}/featured`
      ];
      
      const response = await apiRequestWithFallback(
        primaryEndpoint, 
        fallbackEndpoints, 
        { method: 'patch', data: { featured } }
      );
      
      return normalizeResponse(response);
    } catch (error) {
      console.error('Error al destacar/quitar destacado del evento:', error);
      throw error;
    }
  },
  
  deleteEvent: async (eventId) => {
    try {
      const primaryEndpoint = `/api/v1/dashboard/admin/events/${eventId}`;
      const fallbackEndpoints = [
        `/api/v1/events/${eventId}`,
        `/api/events/${eventId}`
      ];
      
      const response = await apiRequestWithFallback(
        primaryEndpoint, 
        fallbackEndpoints, 
        { method: 'delete' }
      );
      
      return normalizeResponse(response);
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw error;
    }
  },
  
  // Categorías - Usando el helper optimizado
  getCategories: async () => {
    console.log('Solicitando lista de categorías con helper optimizado');
    return getCategoriesHelper();
  },
  
  // Informes - Usando apiRequestWithFallback
  getReports: async (params) => {
    try {
      const primaryEndpoint = '/api/v1/dashboard/admin/reports';
      const fallbackEndpoints = [
        '/api/v1/admin/reports',
        '/api/admin/reports'
      ];
      
      const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints, { params });
      return normalizeResponse(response, 'reports');
    } catch (error) {
      console.error('Error al obtener informes:', error);
      return {
        data: {
          success: true,
          data: {
            reports: [],
            dataNotAvailable: true,
            error: error.message
          }
        }
      };
    }
  },
  
  getActivityLog: async (params) => {
    try {
      const primaryEndpoint = '/api/v1/dashboard/admin/activity-log';
      const fallbackEndpoints = [
        '/api/v1/admin/activity-log',
        '/api/admin/activity'
      ];
      
      const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints, { params });
      return normalizeResponse(response, 'activities');
    } catch (error) {
      console.error('Error al obtener registro de actividades:', error);
      return {
        data: {
          success: true,
          data: {
            activities: [],
            dataNotAvailable: true,
            error: error.message
          }
        }
      };
    }
  },
  
  getSystemPerformance: async () => {
    try {
      const primaryEndpoint = '/api/v1/dashboard/admin/performance';
      const fallbackEndpoints = [
        '/api/v1/admin/performance',
        '/api/admin/system/performance'
      ];
      
      const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints);
      return normalizeResponse(response);
    } catch (error) {
      console.error('Error al obtener rendimiento del sistema:', error);
      return {
        data: {
          success: true,
          data: {
            cpu: 0,
            memory: 0,
            disk: 0,
            uptime: 0,
            dataNotAvailable: true,
            error: error.message
          }
        }
      };
    }
  },
  
  // Configuración del sistema - Optimizada con rutas fallback
  getSystemSettings: async () => {
    try {
      const primaryEndpoint = '/api/v1/dashboard/admin/settings';
      const fallbackEndpoints = [
        '/api/v1/admin/settings',
        '/api/admin/settings',
        '/api/v1/settings',
        '/api/settings'
      ];
      
      const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints);
      return normalizeResponse(response);
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
            error: error.message || 'No se pudo cargar la configuración del sistema'
          }
        }
      };
    }
  },
  
  updateSystemSettings: async (settings) => {
    try {
      const primaryEndpoint = '/api/v1/dashboard/admin/settings';
      const fallbackEndpoints = [
        '/api/v1/admin/settings',
        '/api/admin/settings'
      ];
      
      const response = await apiRequestWithFallback(
        primaryEndpoint, 
        fallbackEndpoints, 
        { method: 'put', data: settings }
      );
      
      return normalizeResponse(response);
    } catch (error) {
      console.error('Error al actualizar configuración del sistema:', error);
      throw error;
    }
  },
  
  // Configuración de correo electrónico - Optimizada con rutas fallback
  getEmailSettings: async () => {
    try {
      const primaryEndpoint = '/api/v1/dashboard/admin/settings/email';
      const fallbackEndpoints = [
        '/api/v1/dashboard/email/config',
        '/api/v1/admin/settings/email',
        '/api/email/config'
      ];
      
      const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints);
      return normalizeResponse(response);
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
            error: error.message || 'No se pudo cargar la configuración de correo electrónico'
          }
        }
      };
    }
  },
  
  updateEmailSettings: async (settings) => {
    try {
      const primaryEndpoint = '/api/v1/dashboard/admin/settings/email';
      const fallbackEndpoints = [
        '/api/v1/dashboard/email/config',
        '/api/v1/admin/settings/email',
        '/api/email/config'
      ];
      
      const response = await apiRequestWithFallback(
        primaryEndpoint, 
        fallbackEndpoints, 
        { method: 'put', data: settings }
      );
      
      return normalizeResponse(response);
    } catch (error) {
      console.error('Error al actualizar configuración de correo:', error);
      throw error;
    }
  },
  
  sendTestEmail: async (emailData) => {
    try {
      const primaryEndpoint = '/api/v1/dashboard/admin/send-test-email';
      const fallbackEndpoints = [
        '/api/v1/dashboard/email/test',
        '/api/email/test'
      ];
      
      const response = await apiRequestWithFallback(
        primaryEndpoint, 
        fallbackEndpoints, 
        { method: 'post', data: emailData }
      );
      
      return normalizeResponse(response);
    } catch (error) {
      console.error('Error al enviar correo de prueba:', error);
      throw error;
    }
  },
  
  // Comunicaciones
  getCommunications: async (params) => {
    try {
      const primaryEndpoint = '/api/v1/dashboard/admin/communications';
      const fallbackEndpoints = [
        '/api/v1/admin/communications',
        '/api/admin/communications'
      ];
      
      const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints, { params });
      return normalizeResponse(response, 'communications');
    } catch (error) {
      console.error('Error al obtener comunicaciones:', error);
      return {
        data: {
          success: true,
          data: {
            communications: [],
            dataNotAvailable: true,
            error: error.message
          }
        }
      };
    }
  },
  
  sendCommunication: async (data) => {
    try {
      const primaryEndpoint = '/api/v1/dashboard/admin/communications';
      const fallbackEndpoints = [
        '/api/v1/admin/communications',
        '/api/admin/communications'
      ];
      
      const response = await apiRequestWithFallback(
        primaryEndpoint, 
        fallbackEndpoints, 
        { method: 'post', data }
      );
      
      return normalizeResponse(response);
    } catch (error) {
      console.error('Error al enviar comunicación:', error);
      throw error;
    }
  },

  // Configuración UI - Usando el endpoint que funciona correctamente
  getUiConfig: async (route) => {
    try {
      console.log(`Solicitando configuración UI para ruta: ${route}`);
      
      const primaryEndpoint = '/api/templates/ui-config';
      const fallbackEndpoints = [
        '/api/v1/dashboard/ui-config',
        '/api/ui-config'
      ];
      
      const params = route ? { route } : undefined;
      const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints, { params });
      
      // Normalizar respuesta pero asegurar que siempre tenga la navegación correcta
      const normalizedResponse = normalizeResponse(response);
      
      // Asegurar que haya elementos de navegación consistentes para el dashboard
      if (normalizedResponse?.data?.data) {
        normalizedResponse.data.data = {
          ...normalizedResponse.data.data,
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
        };
      }
      
      return normalizedResponse;
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