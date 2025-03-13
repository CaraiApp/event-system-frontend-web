import './App.css'
import Layout from './ComponentsHome/Layout/Layout'
import React, { useEffect } from 'react'
import axios from 'axios'
import { UserContextProvider } from './UserContext'

// Configuración global de axios - Usando un proxy CORS público como solución final
axios.defaults.baseURL = 'https://corsproxy.io/?' + encodeURIComponent(
  import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://event-system-backend-production.up.railway.app'
);
axios.defaults.withCredentials = false; // Debe ser false cuando se usa proxy CORS
axios.defaults.timeout = 15000; // Aumentado a 15 segundos

// Configuraciones para peticiones
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Configurar para que acepte certificados autofirmados en desarrollo
axios.defaults.httpsAgent = {
  rejectUnauthorized: false
};

// Interceptor para incluir automáticamente el token JWT en todas las peticiones
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // No usar withCredentials cuando se utiliza un proxy CORS
  // config.withCredentials = true;
  
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
    
    // Implementar sistema de reintento con varios servicios de proxy CORS
    const config = error.config;
    
    // Si es un error de red y no se ha intentado reenviar ya
    if (error.message === 'Network Error' && !config._retry) {
      config._retry = true;
      console.log('Reintentando petición a través de proxy alternativo...');
      
      // Pequeño retraso antes de reintentar
      return new Promise(resolve => {
        setTimeout(() => {
          // Usar otro servicio de proxy CORS (cors-anywhere como fallback)
          const apiURL = config.url || '';
          const backendURL = 'https://event-system-backend-production.up.railway.app';
          const fullURL = apiURL.startsWith('/') ? backendURL + apiURL : apiURL;
          
          // Crea una nueva URL utilizando el proxy alternativo
          config.url = 'https://cors-anywhere.herokuapp.com/' + encodeURIComponent(fullURL);
          config.baseURL = '';
          config.withCredentials = false;
          
          resolve(axios(config));
        }, 1000);
      });
    }
    
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
  }, []);

  return (
    <UserContextProvider>
      <Layout/>
    </UserContextProvider>
  )
}

export default App;
