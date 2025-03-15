import axios from 'axios';

// Crear una instancia de axios con la configuración base
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
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
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  
  // Dashboard Overview
  getDashboardOverview: () => api.get('/dashboard/admin/overview'),
  
  // Usuarios
  getUsers: (params) => api.get('/dashboard/admin/users', { params }),
  getOrganizers: (params) => api.get('/dashboard/admin/organizers', { params }),
  updateUser: (userId, userData) => api.patch(`/dashboard/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/dashboard/admin/users/${userId}`),
  
  // Eventos
  getEvents: (params) => api.get('/dashboard/admin/events', { params }),
  updateEventStatus: (eventId, status) => api.patch(`/dashboard/admin/events/${eventId}/status`, { status }),
  toggleEventFeatured: (eventId, featured) => api.patch(`/dashboard/admin/events/${eventId}/featured`, { featured }),
  deleteEvent: (eventId) => api.delete(`/dashboard/admin/events/${eventId}`),
  
  // Categorías
  getCategories: () => api.get('/dashboard/admin/categories'),
  
  // Informes
  getReports: (params) => api.get('/dashboard/admin/reports', { params }),
  getActivityLog: (params) => api.get('/dashboard/admin/activity-log', { params }),
  getSystemPerformance: () => api.get('/dashboard/admin/performance'),
  
  // Configuración del sistema
  getSystemSettings: () => api.get('/dashboard/admin/settings'),
  updateSystemSettings: (settings) => api.put('/dashboard/admin/settings', settings),
  
  // Configuración de correo electrónico
  getEmailSettings: () => api.get('/dashboard/admin/settings/email'),
  updateEmailSettings: (settings) => api.put('/dashboard/admin/settings/email', settings),
  sendTestEmail: (emailData) => api.post('/dashboard/admin/send-test-email', emailData),
  
  // Comunicaciones
  getCommunications: (params) => api.get('/dashboard/admin/communications', { params }),
  sendCommunication: (data) => api.post('/dashboard/admin/communications', data),

  // Configuración UI
  getUiConfig: (route) => api.get('/dashboard/ui-config', { params: { route } }),
};

export default adminApi;