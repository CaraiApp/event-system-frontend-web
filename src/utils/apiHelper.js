import axios from 'axios';

// Crear una instancia de axios con configuración avanzada
const axiosInstance = axios.create({
  withCredentials: true, // Importante para mantener las cookies de sesión
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 segundos de timeout para detectar problemas de conexión
});

// Interceptor para agregar el token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo avanzado de respuestas
axiosInstance.interceptors.response.use(
  (response) => {
    // Normalizar formato de respuesta para mayor consistencia
    if (response.data && !response.data.success && response.data.data) {
      // Si falta el flag success pero hay datos, asumimos éxito
      response.data = {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Operación exitosa'
      };
    }
    return response;
  },
  (error) => {
    // Manejar errores de autenticación (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirigir solo si estamos en una página que requiere autenticación
      const protectedPaths = ['/admin', '/organizer', '/account', '/wallet'];
      const currentPath = window.location.pathname;
      if (protectedPaths.some(path => currentPath.startsWith(path))) {
        window.location.href = '/login?redirect=' + currentPath;
      }
    }
    return Promise.reject(error);
  }
);

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

  // Determinar si estamos en producción o desarrollo
  const isProduction = import.meta.env.PROD;
  
  // En desarrollo, usar la URL base de la API que está en .env.development
  // En producción, usar la URL base desplegada
  const API_BASE_URL = isProduction 
    ? 'https://event-system-backend-main.vercel.app' 
    : import.meta.env.VITE_API_URL || '';
  
  console.log(`Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`API Base URL: ${API_BASE_URL || 'Using relative paths with proxy'}`);
  
  // Construir URL completa si tenemos una URL base configurada
  const buildFullUrl = (endpoint) => {
    // Si el endpoint ya es una URL completa, devolverla
    if (endpoint.startsWith('http')) return endpoint;
    
    // Si tenemos API_BASE_URL, construir URL completa
    if (API_BASE_URL) {
      return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    }
    
    // De lo contrario, devolver endpoint relativo (para el proxy en desarrollo)
    return endpoint;
  };

  // Log para debugging
  console.log(`Intentando ${method.toUpperCase()} a endpoint principal:`, primaryEndpoint);
  
  try {
    // Intentar con el endpoint principal
    const config = {
      url: buildFullUrl(primaryEndpoint),
      method,
      headers,
      ...(params && { params }),
      ...(data && { data }),
    };
    
    const response = await axiosInstance(config);
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
            url: buildFullUrl(endpoint),
            method,
            headers,
            ...(params && { params }),
            ...(data && { data }),
          };
          
          const fallbackResponse = await axiosInstance(config);
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
 * Normaliza la estructura de respuesta para manejar diferentes formatos de API
 * @param {object} response - Respuesta original de la API
 * @param {string} dataKey - Clave principal para extraer datos (ej: 'users', 'events')
 * @returns {object} - Respuesta normalizada
 */
export const normalizeResponse = (response, dataKey = null) => {
  if (!response) return null;
  
  // Si ya tiene el formato esperado
  if (response?.data?.success === true && response?.data?.data) {
    return response;
  }
  
  // Si tiene formato alternativo con statusCode
  if (response?.data?.statusCode && response?.data?.data) {
    return {
      data: {
        success: response.data.statusCode >= 200 && response.data.statusCode < 300,
        data: response.data.data,
        message: response.data.message || ''
      }
    };
  }
  
  // Si es un array directo o tiene datos pero no en la estructura esperada
  if (Array.isArray(response?.data) || (response?.data && !response?.data?.success)) {
    let normalizedData;
    
    // Si tenemos dataKey, formatear en estructura específica
    if (dataKey) {
      normalizedData = {
        [dataKey]: Array.isArray(response.data) ? response.data : 
                  (Array.isArray(response.data.data) ? response.data.data : [response.data]),
      };
      
      // Agregar metadatos si están disponibles
      if (response.data.totalCount) normalizedData.totalCount = response.data.totalCount;
      if (response.data.page) normalizedData.page = response.data.page;
      if (response.data.limit) normalizedData.limit = response.data.limit;
    } else {
      // Sin dataKey, solo envolver en estructura success
      normalizedData = Array.isArray(response.data) ? response.data : 
                      (response.data.data ? response.data.data : response.data);
    }
    
    return {
      data: {
        success: true,
        data: normalizedData,
        message: 'Datos obtenidos correctamente'
      }
    };
  }
  
  // Si no podemos identificar un formato válido
  return {
    data: {
      success: false,
      data: null,
      message: 'Formato de respuesta no reconocido'
    }
  };
};

/**
 * Helper específico para obtener eventos desde la API real
 * @param {string} userRole - Rol del usuario (organizer, admin, user)
 * @returns {Promise<object>} - Respuesta de la API con eventos
 */
export const getEvents = async (userRole, params = {}) => {
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
  
  try {
    const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints, { params });
    return normalizeResponse(response, 'events');
  } catch (error) {
    console.error('Error en getEvents:', error);
    // Devolver estructura de datos vacía pero correcta para evitar errores en componentes
    return {
      data: {
        success: true,
        data: {
          events: [],
          totalCount: 0,
          dataNotAvailable: true,
          error: error.message
        }
      }
    };
  }
};

/**
 * Helper específico para obtener usuarios desde la API real
 * @param {object} params - Parámetros de la petición (page, limit, role, etc.)
 * @returns {Promise<object>} - Respuesta de la API con usuarios
 */
export const getUsers = async (params = {}) => {
  const primaryEndpoint = '/api/v1/dashboard/admin/users';
  const fallbackEndpoints = [
    '/api/v1/users',
    '/api/v1/admin/users',
    '/api/users',
    '/api/admin/users'
  ];
  
  try {
    const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints, { params });
    return normalizeResponse(response, 'users');
  } catch (error) {
    console.error('Error en getUsers:', error);
    // Devolver estructura de datos vacía pero correcta
    return {
      data: {
        success: true,
        data: {
          users: [],
          totalCount: 0,
          currentPage: params.page || 1,
          totalPages: 0,
          dataNotAvailable: true,
          error: error.message
        }
      }
    };
  }
};

/**
 * Helper específico para obtener organizadores desde la API real
 * @param {object} params - Parámetros de la petición (page, limit, etc.)
 * @returns {Promise<object>} - Respuesta de la API con organizadores
 */
export const getOrganizers = async (params = {}) => {
  // Asegurarse de que el parámetro role esté presente
  const queryParams = { ...params, role: 'organizer' };
  
  const primaryEndpoint = '/api/v1/dashboard/admin/organizers';
  const fallbackEndpoints = [
    '/api/v1/dashboard/admin/users', // Intentar con endpoint de usuarios filtrando por rol
    '/api/v1/users',
    '/api/v1/admin/users',
    '/api/users',
    '/api/admin/users'
  ];
  
  try {
    const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints, { params: queryParams });
    return normalizeResponse(response, 'users');
  } catch (error) {
    console.error('Error en getOrganizers:', error);
    // Devolver estructura de datos vacía pero correcta
    return {
      data: {
        success: true,
        data: {
          users: [],
          totalCount: 0,
          currentPage: params.page || 1,
          totalPages: 0,
          dataNotAvailable: true,
          error: error.message
        }
      }
    };
  }
};

/**
 * Helper para obtener datos del dashboard de administrador
 */
export const getAdminDashboardOverview = async () => {
  const primaryEndpoint = '/api/v1/dashboard/admin/overview';
  const fallbackEndpoints = [
    '/api/v1/admin/overview',
    '/api/dashboard/admin/overview'
  ];
  
  try {
    const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints);
    return normalizeResponse(response);
  } catch (error) {
    console.error('Error en getAdminDashboardOverview:', error);
    // Devolver datos de fallback para que la UI no falle
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
          dataNotAvailable: true,
          error: error.message
        }
      }
    };
  }
};

/**
 * Helper para obtener categorías
 */
export const getCategories = async () => {
  const primaryEndpoint = '/api/v1/dashboard/admin/categories';
  const fallbackEndpoints = [
    '/api/v1/categories',
    '/api/categories'
  ];
  
  try {
    const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints);
    return normalizeResponse(response, 'categories');
  } catch (error) {
    console.error('Error en getCategories:', error);
    return {
      data: {
        success: true,
        data: {
          categories: [],
          dataNotAvailable: true,
          error: error.message
        }
      }
    };
  }
};

// Exportar la instancia de axios para uso general
export const api = axiosInstance;

export default {
  api,
  apiRequestWithFallback,
  normalizeResponse,
  getEvents,
  getUsers,
  getOrganizers,
  getAdminDashboardOverview,
  getCategories
};