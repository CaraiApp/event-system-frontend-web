import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Grid, 
  Box, 
  Alert, 
  CircularProgress 
} from '@mui/material';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('https://event-system-backend-production.up.railway.app/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña.');
      } else {
        setError(data.message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      setError('Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
      console.error('Error:', error);
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
            fontSize: '2rem',
            color: '#2c3e50',
            mb: 1
          }}
        >
          Recuperar contraseña
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 3, 
            textAlign: 'center',
            fontSize: '1.2rem',
            maxWidth: '400px',
            lineHeight: 1.5
          }}
        >
          Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
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

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            disabled={isLoading}
            InputProps={{
              style: { fontSize: '1.2rem', textTransform: 'lowercase' },
              inputProps: {
                style: { textTransform: 'lowercase' }
              }
            }}
            inputProps={{
              style: { textTransform: 'lowercase' },
              autoCapitalize: "off"
            }}
            InputLabelProps={{
              style: { fontSize: '1.2rem' },
            }}
            sx={{ 
              "& input": { 
                textTransform: "lowercase" 
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
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Enviar instrucciones'}
          </Button>
          
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
      </Box>
    </Container>
  );
}
