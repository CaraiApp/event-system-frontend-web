import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress 
} from '@mui/material';

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`https://event-system-backend-production.up.railway.app/api/v1/auth/verify-email/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (response.ok) {
          setVerified(true);
          // Redireccionar al login después de 3 segundos
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setError(data.message || 'No se pudo verificar tu correo electrónico. El enlace podría haber expirado.');
        }
      } catch (error) {
        setError('Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsLoading(false);
      setError('Enlace de verificación inválido.');
    }
  }, [token, navigate]);

  const handleResendVerification = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Verificación de correo electrónico
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <CircularProgress />
          </Box>
        ) : verified ? (
          <>
            <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
              ¡Tu correo electrónico ha sido verificado correctamente! Serás redirigido al inicio de sesión en unos segundos.
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Ya puedes iniciar sesión con tu correo electrónico y contraseña.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/login"
              sx={{ mt: 2 }}
            >
              Ir al inicio de sesión
            </Button>
          </>
        ) : (
          <>
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Si necesitas un nuevo enlace de verificación, inicia sesión y solicita un nuevo correo de verificación.
            </Typography>
            <Button
              variant="contained"
              onClick={handleResendVerification}
              sx={{ mt: 2 }}
            >
              Ir al inicio de sesión
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default VerifyEmail;