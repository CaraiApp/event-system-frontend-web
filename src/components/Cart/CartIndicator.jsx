import React from 'react';
import { useCart } from '../../CartContext';
import { Badge, Box, IconButton, Tooltip, Typography, Chip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const CartIndicator = () => {
  const { 
    cartItems, 
    timeRemaining, 
    formatTimeRemaining,
    loading
  } = useCart();

  // No mostrar si el carrito está vacío
  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        py: 0.5,
        px: 1,
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.05)'
      }}
    >
      <Tooltip title="Carrito de asientos">
        <Badge 
          badgeContent={cartItems.length} 
          color="primary"
          overlap="circular"
        >
          <IconButton color="primary" disabled={loading}>
            <ShoppingCartIcon />
          </IconButton>
        </Badge>
      </Tooltip>
      
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
          {cartItems.length} asiento{cartItems.length !== 1 ? 's' : ''} en carrito
        </Typography>
        
        {timeRemaining > 0 && (
          <Chip
            icon={<AccessTimeIcon fontSize="small" />}
            label={formatTimeRemaining()}
            size="small"
            color={timeRemaining < 60000 ? "error" : "success"}
            variant="outlined"
            sx={{ 
              height: 24, 
              '& .MuiChip-icon': { 
                fontSize: '0.9rem',
                marginLeft: '4px'
              }, 
              '& .MuiChip-label': { 
                px: 1,
                fontSize: '0.75rem' 
              } 
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default CartIndicator;