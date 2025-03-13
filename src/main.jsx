import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// Console.log para depuración de variables de entorno
console.log('Environment variable VITE_REACT_APP_BACKEND_BASEURL:', import.meta.env.VITE_REACT_APP_BACKEND_BASEURL);

// Configura globalmente fetch para que sea más fácil usar
window.originalFetch = window.fetch;
window.fetch = async function(resource, options = {}) {
  // Si la URL es absoluta (comienza con http:// o https://) o algún tipo de URL especial, úsala directamente
  if (/^(https?:\/\/|\/\/|data:|blob:|file:)/.test(resource)) {
    return window.originalFetch(resource, options);
  }
  
  // Si es una URL relativa que comienza con /, conviértela a una URL absoluta con la base URL configurada
  const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
  if (resource.startsWith('/')) {
    const url = `${baseUrl}${resource}`;
    console.log(`Fetch: ${resource} -> ${url}`);
    return window.originalFetch(url, options);
  }
  
  // De lo contrario, es una URL relativa normal
  return window.originalFetch(resource, options);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
