import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Estado local para los datos de formulario
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: ''
  });

  // Cargar los datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/v1/users/getSingleUser', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const userData = response.data.data;
          setUser(userData);
          
          // Inicializar el formulario con los datos del usuario
          setFormData({
            fullName: userData.fullName || '',
            username: userData.username || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            address: userData.address || '',
            city: userData.city || ''
          });
          
          setLoading(false);
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
          setSnackbar({
            open: true,
            message: 'Error al cargar los datos del perfil',
            severity: 'error'
          });
          setLoading(false);
        }
      }
    };
    
    fetchUser();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Aquí iría la lógica para actualizar el perfil
        // Por ahora simularemos un retardo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Actualizar el estado del usuario con los nuevos datos
        setUser({
          ...user,
          ...formData
        });
        
        setEditMode(false);
        setSnackbar({
          open: true,
          message: 'Perfil actualizado correctamente',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        setSnackbar({
          open: true,
          message: 'Error al actualizar el perfil',
          severity: 'error'
        });
      } finally {
        setSaving(false);
      }
    }
  };

  // Cancelar la edición
  const handleCancel = () => {
    // Restaurar los datos originales
    setFormData({
      fullName: user.fullName || '',
      username: user.username || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      city: user.city || ''
    });
    setEditMode(false);
  };

  // Cerrar el snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Mi Perfil
          </Typography>
          {!editMode ? (
            <Button 
              variant="contained" 
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
            >
              Editar Perfil
            </Button>
          ) : (
            <Box>
              <Button 
                variant="outlined" 
                color="secondary"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{ mr: 1 }}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Guardar'}
              </Button>
            </Box>
          )}
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {/* Avatar y nombre */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: '#3795d6',
                mb: 2
              }}
            >
              {user.username ? user.username[0].toUpperCase() : <PersonIcon fontSize="large" />}
            </Avatar>
            
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {user.username || 'Usuario'}
            </Typography>
            
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {user.role === 'user' ? 'Usuario' : user.role}
            </Typography>
            
            <Typography variant="body2" color="textSecondary">
              Miembro desde: {new Date(user.createdAt || Date.now()).toLocaleDateString('es-ES')}
            </Typography>
          </Grid>
          
          {/* Formulario de información personal */}
          <Grid item xs={12} md={8}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre de Usuario"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    disabled={!editMode || saving}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre Completo"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    fullWidth
                    disabled={!editMode || saving}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Correo Electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    disabled={!editMode || saving}
                    type="email"
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Teléfono"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    disabled={!editMode || saving}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ciudad"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    fullWidth
                    disabled={!editMode || saving}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Dirección"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    disabled={!editMode || saving}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Sección de seguridad */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Seguridad de la Cuenta
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Button
          variant="outlined"
          color="primary"
          sx={{ mb: 2 }}
        >
          Cambiar Contraseña
        </Button>
      </Paper>
      
      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;