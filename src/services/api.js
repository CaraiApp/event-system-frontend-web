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
    try {
      console.log('📝 Intentando obtener eventos del usuario...');
      const token = localStorage.getItem('token');
      console.log('📝 Token presente:', !!token);
      console.log('📝 Rol del usuario:', localStorage.getItem('role'));
      
      const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
      console.log('📝 URL completa:', `${API_BASE_URL}/api/v1/events/getuserEvent`);
      
      const response = await axios.get('/api/v1/events/getuserEvent');
      console.log('📝 Respuesta exitosa:', response);
      return response;
    } catch (error) {
      console.error('📝 Error al obtener eventos del usuario:', error.message);
      if (error.response) {
        console.error('📝 Datos de respuesta de error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw error;
    }
  },
  
  // Obtener un evento específico
  getEvent: async (eventId) => {
    return axios.get(`/api/v1/events/getsingleEvent?id=${eventId}`);
  },
  
  // Crear un evento nuevo
  createEvent: async (eventData) => {
    return axios.post('/api/v1/events/createEvent', eventData);
  },
  
  // Actualizar un evento
  updateEvent: async (eventId, eventData) => {
    // Obtener primero los datos completos del evento
    try {
      const eventResponse = await axios.get(`/api/v1/events/getsingleEvent?id=${eventId}`);
      const currentEvent = eventResponse.data.data;
      
      // Combinar datos actuales con las actualizaciones
      const updatedData = {
        ...currentEvent,
        ...eventData,
        id: eventId
      };
      
      // Eliminar campos que no deberían enviarse
      delete updatedData._id;
      delete updatedData.__v;
      delete updatedData.createdAt;
      delete updatedData.updatedAt;
      delete updatedData.user_id;
      
      return axios.put('/api/v1/events/updateEvent', updatedData);
    } catch (error) {
      console.error('Error al obtener datos del evento para actualización:', error);
      throw error;
    }
  },
  
  // Eliminar un evento
  deleteEvent: async (eventId) => {
    return axios.delete(`/api/v1/events/${eventId}`);
  },
  
  // Cancelar un evento
  cancelEvent: async (eventId) => {
    // Implementación directa para evitar referencia circular
    try {
      const eventResponse = await axios.get(`/api/v1/events/getsingleEvent?id=${eventId}`);
      const currentEvent = eventResponse.data.data;
      
      // Mantener todos los campos y modificar solo los necesarios
      const updatedData = {
        ...currentEvent,
        id: eventId,
        status: 'cancelled',
        published: false
      };
      
      // Eliminar campos que no deberían enviarse
      delete updatedData._id;
      delete updatedData.__v;
      delete updatedData.createdAt;
      delete updatedData.updatedAt;
      delete updatedData.user_id;
      
      return axios.put('/api/v1/events/updateEvent', updatedData);
    } catch (error) {
      console.error('Error al cancelar evento:', error);
      throw error;
    }
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
  
  // Crear una reserva para evento gratuito
  createFreeBooking: async (bookingData) => {
    return axios.post('/api/v1/booking/free', bookingData);
  },
  
  // Obtener una reserva específica
  getBooking: async (bookingId) => {
    return axios.get(`/api/v1/booking/${bookingId}`);
  },
  
  // Obtener reservas de un evento específico
  getEventBookings: async (eventId) => {
    return axios.get(`/api/v1/booking/geteventbooking?event_id=${eventId}`);
  },
  
  // Verificar si un evento tiene reservas (útil antes de eliminar)
  hasEventBookings: async (eventId) => {
    try {
      const response = await axios.get(`/api/v1/booking/geteventbooking?event_id=${eventId}`);
      return response.data && response.data.data && response.data.data.length > 0;
    } catch (error) {
      console.error('Error checking event bookings:', error);
      return false; // En caso de error, asumimos que no hay reservas
    }
  },
  
  // RESERVAS TEMPORALES (CARRITO DE COMPRA)
  // Crear/actualizar reserva temporal de asientos (bloqueo de 7 minutos)
  createTempBooking: async (eventId, seatNumbers, sessionId = null) => {
    const data = {
      event_id: eventId,
      seatNumbers,
      sessionId
    };
    return axios.post('/api/v1/temp-bookings/create', data);
  },
  
  // Obtener asientos temporalmente reservados para un evento
  getTempBookedSeats: async (eventId) => {
    return axios.get(`/api/v1/temp-bookings/get?event_id=${eventId}`);
  },
  
  // Liberar reserva temporal
  releaseTempBooking: async (eventId, sessionId) => {
    return axios.post('/api/v1/temp-bookings/release', { 
      event_id: eventId, 
      sessionId 
    });
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