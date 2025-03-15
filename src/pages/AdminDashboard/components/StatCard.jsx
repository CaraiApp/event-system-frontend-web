import React from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';

// Componente para mostrar una tarjeta de estadística
const StatCard = ({ title, value, icon, color, subtitle, change }) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s', 
        '&:hover': { 
          transform: 'translateY(-4px)', 
          boxShadow: theme.shadows[3] 
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: `${color}.light`, 
            color: `${color}.main`, 
            borderRadius: '50%', 
            p: 1,
            height: 40,
            width: 40
          }}
        >
          {icon}
        </Box>
      </Box>
      
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', my: 1 }}>
        {value}
      </Typography>
      
      {subtitle && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
          {change && (
            <Typography 
              variant="body2" 
              sx={{ 
                ml: 1, 
                color: change >= 0 ? 'success.main' : 'error.main', 
                fontWeight: 'medium' 
              }}
            >
              {change >= 0 ? '+' : ''}{change}%
            </Typography>
          )}
        </Box>
      )}

      {/* Decorative background element */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: -15, 
          right: -15, 
          width: 100, 
          height: 100, 
          borderRadius: '50%', 
          backgroundColor: `${color}.50`, 
          opacity: 0.3,
          zIndex: 0
        }} 
      />
    </Paper>
  );
};

export default StatCard;