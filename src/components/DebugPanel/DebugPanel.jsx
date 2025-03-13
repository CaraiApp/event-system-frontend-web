import React, { useState, useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import BugReportIcon from '@mui/icons-material/BugReport';
import axios from 'axios';

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiEndpoints, setApiEndpoints] = useState([]);
  const [apiResponses, setApiResponses] = useState({});
  const [axiosConfig, setAxiosConfig] = useState({});
  const [errorLog, setErrorLog] = useState([]);
  const [networkInfo, setNetworkInfo] = useState({});

  useEffect(() => {
    // Capturar la configuración actual de axios
    setAxiosConfig({
      baseURL: axios.defaults.baseURL,
      withCredentials: axios.defaults.withCredentials,
      headers: axios.defaults.headers.common
    });

    // Lista de endpoints para probar
    setApiEndpoints([
      { name: 'Health Check', url: '/health', method: 'GET' },
      { name: 'Get Events', url: '/api/v1/events', method: 'GET' },
      { name: 'User Profile', url: '/api/v1/users/getSingleUser', method: 'GET', requiresAuth: true },
      { name: 'Templates', url: '/api/v1/templates', method: 'GET' }
    ]);

    // Obtener información de red
    setNetworkInfo({
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      hostname: window.location.hostname,
      protocol: window.location.protocol
    });

    // Capturar errores de consola
    const originalConsoleError = console.error;
    console.error = (...args) => {
      setErrorLog(prev => [...prev, { 
        timestamp: new Date().toISOString(), 
        message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')
      }]);
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const testEndpoint = async (endpoint) => {
    try {
      const config = {};
      
      if (endpoint.requiresAuth) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }
      }
      
      const start = performance.now();
      const response = await axios({
        method: endpoint.method,
        url: endpoint.url,
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
    }
  };

  const testAllEndpoints = async () => {
    for (const endpoint of apiEndpoints) {
      await testEndpoint(endpoint);
    }
  };

  const formatJSON = (json) => {
    try {
      return JSON.stringify(json, null, 2);
    } catch (e) {
      return String(json);
    }
  };

  const clearErrorLog = () => {
    setErrorLog([]);
  };

  if (!isOpen) {
    return (
      <IconButton 
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16, 
          backgroundColor: '#2196f3',
          color: 'white',
          '&:hover': {
            backgroundColor: '#1976d2'
          }
        }}
        onClick={() => setIsOpen(true)}
      >
        <BugReportIcon />
      </IconButton>
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: '80%',
        maxWidth: 800,
        maxHeight: '80vh',
        overflow: 'auto',
        zIndex: 9999,
        p: 2,
        borderRadius: 2
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" color="primary" display="flex" alignItems="center">
          <BugReportIcon sx={{ mr: 1 }} />
          Panel de Depuración
        </Typography>
        <IconButton onClick={() => setIsOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Configuración de Axios</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, overflow: 'auto' }}>
            <pre>{formatJSON(axiosConfig)}</pre>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Pruebas de API</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box mb={2}>
            <Button variant="contained" onClick={testAllEndpoints}>
              Probar Todos los Endpoints
            </Button>
          </Box>
          
          {apiEndpoints.map((endpoint) => (
            <Box key={endpoint.name} mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <Chip 
                  label={endpoint.method} 
                  size="small" 
                  color={endpoint.method === 'GET' ? 'primary' : 'secondary'} 
                  sx={{ mr: 1 }}
                />
                <Typography variant="body1">{endpoint.name}: {endpoint.url}</Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ ml: 2 }}
                  onClick={() => testEndpoint(endpoint)}
                >
                  Probar
                </Button>
              </Box>
              
              {apiResponses[endpoint.name] && (
                <Paper variant="outlined" sx={{ p: 1, backgroundColor: apiResponses[endpoint.name].error ? '#ffebee' : '#e8f5e9' }}>
                  <Typography variant="caption">
                    Status: {apiResponses[endpoint.name].status}
                    {apiResponses[endpoint.name].time && ` - Tiempo: ${apiResponses[endpoint.name].time}`}
                  </Typography>
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
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            Registro de Errores
            {errorLog.length > 0 && <Chip 
              label={errorLog.length} 
              color="error" 
              size="small" 
              sx={{ ml: 1 }}
            />}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {errorLog.length > 0 ? (
            <>
              <Button variant="outlined" color="error" size="small" onClick={clearErrorLog} sx={{ mb: 1 }}>
                Limpiar Registro
              </Button>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {errorLog.map((error, index) => (
                  <Box key={index} sx={{ mb: 1, p: 1, backgroundColor: '#ffebee', borderRadius: 1 }}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {new Date(error.timestamp).toLocaleTimeString()}
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word', fontFamily: 'monospace' }}>
                      {error.message}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay errores registrados.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Información del Navegador</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
            <pre>{formatJSON(networkInfo)}</pre>
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle2">Almacenamiento Local:</Typography>
            <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mt: 1 }}>
              <pre>{formatJSON(Object.fromEntries(
                Object.keys(localStorage).map(key => [key, 
                  key === 'token' ? 'JWT...[truncado]' : localStorage.getItem(key)])
              ))}</pre>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => {
            const debugData = {
              axiosConfig,
              apiResponses,
              errorLog,
              networkInfo,
              localStorage: Object.fromEntries(
                Object.keys(localStorage).map(key => [key, 
                  key === 'token' ? 'JWT...[truncado]' : localStorage.getItem(key)])
              )
            };
            
            // Copiar al portapapeles
            navigator.clipboard.writeText(JSON.stringify(debugData, null, 2))
              .then(() => alert('Información de depuración copiada al portapapeles'))
              .catch(err => console.error('Error al copiar:', err));
          }}
        >
          Copiar Información
        </Button>
      </Box>
    </Paper>
  );
};

export default DebugPanel;