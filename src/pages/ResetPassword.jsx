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
        const response = await fetch(`https://event-system-backend-production.up.railway.app/api/v1/auth/validate-reset-token/${token}`, {
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
        console.error('Error al validar token:', error);
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
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: { xs: 3, sm: 4 },
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          width: '100%',
        }}
      >
        <Typography 
          component="h1" 
          variant="h5" 
          sx={{ 
            fontWeight: '600',
            textTransform: 'none',
            fontSize: '1.75rem',
            color: '#2c3e50',
            mb: 1
          }}
        >
          Restablecer contraseña
        </Typography>

        {message && (
          <Box 
            sx={{
              p: 2,
              mb: 2,
              width: '100%',
              borderRadius: 1,
              bgcolor: '#e8f5e9',
              color: '#2e7d32',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#2e7d32" style={{marginRight: '8px'}}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {message}
          </Box>
        )}

        {error && (
          <Box 
            sx={{
              p: 2,
              mb: 2,
              width: '100%',
              borderRadius: 1,
              bgcolor: '#ffebee',
              color: '#d32f2f',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#d32f2f" style={{marginRight: '8px'}}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {error}
          </Box>
        )}

        {tokenValid && (
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
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
              InputProps={{
                style: { fontSize: '1rem' },
              }}
              InputLabelProps={{
                style: { fontSize: '1rem' },
              }}
              FormHelperTextProps={{
                style: { 
                  fontSize: '0.8rem',
                  color: passwordError ? '#d32f2f' : 'inherit',
                  marginLeft: 0,
                  marginTop: '4px'
                }
              }}
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
              InputProps={{
                style: { fontSize: '1rem' },
              }}
              InputLabelProps={{
                style: { fontSize: '1rem' },
              }}
              FormHelperTextProps={{
                style: { 
                  fontSize: '0.8rem',
                  color: confirmPasswordError ? '#d32f2f' : 'inherit',
                  marginLeft: 0,
                  marginTop: '4px'
                }
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)'
              }}
              disabled={isLoading || !tokenValid}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Restablecer contraseña'}
            </Button>
          </Box>
        )}
        
        <Grid container justifyContent="center">
          <Grid item>
            <Link to="/login" style={{ 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              color: '#6497df',
              fontSize: '0.95rem',
              fontWeight: 'medium'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '4px'}}>
                <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>
              Volver al inicio de sesión
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}