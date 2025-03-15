import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  TextField, 
  Button, 
  Grid, 
  Switch, 
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Alert,
  Snackbar,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LockIcon from '@mui/icons-material/Lock';
import LanguageIcon from '@mui/icons-material/Language';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PageHeader from '../components/PageHeader';
import adminApi from '../services/api';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Configuración General
    siteName: '',
    contactEmail: '',
    supportPhone: '',
    logoUrl: '',
    primaryColor: '',
    secondaryColor: '',
    currencySymbol: '€',
    defaultLanguage: 'es',
    
    // Configuración Financiera
    comissionRate: 5,
    taxRate: 21,
    
    // Configuración de Seguridad
    allowNewRegistrations: true,
    requireEmailVerification: true,
    maintenanceMode: false,
    
    // Configuración de Carga
    allowedFileTypes: 'jpg,jpeg,png,pdf',
    maxFileSize: 5,
    timeZone: 'Europe/Madrid'
  });
  
  const [emailSettings, setEmailSettings] = useState({
    provider: 'smtp',
    host: '',
    port: 587,
    username: '',
    password: '',
    encryption: 'tls',
    fromName: '',
    fromEmail: '',
    replyToEmail: '',
    templates: {
      welcome: { subject: '', enabled: true },
      orderConfirmation: { subject: '', enabled: true },
      passwordReset: { subject: '', enabled: true },
      eventReminder: { subject: '', enabled: true },
    }
  });
  
  const [testEmail, setTestEmail] = useState({
    recipient: '',
    subject: 'Correo de prueba',
    message: 'Este es un correo de prueba enviado desde el panel de administración.'
  });
  
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [showPassword, setShowPassword] = useState(false);

  // Cargar configuración al montar el componente
  useEffect(() => {
    fetchSettings();
  }, [activeTab]);

  // Función para cargar configuración según la pestaña activa
  const fetchSettings = async () => {
    setLoading(true);
    try {
      if (activeTab === 0) {
        const response = await adminApi.getSystemSettings();
        if (response.data && response.data.data) {
          setSettings(response.data.data);
        }
      } else if (activeTab === 1) {
        const response = await adminApi.getEmailSettings();
        if (response.data && response.data.data) {
          setEmailSettings(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      setAlert({
        open: true,
        message: 'Error al cargar la configuración. Por favor, inténtalo de nuevo.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSystemSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEmailSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Manejo de campos anidados (por ejemplo templates.welcome.subject)
      const parts = name.split('.');
      
      if (parts.length === 3) {
        // Para campos como templates.welcome.subject
        setEmailSettings(prev => ({
          ...prev,
          [parts[0]]: {
            ...prev[parts[0]],
            [parts[1]]: {
              ...prev[parts[0]][parts[1]],
              [parts[2]]: type === 'checkbox' ? checked : value
            }
          }
        }));
      }
    } else {
      // Campos regulares
      setEmailSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleTestEmailChange = (e) => {
    const { name, value } = e.target;
    setTestEmail(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSystemSettings = async () => {
    setSaving(true);
    try {
      await adminApi.updateSystemSettings(settings);
      setAlert({
        open: true,
        message: 'Configuración del sistema actualizada correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al guardar configuración del sistema:', error);
      setAlert({
        open: true,
        message: 'Error al guardar la configuración. Por favor, inténtalo de nuevo.',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmailSettings = async () => {
    setSaving(true);
    try {
      await adminApi.updateEmailSettings(emailSettings);
      setAlert({
        open: true,
        message: 'Configuración de correo electrónico actualizada correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al guardar configuración de correo:', error);
      setAlert({
        open: true,
        message: 'Error al guardar la configuración. Por favor, inténtalo de nuevo.',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    setSaving(true);
    try {
      await adminApi.sendTestEmail(testEmail);
      setAlert({
        open: true,
        message: `Correo de prueba enviado a ${testEmail.recipient}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al enviar correo de prueba:', error);
      setAlert({
        open: true,
        message: 'Error al enviar correo de prueba. Por favor, verifica la configuración SMTP.',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Box>
      <PageHeader 
        title="Configuración del Sistema"
        subtitle="Gestiona la configuración general del sistema, correo electrónico y seguridad"
      />
      
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Configuración General" />
          <Tab label="Correo Electrónico" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Tab: Configuración General */}
              {activeTab === 0 && (
                <Box component="form">
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Información del Sitio
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="siteName"
                        label="Nombre del Sitio"
                        value={settings.siteName}
                        onChange={handleSystemSettingsChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="contactEmail"
                        label="Email de Contacto"
                        type="email"
                        value={settings.contactEmail}
                        onChange={handleSystemSettingsChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="supportPhone"
                        label="Teléfono de Soporte"
                        value={settings.supportPhone}
                        onChange={handleSystemSettingsChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="logoUrl"
                        label="URL del Logo"
                        value={settings.logoUrl}
                        onChange={handleSystemSettingsChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <ColorLensIcon sx={{ mr: 1 }} />
                    Personalización
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="primaryColor"
                        label="Color Principal"
                        value={settings.primaryColor}
                        onChange={handleSystemSettingsChange}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  backgroundColor: settings.primaryColor || '#ccc'
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="secondaryColor"
                        label="Color Secundario"
                        value={settings.secondaryColor}
                        onChange={handleSystemSettingsChange}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  backgroundColor: settings.secondaryColor || '#ccc'
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <LanguageIcon sx={{ mr: 1 }} />
                    Localización
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        name="currencySymbol"
                        label="Símbolo de Moneda"
                        value={settings.currencySymbol}
                        onChange={handleSystemSettingsChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        name="defaultLanguage"
                        label="Idioma Predeterminado"
                        value={settings.defaultLanguage}
                        onChange={handleSystemSettingsChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        name="timeZone"
                        label="Zona Horaria"
                        value={settings.timeZone}
                        onChange={handleSystemSettingsChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon sx={{ mr: 1 }} />
                    Configuración Financiera
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="comissionRate"
                        label="Porcentaje de Comisión"
                        value={settings.comissionRate}
                        onChange={handleSystemSettingsChange}
                        fullWidth
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="taxRate"
                        label="Porcentaje de Impuestos"
                        value={settings.taxRate}
                        onChange={handleSystemSettingsChange}
                        fullWidth
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <LockIcon sx={{ mr: 1 }} />
                    Seguridad y Acceso
                  </Typography>
                  
                  <FormGroup sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="allowNewRegistrations"
                              checked={settings.allowNewRegistrations}
                              onChange={handleSystemSettingsChange}
                            />
                          }
                          label="Permitir Nuevos Registros"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="requireEmailVerification"
                              checked={settings.requireEmailVerification}
                              onChange={handleSystemSettingsChange}
                            />
                          }
                          label="Requerir Verificación de Email"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="maintenanceMode"
                              checked={settings.maintenanceMode}
                              onChange={handleSystemSettingsChange}
                            />
                          }
                          label="Modo Mantenimiento"
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Archivos y Carga
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="allowedFileTypes"
                        label="Tipos de Archivo Permitidos"
                        value={settings.allowedFileTypes}
                        onChange={handleSystemSettingsChange}
                        fullWidth
                        helperText="Separados por comas (ej: jpg,png,pdf)"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="maxFileSize"
                        label="Tamaño Máximo de Archivo"
                        value={settings.maxFileSize}
                        onChange={handleSystemSettingsChange}
                        fullWidth
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">MB</InputAdornment>,
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleSaveSystemSettings}
                      startIcon={<SaveIcon />}
                      disabled={saving}
                    >
                      {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </Button>
                  </Box>
                </Box>
              )}
              
              {/* Tab: Correo Electrónico */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Configuración SMTP
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="provider"
                        label="Proveedor"
                        value={emailSettings.provider}
                        onChange={handleEmailSettingsChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="host"
                        label="Servidor SMTP"
                        value={emailSettings.host}
                        onChange={handleEmailSettingsChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="port"
                        label="Puerto"
                        value={emailSettings.port}
                        onChange={handleEmailSettingsChange}
                        fullWidth
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="encryption"
                        label="Encriptación"
                        value={emailSettings.encryption}
                        onChange={handleEmailSettingsChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="username"
                        label="Usuario SMTP"
                        value={emailSettings.username}
                        onChange={handleEmailSettingsChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="password"
                        label="Contraseña SMTP"
                        value={emailSettings.password}
                        onChange={handleEmailSettingsChange}
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={toggleShowPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Configuración de Remitente
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        name="fromName"
                        label="Nombre del Remitente"
                        value={emailSettings.fromName}
                        onChange={handleEmailSettingsChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        name="fromEmail"
                        label="Email del Remitente"
                        value={emailSettings.fromEmail}
                        onChange={handleEmailSettingsChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        name="replyToEmail"
                        label="Email de Respuesta"
                        value={emailSettings.replyToEmail}
                        onChange={handleEmailSettingsChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Plantillas de Correo
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>
                            Email de Bienvenida
                            {!emailSettings.templates.welcome.enabled && (
                              <Typography component="span" sx={{ ml: 1, color: 'text.secondary' }}>
                                (Desactivado)
                              </Typography>
                            )}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                name="templates.welcome.subject"
                                label="Asunto"
                                value={emailSettings.templates.welcome.subject}
                                onChange={handleEmailSettingsChange}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    name="templates.welcome.enabled"
                                    checked={emailSettings.templates.welcome.enabled}
                                    onChange={handleEmailSettingsChange}
                                  />
                                }
                                label="Activar plantilla"
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                      
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>
                            Confirmación de Pedido
                            {!emailSettings.templates.orderConfirmation.enabled && (
                              <Typography component="span" sx={{ ml: 1, color: 'text.secondary' }}>
                                (Desactivado)
                              </Typography>
                            )}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                name="templates.orderConfirmation.subject"
                                label="Asunto"
                                value={emailSettings.templates.orderConfirmation.subject}
                                onChange={handleEmailSettingsChange}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    name="templates.orderConfirmation.enabled"
                                    checked={emailSettings.templates.orderConfirmation.enabled}
                                    onChange={handleEmailSettingsChange}
                                  />
                                }
                                label="Activar plantilla"
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                      
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>
                            Restablecimiento de Contraseña
                            {!emailSettings.templates.passwordReset.enabled && (
                              <Typography component="span" sx={{ ml: 1, color: 'text.secondary' }}>
                                (Desactivado)
                              </Typography>
                            )}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                name="templates.passwordReset.subject"
                                label="Asunto"
                                value={emailSettings.templates.passwordReset.subject}
                                onChange={handleEmailSettingsChange}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    name="templates.passwordReset.enabled"
                                    checked={emailSettings.templates.passwordReset.enabled}
                                    onChange={handleEmailSettingsChange}
                                  />
                                }
                                label="Activar plantilla"
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                      
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>
                            Recordatorio de Evento
                            {!emailSettings.templates.eventReminder.enabled && (
                              <Typography component="span" sx={{ ml: 1, color: 'text.secondary' }}>
                                (Desactivado)
                              </Typography>
                            )}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                name="templates.eventReminder.subject"
                                label="Asunto"
                                value={emailSettings.templates.eventReminder.subject}
                                onChange={handleEmailSettingsChange}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    name="templates.eventReminder.enabled"
                                    checked={emailSettings.templates.eventReminder.enabled}
                                    onChange={handleEmailSettingsChange}
                                  />
                                }
                                label="Activar plantilla"
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Enviar Correo de Prueba
                  </Typography>
                  
                  <Card sx={{ mb: 4 }}>
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            name="recipient"
                            label="Destinatario"
                            value={testEmail.recipient}
                            onChange={handleTestEmailChange}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            name="subject"
                            label="Asunto"
                            value={testEmail.subject}
                            onChange={handleTestEmailChange}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            name="message"
                            label="Mensaje"
                            value={testEmail.message}
                            onChange={handleTestEmailChange}
                            fullWidth
                            multiline
                            rows={4}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={handleSendTestEmail}
                        startIcon={<SendIcon />}
                        disabled={saving || !testEmail.recipient}
                      >
                        Enviar Prueba
                      </Button>
                    </CardActions>
                  </Card>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleSaveEmailSettings}
                      startIcon={<SaveIcon />}
                      disabled={saving}
                    >
                      {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </Paper>
      
      {/* Alerta para notificaciones */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SystemSettings;