/**
 * Servicio centralizado para las llamadas a la API
 * Este archivo proporciona funciones para todas las operaciones comunes con el backend
 */
import axios from 'axios';

// La configuración base de axios ya está establecida en App.jsx
// axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL

/**
 * Funciones relacionadas con la autenticación
 */
export const authAPI = {
  // Iniciar sesión
  login: async (email, password) => {
    return axios.post('/api/v1/auth/login', { email, password });
  },
  
  // Registrar usuario
  register: async (userData) => {
    return axios.post('/api/v1/auth/register', userData);
  },
  
  // Obtener información del usuario actual
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    return axios.get('/api/v1/users/getSingleUser');
  },
  
  // Cerrar sesión (en el cliente - no hay endpoint de logout)
  logout: () => {
    localStorage.removeItem('token');
  },
  
  // Solicitar restablecimiento de contraseña
  requestPasswordReset: async (email) => {
    return axios.post('/api/v1/auth/forgotpassword', { email });
  },
  
  // Restablecer contraseña
  resetPassword: async (token, password) => {
    return axios.post(`/api/v1/auth/resetpassword/${token}`, { password });
  }
};

/**
 * Funciones relacionadas con eventos
 */
export const eventAPI = {
  // Obtener todos los eventos
  getEvents: async () => {
    return axios.get('/api/v1/events');
  },
  
  // Obtener eventos del usuario
  getUserEvents: async () => {
    return axios.get('/api/v1/events/getuserEvent');
  },
  
  // Obtener un evento específico
  getEvent: async (eventId) => {
    return axios.get(`/api/v1/events/${eventId}`);
  },
  
  // Crear un evento nuevo
  createEvent: async (eventData) => {
    return axios.post('/api/v1/events/createEvent', eventData);
  },
  
  // Actualizar un evento
  updateEvent: async (eventId, eventData) => {
    return axios.put(`/api/v1/events/${eventId}`, eventData);
  },
  
  // Eliminar un evento
  deleteEvent: async (eventId) => {
    return axios.delete(`/api/v1/events/${eventId}`);
  }
};

/**
 * Funciones relacionadas con reservas
 */
export const bookingAPI = {
  // Obtener reservas del usuario
  getUserBookings: async () => {
    return axios.get('/api/v1/booking/getuserbookings');
  },
  
  // Crear una reserva
  createBooking: async (bookingData) => {
    return axios.post('/api/v1/booking/create', bookingData);
  },
  
  // Obtener una reserva específica
  getBooking: async (bookingId) => {
    return axios.get(`/api/v1/booking/${bookingId}`);
  }
};

/**
 * Funciones relacionadas con plantillas
 */
export const templateAPI = {
  // Obtener todas las plantillas
  getTemplates: async () => {
    return axios.get('/api/v1/templates');
  },
  
  // Obtener una plantilla específica
  getTemplate: async (templateId) => {
    return axios.get(`/api/v1/templates/${templateId}`);
  },
  
  // Crear una plantilla
  createTemplate: async (templateData) => {
    return axios.post('/api/v1/templates', templateData);
  },
  
  // Actualizar una plantilla
  updateTemplate: async (templateId, templateData) => {
    return axios.put(`/api/v1/templates/${templateId}`, templateData);
  }
};

/**
 * Funciones relacionadas con el dashboard y la configuración de UI
 */
export const dashboardAPI = {
  // Obtener configuración de UI para dashboards
  getUIConfig: async (route) => {
    try {
      return await axios.get('/api/v1/dashboard/ui-config', { params: { route } });
    } catch (error) {
      // Si falla, intentar con la ruta alternativa
      console.log(`Error al obtener configuración UI para ${route}:`, error.message);
      
      // Intentar ruta alternativa
      try {
        return await axios.get('/api/templates/ui-config');
      } catch (altError) {
        console.log('Error también en ruta alternativa:', altError.message);
        
        // Devolver una configuración por defecto como último recurso
        return {
          data: {
            success: true,
            data: {
              hideHeader: true,
              hideFooter: true,
              dashboardConfig: {
                navItems: [] // Puedes definir elementos de navegación por defecto aquí
              }
            }
          }
        };
      }
    }
  }
};

// Exportar un objeto API con todas las funciones
export default {
  auth: authAPI,
  events: eventAPI,
  bookings: bookingAPI,
  templates: templateAPI,
  dashboard: dashboardAPI
};