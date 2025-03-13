import './App.css'
import Layout from './ComponentsHome/Layout/Layout'
import React, { useEffect } from 'react'
import axios from 'axios'
import { UserContextProvider } from './UserContext'

// Configuración global de axios
axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://event-system-backend-production.up.railway.app';
axios.defaults.withCredentials = true;

// Interceptor para incluir automáticamente el token JWT en todas las peticiones
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

axios.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Token expirado o inválido
      console.error('Sesión expirada o token inválido');
      localStorage.removeItem('token');
      // No redirigimos automáticamente aquí para evitar ciclos de redirección
    }
    console.error(`API Error: ${error.response?.status || 'Network Error'} from ${error.config?.url || 'unknown'}`);
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
