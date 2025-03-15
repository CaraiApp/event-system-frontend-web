import axios from 'axios';

// Determinar si estamos en producción o desarrollo
const isProduction = import.meta.env.PROD;
// CORRECCIÓN: Usamos la URL correcta de Railway en producción
const API_BASE_URL = isProduction 
  ? 'https://event-system-backend-production.up.railway.app' 
  : import.meta.env.VITE_API_URL || '';

// Crear una instancia de axios con configuración avanzada
const axiosInstance = axios.create({
  // withCredentials solo cuando estamos en el mismo origen o dominios específicos
  withCredentials: false, // Por ahora deshabilitamos para evitar problemas CORS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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
  
  // Log de modo de funcionamiento
  console.log(`Modo CORS: withCredentials=${axiosInstance.defaults.withCredentials}, API URL=${API_BASE_URL || 'usando proxy'}`);
  
  // NOTA: No podemos establecer el header 'Origin' manualmente
  // El navegador lo hace automáticamente y rechaza los intentos de modificarlo
  if (isProduction) {
    // Podemos usar otras cabeceras permitidas
    axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    console.log(`Modo producción detectado, usando cabecera X-Requested-With`);
  }

  // Log para debugging
  console.log(`Intentando ${method.toUpperCase()} a endpoint principal:`, primaryEndpoint);
  
  try {
    // Intentar con el endpoint principal
    const config = {
      url: buildFullUrl(primaryEndpoint),
      method,
      headers: {
        ...headers,
        // Añadir cabeceras para ayudar con CORS
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
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
            headers: {
              ...headers,
              // Añadir cabeceras para ayudar con CORS
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
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
// Función para construir URL completa basada en el endpoint
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

export const getCategories = async () => {
  const primaryEndpoint = '/api/v1/dashboard/admin/categories';
  const fallbackEndpoints = [
    '/api/v1/categories',
    '/api/categories',
    '/api/categories/test' // Endpoint adicional para probar
  ];
  
  try {
    console.log('🔄 Intentando obtener categorías desde múltiples endpoints...');
    // Registrar cada intento para diagnóstico
    let errorLog = [];
    
    try {
      console.log(`API Request: GET ${primaryEndpoint}`, {});
      const response = await apiRequestWithFallback(primaryEndpoint, fallbackEndpoints);
      console.log('✅ Éxito al obtener categorías');
      return normalizeResponse(response, 'categories');
    } catch (error) {
      // Registrar el error para diagnóstico
      console.error(`❌ Error en getCategories: ${error.message}`);
      errorLog.push({ endpoint: primaryEndpoint, error: error.message });
      
      // Intentar manualmente cada endpoint para diagnosticar
      for (const endpoint of fallbackEndpoints) {
        try {
          console.log(`API Request: GET ${endpoint}`, {});
          // Intentar directamente con axios para ver qué está fallando
          // Obtener token para autenticación
          const token = localStorage.getItem('token');
          const headers = {};
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          headers['Accept'] = 'application/json';
          
          const testResponse = await axios.get(buildFullUrl(endpoint), { headers });
          console.log(`✅ Éxito con endpoint alternativo ${endpoint}`);
          return normalizeResponse(testResponse, 'categories');
        } catch (testError) {
          console.error(`❌ Error con endpoint alternativo ${endpoint}: ${testError.message}`);
          errorLog.push({ endpoint, error: testError.message });
          
          // Si hay un cuerpo de respuesta, registrarlo para diagnóstico
          if (testError.response) {
            console.error('Response Error Details:', testError.response.data);
          }
        }
      }
      
      // Si llegamos aquí, todos los intentos fallaron
      console.error('❌ Error en todos los intentos de conexión a categorías:', error.message);
      console.error('📋 Registro de errores de categorías:', errorLog);
      
      // Proporcionar datos mock para desarrollo cuando la API no está disponible
      console.log('Usando datos mock para categorías, ya que la API no está disponible');
      
      const mockCategories = [
        {
          id: 'cat-1',
          name: 'Conciertos',
          description: 'Eventos musicales y conciertos en vivo',
          icon: 'music_note',
          color: '#3498db',
          imageUrl: 'https://via.placeholder.com/300x200?text=Conciertos',
          featured: true,
          eventCount: 5
        },
        {
          id: 'cat-2',
          name: 'Deportes',
          description: 'Eventos deportivos y competiciones',
          icon: 'sports_soccer',
          color: '#2ecc71',
          imageUrl: 'https://via.placeholder.com/300x200?text=Deportes',
          featured: true,
          eventCount: 3
        },
        {
          id: 'cat-3',
          name: 'Teatro',
          description: 'Obras de teatro y espectáculos',
          icon: 'theater_comedy',
          color: '#e74c3c',
          imageUrl: 'https://via.placeholder.com/300x200?text=Teatro',
          featured: false,
          eventCount: 2
        }
      ];
      
      return {
        data: {
          success: true,
          data: {
            categories: mockCategories,
            totalCount: mockCategories.length
          }
        }
      };
    }
  } catch (finalError) {
    console.error('Error crítico en getCategories:', finalError);
    // Asegurar que siempre devolvemos una estructura válida
    return {
      data: {
        success: true,
        data: {
          categories: [],
          totalCount: 0,
          dataNotAvailable: true,
          error: finalError.message
        }
      }
    };
  }
};

// Exportar la instancia de axios para uso general
export const api = axiosInstance;

/**
 * Función específica para probar la conectividad CORS
 * @returns {Promise<object>} - Resultado de la prueba CORS
 */
export const testCorsConnection = async () => {
  try {
    console.log('Realizando prueba de conexión CORS...');
    
    // Intentar con diferentes endpoints para probar CORS
    const endpoints = [
      '/api/v1/dashboard/ui-config',
      '/api/templates/ui-config',
      '/api/v1/health',
      '/'
    ];
    
    // Probar cada endpoint en secuencia
    for (const endpoint of endpoints) {
      try {
        // CORRECCIÓN: Usamos la URL correcta de Railway para la prueba CORS
        const fullUrl = `https://event-system-backend-production.up.railway.app${endpoint}`;
        console.log(`Probando CORS con: ${fullUrl}`);
        
        // Configurar la solicitud para mostrar mejor los problemas CORS
        const response = await axios({
          url: fullUrl,
          method: 'GET',
          withCredentials: false, // Primero sin credenciales para mayor compatibilidad
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Origin': window.location.origin,
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        console.log(`✅ Endpoint ${endpoint} respondió sin problemas CORS:`, response.status);
        return {
          success: true,
          endpoint,
          status: response.status,
          data: response.data,
          cors: {
            allowOrigin: response.headers['access-control-allow-origin'],
            allowCredentials: response.headers['access-control-allow-credentials'],
            allowMethods: response.headers['access-control-allow-methods'],
          }
        };
      } catch (error) {
        console.error(`❌ Error en prueba CORS con ${endpoint}:`, error.message);
        
        // Continuar con el siguiente endpoint
        continue;
      }
    }
    
    // Si llegamos aquí, todos los intentos fallaron
    throw new Error('Todos los endpoints fallaron la prueba CORS');
  } catch (error) {
    console.error('❌ Error general en prueba CORS:', error);
    return {
      success: false,
      error: error.message,
      cors: {
        info: 'Fallo al establecer conexión CORS con el backend',
        suggestion: 'Verifica la configuración CORS en el backend y frontend',
        browserError: error.name === 'Error' ? 'Posible error CORS bloqueado por el navegador' : error.name
      }
    };
  }
};

export default {
  api,
  apiRequestWithFallback,
  normalizeResponse,
  getEvents,
  getUsers,
  getOrganizers,
  getAdminDashboardOverview,
  getCategories,
  testCorsConnection
};