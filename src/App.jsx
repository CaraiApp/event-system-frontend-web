import './App.css'
import Layout from './ComponentsHome/Layout/Layout'
import React, { useEffect } from 'react'
import axios from 'axios'
import { UserContextProvider } from './UserContext'

// Configuración global de axios
axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'https://event-system-backend-production.up.railway.app';
axios.defaults.withCredentials = true;

// Interceptor para logs (opcional pero útil para debuggear)
axios.interceptors.request.use(config => {
  console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

axios.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  error => {
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
