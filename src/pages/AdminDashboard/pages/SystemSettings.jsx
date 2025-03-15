import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Button, FormControlLabel, Switch,
  Divider, Alert, CircularProgress, Card, CardContent, CardHeader, Tabs, Tab,
  FormControl, InputLabel, Select, MenuItem, InputAdornment, Accordion,
  AccordionSummary, AccordionDetails, Chip, IconButton, Tooltip, Snackbar,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import {
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  DeleteOutline as DeleteOutlineIcon,
  BuildOutlined as BuildOutlinedIcon,
  EmailOutlined as EmailOutlinedIcon,
  PaymentOutlined as PaymentOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  SecurityOutlined as SecurityOutlinedIcon,
  EventAvailableOutlined as EventAvailableOutlinedIcon,
  PersonOutlineOutlined as PersonOutlineOutlinedIcon,
  GavelOutlined as GavelOutlinedIcon,
  Refresh as RefreshIcon,
  Autorenew as AutorenewIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon,
  Cached as CachedIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon
} from '@mui/icons-material';
import axios from 'axios';

// TabPanel para las pesta�as
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SystemSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [cleaningInProgress, setCleaningInProgress] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'EntradasMelilla',
      siteDescription: 'Compra tus entradas para los mejores eventos de Melilla',
      contactEmail: 'info@entradasmelilla.com',
      supportPhone: '+34 612 345 678',
      logoUrl: '',
      faviconUrl: '',
      defaultLanguage: 'es',
      timeZone: 'Europe/Madrid',
      maintenanceMode: false,
      maintenanceMessage: 'Estamos realizando tareas de mantenimiento. Por favor, vuelve m�s tarde.'
    },
    payment: {
      currency: 'EUR',
      currencySymbol: '�',
      stripeEnabled: true,
      stripePublicKey: 'pk_test_********************************',
      stripeSecretKey: 'sk_test_********************************',
      paypalEnabled: false,
      paypalClientId: '',
      paypalClientSecret: '',
      bankTransferEnabled: true,
      bankTransferInstructions: 'Realiza la transferencia a la siguiente cuenta bancaria...',
      commissionRate: 5,
      commissionType: 'percentage', // percentage | fixed
      commissionFixed: 0
    },
    email: {
      emailProvider: 'brevo',
      smtpHost: 'smtp-relay.brevo.com',
      smtpPort: 587,
      smtpUser: 'info@entradasmelilla.com',
      smtpPassword: '********************',
      smtpEncryption: 'tls',
      fromName: 'EntradasMelilla',
      fromEmail: 'info@entradasmelilla.com',
      emailTemplates: [
        { id: 'welcome', name: 'Bienvenida', subject: 'Bienvenido a EntradasMelilla' },
        { id: 'booking_confirmation', name: 'Confirmaci�n de Reserva', subject: 'Confirmaci�n de tu reserva' },
        { id: 'booking_cancelled', name: 'Reserva Cancelada', subject: 'Tu reserva ha sido cancelada' },
        { id: 'payment_confirmation', name: 'Confirmaci�n de Pago', subject: 'Confirmaci�n de pago' },
        { id: 'event_reminder', name: 'Recordatorio de Evento', subject: 'Recordatorio: Tu evento se acerca' }
      ]
    },
    events: {
      maxTicketsPerPurchase: 10,
      minTicketsPerPurchase: 1,
      allowGuestCheckout: true,
      requirePhoneNumber: true,
      requireAddress: false,
      enableWaitlist: true,
      enableRefunds: true,
      refundPeriodDays: 7,
      enablePartialRefunds: false,
      defaultEventDuration: 120, // minutes
      defaultTicketTypes: [
        { id: 'standard', name: 'Est�ndar', color: '#2196F3' },
        { id: 'vip', name: 'VIP', color: '#F44336' }
      ]
    },
    security: {
      requireEmailVerification: true,
      twoFactorAuthEnabled: false,
      passwordMinLength: 8,
      passwordRequireSpecialChars: true,
      passwordRequireNumbers: true,
      passwordRequireUppercase: true,
      accountLockoutAttempts: 5,
      sessionTimeout: 60, // minutes
      jwtExpirationTime: 24, // hours
      allowedOrigins: ['https://entradasmelilla.com', 'https://admin.entradasmelilla.com']
    },
    privacy: {
      privacyPolicyUrl: 'https://entradasmelilla.com/privacy',
      termsOfServiceUrl: 'https://entradasmelilla.com/terms',
      cookiePolicyUrl: 'https://entradasmelilla.com/cookies',
      dataDeletionPeriod: 365, // days
      gdprCompliant: true,
      cookieConsentRequired: true,
      analyticsEnabled: true,
      analyticsProvider: 'google',
      analyticsTrackingId: 'G-XXXXXXXXXX'
    },
    users: {
      allowUserRegistration: true,
      allowSocialLogin: false,
      defaultUserRole: 'user',
      requireOrganizerApproval: true,
      maxEventsPerOrganizer: 0, // 0 = unlimited
      maxAttendeesPerEvent: 0, // 0 = unlimited
      organizerCommissionRate: 5, // percentage
      adminEmails: ['admin@entradasmelilla.com']
    }
  });
  
  // Función para obtener estado de tareas programadas
  const fetchSchedulerStatus = async () => {
    setLoadingTasks(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      
      const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
      const response = await axios.get(`${API_BASE_URL}/api/v1/scheduler/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data && response.data.data.tasks) {
        setScheduledTasks(response.data.data.tasks);
      } else {
        // Si no hay conexión al backend o la API aún no está implementada, 
        // usamos datos de muestra para la demo
        setScheduledTasks([
          {
            name: 'tempBookingCleanup',
            expression: '*/2 * * * *',
            active: true,
            createdAt: new Date().toISOString(),
            description: 'Limpieza de reservas temporales expiradas'
          },
          {
            name: 'eventReminder',
            expression: '0 9 * * *',
            active: true,
            createdAt: new Date().toISOString(),
            description: 'Envío de recordatorios de eventos'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching scheduler status:', error);
      // Generar datos de muestra para la demo si hay error
      setScheduledTasks([
        {
          name: 'tempBookingCleanup',
          expression: '*/2 * * * *',
          active: true,
          createdAt: new Date().toISOString(),
          description: 'Limpieza de reservas temporales expiradas'
        }
      ]);
    } finally {
      setLoadingTasks(false);
    }
  };
  
  // Función para ejecutar limpieza manual de reservas temporales
  const executeCleanupNow = async () => {
    setCleaningInProgress(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      
      const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/tempbookings/cleanup-now`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data && response.data.status === 'success') {
        setSuccess('Limpieza de reservas temporales iniciada correctamente');
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError('Error al iniciar limpieza de reservas temporales');
      }
    } catch (error) {
      console.error('Error executing cleanup:', error);
      setError('Error al iniciar limpieza: ' + (error.response?.data?.message || error.message));
    } finally {
      setCleaningInProgress(false);
    }
  };
  
  // Función para ejecutar una tarea programada manualmente
  const runScheduledTask = async (taskName) => {
    setLoadingTasks(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      
      const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/scheduler/execute/${taskName}`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data && response.data.status === 'success') {
        setSuccess(`Tarea ${taskName} ejecutada correctamente`);
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(`Error al ejecutar tarea ${taskName}`);
      }
    } catch (error) {
      console.error('Error running scheduled task:', error);
      setError('Error al ejecutar tarea: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No se encontró token de autenticación');
        setLoading(false);
        return;
      }
      
      try {
        // En producción, aquí se realizará la petición real a la API
        // const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        // const response = await axios.get(`${API_BASE_URL}/api/v1/admin/settings`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setSettings(response.data.data);
        
        // Cargar también las tareas programadas
        fetchSchedulerStatus();
        
        // Simulamos un tiempo de carga
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Error al cargar la configuración del sistema');
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSettingChange = (section, field, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: value
      }
    }));
  };
  
  const handleNestedSettingChange = (section, subField, field, value) => {
    const updatedArray = [...settings[section][subField]];
    const index = updatedArray.findIndex(item => item.id === field);
    
    if (index !== -1) {
      updatedArray[index] = { ...updatedArray[index], ...value };
      
      setSettings(prevSettings => ({
        ...prevSettings,
        [section]: {
          ...prevSettings[section],
          [subField]: updatedArray
        }
      }));
    }
  };
  
  const handleDeleteItem = (section, subField, itemId) => {
    const updatedArray = settings[section][subField].filter(item => item.id !== itemId);
    
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [subField]: updatedArray
      }
    }));
  };
  
  const handleAddItem = (section, subField, newItem) => {
    const updatedArray = [...settings[section][subField], newItem];
    
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [subField]: updatedArray
      }
    }));
  };
  
  const handleRefresh = () => {
    setLoading(true);
    // En una implementaci�n real, aqu� se recargar�an los datos desde el backend
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      // En producci�n, aqu� se realizar� la petici�n real a la API
      // const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
      // const token = localStorage.getItem('token');
      // await axios.put(`${API_BASE_URL}/api/v1/admin/settings`, settings, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Simulamos un tiempo de guardado
      setTimeout(() => {
        setSuccess('Configuraci�n guardada correctamente');
        setSaving(false);
        
        // Ocultar mensaje de �xito despu�s de 3 segundos
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }, 1500);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Error al guardar la configuraci�n');
      setSaving(false);
    }
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
      <Box className="admin-title">
        <Typography variant="h4" component="h1" className="admin-title-text">
          Configuraci�n del Sistema
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Actualizar
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>
      </Box>
      
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      {/* Panel Principal */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Estado del Sistema"
          subheader="Informaci�n general sobre el sistema"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Nombre del Sitio
                </Typography>
                <Typography variant="h6">
                  {settings.general.siteName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Versi�n del Sistema
                </Typography>
                <Typography variant="h6">
                  2.0.1
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Estado
                </Typography>
                <Chip 
                  label={settings.general.maintenanceMode ? 'Mantenimiento' : 'Activo'} 
                  color={settings.general.maintenanceMode ? 'warning' : 'success'} 
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Pasarelas de Pago
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label="Stripe" 
                    color={settings.payment.stripeEnabled ? 'success' : 'default'} 
                    variant={settings.payment.stripeEnabled ? 'filled' : 'outlined'} 
                    size="small" 
                  />
                  <Chip 
                    label="PayPal" 
                    color={settings.payment.paypalEnabled ? 'success' : 'default'} 
                    variant={settings.payment.paypalEnabled ? 'filled' : 'outlined'} 
                    size="small" 
                  />
                  <Chip 
                    label="Transferencia" 
                    color={settings.payment.bankTransferEnabled ? 'success' : 'default'} 
                    variant={settings.payment.bankTransferEnabled ? 'filled' : 'outlined'} 
                    size="small" 
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Comisi�n por Venta
                </Typography>
                <Typography variant="h6">
                  {settings.payment.commissionType === 'percentage' 
                    ? `${settings.payment.commissionRate}%` 
                    : `${settings.payment.commissionFixed}�`}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Email de Soporte
                </Typography>
                <Typography variant="h6">
                  {settings.general.contactEmail}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Pesta�as de Configuraci�n */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="settings tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<SettingsOutlinedIcon />} iconPosition="start" label="General" />
          <Tab icon={<PaymentOutlinedIcon />} iconPosition="start" label="Pagos" />
          <Tab icon={<EmailOutlinedIcon />} iconPosition="start" label="Email" />
          <Tab icon={<EventAvailableOutlinedIcon />} iconPosition="start" label="Eventos" />
          <Tab icon={<SecurityOutlinedIcon />} iconPosition="start" label="Seguridad" />
          <Tab icon={<GavelOutlinedIcon />} iconPosition="start" label="Privacidad" />
          <Tab icon={<PersonOutlineOutlinedIcon />} iconPosition="start" label="Usuarios" />
          <Tab icon={<ScheduleIcon />} iconPosition="start" label="Tareas Programadas" />
          <Tab icon={<BuildOutlinedIcon />} iconPosition="start" label="Avanzado" />
        </Tabs>
        
        {/* Configuraci�n General */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuraci�n General
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configura los ajustes b�sicos de la plataforma.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre del Sitio"
                  value={settings.general.siteName}
                  onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email de Contacto"
                  value={settings.general.contactEmail}
                  onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripci�n del Sitio"
                  value={settings.general.siteDescription}
                  onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tel�fono de Soporte"
                  value={settings.general.supportPhone}
                  onChange={(e) => handleSettingChange('general', 'supportPhone', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="timezone-label">Zona Horaria</InputLabel>
                  <Select
                    labelId="timezone-label"
                    value={settings.general.timeZone}
                    label="Zona Horaria"
                    onChange={(e) => handleSettingChange('general', 'timeZone', e.target.value)}
                  >
                    <MenuItem value="Europe/Madrid">Europe/Madrid</MenuItem>
                    <MenuItem value="Europe/London">Europe/London</MenuItem>
                    <MenuItem value="Europe/Paris">Europe/Paris</MenuItem>
                    <MenuItem value="America/New_York">America/New_York</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="language-label">Idioma Predeterminado</InputLabel>
                  <Select
                    labelId="language-label"
                    value={settings.general.defaultLanguage}
                    label="Idioma Predeterminado"
                    onChange={(e) => handleSettingChange('general', 'defaultLanguage', e.target.value)}
                  >
                    <MenuItem value="es">Espa�ol</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="fr">Fran�ais</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Modo Mantenimiento
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.general.maintenanceMode}
                      onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                      name="maintenanceMode"
                      color="primary"
                    />
                  }
                  label="Activar modo mantenimiento"
                />
                <TextField
                  fullWidth
                  label="Mensaje de Mantenimiento"
                  value={settings.general.maintenanceMessage}
                  onChange={(e) => handleSettingChange('general', 'maintenanceMessage', e.target.value)}
                  margin="normal"
                  multiline
                  rows={2}
                  disabled={!settings.general.maintenanceMode}
                />
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Configuraci�n de Pagos */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuraci�n de Pagos
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configura las pasarelas de pago y comisiones.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="currency-label">Moneda</InputLabel>
                  <Select
                    labelId="currency-label"
                    value={settings.payment.currency}
                    label="Moneda"
                    onChange={(e) => handleSettingChange('payment', 'currency', e.target.value)}
                  >
                    <MenuItem value="EUR">Euro (EUR)</MenuItem>
                    <MenuItem value="USD">US Dollar (USD)</MenuItem>
                    <MenuItem value="GBP">British Pound (GBP)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="S�mbolo de Moneda"
                  value={settings.payment.currencySymbol}
                  onChange={(e) => handleSettingChange('payment', 'currencySymbol', e.target.value)}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Comisiones
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="commission-type-label">Tipo de Comisi�n</InputLabel>
                      <Select
                        labelId="commission-type-label"
                        value={settings.payment.commissionType}
                        label="Tipo de Comisi�n"
                        onChange={(e) => handleSettingChange('payment', 'commissionType', e.target.value)}
                      >
                        <MenuItem value="percentage">Porcentaje</MenuItem>
                        <MenuItem value="fixed">Fijo</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {settings.payment.commissionType === 'percentage' ? (
                      <TextField
                        fullWidth
                        label="Porcentaje de Comisi�n"
                        value={settings.payment.commissionRate}
                        onChange={(e) => handleSettingChange('payment', 'commissionRate', e.target.value)}
                        margin="normal"
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    ) : (
                      <TextField
                        fullWidth
                        label="Comisi�n Fija"
                        value={settings.payment.commissionFixed}
                        onChange={(e) => handleSettingChange('payment', 'commissionFixed', e.target.value)}
                        margin="normal"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">{settings.payment.currencySymbol}</InputAdornment>,
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Pasarelas de Pago
                </Typography>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.payment.stripeEnabled}
                          onChange={(e) => handleSettingChange('payment', 'stripeEnabled', e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                      label="Stripe"
                      sx={{ width: '100%', mr: 0 }}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Stripe Public Key"
                          value={settings.payment.stripePublicKey}
                          onChange={(e) => handleSettingChange('payment', 'stripePublicKey', e.target.value)}
                          margin="normal"
                          disabled={!settings.payment.stripeEnabled}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Stripe Secret Key"
                          value={settings.payment.stripeSecretKey}
                          onChange={(e) => handleSettingChange('payment', 'stripeSecretKey', e.target.value)}
                          margin="normal"
                          type="password"
                          disabled={!settings.payment.stripeEnabled}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.payment.paypalEnabled}
                          onChange={(e) => handleSettingChange('payment', 'paypalEnabled', e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                      label="PayPal"
                      sx={{ width: '100%', mr: 0 }}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="PayPal Client ID"
                          value={settings.payment.paypalClientId}
                          onChange={(e) => handleSettingChange('payment', 'paypalClientId', e.target.value)}
                          margin="normal"
                          disabled={!settings.payment.paypalEnabled}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="PayPal Client Secret"
                          value={settings.payment.paypalClientSecret}
                          onChange={(e) => handleSettingChange('payment', 'paypalClientSecret', e.target.value)}
                          margin="normal"
                          type="password"
                          disabled={!settings.payment.paypalEnabled}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.payment.bankTransferEnabled}
                          onChange={(e) => handleSettingChange('payment', 'bankTransferEnabled', e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                      label="Transferencia Bancaria"
                      sx={{ width: '100%', mr: 0 }}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      label="Instrucciones de Transferencia"
                      value={settings.payment.bankTransferInstructions}
                      onChange={(e) => handleSettingChange('payment', 'bankTransferInstructions', e.target.value)}
                      margin="normal"
                      multiline
                      rows={4}
                      disabled={!settings.payment.bankTransferEnabled}
                    />
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Configuraci�n de Email */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuraci�n de Email
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configura el servicio de correo electr�nico y plantillas.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="email-provider-label">Proveedor de Email</InputLabel>
                  <Select
                    labelId="email-provider-label"
                    value={settings.email.emailProvider}
                    label="Proveedor de Email"
                    onChange={(e) => handleSettingChange('email', 'emailProvider', e.target.value)}
                  >
                    <MenuItem value="brevo">Brevo (Sendinblue)</MenuItem>
                    <MenuItem value="smtp">SMTP Personalizado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre del Remitente"
                  value={settings.email.fromName}
                  onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email del Remitente"
                  value={settings.email.fromEmail}
                  onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Configuraci�n SMTP
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Servidor SMTP"
                      value={settings.email.smtpHost}
                      onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Puerto SMTP"
                      value={settings.email.smtpPort}
                      onChange={(e) => handleSettingChange('email', 'smtpPort', e.target.value)}
                      margin="normal"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Usuario SMTP"
                      value={settings.email.smtpUser}
                      onChange={(e) => handleSettingChange('email', 'smtpUser', e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contrase�a SMTP"
                      value={settings.email.smtpPassword}
                      onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
                      margin="normal"
                      type="password"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="smtp-encryption-label">Encriptaci�n SMTP</InputLabel>
                      <Select
                        labelId="smtp-encryption-label"
                        value={settings.email.smtpEncryption}
                        label="Encriptaci�n SMTP"
                        onChange={(e) => handleSettingChange('email', 'smtpEncryption', e.target.value)}
                      >
                        <MenuItem value="tls">TLS</MenuItem>
                        <MenuItem value="ssl">SSL</MenuItem>
                        <MenuItem value="none">Ninguna</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Plantillas de Email
                </Typography>
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Plantilla</TableCell>
                        <TableCell>Asunto</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {settings.email.emailTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>{template.name}</TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              value={template.subject}
                              onChange={(e) => handleNestedSettingChange(
                                'email', 
                                'emailTemplates', 
                                template.id, 
                                { subject: e.target.value }
                              )}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Editar Plantilla">
                              <IconButton size="small" color="primary">
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar Plantilla">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteItem('email', 'emailTemplates', template.id)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 2 }}
                  onClick={() => handleAddItem('email', 'emailTemplates', {
                    id: `template_${Date.now()}`,
                    name: 'Nueva Plantilla',
                    subject: 'Asunto de la nueva plantilla'
                  })}
                >
                  A�adir Plantilla
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Configuraci�n de Eventos */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuraci�n de Eventos
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configura las opciones relacionadas con eventos.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="M�ximo de Entradas por Compra"
                  value={settings.events.maxTicketsPerPurchase}
                  onChange={(e) => handleSettingChange('events', 'maxTicketsPerPurchase', e.target.value)}
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="M�nimo de Entradas por Compra"
                  value={settings.events.minTicketsPerPurchase}
                  onChange={(e) => handleSettingChange('events', 'minTicketsPerPurchase', e.target.value)}
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Duraci�n Predeterminada (minutos)"
                  value={settings.events.defaultEventDuration}
                  onChange={(e) => handleSettingChange('events', 'defaultEventDuration', e.target.value)}
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Per�odo de Reembolso (d�as)"
                  value={settings.events.refundPeriodDays}
                  onChange={(e) => handleSettingChange('events', 'refundPeriodDays', e.target.value)}
                  margin="normal"
                  type="number"
                  disabled={!settings.events.enableRefunds}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.events.allowGuestCheckout}
                      onChange={(e) => handleSettingChange('events', 'allowGuestCheckout', e.target.checked)}
                      name="allowGuestCheckout"
                      color="primary"
                    />
                  }
                  label="Permitir checkout de invitados (sin registro)"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.events.requirePhoneNumber}
                      onChange={(e) => handleSettingChange('events', 'requirePhoneNumber', e.target.checked)}
                      name="requirePhoneNumber"
                      color="primary"
                    />
                  }
                  label="Requerir n�mero de tel�fono en la compra"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.events.requireAddress}
                      onChange={(e) => handleSettingChange('events', 'requireAddress', e.target.checked)}
                      name="requireAddress"
                      color="primary"
                    />
                  }
                  label="Requerir direcci�n en la compra"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.events.enableWaitlist}
                      onChange={(e) => handleSettingChange('events', 'enableWaitlist', e.target.checked)}
                      name="enableWaitlist"
                      color="primary"
                    />
                  }
                  label="Habilitar lista de espera para eventos agotados"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.events.enableRefunds}
                      onChange={(e) => handleSettingChange('events', 'enableRefunds', e.target.checked)}
                      name="enableRefunds"
                      color="primary"
                    />
                  }
                  label="Permitir reembolsos"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.events.enablePartialRefunds}
                      onChange={(e) => handleSettingChange('events', 'enablePartialRefunds', e.target.checked)}
                      name="enablePartialRefunds"
                      color="primary"
                      disabled={!settings.events.enableRefunds}
                    />
                  }
                  label="Permitir reembolsos parciales"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Tipos de Entradas Predeterminados
                </Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Color</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {settings.events.defaultTicketTypes.map((type) => (
                        <TableRow key={type.id}>
                          <TableCell>{type.id}</TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              value={type.name}
                              onChange={(e) => handleNestedSettingChange(
                                'events', 
                                'defaultTicketTypes', 
                                type.id, 
                                { name: e.target.value }
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  bgcolor: type.color,
                                  mr: 1,
                                  border: '1px solid rgba(0, 0, 0, 0.12)'
                                }}
                              />
                              <TextField
                                size="small"
                                value={type.color}
                                onChange={(e) => handleNestedSettingChange(
                                  'events', 
                                  'defaultTicketTypes', 
                                  type.id, 
                                  { color: e.target.value }
                                )}
                                sx={{ width: 120 }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteItem('events', 'defaultTicketTypes', type.id)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mt: 2 }}
                  onClick={() => handleAddItem('events', 'defaultTicketTypes', {
                    id: `ticket_${Date.now()}`,
                    name: 'Nuevo Tipo',
                    color: '#673AB7'
                  })}
                >
                  A�adir Tipo de Entrada
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Las pesta�as restantes pueden implementarse de manera similar */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuraci�n de Seguridad
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configura los ajustes de seguridad y autenticaci�n.
            </Typography>
            
            {/* Implementaci�n simplificada */}
            <Alert severity="info" sx={{ mb: 3 }}>
              La configuraci�n detallada de seguridad se implementar� en una versi�n futura.
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.requireEmailVerification}
                      onChange={(e) => handleSettingChange('security', 'requireEmailVerification', e.target.checked)}
                      name="requireEmailVerification"
                      color="primary"
                    />
                  }
                  label="Requerir verificaci�n de email"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.twoFactorAuthEnabled}
                      onChange={(e) => handleSettingChange('security', 'twoFactorAuthEnabled', e.target.checked)}
                      name="twoFactorAuthEnabled"
                      color="primary"
                    />
                  }
                  label="Habilitar autenticaci�n de dos factores"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Longitud M�nima de Contrase�a"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => handleSettingChange('security', 'passwordMinLength', e.target.value)}
                  margin="normal"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tiempo de Expiraci�n JWT (horas)"
                  value={settings.security.jwtExpirationTime}
                  onChange={(e) => handleSettingChange('security', 'jwtExpirationTime', e.target.value)}
                  margin="normal"
                  type="number"
                />
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={5}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuraci�n de Privacidad
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configura los ajustes relacionados con la privacidad y GDPR.
            </Typography>
            
            <Alert severity="info" sx={{ mb: C}}>
              La configuraci�n detallada de privacidad se implementar� en una versi�n futura.
            </Alert>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={6}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuraci�n de Usuarios
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configura los ajustes relacionados con los usuarios y organizadores.
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              La configuraci�n detallada de usuarios se implementar� en una versi�n futura.
            </Alert>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={7}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tareas Programadas
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Gestiona y monitoriza las tareas programadas del sistema, como limpieza de datos o envío de notificaciones.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />}
                onClick={fetchSchedulerStatus}
                disabled={loadingTasks}
              >
                Actualizar Estado
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<DeleteIcon />}
                onClick={executeCleanupNow}
                disabled={cleaningInProgress}
              >
                {cleaningInProgress ? (
                  <>
                    Limpiando reservas... <CircularProgress size={20} sx={{ ml: 1 }} />
                  </>
                ) : 'Limpiar Reservas Temporales'}
              </Button>
            </Box>
            
            {loadingTasks ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Paper>
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Tareas Activas del Sistema
                  </Typography>
                </Box>
                
                {scheduledTasks.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      No hay tareas programadas configuradas
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {scheduledTasks.map((task) => (
                      <Box key={task.name} sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                              <Typography variant="subtitle1">{task.name}</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">
                              {task.description || 'Sin descripción'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Chip 
                                label={task.expression} 
                                size="small" 
                                variant="outlined"
                                title="Expresión cron (minuto hora día-mes mes día-semana)"
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={6} md={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Chip 
                                label={task.active ? 'Activa' : 'Pausa'} 
                                color={task.active ? 'success' : 'default'} 
                                size="small"
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Tooltip title="Ejecutar ahora">
                                <IconButton 
                                  color="primary" 
                                  onClick={() => runScheduledTask(task.name)}
                                  disabled={loadingTasks || !task.active}
                                >
                                  <CachedIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">
                              Creada: {new Date(task.createdAt).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            )}
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Acciones Manuales
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Limpieza de Reservas Temporales
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Elimina manualmente todas las reservas temporales que han expirado. Útil cuando necesitas liberar asientos inmediatamente.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<DeleteIcon />}
                      onClick={executeCleanupNow}
                      disabled={cleaningInProgress}
                    >
                      {cleaningInProgress ? (
                        <>
                          Limpiando... <CircularProgress size={20} sx={{ ml: 1 }} />
                        </>
                      ) : 'Ejecutar Limpieza'}
                    </Button>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Estado del Programador
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Comprueba el estado del sistema de tareas programadas y actualiza la información mostrada.
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<RefreshIcon />}
                      onClick={fetchSchedulerStatus}
                      disabled={loadingTasks}
                    >
                      {loadingTasks ? (
                        <>
                          Actualizando... <CircularProgress size={20} sx={{ ml: 1 }} />
                        </>
                      ) : 'Actualizar Estado'}
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={8}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuración Avanzada
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configuraciones avanzadas del sistema.
            </Typography>
            
            <Alert severity="warning" sx={{ mb: 3 }}>
              Estas configuraciones son para usuarios avanzados. Modificarlas incorrectamente puede afectar el funcionamiento del sistema.
            </Alert>
          </Box>
        </TabPanel>
      </Paper>
      
      {/* Bot�n Guardar Fijo */}
      <Paper 
        sx={{ 
          position: 'sticky', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          p: 2, 
          display: 'flex', 
          justifyContent: 'flex-end',
          mt: 2,
          zIndex: 10
        }}
        elevation={3}
      >
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={saving}
          size="large"
        >
          {saving ? (
            <>
              Guardando... <CircularProgress size={20} sx={{ ml: 1 }} />
            </>
          ) : 'Guardar Todos los Cambios'}
        </Button>
      </Paper>
    </>
  );
};

export default SystemSettings;