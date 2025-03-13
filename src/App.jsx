import './App.css'
import Layout from './ComponentsHome/Layout/Layout'
import React, { useEffect } from 'react'
import axios from 'axios'
import { UserContextProvider } from './UserContext'

// Configuración global de axios
axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://event-system-backend-production.up.railway.app';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000; // Timeout de 10 segundos

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
    
    // Implementar reintento para errores de red
    const config = error.config;
    
    // Si es un error de red y no se ha intentado reenviar ya
    if (error.message === 'Network Error' && !config._retry) {
      config._retry = true;
      console.log('Reintentando petición después de error de red...');
      
      // Pequeño retraso antes de reintentar
      return new Promise(resolve => {
        setTimeout(() => {
          // Modificar el withCredentials para ver si así funciona
          config.withCredentials = false;
          
          // También podemos probar con la URL absoluta
          if (config.url?.startsWith('/')) {
            const backendUrl = 'https://event-system-backend-production.up.railway.app';
            config.url = backendUrl + config.url;
            config.baseURL = '';
          }
          
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
