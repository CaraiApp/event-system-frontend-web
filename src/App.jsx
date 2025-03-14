import './App.css'
import Layout from './ComponentsHome/Layout/Layout'
import React, { useEffect } from 'react'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import { CartProvider } from './CartContext'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './styles/theme'

// Configuración global de axios
axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://event-system-backend-production.up.railway.app';
axios.defaults.withCredentials = true;

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