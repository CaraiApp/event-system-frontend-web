import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Alert,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Chip,
  Snackbar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  QrCodeScanner,
  CheckCircle,
  Cancel,
  Refresh,
  Close,
  PhotoCamera,
  EventAvailable,
  Info
} from '@mui/icons-material';
import axios from 'axios';

// Componente principal
const QRScanner = () => {
  // Estado para gestionar el escáner y datos de tickets
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '', severity: 'info' });
  const [selectedEvent, setSelectedEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    scanned: 0,
    total: 0,
    remaining: 0
  });

  // Efecto para cargar eventos del organizador al inicio
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        const response = await axios.get(`${API_BASE_URL}/api/v1/events/getuserEvent`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.data) {
          setEvents(response.data.data);
        }
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        showAlert('Error al cargar eventos. Inténtalo de nuevo.', 'error');
      }
    };

    fetchEvents();
  }, []);

  // Efecto para inicializar el escáner de QR
  useEffect(() => {
    if (!selectedEvent) return; // No iniciar el escáner hasta seleccionar evento
    
    // Configuración del escáner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      aspectRatio: 1
    };
    
    // Inicializar escáner HTML5
    const qrScanner = new Html5QrcodeScanner(
      "reader", 
      config, 
      false // No mostrar scan type
    );
    
    const successCallback = async (decodedText) => {
      try {
        setLoading(true);
        setScanError(null);
        
        console.log("QR escaneado:", decodedText);
        
        // Verificar el formato del QR
        let qrData;
        try {
          qrData = JSON.parse(decodedText);
        } catch (error) {
          console.error("Error al parsear el QR:", error);
          setScanError("Formato de QR inválido");
          setLoading(false);
          return;
        }
        
        // Verificar la entrada con el backend
        const token = localStorage.getItem('token');
        if (!token) {
          setScanError("No autorizado. Inicia sesión de nuevo.");
          setLoading(false);
          return;
        }
        
        const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/booking/scan-qr`,
          { 
            qrData: qrData,
            eventId: selectedEvent
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setScanResult(response.data);
        
        // Actualizar estadísticas
        setStats(prev => ({
          ...prev,
          scanned: prev.scanned + 1,
          remaining: prev.total > 0 ? prev.total - prev.scanned - 1 : 0
        }));
        
        // Mostrar mensaje según resultado
        if (response.data.success === true) {
          showAlert('¡Entrada validada correctamente!', 'success');
        } else {
          showAlert(response.data.message || 'Error al validar entrada', 'error');
        }
        
      } catch (error) {
        console.error("Error al verificar QR:", error);
        
        let errorMessage = "Error al verificar QR";
        if (error.response) {
          errorMessage = error.response.data.message || "Error en la verificación";
          if (error.response.status === 401) {
            errorMessage = "No autorizado. Inicia sesión de nuevo.";
          } else if (error.response.status === 400) {
            errorMessage = error.response.data.message || "Entrada no válida";
          }
        }
        
        setScanError(errorMessage);
        showAlert(errorMessage, 'error');
        
      } finally {
        setLoading(false);
      }
    };
    
    const errorCallback = (error) => {
      console.warn(`Error al escanear QR: ${error}`);
    };
    
    qrScanner.render(successCallback, errorCallback);
    setScanner(qrScanner);
    
    // Limpiar al desmontar
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [selectedEvent]);

  // Efecto para cargar estadísticas del evento seleccionado
  useEffect(() => {
    if (!selectedEvent) return;
    
    const fetchEventStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        const response = await axios.get(`${API_BASE_URL}/api/v1/booking/geteventbooking?event_id=${selectedEvent}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.data) {
          const attendees = response.data.data;
          const scannedCount = attendees.filter(a => a.qrCodeScanStatus === true).length;
          
          setStats({
            scanned: scannedCount,
            total: attendees.length,
            remaining: attendees.length - scannedCount
          });
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };

    fetchEventStats();
  }, [selectedEvent]);

  // Función para mostrar alertas
  const showAlert = (message, severity = 'info') => {
    setAlertInfo({
      open: true,
      message,
      severity
    });
  };

  // Función para manejar cierre de alerta
  const handleAlertClose = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  // Función para reiniciar el escáner
  const handleReset = () => {
    setScanResult(null);
    setScanError(null);
    if (scanner) {
      scanner.render(
        async (decodedText) => {
          try {
            setLoading(true);
            setScanError(null);
            
            console.log("QR escaneado:", decodedText);
            
            // Verificar el formato del QR
            let qrData;
            try {
              qrData = JSON.parse(decodedText);
            } catch (error) {
              console.error("Error al parsear el QR:", error);
              setScanError("Formato de QR inválido");
              setLoading(false);
              return;
            }
            
            // Verificar la entrada con el backend
            const token = localStorage.getItem('token');
            if (!token) {
              setScanError("No autorizado. Inicia sesión de nuevo.");
              setLoading(false);
              return;
            }
            
            const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
            const response = await axios.post(
              `${API_BASE_URL}/api/v1/booking/scan-qr`,
              { 
                qrData: qrData,
                eventId: selectedEvent
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setScanResult(response.data);
            
            // Actualizar estadísticas
            setStats(prev => ({
              ...prev,
              scanned: prev.scanned + 1,
              remaining: prev.total > 0 ? prev.total - prev.scanned - 1 : 0
            }));
            
            // Mostrar mensaje según resultado
            if (response.data.success === true) {
              showAlert('¡Entrada validada correctamente!', 'success');
            } else {
              showAlert(response.data.message || 'Error al validar entrada', 'error');
            }
            
          } catch (error) {
            console.error("Error al verificar QR:", error);
            
            let errorMessage = "Error al verificar QR";
            if (error.response) {
              errorMessage = error.response.data.message || "Error en la verificación";
              if (error.response.status === 401) {
                errorMessage = "No autorizado. Inicia sesión de nuevo.";
              } else if (error.response.status === 400) {
                errorMessage = error.response.data.message || "Entrada no válida";
              }
            }
            
            setScanError(errorMessage);
            showAlert(errorMessage, 'error');
            
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.warn(`Error al escanear QR: ${error}`);
        }
      );
    }
  };

  // Función para cambiar el evento seleccionado
  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
    setScanResult(null);
    setScanError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Alerta para mostrar mensajes */}
      <Snackbar
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertInfo.severity}
          sx={{ width: '100%' }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>

      {/* Encabezado */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          <QrCodeScanner sx={{ mr: 1, verticalAlign: 'middle' }} />
          Escáner de Entradas
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Escanea los códigos QR de las entradas para validar el acceso al evento
        </Typography>
      </Box>

      {/* Selector de evento */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#f8f9fc' }}>
        <FormControl fullWidth>
          <InputLabel id="event-select-label">Selecciona un evento</InputLabel>
          <Select
            labelId="event-select-label"
            id="event-select"
            value={selectedEvent}
            label="Selecciona un evento"
            onChange={handleEventChange}
          >
            <MenuItem value="">
              <em>Selecciona un evento</em>
            </MenuItem>
            {events.map((event) => (
              <MenuItem key={event._id} value={event._id}>
                {event.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Estadísticas del evento */}
      {selectedEvent && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#e0f2fe', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total de Entradas
                </Typography>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#dcfce7', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Entradas Escaneadas
                </Typography>
                <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
                  {stats.scanned}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#fef3e2', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Entradas Restantes
                </Typography>
                <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold' }}>
                  {stats.remaining}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={4}>
        {/* Área del escáner */}
        <Grid item xs={12} md={selectedEvent ? 6 : 12}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <PhotoCamera sx={{ mr: 1 }} /> Escanear Código QR
            </Typography>
            
            {!selectedEvent ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                Por favor, selecciona un evento para comenzar a escanear entradas.
              </Alert>
            ) : (
              <>
                <Box id="reader" sx={{ width: '100%', mx: 'auto', mb: 3 }}></Box>
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Grid>

        {/* Área de resultados */}
        {selectedEvent && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Info sx={{ mr: 1 }} /> Resultados de Verificación
              </Typography>
              
              {scanResult ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  {scanResult.success ? (
                    <Box>
                      <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                      <Typography variant="h5" color="success.main" gutterBottom>
                        ¡Entrada Válida!
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ mb: 3, textAlign: 'left' }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Evento:</strong> {scanResult.eventName || 'No disponible'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Asistente:</strong> {scanResult.attendeeName || 'No disponible'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Asiento:</strong> {scanResult.seatInfo || 'No asignado'}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Estado:</strong> {' '}
                          {scanResult.alreadyScanned ? (
                            <Chip 
                              icon={<Info />} 
                              label="Ya escaneado anteriormente" 
                              color="warning" 
                              size="small" 
                            />
                          ) : (
                            <Chip 
                              icon={<CheckCircle />} 
                              label="Primer acceso" 
                              color="success" 
                              size="small" 
                            />
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Cancel sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                      <Typography variant="h5" color="error.main" gutterBottom>
                        Entrada No Válida
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {scanResult.message || 'La entrada no pudo ser validada'}
                      </Typography>
                    </Box>
                  )}
                  
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Refresh />}
                    onClick={handleReset}
                    sx={{ mt: 3 }}
                  >
                    Escanear Otra Entrada
                  </Button>
                </Box>
              ) : scanError ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Cancel sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                  <Typography variant="h5" color="error.main" gutterBottom>
                    Error de Escaneo
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {scanError}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Refresh />}
                    onClick={handleReset}
                    sx={{ mt: 3 }}
                  >
                    Reintentar
                  </Button>
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  minHeight: '300px'
                }}>
                  <QrCodeScanner sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1" color="text.secondary" align="center">
                    Los resultados de la verificación aparecerán aquí después de escanear un código QR.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                    Apunta la cámara al código QR de la entrada para verificarla.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Instrucciones */}
      <Paper sx={{ p: 3, mt: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Instrucciones de Uso
        </Typography>
        <Typography variant="body2" paragraph>
          1. Selecciona el evento para el que quieres verificar entradas
        </Typography>
        <Typography variant="body2" paragraph>
          2. Permite el acceso a la cámara cuando se te solicite
        </Typography>
        <Typography variant="body2" paragraph>
          3. Apunta la cámara al código QR de la entrada
        </Typography>
        <Typography variant="body2">
          4. Verifica el resultado de la validación antes de permitir el acceso
        </Typography>
      </Paper>
    </Container>
  );
};

export default QRScanner;