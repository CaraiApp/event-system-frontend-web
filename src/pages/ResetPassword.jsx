import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Grid, 
  Box, 
  Alert, 
  CircularProgress,
  FormHelperText
} from '@mui/material';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [tokenValid, setTokenValid] = useState(true);
  const { token } = useParams();
  const navigate = useNavigate();

  // Validación
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Verificar token al cargar
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`https://event-system-backend-production.up.railway.app/api/v1/auth/reset-password/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          setTokenValid(false);
          setError('El enlace de restablecimiento ha expirado o no es válido. Por favor, solicita un nuevo enlace.');
        }
      } catch (error) {
        setTokenValid(false);
        setError('Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
      }
    };

    if (token) {
      verifyToken();
    } else {
      setTokenValid(false);
      setError('Enlace inválido. Por favor, solicita un nuevo enlace de restablecimiento de contraseña.');
    }
  }, [token]);

  const validateForm = () => {
    let isValid = true;
    setPasswordError('');
    setConfirmPasswordError('');

    if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`https://event-system-backend-production.up.railway.app/api/v1/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Tu contraseña ha sido restablecida correctamente. Serás redirigido al inicio de sesión en unos segundos.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      setError('Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
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
          Restablecer contraseña
        </Typography>

        {message && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {tokenValid && (
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Nueva contraseña"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || !tokenValid}
              error={!!passwordError}
              helperText={passwordError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar contraseña"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading || !tokenValid}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading || !tokenValid}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Restablecer contraseña'}
            </Button>
          </Box>
        )}
        
        <Grid container justifyContent="center">
          <Grid item>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button
                startIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
                  </svg>
                }
              >
                Volver al inicio de sesión
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}