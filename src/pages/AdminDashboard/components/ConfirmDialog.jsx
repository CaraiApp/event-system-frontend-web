import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Componente para diálogos de confirmación
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  confirmColor = 'primary',
  showCancel = true,
  loading = false,
  icon,
  maxWidth = 'sm'
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth={maxWidth}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon && (
            <Box 
              sx={{ 
                mr: 1, 
                color: confirmColor === 'error' ? 'error.main' : 'primary.main',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Box>
        
        {onCancel && (
          <IconButton
            aria-label="close"
            onClick={onCancel}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent dividers>
        <DialogContentText 
          id="alert-dialog-description"
          sx={{ color: 'text.primary' }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        {showCancel && (
          <Button 
            onClick={onCancel} 
            color="inherit"
            variant="outlined"
            disabled={loading}
          >
            {cancelText}
          </Button>
        )}
        
        <Button 
          onClick={onConfirm} 
          color={confirmColor} 
          variant="contained"
          autoFocus
          disabled={loading}
        >
          {loading ? 'Procesando...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;