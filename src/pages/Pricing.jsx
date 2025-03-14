import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    title: 'Gratuito',
    features: [
      'Publicación de eventos básicos',
      'Sin límite de asistentes',
      'Entradas con código QR',
      'Sin procesamiento de pagos',
      'Ideal para eventos sin costo'
    ],
    price: 'Gratis',
    isFreePlan: true,
    buttonText: 'Crear Evento Gratuito',
    path: '/create-event?type=free'
  },
  {
    title: 'Básico',
    features: [
      'Publicación de eventos',
      'Opciones de asientos',
      'Imagen de banner',
      'Boleto con código QR',
      'Procesamiento de pagos'
    ],
    price: '$300.0',
    buttonText: 'Suscribir',
    path: '/create-event'
  },
  {
    title: 'Estándar',
    features: [
      'Múltiples eventos',
      '2 mapas de asientos',
      'Solicitudes destacadas (4x)',
      'Galería de fotos',
      'Boleto con código QR'
    ],
    price: '$500.0',
    buttonText: 'Suscribir',
    path: '/create-event'
  },
  {
    title: 'Premium',
    features: [
      'Publicación de eventos',
      'Solicitudes destacadas',
      'Galería de fotos',
      'Asignación de asientos temáticos',
      'Eventos sin boleto electrónico',
      'Boleto con código QR'
    ],
    price: '$1000.0',
    buttonText: 'Suscribir',
    path: '/create-event'
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 6, marginTop: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#333' }}
        >
          Planes para tus Eventos
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
          Elige el plan perfecto para tus necesidades, desde eventos gratuitos hasta experiencias premium
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                p: 3,
                border: plan.isFreePlan ? '2px solid #4caf50' : '1px solid #dfd3d3',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: 10,
                },
                borderRadius: '16px',
                background: plan.isFreePlan 
                  ? 'linear-gradient(45deg, #e8f5e9, #ffffff)'
                  : 'linear-gradient(45deg, #f5f5f5, #ffffff)',
                width: '100%',
                height: '420px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {plan.isFreePlan && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: '12px', 
                    right: '-30px', 
                    transform: 'rotate(45deg)',
                    bgcolor: '#4caf50', 
                    color: 'white', 
                    py: 0.5,
                    width: '150px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    zIndex: 1
                  }}
                >
                  ¡NUEVO!
                </Box>
              )}
              
              <CardContent sx={{ p: 0 }}>
                <Typography
                  variant="h5"
                  align="center"
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    color: plan.isFreePlan ? '#4caf50' : '#333'
                  }}
                >
                  {plan.title}
                </Typography>
                
                <Typography
                  variant="h4"
                  align="center"
                  sx={{ 
                    mt: 1, 
                    mb: 3, 
                    fontWeight: 'bold',
                    color: plan.isFreePlan ? '#4caf50' : '#2196f3'
                  }}
                >
                  {plan.price}
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ minHeight: '180px' }}>
                  <ul style={{ 
                    listStyleType: 'none', 
                    padding: 0, 
                    margin: 0,
                    textAlign: 'left'
                  }}>
                    {plan.features.map((feature, idx) => (
                      <Typography
                        key={idx}
                        component="li"
                        variant="body2"
                        sx={{
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          color: 'text.primary',
                          fontSize: '14px',
                          '&:before': {
                            content: '"✓"',
                            color: plan.isFreePlan ? '#4caf50' : '#2196f3',
                            fontWeight: 'bold',
                            marginRight: '8px'
                          }
                        }}
                      >
                        {feature}
                      </Typography>
                    ))}
                  </ul>
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(plan.path)}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    backgroundColor: plan.isFreePlan ? '#4caf50' : '#2196f3',
                    color: '#fff',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    '&:hover': { 
                      backgroundColor: plan.isFreePlan ? '#388e3c' : '#1976d2',
                      transform: 'scale(1.05)'
                    },
                    transition: 'transform 0.2s'
                  }}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="body1" color="text.secondary" paragraph>
          ¿Necesitas un plan personalizado para tu evento? Contáctanos para opciones adicionales.
        </Typography>
        <Button 
          variant="outlined" 
          href="/contact"
          sx={{ 
            borderRadius: '30px', 
            px: 4, 
            py: 1,
            borderColor: '#2196f3',
            color: '#2196f3',
            '&:hover': {
              borderColor: '#1976d2',
              backgroundColor: 'rgba(33, 150, 243, 0.04)'
            }
          }}
        >
          Contactar
        </Button>
      </Box>
    </Container>
  );
}