import './App.css'
import Layout from './ComponentsHome/Layout/Layout'
import React, { useEffect } from 'react'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import { CartProvider } from './CartContext'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './styles/theme'
import { getEvents } from './utils/apiHelper'

// Configuración global de axios
axios.defaults.baseURL = 'https://event-system-backend-production.up.railway.app';
axios.defaults.withCredentials = true;

// Log para verificar la URL base
console.log('Axios baseURL:', axios.defaults.baseURL);

// Añadir interceptor para logs de API y debugging
axios.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log('API Response OK:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.config?.url, error.message);
    console.error('Response Error Details:', error.response?.data || 'No response data');
    
    // Verificar si es un error 404 de un endpoint principal para proponer alternativa
    if (error.response?.status === 404) {
      const url = error.config?.url || '';
      // Intentar construir una alternativa automáticamente
      if (url.endsWith('/events')) {
        console.log('API 404 para /events, se sugerirá /events/getAllEvents');
        error.alternativeEndpoint = url + '/getAllEvents';
      }
    }
    
    return Promise.reject(error);
  }
);

// Configuraciones para peticiones
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptor para incluir automáticamente el token JWT en todas las peticiones
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Asegurar que las credenciales se envíen siempre
  config.withCredentials = true;
  
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
  return config;
}, error => {
  console.error('Request error interceptor:', error);
  return Promise.reject(error);
});

axios.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} from ${response.config.url}`, response);
    return response;
  },
  error => {
    console.error('Error completo:', error);
    
    if (error.response && error.response.status === 401) {
      // Token expirado o inválido
      console.error('Sesión expirada o token inválido');
      localStorage.removeItem('token');
      // No redirigimos automáticamente aquí para evitar ciclos de redirección
    }
    
    console.error(`API Error: ${error.response?.status || 'Network Error'} from ${error.config?.url || 'unknown'}`);
    
    // Si es un error de CORS, mostramos información adicional
    if (error.message.includes('Network Error') || error.message.includes('CORS')) {
      console.error('Posible error de CORS - verificar configuración de backend y origen de las peticiones');
    }
    
    return Promise.reject(error);
  }
);

const App = () => {
  useEffect(() => {
    console.log('App initialized with backend URL:', axios.defaults.baseURL);
    
    // Verificar conexión con el backend y la base de datos
    const verifyConnection = async () => {
      try {
        console.log('Verificando conexión con el backend...');
        
        // Usar el helper con todas las rutas alternativas para eventos
        try {
          console.log('Verificando conexión a eventos...');
          const eventsResponse = await getEvents('user');
          console.log('✅ Conexión exitosa a eventos:', eventsResponse.data);
        } catch (eventsError) {
          console.error('❌ Error al verificar conexión a eventos:', eventsError.message);
        }
        
        // Intentar obtener categorías
        try {
          console.log('Verificando conexión a categorías...');
          const categoriesResponse = await axios.get('/api/v1/categories');
          console.log('✅ Conexión exitosa a categorías:', categoriesResponse.data);
        } catch (catError) {
          console.error('❌ Error al obtener categorías:', catError.message);
          
          // Intentar con ruta alternativa para categorías
          try {
            const altCategoriesResponse = await axios.get('/api/categories');
            console.log('✅ Conexión exitosa a categorías (ruta alternativa):', altCategoriesResponse.data);
          } catch (altCatError) {
            console.error('❌ Error también con ruta alternativa para categorías:', altCatError.message);
          }
        }
        
      } catch (error) {
        console.error('❌ Error general al verificar conexión:', error.message);
        if (error.response) {
          console.error('Detalles:', {
            status: error.response.status,
            data: error.response.data
          });
        }
      }
    };
    
    verifyConnection();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserContextProvider>
        <CartProvider>
          <Layout/>
        </CartProvider>
      </UserContextProvider>
    </ThemeProvider>
  )
}

export default App;