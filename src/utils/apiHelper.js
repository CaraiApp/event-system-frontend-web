import axios from 'axios';

/**
 * Helper para realizar peticiones API con rutas alternativas en caso de error
 * @param {string} primaryEndpoint - La ruta API principal a intentar
 * @param {string[]} fallbackEndpoints - Rutas alternativas a intentar si la principal falla
 * @param {object} options - Opciones adicionales (method, data, params, etc.)
 * @returns {Promise<object>} - Respuesta de la API
 */
export const apiRequestWithFallback = async (primaryEndpoint, fallbackEndpoints = [], options = {}) => {
  const {
    method = 'get',
    data = null,
    params = null,
    headers = {},
  } = options;

  // Log para debugging
  console.log(`Intentando ${method.toUpperCase()} a endpoint principal:`, primaryEndpoint);
  
  try {
    // Intentar con el endpoint principal
    const config = {
      url: primaryEndpoint,
      method,
      headers,
      ...(params && { params }),
      ...(data && { data }),
    };
    
    const response = await axios(config);
    console.log(`✅ Éxito con endpoint principal ${primaryEndpoint}:`, response.status);
    return response;
  } catch (error) {
    console.error(`❌ Error con endpoint principal ${primaryEndpoint}:`, error.message);
    
    // Si hay rutas alternativas, intentar cada una
    if (fallbackEndpoints && fallbackEndpoints.length > 0) {
      console.log(`Intentando ${fallbackEndpoints.length} endpoints alternativos`);
      
      // Intentar cada ruta alternativa en secuencia
      for (const endpoint of fallbackEndpoints) {
        try {
          console.log(`Intentando endpoint alternativo: ${endpoint}`);
          
          const config = {
            url: endpoint,
            method,
            headers,
            ...(params && { params }),
            ...(data && { data }),
          };
          
          const fallbackResponse = await axios(config);
          console.log(`✅ Éxito con endpoint alternativo ${endpoint}:`, fallbackResponse.status);
          return fallbackResponse;
        } catch (fallbackError) {
          console.error(`❌ Error con endpoint alternativo ${endpoint}:`, fallbackError.message);
          // Continuar con el siguiente endpoint si hay más
        }
      }
    }
    
    // Si llegamos aquí, todos los intentos fallaron
    console.error('Todos los endpoints fallaron. Último error:', error);
    throw error;
  }
};

/**
 * Helper específico para obtener eventos con múltiples alternativas
 * @param {string} userRole - Rol del usuario (organizer, admin, user)
 * @returns {Promise<object>} - Respuesta de la API con eventos
 */
export const getEvents = async (userRole) => {
  const endpoints = userRole === 'organizer'
    ? ['/api/v1/events/getuserEvent'] // Para organizadores
    : [
        '/api/v1/events/getAllEvents', // Principal para usuarios y admin
        '/api/v1/events',             // Alternativa 1
        '/api/events',                // Alternativa 2
        '/events'                     // Alternativa 3
      ];
  
  // Obtener el primer endpoint como principal y el resto como alternativas
  const primaryEndpoint = endpoints[0];
  const fallbackEndpoints = endpoints.slice(1);
  
  return apiRequestWithFallback(primaryEndpoint, fallbackEndpoints);
};

export default {
  apiRequestWithFallback,
  getEvents
};