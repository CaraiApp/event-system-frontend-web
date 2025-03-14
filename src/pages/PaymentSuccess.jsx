import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircleOutline,
  EventAvailable,
  QrCode2,
  ArrowBack,
  Download,
  Wallet,
  Email
} from "@mui/icons-material";
import {
  Button,
  Card,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Alert,
  Snackbar
} from "@mui/material";
import axios from "axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  
  // Datos de la entrada desde el state
  const ticketData = location.state || {};
  const { bookingId, eventName, qrCodeUrl, isFreeEvent } = ticketData;
  
  // Estado para más detalles del evento si es necesario
  const [eventDetails, setEventDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  
  useEffect(() => {
    // Si no hay datos en el state, podrías intentar recuperarlos desde una API
    // o redirigir al usuario a otra página
    if (!bookingId && !qrCodeUrl) {
      setAlertSeverity("warning");
      setAlertMessage("No se encontraron detalles de la compra");
      setAlertOpen(true);
    } else {
      // Podrías cargar más detalles del evento/reserva aquí si es necesario
    }
  }, [bookingId, qrCodeUrl]);

  // Función para generar un Apple Wallet Pass (simulación)
  const generateAppleWalletPass = async () => {
    try {
      setLoading(true);
      setAlertSeverity("info");
      setAlertMessage("Generando Apple Wallet Pass...");
      setAlertOpen(true);
      
      // Aquí iría la llamada a tu API para generar el pase
      // Por ahora solo simulamos un retraso
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAlertSeverity("success");
      setAlertMessage("¡Apple Wallet Pass generado! Se abrirá en una nueva ventana.");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error generando Apple Wallet Pass:", error);
      setAlertSeverity("error");
      setAlertMessage("Error al generar el Apple Wallet Pass. Inténtalo de nuevo.");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Función para generar un Google Pay Pass (simulación)
  const generateGooglePayPass = async () => {
    try {
      setLoading(true);
      setAlertSeverity("info");
      setAlertMessage("Generando Google Pay Pass...");
      setAlertOpen(true);
      
      // Aquí iría la llamada a tu API para generar el pase
      // Por ahora solo simulamos un retraso
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAlertSeverity("success");
      setAlertMessage("¡Google Pay Pass generado! Se abrirá en una nueva ventana.");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error generando Google Pay Pass:", error);
      setAlertSeverity("error");
      setAlertMessage("Error al generar el Google Pay Pass. Inténtalo de nuevo.");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Función para enviar la entrada por correo
  const sendTicketByEmail = async () => {
    try {
      setLoading(true);
      setAlertSeverity("info");
      setAlertMessage("Enviando entrada a tu correo electrónico...");
      setAlertOpen(true);
      
      // Aquí iría la llamada a tu API para enviar el correo
      // Por ahora solo simulamos un retraso
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAlertSeverity("success");
      setAlertMessage("¡Entrada enviada correctamente a tu correo electrónico!");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error enviando correo:", error);
      setAlertSeverity("error");
      setAlertMessage("Error al enviar el correo. Inténtalo de nuevo.");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Función para descargar el QR como imagen
  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `ticket-${bookingId || 'evento'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setAlertSeverity("success");
      setAlertMessage("Descargando código QR...");
      setAlertOpen(true);
    } else {
      setAlertSeverity("error");
      setAlertMessage("No se pudo descargar el código QR.");
      setAlertOpen(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Mensajes de alerta */}
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      
      {/* Cabecera */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: '#f8f9fe',
          border: '1px solid #e0e7ff'
        }}
      >
        <CheckCircleOutline sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="#333">
          {isFreeEvent ? '¡Registro Completado!' : '¡Pago Completado!'}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          {isFreeEvent 
            ? 'Tu registro para el evento gratuito ha sido confirmado.' 
            : 'Tu pago ha sido procesado y tu entrada está lista.'}
        </Typography>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={() => navigate('/wallet')}
          >
            Ver mis entradas
          </Button>
        </Box>
      </Paper>
      
      {/* Detalles de la entrada */}
      <Grid container spacing={4}>
        {/* QR Code */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Código QR de entrada
            </Typography>
            
            {qrCodeUrl ? (
              <Box 
                sx={{ 
                  flex: 1,
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2
                }}
              >
                <img 
                  src={qrCodeUrl} 
                  alt="Código QR de entrada" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '250px',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    padding: '8px'
                  }} 
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  Presenta este código QR en la entrada del evento
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Event Details */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Detalles del evento
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" fontWeight="bold" color="primary.main">
                Nombre del evento:
              </Typography>
              <Typography variant="body1" paragraph>
                {eventName || "Evento"}
              </Typography>
              
              <Typography variant="body1" fontWeight="bold" color="primary.main">
                ID de reserva:
              </Typography>
              <Typography variant="body1" paragraph>
                {bookingId || "No disponible"}
              </Typography>
              
              <Typography variant="body1" fontWeight="bold" color="primary.main">
                Tipo de entrada:
              </Typography>
              <Typography variant="body1">
                {isFreeEvent ? "Entrada gratuita" : "Entrada de pago"}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
              Guardar mi entrada:
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Wallet />}
                disabled={loading}
                onClick={generateAppleWalletPass}
                fullWidth
              >
                Añadir a Apple Wallet
              </Button>
              
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<Wallet />}
                disabled={loading}
                onClick={generateGooglePayPass}
                fullWidth
              >
                Añadir a Google Pay
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<Download />}
                disabled={loading || !qrCodeUrl}
                onClick={downloadQR}
                fullWidth
              >
                Descargar QR
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<Email />}
                disabled={loading}
                onClick={sendTicketByEmail}
                fullWidth
              >
                Enviar a mi correo
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Info adicional */}
      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2">
          El código QR es tu entrada al evento. Guárdalo en tu dispositivo o añádelo a tu billetera digital.
          Recuerda presentarlo en la entrada del evento para validarlo.
        </Typography>
      </Alert>
    </Container>
  );
};

export default PaymentSuccess;