import React from 'react';
import { Box, Card, Typography, CardContent } from '@mui/material';
import { alpha } from '@mui/material/styles';

const StatCard = ({ title, value, subtitle, change, icon, color = 'primary' }) => {
  // Colores predefinidos
  const colors = {
    primary: '#2196f3',
    secondary: '#673ab7',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#03a9f4'
  };

  // Obtener el color seleccionado o usar el primario por defecto
  const themeColor = colors[color] || colors.primary;

  return (
    <Card sx={{ 
      height: '100%',
      borderRadius: 2,
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && change !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {subtitle}:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    ml: 0.5,
                    color: typeof change === 'number' && change < 0 ? 'error.main' : 'success.main',
                    fontWeight: 'medium'
                  }}
                >
                  {change}
                </Typography>
              </Box>
            )}
          </Box>
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 1.5,
              borderRadius: '12px',
              bgcolor: alpha(themeColor, 0.12),
              color: themeColor
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;