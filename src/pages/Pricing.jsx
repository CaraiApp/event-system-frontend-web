import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    title: 'Básico',
    features: [
    'Publicación de eventos',
    'Opciones de asientos',
    'Imagen de banner',
    'Boleto con código QR',
    ],
    price: '$300.0',
    
  },
  {
    title: 'Estándar',
    features: [
    'Múltiples eventos',
    '2 mapas de asientos',
    'Solicitudes destacadas (4x)',
    'Galería de fotos',
    'Boleto con código QR',
    ],
    price: '$500.0',
    
  },
  {
    title: 'Premium',
    features: [
    'Publicación de eventos',
    'Solicitudes destacadas',
    'Galería de fotos',
    'Asignación de asientos temáticos',
    'Eventos sin boleto electrónico',
    'Boleto con código QR',
    ],
    price: '$1000.0',
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4, marginTop: 15 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        Suscripción
      </Typography>

      <Grid container spacing={3}>
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              onClick={() => navigate('/create-event')}
              sx={{
                p: 2,
                border: '1px solid #dfd3d3',
             
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                },
                borderRadius: '10px',
                background: 'linear-gradient(45deg, #c3c3ed, transparent)',
                width: '100%', // Makes card responsive
                height: '350px', // Set a fixed height for all cards
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  align="center"
                  sx={{ fontWeight: 'bold', mb: 2 }}
                >
                  {plan.title}
                </Typography>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  {plan.features.map((feature, idx) => (
                    <Typography
                      key={idx}
                      component="li"
                      variant="body2"
                      sx={{
                        mb: 1,
                        fontWeight: 'bold',
                        color: 'text.secondary',
                        fontSize: '14px', // Adjust font size for better styling
                      }}
                    >
                      {feature}
                    </Typography>
                  ))}
                </ul>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mt: 2, fontWeight: 'bold' }}
                >
                  {plan.price}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: '#007bff',
                    color: '#fff',
                    fontWeight: 'bold', // Ensure button text is bold
                    '&:hover': { backgroundColor: '#0056b3' },
                  }}
                >
                  Suscribir
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
