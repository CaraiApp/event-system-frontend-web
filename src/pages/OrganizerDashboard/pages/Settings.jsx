import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Button, Divider,
  FormControlLabel, Switch, CircularProgress, Snackbar, Alert,
  Card, CardContent, Avatar, IconButton, Accordion, AccordionSummary,
  AccordionDetails, InputAdornment
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import axios from 'axios';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profileData, setProfileData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    taxId: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileImage: null,
    profileImageUrl: '',
    bio: '',
    website: '',
    notifyNewSales: true,
    notifyLowInventory: true,
    notifyEventReminders: true,
    showCompanyInfo: true
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No se encontró token de autenticación');
        setLoading(false);
        return;
      }
      
      try {
        // Este endpoint se implementará en el backend
        // const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        // const response = await axios.get(`${API_BASE_URL}/api/v1/users/profile`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        
        // Datos de prueba
        setTimeout(() => {
          const mockProfileData = {
            username: 'organizador1',
            fullName: 'Juan Organizador',
            email: 'organizador@example.com',
            phone: '+34 612345678',
            companyName: 'Eventos Increíbles',
            taxId: 'A12345678',
            profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
            bio: 'Organizador de eventos con 10 años de experiencia en conciertos, eventos deportivos y conferencias.',
            website: 'www.eventosincreibles.com',
            notifyNewSales: true,
            notifyLowInventory: true,
            notifyEventReminders: true,
            showCompanyInfo: true
          };
          
          setProfileData(prevData => ({
            ...prevData,
            ...mockProfileData
          }));
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Error al cargar los datos del perfil');
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);
  
  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: checked
    }));
  };
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileData(prevData => ({
        ...prevData,
        profileImage: file,
        profileImageUrl: URL.createObjectURL(file)
      }));
    }
  };
  
  const toggleShowPassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  const handleSaveProfile = async () => {
    // Validar que las contraseñas coincidan si se están cambiando
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setSaving(true);
    
    try {
      // Implementar llamada a la API para guardar datos
      // const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
      // const formData = new FormData();
      // Object.keys(profileData).forEach(key => {
      //   if (key === 'profileImage' && profileData.profileImage) {
      //     formData.append('profileImage', profileData.profileImage);
      //   } else if (key !== 'profileImageUrl' && key !== 'profileImage') {
      //     formData.append(key, profileData[key]);
      //   }
      // });
      // 
      // const token = localStorage.getItem('token');
      // await axios.put(`${API_BASE_URL}/api/v1/users/profile`, formData, {
      //   headers: { 
      //     Authorization: `Bearer ${token}`,
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      
      // Simulación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Perfil actualizado correctamente');
      
      // Limpiar campos de contraseña
      setProfileData(prevData => ({
        ...prevData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <>
      <Box className="dashboard-title">
        <Typography variant="h4" component="h1" className="dashboard-title-text">
          Configuración
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* Columna izquierda - Perfil */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  alt={profileData.fullName}
                  src={profileData.profileImageUrl}
                  sx={{ width: 120, height: 120, margin: '0 auto 16px auto' }}
                />
                <IconButton
                  color="primary"
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  <PhotoCameraIcon />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </IconButton>
              </Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {profileData.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                @{profileData.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profileData.email}
              </Typography>
              {profileData.companyName && (
                <Typography variant="body1" sx={{ mt: 2, fontWeight: 'medium' }}>
                  {profileData.companyName}
                </Typography>
              )}
              {profileData.website && (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  href={`https://${profileData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 2 }}
                  size="small"
                >
                  Visitar Sitio Web
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estadísticas Rápidas
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Eventos Creados:</Typography>
                <Typography variant="body2" fontWeight="bold">12</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Entradas Vendidas:</Typography>
                <Typography variant="body2" fontWeight="bold">325</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Ingresos Totales:</Typography>
                <Typography variant="body2" fontWeight="bold">¬15,750.50</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Miembro desde:</Typography>
                <Typography variant="body2" fontWeight="bold">Enero 2023</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Columna derecha - Formularios */}
        <Grid item xs={12} md={8}>
          {/* Información personal */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Información Personal
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre de usuario"
                  name="username"
                  value={profileData.username}
                  onChange={handleTextChange}
                  variant="outlined"
                  disabled
                  helperText="El nombre de usuario no se puede cambiar"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleTextChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleTextChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleTextChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Biografía"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleTextChange}
                  variant="outlined"
                  multiline
                  rows={3}
                  helperText="Una breve descripción sobre ti o tu organización"
                />
              </Grid>
            </Grid>
          </Paper>
          
          {/* Información de empresa */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Información de Empresa
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre de empresa"
                  name="companyName"
                  value={profileData.companyName}
                  onChange={handleTextChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CIF/NIF"
                  name="taxId"
                  value={profileData.taxId}
                  onChange={handleTextChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sitio web"
                  name="website"
                  value={profileData.website}
                  onChange={handleTextChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">https://</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.showCompanyInfo}
                      onChange={handleSwitchChange}
                      name="showCompanyInfo"
                      color="primary"
                    />
                  }
                  label="Mostrar información de empresa en las páginas de eventos"
                />
              </Grid>
            </Grid>
          </Paper>
          
          {/* Cambiar contraseña */}
          <Accordion sx={{ mb: 4 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Cambiar Contraseña</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contraseña actual"
                    name="currentPassword"
                    type={showPassword.current ? 'text' : 'password'}
                    value={profileData.currentPassword}
                    onChange={handleTextChange}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => toggleShowPassword('current')}
                            edge="end"
                          >
                            {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nueva contraseña"
                    name="newPassword"
                    type={showPassword.new ? 'text' : 'password'}
                    value={profileData.newPassword}
                    onChange={handleTextChange}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => toggleShowPassword('new')}
                            edge="end"
                          >
                            {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirmar nueva contraseña"
                    name="confirmPassword"
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={profileData.confirmPassword}
                    onChange={handleTextChange}
                    variant="outlined"
                    error={profileData.newPassword !== profileData.confirmPassword && profileData.confirmPassword !== ''}
                    helperText={profileData.newPassword !== profileData.confirmPassword && profileData.confirmPassword !== '' ? 'Las contraseñas no coinciden' : ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => toggleShowPassword('confirm')}
                            edge="end"
                          >
                            {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          {/* Notificaciones */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Preferencias de Notificaciones
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.notifyNewSales}
                      onChange={handleSwitchChange}
                      name="notifyNewSales"
                      color="primary"
                    />
                  }
                  label="Recibir notificaciones de nuevas ventas"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.notifyLowInventory}
                      onChange={handleSwitchChange}
                      name="notifyLowInventory"
                      color="primary"
                    />
                  }
                  label="Alertas de inventario bajo (menos del 20% de entradas disponibles)"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.notifyEventReminders}
                      onChange={handleSwitchChange}
                      name="notifyEventReminders"
                      color="primary"
                    />
                  }
                  label="Recordatorios de eventos (48h antes del evento)"
                />
              </Grid>
            </Grid>
          </Paper>
          
          {/* Botón guardar */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveProfile}
              disabled={saving}
              sx={{ px: 4, py: 1 }}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
              {saving && <CircularProgress size={24} sx={{ ml: 1 }} />}
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {/* Notificaciones */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Settings;