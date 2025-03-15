import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Divider,
  Chip,
  IconButton,
  TextField,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Badge,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import BugReportIcon from '@mui/icons-material/BugReport';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { UserContext } from '../../UserContext';

// Funciones de utilidad
const formatJSON = (json) => {
  try {
    return JSON.stringify(json, null, 2);
  } catch (e) {
    return String(json);
  }
};

// LogCollector que captura console.log, error, warn
class LogCollector {
  constructor(onLogUpdate) {
    this.logs = [];
    this.onLogUpdate = onLogUpdate;
    this.originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };

    this.setupInterceptors();
  }

  addLog(type, args) {
    const log = {
      type,
      timestamp: new Date().toISOString(),
      message: args.map(arg => {
        if (arg instanceof Error) {
          return `${arg.name}: ${arg.message}\n${arg.stack || ''}`;
        } else if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' '),
      raw: args
    };
    
    this.logs.push(log);
    if (this.logs.length > 1000) this.logs.shift(); // Limitar a 1000 registros
    this.onLogUpdate(this.logs);
  }

  setupInterceptors() {
    console.log = (...args) => {
      this.addLog('log', args);
      this.originalConsole.log(...args);
    };
    
    console.error = (...args) => {
      this.addLog('error', args);
      this.originalConsole.error(...args);
    };
    
    console.warn = (...args) => {
      this.addLog('warn', args);
      this.originalConsole.warn(...args);
    };
    
    console.info = (...args) => {
      this.addLog('info', args);
      this.originalConsole.info(...args);
    };
  }

  restoreConsole() {
    console.log = this.originalConsole.log;
    console.error = this.originalConsole.error;
    console.warn = this.originalConsole.warn;
    console.info = this.originalConsole.info;
  }

  clear() {
    this.logs = [];
    this.onLogUpdate(this.logs);
  }
}

// Componente para monitorear respuestas HTTP
const HttpMonitor = ({ onNewRequest }) => {
  useEffect(() => {
    // Guarda referencia al original para restaurarlo
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    
    // Sobrescribe el método open
    XMLHttpRequest.prototype.open = function(method, url, async) {
      this._requestData = {
        method,
        url,
        async,
        startTime: Date.now(),
        requestHeaders: {}
      };
      originalOpen.apply(this, arguments);
    };
    
    // Sobrescribe el método send
    XMLHttpRequest.prototype.send = function(data) {
      if (this._requestData) {
        this._requestData.requestBody = data;
        
        // Capturar respuesta
        this.addEventListener('load', function() {
          const responseData = {
            ...this._requestData,
            status: this.status,
            statusText: this.statusText,
            duration: Date.now() - this._requestData.startTime,
            responseHeaders: this.getAllResponseHeaders(),
            responseType: this.responseType,
            response: this.responseText || this.response
          };
          
          onNewRequest(responseData);
        });
        
        // Capturar errores
        this.addEventListener('error', function() {
          const errorData = {
            ...this._requestData,
            error: true,
            status: 0,
            statusText: 'Error de red',
            duration: Date.now() - this._requestData.startTime
          };
          
          onNewRequest(errorData);
        });
      }
      
      originalSend.apply(this, arguments);
    };
    
    // Interceptar Fetch API
    const originalFetch = window.fetch;
    window.fetch = async function(resource, config = {}) {
      const startTime = Date.now();
      const url = typeof resource === 'string' ? resource : resource.url;
      const method = config.method || (typeof resource === 'string' ? 'GET' : resource.method) || 'GET';
      
      const requestData = {
        method,
        url,
        startTime,
        requestHeaders: config.headers || {},
        requestBody: config.body
      };
      
      try {
        const response = await originalFetch.apply(this, arguments);
        const clonedResponse = response.clone();
        
        try {
          const responseBody = await clonedResponse.text();
          
          const responseData = {
            ...requestData,
            status: response.status,
            statusText: response.statusText,
            duration: Date.now() - startTime,
            responseHeaders: Object.fromEntries([...response.headers.entries()]),
            responseBody
          };
          
          onNewRequest(responseData);
        } catch (e) {
          // Si no podemos acceder al cuerpo (ej: stream)
          const responseData = {
            ...requestData,
            status: response.status,
            statusText: response.statusText,
            duration: Date.now() - startTime,
            responseHeaders: Object.fromEntries([...response.headers.entries()]),
            responseBody: '[No se pudo leer el cuerpo de la respuesta]'
          };
          
          onNewRequest(responseData);
        }
        
        return response;
      } catch (error) {
        const errorData = {
          ...requestData,
          error: true,
          status: 0,
          statusText: error.message || 'Error de red',
          duration: Date.now() - startTime
        };
        
        onNewRequest(errorData);
        throw error;
      }
    };
    
    // Interceptar Axios
    const axiosInterceptor = axios.interceptors.response.use(
      (response) => {
        // No necesitamos hacer nada aquí ya que fetch/XHR ya lo capturan
        return response;
      },
      (error) => {
        // Solo necesitamos capturar los errores que no están manejados por fetch/XHR
        if (error.isAxiosError && !error.request) {
          const errorData = {
            method: error.config?.method?.toUpperCase() || 'UNKNOWN',
            url: error.config?.url || 'UNKNOWN',
            startTime: Date.now(),
            error: true,
            status: 0,
            statusText: error.message || 'Error de configuración de Axios',
            duration: 0
          };
          
          onNewRequest(errorData);
        }
        return Promise.reject(error);
      }
    );
    
    // Cleanup
    return () => {
      XMLHttpRequest.prototype.open = originalOpen;
      XMLHttpRequest.prototype.send = originalSend;
      window.fetch = originalFetch;
      axios.interceptors.response.eject(axiosInterceptor);
    };
  }, [onNewRequest]);
  
  return null;
};

// Función para diagnosticar problemas comunes
const diagnosticTools = {
  checkCORS: (request) => {
    if (request.error || request.status === 0) {
      return {
        issue: 'Posible error CORS',
        description: 'La solicitud fue bloqueada debido a restricciones de CORS',
        severity: 'error',
        fix: 'Verifica la configuración CORS en el backend. Debe incluir el origen correcto.'
      };
    }
    
    if (request.status === 403) {
      return {
        issue: 'Acceso prohibido',
        description: 'El servidor rechazó la solicitud por falta de permisos',
        severity: 'error',
        fix: 'Verifica los headers de autorización y que el token JWT sea válido.'
      };
    }
    
    return null;
  },
  
  checkAuth: (request) => {
    if (request.status === 401) {
      return {
        issue: 'No autenticado',
        description: 'La solicitud requiere autenticación pero el token no es válido o ha expirado',
        severity: 'error',
        fix: 'Intenta cerrar sesión y volver a iniciar sesión para obtener un nuevo token.'
      };
    }
    return null;
  },
  
  checkNetwork: (request) => {
    if (request.duration > 5000) {
      return {
        issue: 'Solicitud lenta',
        description: `La solicitud tomó ${request.duration}ms en completarse`,
        severity: 'warning',
        fix: 'Verifica la conexión a internet y la respuesta del servidor.'
      };
    }
    return null;
  },
  
  checkContentType: (request) => {
    const contentType = request.responseHeaders && (
      request.responseHeaders['content-type'] || 
      request.responseHeaders['Content-Type']
    );
    
    if (request.status >= 200 && request.status < 300 && contentType && !contentType.includes('application/json')) {
      if (contentType.includes('text/html')) {
        return {
          issue: 'Respuesta HTML en lugar de JSON',
          description: 'El servidor devolvió HTML cuando se esperaba JSON',
          severity: 'warning',
          fix: 'Verifica el endpoint de la API. Podrías estar accediendo a una página web en lugar de una API.'
        };
      }
    }
    return null;
  },
  
  runAllDiagnostics: (request) => {
    const results = [
      diagnosticTools.checkCORS(request),
      diagnosticTools.checkAuth(request),
      diagnosticTools.checkNetwork(request),
      diagnosticTools.checkContentType(request)
    ].filter(Boolean);
    
    return results;
  }
};

// Componente de diagnóstico del backend
const BackendDiagnostic = ({ apiURL }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const runDiagnostic = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prueba el endpoint de salud primero
      const healthEndpoint = `${apiURL}/health`;
      let healthStatus = null;
      
      try {
        const healthResponse = await axios.get(healthEndpoint, { timeout: 5000 });
        healthStatus = {
          status: healthResponse.status,
          data: healthResponse.data,
          ok: healthResponse.status >= 200 && healthResponse.status < 300
        };
      } catch (err) {
        healthStatus = {
          status: err.response?.status || 0,
          error: err.message,
          ok: false
        };
      }
      
      // Intenta obtener información detallada del sistema (si está disponible)
      let systemInfo = null;
      try {
        const systemResponse = await axios.get(`${apiURL}/health/detailed`, { 
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          } 
        });
        systemInfo = systemResponse.data;
      } catch (err) {
        // No hacer nada si este endpoint no está disponible
      }
      
      // Realiza pruebas de CORS
      let corsStatus = null;
      try {
        const corsResponse = await axios.options(apiURL, { timeout: 3000 });
        const corsHeaders = {
          'Access-Control-Allow-Origin': corsResponse.headers['access-control-allow-origin'],
          'Access-Control-Allow-Methods': corsResponse.headers['access-control-allow-methods'],
          'Access-Control-Allow-Headers': corsResponse.headers['access-control-allow-headers'],
          'Access-Control-Allow-Credentials': corsResponse.headers['access-control-allow-credentials']
        };
        
        corsStatus = {
          status: corsResponse.status,
          headers: corsHeaders,
          ok: !!corsResponse.headers['access-control-allow-origin']
        };
      } catch (err) {
        corsStatus = {
          status: err.response?.status || 0,
          error: err.message,
          ok: false
        };
      }
      
      // Realiza una prueba de autenticación básica
      let authStatus = null;
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const authResponse = await axios.get(`${apiURL}/api/v1/users/getSingleUser`, {
            timeout: 5000,
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          authStatus = {
            status: authResponse.status,
            data: authResponse.data,
            ok: authResponse.status === 200
          };
        } catch (err) {
          authStatus = {
            status: err.response?.status || 0,
            error: err.message,
            ok: false
          };
        }
      } else {
        authStatus = {
          status: 'N/A',
          error: 'No hay token disponible',
          ok: false
        };
      }
      
      // Establece los resultados
      setResults({
        timestamp: new Date().toISOString(),
        baseURL: apiURL,
        health: healthStatus,
        systemInfo,
        cors: corsStatus,
        auth: authStatus,
        recommendations: []
      });
      
      // Genera recomendaciones basadas en los resultados
      const recommendations = [];
      
      if (!healthStatus.ok) {
        recommendations.push({
          severity: 'error',
          message: 'El backend no está respondiendo correctamente. Verifica que el servidor esté en funcionamiento.',
          details: `Status: ${healthStatus.status}, Error: ${healthStatus.error || 'Desconocido'}`
        });
      }
      
      if (!corsStatus.ok) {
        recommendations.push({
          severity: 'error',
          message: 'Configuración CORS incorrecta. El backend no está permitiendo solicitudes desde este origen.',
          details: 'Verifica la configuración CORS en los archivos cors.js y vercel.json del backend.'
        });
      }
      
      if (token && !authStatus.ok) {
        if (authStatus.status === 401) {
          recommendations.push({
            severity: 'warning',
            message: 'El token de autenticación ha expirado o no es válido.',
            details: 'Intenta cerrar sesión y volver a iniciar sesión.'
          });
        } else {
          recommendations.push({
            severity: 'error',
            message: 'Hay un problema con la autenticación.',
            details: `Status: ${authStatus.status}, Error: ${authStatus.error || 'Desconocido'}`
          });
        }
      }
      
      setResults(prev => ({
        ...prev,
        recommendations
      }));
      
    } catch (err) {
      setError(`Error al ejecutar el diagnóstico: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1">Diagnóstico del Backend</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={runDiagnostic}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
        >
          {loading ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {results && (
        <Box sx={{ mt: 2 }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Resumen del Diagnóstico</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" gutterBottom>
                Estado General:
                <Chip 
                  label={results.health.ok ? 'OK' : 'Problemas Detectados'} 
                  color={results.health.ok ? 'success' : 'error'}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>URL Base:</strong> {results.baseURL}
                </Typography>
                <Typography variant="body2">
                  <strong>Timestamp:</strong> {new Date(results.timestamp).toLocaleString()}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Comprobaciones:
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" alignItems="center">
                  {results.health.ok ? (
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  ) : (
                    <ErrorIcon color="error" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body2">
                    Salud del Servidor: {results.health.ok ? 'Operativo' : `Error (${results.health.status})`}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center">
                  {results.cors.ok ? (
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  ) : (
                    <ErrorIcon color="error" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body2">
                    Configuración CORS: {results.cors.ok ? 'Correcta' : 'Incorrecta'}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center">
                  {results.auth.ok ? (
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  ) : (
                    <WarningIcon color="warning" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body2">
                    Autenticación: {results.auth.ok ? 'Válida' : `Problema (${results.auth.status})`}
                  </Typography>
                </Box>
              </Box>
              
              {results.recommendations.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Recomendaciones:
                  </Typography>
                  
                  {results.recommendations.map((rec, idx) => (
                    <Alert severity={rec.severity} key={idx} sx={{ mb: 1 }}>
                      <Typography variant="body2">{rec.message}</Typography>
                      {rec.details && (
                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                          {rec.details}
                        </Typography>
                      )}
                    </Alert>
                  ))}
                </>
              )}
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Detalles Técnicos</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
                <pre>{formatJSON(results)}</pre>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

// Componente principal mejorado
const DebugPanel = () => {
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [customEndpoints, setCustomEndpoints] = useState([]);
  const [apiResponses, setApiResponses] = useState({});
  const [axiosConfig, setAxiosConfig] = useState({});
  const [networkInfo, setNetworkInfo] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [httpRequests, setHttpRequests] = useState([]);
  const [errorDiagnostics, setErrorDiagnostics] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    error: true,
    warning: true,
    info: true,
    log: false,
    apiOnly: false,
    search: ''
  });
  const [newEndpoint, setNewEndpoint] = useState({
    name: '',
    url: '',
    method: 'GET',
    requiresAuth: true
  });
  const [showAddEndpoint, setShowAddEndpoint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendURL, setBackendURL] = useState('');
  const logCollectorRef = useRef(null);
  
  // Verificar si el usuario es admin
  const isAdmin = user && (user.role === 'admin' || user.isAdmin);
  
  // Si no es admin, no mostrar nada
  if (!isAdmin) {
    return null;
  }
  
  useEffect(() => {
    // Inicializar el colector de logs
    if (!logCollectorRef.current) {
      logCollectorRef.current = new LogCollector(logs => {
        setLogs(logs);
      });
    }
    
    // Configuración actual de axios
    setAxiosConfig({
      baseURL: axios.defaults.baseURL,
      withCredentials: axios.defaults.withCredentials,
      headers: axios.defaults.headers.common
    });
    
    // Endpoints predefinidos
    const defaultEndpoints = [
      { name: 'Health Check', url: '/health', method: 'GET' },
      { name: 'Health Check (Detailed)', url: '/health/detailed', method: 'GET', requiresAuth: true },
      { name: 'Get Events', url: '/api/v1/events', method: 'GET' },
      { name: 'User Profile', url: '/api/v1/users/getSingleUser', method: 'GET', requiresAuth: true },
      { name: 'Templates', url: '/api/v1/templates', method: 'GET' }
    ];
    
    // Cargar endpoints guardados
    const savedEndpoints = localStorage.getItem('debugPanelEndpoints');
    if (savedEndpoints) {
      try {
        setCustomEndpoints(JSON.parse(savedEndpoints));
      } catch (e) {
        console.error('Error al cargar endpoints guardados:', e);
        setCustomEndpoints(defaultEndpoints);
      }
    } else {
      setCustomEndpoints(defaultEndpoints);
    }
    
    // Obtener información de la red
    setNetworkInfo({
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack
    });
    
    // Obtener URL del backend
    const apiUrl = process.env.REACT_APP_API_URL || 
                   process.env.VITE_API_URL || 
                   axios.defaults.baseURL || 
                   'https://v2-backend.entradasmelilla.com';
    setBackendURL(apiUrl);
    
    // Cleanup
    return () => {
      if (logCollectorRef.current) {
        logCollectorRef.current.restoreConsole();
      }
    };
  }, []);
  
  // Guardar endpoints cuando cambien
  useEffect(() => {
    localStorage.setItem('debugPanelEndpoints', JSON.stringify(customEndpoints));
  }, [customEndpoints]);
  
  // Manejar nuevas solicitudes HTTP
  const handleNewRequest = (request) => {
    setHttpRequests(prev => {
      const newRequests = [request, ...prev].slice(0, 100); // Mantener solo los últimos 100
      
      // Ejecutar diagnósticos
      const newDiagnostics = diagnosticTools.runAllDiagnostics(request);
      if (newDiagnostics.length > 0) {
        setErrorDiagnostics(prev => [...newDiagnostics, ...prev].slice(0, 50));
      }
      
      return newRequests;
    });
  };
  
  // Probar endpoint
  const testEndpoint = async (endpoint) => {
    try {
      setIsLoading(true);
      const config = {};
      
      if (endpoint.requiresAuth) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }
      }
      
      const fullUrl = endpoint.url.startsWith('http') ? 
                      endpoint.url : 
                      `${backendURL}${endpoint.url}`;
      
      const start = performance.now();
      const response = await axios({
        method: endpoint.method,
        url: fullUrl,
        ...config
      });
      const end = performance.now();
      
      setApiResponses(prev => ({
        ...prev,
        [endpoint.name]: {
          status: response.status,
          data: response.data,
          headers: response.headers,
          time: (end - start).toFixed(2) + 'ms',
          timestamp: new Date().toISOString()
        }
      }));
      
      return true;
    } catch (error) {
      setApiResponses(prev => ({
        ...prev,
        [endpoint.name]: {
          error: true,
          status: error.response?.status || 'Network Error',
          message: error.message,
          response: error.response?.data,
          timestamp: new Date().toISOString()
        }
      }));
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Probar todos los endpoints
  const testAllEndpoints = async () => {
    setIsLoading(true);
    for (const endpoint of customEndpoints) {
      await testEndpoint(endpoint);
    }
    setIsLoading(false);
  };
  
  // Añadir nuevo endpoint
  const addEndpoint = () => {
    if (newEndpoint.name && newEndpoint.url) {
      setCustomEndpoints(prev => [...prev, { ...newEndpoint }]);
      setNewEndpoint({
        name: '',
        url: '',
        method: 'GET',
        requiresAuth: true
      });
      setShowAddEndpoint(false);
    }
  };
  
  // Eliminar endpoint
  const deleteEndpoint = (index) => {
    setCustomEndpoints(prev => prev.filter((_, idx) => idx !== index));
  };
  
  // Limpiar registros
  const clearLogs = () => {
    if (logCollectorRef.current) {
      logCollectorRef.current.clear();
    }
  };
  
  // Limpiar solicitudes HTTP
  const clearRequests = () => {
    setHttpRequests([]);
    setErrorDiagnostics([]);
  };
  
  // Filtrar logs
  const getFilteredLogs = () => {
    return logs.filter(log => {
      // Filtro por tipo
      if (!filterOptions[log.type]) return false;
      
      // Filtro por API
      if (filterOptions.apiOnly && !log.message.includes('/api/')) return false;
      
      // Filtro por búsqueda
      if (filterOptions.search && !log.message.toLowerCase().includes(filterOptions.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };
  
  // Descargar logs
  const downloadLogs = () => {
    const logData = JSON.stringify({
      logs: logs,
      httpRequests: httpRequests,
      diagnostics: errorDiagnostics,
      networkInfo: networkInfo,
      axiosConfig: axiosConfig,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }, null, 2);
    
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Copiar información al portapapeles
  const copyToClipboard = (data) => {
    navigator.clipboard.writeText(typeof data === 'object' ? JSON.stringify(data, null, 2) : data)
      .then(() => {
        alert('Copiado al portapapeles');
      })
      .catch(err => {
        console.error('Error al copiar:', err);
      });
  };
  
  // Si el panel está cerrado, mostrar solo el botón
  if (!isOpen) {
    return (
      <>
        <HttpMonitor onNewRequest={handleNewRequest} />
        <IconButton 
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16, 
            backgroundColor: '#2196f3',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1976d2'
            },
            zIndex: 9999
          }}
          onClick={() => setIsOpen(true)}
        >
          <Badge 
            badgeContent={errorDiagnostics.length} 
            color="error"
            invisible={errorDiagnostics.length === 0}
          >
            <BugReportIcon />
          </Badge>
        </IconButton>
      </>
    );
  }
  
  return (
    <>
      <HttpMonitor onNewRequest={handleNewRequest} />
      <Paper
        elevation={4}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          width: '90%',
          maxWidth: 1200,
          maxHeight: '90vh',
          overflow: 'auto',
          zIndex: 9999,
          p: 2,
          borderRadius: 2
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="primary" display="flex" alignItems="center">
            <BugReportIcon sx={{ mr: 1 }} />
            Panel de Depuración Avanzado
            {isLoading && <CircularProgress size={20} sx={{ ml: 2 }} />}
            
            <Chip 
              label={`${errorDiagnostics.length} diagnósticos`}
              color={errorDiagnostics.length > 0 ? "error" : "default"}
              size="small"
              sx={{ ml: 2 }}
            />
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={downloadLogs}
              startIcon={<DownloadIcon />}
              sx={{ mr: 1 }}
            >
              Exportar
            </Button>
            <IconButton onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />
        
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Registros" icon={<ErrorIcon />} iconPosition="start" />
          <Tab label="Red" icon={<ErrorIcon />} iconPosition="start" />
          <Tab label="API" icon={<ErrorIcon />} iconPosition="start" />
          <Tab label="Sistema" icon={<ErrorIcon />} iconPosition="start" />
          <Tab label="Diagnóstico" icon={<ErrorIcon />} iconPosition="start" />
        </Tabs>
        
        {/* Tab: Registros */}
        {activeTab === 0 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">Registros de Consola ({getFilteredLogs().length})</Typography>
              <Box>
                <FormControlLabel
                  control={
                    <Switch 
                      size="small" 
                      checked={filterOptions.error} 
                      onChange={() => setFilterOptions(prev => ({ ...prev, error: !prev.error }))}
                    />
                  }
                  label="Errores"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      size="small" 
                      checked={filterOptions.warning} 
                      onChange={() => setFilterOptions(prev => ({ ...prev, warning: !prev.warning }))}
                    />
                  }
                  label="Advertencias"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      size="small" 
                      checked={filterOptions.info} 
                      onChange={() => setFilterOptions(prev => ({ ...prev, info: !prev.info }))}
                    />
                  }
                  label="Info"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      size="small" 
                      checked={filterOptions.log} 
                      onChange={() => setFilterOptions(prev => ({ ...prev, log: !prev.log }))}
                    />
                  }
                  label="Log"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      size="small" 
                      checked={filterOptions.apiOnly} 
                      onChange={() => setFilterOptions(prev => ({ ...prev, apiOnly: !prev.apiOnly }))}
                    />
                  }
                  label="Solo API"
                />
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small" 
                  onClick={clearLogs}
                  startIcon={<DeleteIcon />}
                >
                  Limpiar
                </Button>
              </Box>
            </Box>
            
            <TextField
              fullWidth
              size="small"
              label="Filtrar mensajes"
              variant="outlined"
              value={filterOptions.search}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, search: e.target.value }))}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ maxHeight: 500, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
              {getFilteredLogs().length > 0 ? (
                <List dense disablePadding>
                  {getFilteredLogs().map((log, index) => {
                    const logColor = 
                      log.type === 'error' ? '#ffebee' :
                      log.type === 'warn' ? '#fff8e1' :
                      log.type === 'info' ? '#e8f5e9' : 'transparent';
                      
                    const logIcon = 
                      log.type === 'error' ? <ErrorIcon color="error" fontSize="small" /> :
                      log.type === 'warn' ? <WarningIcon color="warning" fontSize="small" /> :
                      log.type === 'info' ? <InfoIcon color="info" fontSize="small" /> :
                      <InfoIcon color="disabled" fontSize="small" />;
                    
                    return (
                      <ListItem 
                        key={index} 
                        sx={{ 
                          borderBottom: '1px solid #f0f0f0',
                          backgroundColor: logColor,
                          '&:hover': {
                            backgroundColor: '#f5f5f5'
                          }
                        }}
                        secondaryAction={
                          <IconButton 
                            edge="end" 
                            size="small"
                            onClick={() => copyToClipboard(log.message)}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        }
                      >
                        {logIcon}
                        <ListItemText
                          primary={
                            <Typography 
                              variant="body2" 
                              component="div" 
                              sx={{ 
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                              }}
                            >
                              {log.message.length > 500 ? 
                                log.message.substring(0, 500) + '...' : 
                                log.message}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </Typography>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Box p={2} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay registros que coincidan con los filtros.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
        
        {/* Tab: Red */}
        {activeTab === 1 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">Solicitudes HTTP ({httpRequests.length})</Typography>
              <Button 
                variant="outlined" 
                color="error" 
                size="small" 
                onClick={clearRequests}
                startIcon={<DeleteIcon />}
              >
                Limpiar
              </Button>
            </Box>
            
            {errorDiagnostics.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Diagnósticos y Soluciones
                </Typography>
                
                {errorDiagnostics.map((diagnostic, index) => (
                  <Alert 
                    severity={diagnostic.severity} 
                    key={index}
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {diagnostic.issue}
                    </Typography>
                    <Typography variant="body2">
                      {diagnostic.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      <strong>Solución:</strong> {diagnostic.fix}
                    </Typography>
                  </Alert>
                ))}
              </Box>
            )}
            
            <Box sx={{ maxHeight: 500, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
              {httpRequests.length > 0 ? (
                <List dense disablePadding>
                  {httpRequests.map((request, index) => {
                    const isError = request.error || request.status >= 400;
                    const statusColor = 
                      isError ? '#ffebee' :
                      (request.status >= 300) ? '#fff8e1' : '#e8f5e9';
                    
                    return (
                      <Accordion key={index} sx={{ m: 0 }}>
                        <AccordionSummary 
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ 
                            backgroundColor: statusColor,
                            minHeight: '48px!important',
                            '& .MuiAccordionSummary-content': {
                              margin: '6px 0!important'
                            }
                          }}
                        >
                          <Box display="flex" alignItems="center" width="100%">
                            <Chip 
                              label={request.method} 
                              size="small" 
                              color={request.method === 'GET' ? 'primary' : 'secondary'} 
                              sx={{ mr: 1, minWidth: 60 }}
                            />
                            <Typography variant="body2" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {request.url}
                            </Typography>
                            <Chip 
                              label={request.status} 
                              size="small" 
                              color={isError ? 'error' : 'default'} 
                              sx={{ ml: 1 }}
                            />
                            {request.duration && (
                              <Chip 
                                label={`${request.duration}ms`} 
                                size="small" 
                                color={request.duration > 1000 ? 'warning' : 'default'} 
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                          <Tabs value={0} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tab label="Respuesta" />
                            <Tab label="Cabeceras" />
                            <Tab label="Análisis" />
                          </Tabs>
                          
                          {/* Solo mostramos la primera pestaña por simplicidad */}
                          <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                              {new Date(request.startTime).toLocaleString()}
                            </Typography>
                            
                            {isError ? (
                              <Alert severity="error" sx={{ mb: 1 }}>
                                Error: {request.statusText || 'Desconocido'}
                              </Alert>
                            ) : null}
                            
                            <Box sx={{ maxHeight: 300, overflow: 'auto', backgroundColor: '#ffffff', p: 1, borderRadius: 1 }}>
                              <pre style={{ margin: 0, fontSize: '0.75rem' }}>
                                {formatJSON(request.responseBody || request.response || 'Sin cuerpo de respuesta')}
                              </pre>
                            </Box>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </List>
              ) : (
                <Box p={2} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay solicitudes HTTP registradas.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
        
        {/* Tab: API */}
        {activeTab === 2 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Pruebas de API
                </Typography>
                <TextField
                  size="small"
                  label="URL del Backend"
                  variant="outlined"
                  value={backendURL}
                  onChange={(e) => setBackendURL(e.target.value)}
                  sx={{ width: 350 }}
                />
              </Box>
              <Box>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={testAllEndpoints}
                  startIcon={<RefreshIcon />}
                  disabled={isLoading}
                  sx={{ mr: 1 }}
                >
                  Probar Todos
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => setShowAddEndpoint(true)}
                >
                  Añadir Endpoint
                </Button>
              </Box>
            </Box>
            
            {/* Acordeón para configuración */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Configuración de Axios</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
                  <pre>{formatJSON(axiosConfig)}</pre>
                </Box>
              </AccordionDetails>
            </Accordion>
            
            {/* Lista de endpoints */}
            <Box sx={{ mt: 2, maxHeight: 400, overflow: 'auto' }}>
              {customEndpoints.map((endpoint, index) => (
                <Box key={index} mb={2}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Chip 
                      label={endpoint.method} 
                      size="small" 
                      color={endpoint.method === 'GET' ? 'primary' : 'secondary'} 
                      sx={{ mr: 1, minWidth: 60 }}
                    />
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {endpoint.name}: {endpoint.url}
                      {endpoint.requiresAuth && (
                        <Chip label="Auth" size="small" color="default" sx={{ ml: 1 }} />
                      )}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => deleteEndpoint(index)}
                      sx={{ mr: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => testEndpoint(endpoint)}
                      disabled={isLoading}
                    >
                      Probar
                    </Button>
                  </Box>
                  
                  {apiResponses[endpoint.name] && (
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 1, 
                        backgroundColor: apiResponses[endpoint.name].error ? 
                          '#ffebee' : '#e8f5e9' 
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption">
                          Status: {apiResponses[endpoint.name].status}
                          {apiResponses[endpoint.name].time && ` - Tiempo: ${apiResponses[endpoint.name].time}`}
                        </Typography>
                        <IconButton 
                          size="small"
                          onClick={() => copyToClipboard(
                            apiResponses[endpoint.name].error 
                              ? { message: apiResponses[endpoint.name].message, response: apiResponses[endpoint.name].response }
                              : apiResponses[endpoint.name].data
                          )}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ maxHeight: 200, overflow: 'auto', mt: 1 }}>
                        <pre style={{ margin: 0, fontSize: '0.75rem' }}>
                          {formatJSON(apiResponses[endpoint.name].error 
                            ? { message: apiResponses[endpoint.name].message, response: apiResponses[endpoint.name].response }
                            : apiResponses[endpoint.name].data
                          )}
                        </pre>
                      </Box>
                    </Paper>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}
        
        {/* Tab: Sistema */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Información del Sistema
            </Typography>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Información del Navegador</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                  <pre>{formatJSON(networkInfo)}</pre>
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Almacenamiento Local</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                  <pre>{formatJSON(Object.fromEntries(
                    Object.keys(localStorage).map(key => [key, 
                      key === 'token' ? 'JWT...[truncado]' : localStorage.getItem(key)])
                  ))}</pre>
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Usuario Actual</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                  <pre>{formatJSON(user || { error: 'Sin usuario autenticado' })}</pre>
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Variables de Entorno (Públicas)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                  <pre>{formatJSON({
                    NODE_ENV: process.env.NODE_ENV,
                    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
                    VITE_API_URL: process.env.VITE_API_URL,
                    PUBLIC_URL: process.env.PUBLIC_URL
                  })}</pre>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
        
        {/* Tab: Diagnóstico */}
        {activeTab === 4 && (
          <BackendDiagnostic apiURL={backendURL} />
        )}
        
        {/* Diálogo para añadir endpoint */}
        <Dialog open={showAddEndpoint} onClose={() => setShowAddEndpoint(false)}>
          <DialogTitle>Añadir Nuevo Endpoint</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1, width: 400 }}>
              <TextField
                fullWidth
                label="Nombre"
                value={newEndpoint.name}
                onChange={(e) => setNewEndpoint(prev => ({ ...prev, name: e.target.value }))}
                margin="dense"
              />
              <TextField
                fullWidth
                label="URL"
                value={newEndpoint.url}
                onChange={(e) => setNewEndpoint(prev => ({ ...prev, url: e.target.value }))}
                margin="dense"
                helperText="Ruta absoluta o relativa (ej. /api/v1/users)"
              />
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={newEndpoint.requiresAuth} 
                        onChange={(e) => setNewEndpoint(prev => ({ ...prev, requiresAuth: e.target.checked }))}
                      />
                    }
                    label="Requiere Autenticación"
                  />
                </Box>
                
                <Box>
                  <Button 
                    variant={newEndpoint.method === 'GET' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setNewEndpoint(prev => ({ ...prev, method: 'GET' }))}
                    sx={{ mr: 1 }}
                  >
                    GET
                  </Button>
                  <Button 
                    variant={newEndpoint.method === 'POST' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setNewEndpoint(prev => ({ ...prev, method: 'POST' }))}
                    sx={{ mr: 1 }}
                  >
                    POST
                  </Button>
                  <Button 
                    variant={newEndpoint.method === 'PUT' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setNewEndpoint(prev => ({ ...prev, method: 'PUT' }))}
                    sx={{ mr: 1 }}
                  >
                    PUT
                  </Button>
                  <Button 
                    variant={newEndpoint.method === 'DELETE' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setNewEndpoint(prev => ({ ...prev, method: 'DELETE' }))}
                  >
                    DELETE
                  </Button>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddEndpoint(false)}>Cancelar</Button>
            <Button 
              onClick={addEndpoint}
              variant="contained"
              disabled={!newEndpoint.name || !newEndpoint.url}
            >
              Añadir
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default DebugPanel;