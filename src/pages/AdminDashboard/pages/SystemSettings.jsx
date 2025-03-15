import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Tooltip,
  useTheme
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';
import PaymentIcon from '@mui/icons-material/Payment';
import EventIcon from '@mui/icons-material/Event';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import PageHeader from '../components/PageHeader';
import adminApi from '../services/api';

// Componente de panel de configuración
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const SystemSettings = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    general: {},
    payment: {},
    email: {},
    events: {},
    security: {},
    privacy: {},
    users: {}
  });
  
  const [originalSettings, setOriginalSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showSecrets, setShowSecrets] = useState({});
  const [emailTestData, setEmailTestData] = useState({
    to: '',
    subject: 'Correo de prueba de EntradasMelilla',
    text: 'Este es un correo de prueba enviado desde el panel de administración.'
  });
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Cargar la configuración inicial
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await adminApi.getSystemSettings();
        setSettings(response.data.data);
        setOriginalSettings(JSON.parse(JSON.stringify(response.data.data)));
      } catch (err) {
        console.error('Error al cargar la configuración:', err);
        setError('Error al cargar la configuración del sistema. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  // Cargar la configuración de correo electrónico
  useEffect(() => {
    const fetchEmailSettings = async () => {
      if (activeTab === 2) { // Solo cargar cuando estamos en la pestaña de correo
        try {
          const response = await adminApi.getEmailSettings();
          setSettings(prev => ({
            ...prev,
            email: response.data.data
          }));
        } catch (err) {
          console.error('Error al cargar la configuración de correo:', err);
        }
      }
    };
    
    fetchEmailSettings();
  }, [activeTab]);

  // Manejar cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Manejar cambios en los campos de configuración
  const handleSettingChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Manejar cambios en los campos anidados
  const handleNestedSettingChange = (section, parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section]?.[parent],
          [field]: value
        }
      }
    }));
  };

  // Guardar configuración
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Guardar configuración general del sistema
      if (activeTab !== 2) { // No email settings
        await adminApi.updateSystemSettings(settings);
      } else {
        // Guardar configuración de correo electrónico
        await adminApi.updateEmailSettings(settings.email);
      }
      
      setSuccess('Configuración guardada correctamente');
      setOriginalSettings(JSON.parse(JSON.stringify(settings)));
    } catch (err) {
      console.error('Error al guardar la configuración:', err);
      setError('Error al guardar la configuración. Por favor, inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  // Comprobar si ha habido cambios
  const hasChanges = () => {
    if (!originalSettings) return false;
    
    const currentSection = activeTab === 0 ? settings.general : 
                          activeTab === 1 ? settings.payment :
                          activeTab === 2 ? settings.email :
                          activeTab === 3 ? settings.events :
                          activeTab === 4 ? settings.security :
                          activeTab === 5 ? settings.privacy :
                          settings.users;
                          
    const originalSection = activeTab === 0 ? originalSettings.general : 
                          activeTab === 1 ? originalSettings.payment :
                          activeTab === 2 ? originalSettings.email :
                          activeTab === 3 ? originalSettings.events :
                          activeTab === 4 ? originalSettings.security :
                          activeTab === 5 ? originalSettings.privacy :
                          originalSettings.users;
    
    return JSON.stringify(currentSection) !== JSON.stringify(originalSection);
  };

  // Enviar correo de prueba
  const handleSendTestEmail = async () => {
    try {
      setSendingTest(true);
      setTestResult(null);
      
      // Preparar datos para el correo de prueba
      const testMailData = {
        ...emailTestData,
        provider: settings.email.emailProvider,
        useApi: settings.email.useApi,
        fromName: settings.email.fromName,
        fromEmail: settings.email.fromEmail
      };
      
      // Si se está usando SMTP, agregar la configuración
      if (!settings.email.useApi) {
        testMailData.smtpSettings = {
          host: settings.email.smtpHost,
          port: settings.email.smtpPort,
          secure: settings.email.smtpEncryption === 'ssl',
          auth: {
            user: settings.email.smtpUser,
            pass: settings.email.smtpPassword
          }
        };
      } else {
        testMailData.apiSettings = {
          provider: settings.email.emailProvider,
          apiKey: settings.email.apiKey
        };
      }
      
      const response = await adminApi.sendTestEmail(testMailData);
      setTestResult({
        success: true,
        message: 'Correo de prueba enviado correctamente'
      });
    } catch (err) {
      console.error('Error al enviar correo de prueba:', err);
      setTestResult({
        success: false,
        message: `Error al enviar correo de prueba: ${err.response?.data?.message || err.message}`
      });
    } finally {
      setSendingTest(false);
    }
  };

  // Verificar si el formulario está siendo cargado
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="Configuración del Sistema" 
        subtitle="Administra la configuración general del sistema, métodos de pago, correo electrónico, seguridad y más."
      />
      
      {/* Alertas */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      
      {/* Tarjeta principal */}
      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                py: 2
              }
            }}
          >
            <Tab 
              icon={<LanguageIcon />} 
              label="General" 
              iconPosition="start"
              sx={{ minWidth: 150 }}
            />
            <Tab 
              icon={<PaymentIcon />} 
              label="Pagos" 
              iconPosition="start"
              sx={{ minWidth: 150 }}
            />
            <Tab 
              icon={<EmailIcon />} 
              label="Correo" 
              iconPosition="start"
              sx={{ minWidth: 150 }}
            />
            <Tab 
              icon={<EventIcon />} 
              label="Eventos" 
              iconPosition="start"
              sx={{ minWidth: 150 }}
            />
            <Tab 
              icon={<SecurityIcon />} 
              label="Seguridad" 
              iconPosition="start"
              sx={{ minWidth: 150 }}
            />
            <Tab 
              icon={<PrivacyTipIcon />} 
              label="Privacidad" 
              iconPosition="start"
              sx={{ minWidth: 150 }}
            />
            <Tab 
              icon={<PeopleIcon />} 
              label="Usuarios" 
              iconPosition="start"
              sx={{ minWidth: 150 }}
            />
          </Tabs>
        </Box>
        
        {/* Panel de configuración general */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información del Sitio
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre del Sitio"
                value={settings.general.siteName || ''}
                onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo de Contacto"
                value={settings.general.contactEmail || ''}
                onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción del Sitio"
                value={settings.general.siteDescription || ''}
                onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono de Soporte"
                value={settings.general.supportPhone || ''}
                onChange={(e) => handleSettingChange('general', 'supportPhone', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="URL del Logo"
                value={settings.general.logoUrl || ''}
                onChange={(e) => handleSettingChange('general', 'logoUrl', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Idioma Predeterminado</InputLabel>
                <Select
                  value={settings.general.defaultLanguage || 'es'}
                  onChange={(e) => handleSettingChange('general', 'defaultLanguage', e.target.value)}
                  label="Idioma Predeterminado"
                >
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="en">Inglés</MenuItem>
                  <MenuItem value="fr">Francés</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Zona Horaria</InputLabel>
                <Select
                  value={settings.general.timeZone || 'Europe/Madrid'}
                  onChange={(e) => handleSettingChange('general', 'timeZone', e.target.value)}
                  label="Zona Horaria"
                >
                  <MenuItem value="Europe/Madrid">Europa/Madrid</MenuItem>
                  <MenuItem value="Europe/London">Europa/Londres</MenuItem>
                  <MenuItem value="America/New_York">América/Nueva York</MenuItem>
                  <MenuItem value="Asia/Tokyo">Asia/Tokio</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Modo de Mantenimiento
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.general.maintenanceMode || false}
                    onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                    color="primary"
                  />
                }
                label="Activar Modo de Mantenimiento"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mensaje de Mantenimiento"
                value={settings.general.maintenanceMessage || ''}
                onChange={(e) => handleSettingChange('general', 'maintenanceMessage', e.target.value)}
                multiline
                rows={3}
                helperText="Este mensaje se mostrará a los usuarios cuando el sitio esté en modo de mantenimiento"
              />
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Panel de configuración de pagos */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Configuración de Moneda
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Moneda</InputLabel>
                <Select
                  value={settings.payment.currency || 'EUR'}
                  onChange={(e) => handleSettingChange('payment', 'currency', e.target.value)}
                  label="Moneda"
                >
                  <MenuItem value="EUR">Euro (€)</MenuItem>
                  <MenuItem value="USD">Dólar Estadounidense ($)</MenuItem>
                  <MenuItem value="GBP">Libra Esterlina (£)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Símbolo de Moneda"
                value={settings.payment.currencySymbol || '€'}
                onChange={(e) => handleSettingChange('payment', 'currencySymbol', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Stripe
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.payment.stripeEnabled || false}
                    onChange={(e) => handleSettingChange('payment', 'stripeEnabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="Habilitar Stripe"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Clave Pública de Stripe"
                value={settings.payment.stripePublicKey || ''}
                onChange={(e) => handleSettingChange('payment', 'stripePublicKey', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Clave Secreta de Stripe"
                type={showSecrets.stripeSecret ? 'text' : 'password'}
                value={settings.payment.stripeSecretKey || ''}
                onChange={(e) => handleSettingChange('payment', 'stripeSecretKey', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowSecrets({...showSecrets, stripeSecret: !showSecrets.stripeSecret})}
                        edge="end"
                      >
                        {showSecrets.stripeSecret ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Transferencia Bancaria
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.payment.bankTransferEnabled || false}
                    onChange={(e) => handleSettingChange('payment', 'bankTransferEnabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="Habilitar Transferencia Bancaria"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instrucciones para Transferencia Bancaria"
                value={settings.payment.bankTransferInstructions || ''}
                onChange={(e) => handleSettingChange('payment', 'bankTransferInstructions', e.target.value)}
                multiline
                rows={4}
                helperText="Proporciona las instrucciones detalladas para realizar transferencias bancarias"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Comisiones
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Comisión</InputLabel>
                <Select
                  value={settings.payment.commissionType || 'percentage'}
                  onChange={(e) => handleSettingChange('payment', 'commissionType', e.target.value)}
                  label="Tipo de Comisión"
                >
                  <MenuItem value="percentage">Porcentaje</MenuItem>
                  <MenuItem value="fixed">Cantidad Fija</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              {settings.payment.commissionType === 'percentage' ? (
                <TextField
                  fullWidth
                  label="Porcentaje de Comisión"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  value={settings.payment.commissionRate || 5}
                  onChange={(e) => handleSettingChange('payment', 'commissionRate', parseFloat(e.target.value))}
                />
              ) : (
                <TextField
                  fullWidth
                  label="Comisión Fija"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{settings.payment.currencySymbol || '€'}</InputAdornment>,
                  }}
                  value={settings.payment.commissionFixed || 0}
                  onChange={(e) => handleSettingChange('payment', 'commissionFixed', parseFloat(e.target.value))}
                />
              )}
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Panel de configuración de correo */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Configuración del Correo Electrónico
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre del Remitente"
                value={settings.email?.fromName || ''}
                onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo del Remitente"
                value={settings.email?.fromEmail || ''}
                onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Proveedor de Correo</InputLabel>
                <Select
                  value={settings.email?.emailProvider || 'smtp'}
                  onChange={(e) => handleSettingChange('email', 'emailProvider', e.target.value)}
                  label="Proveedor de Correo"
                >
                  <MenuItem value="smtp">SMTP</MenuItem>
                  <MenuItem value="sendgrid">SendGrid</MenuItem>
                  <MenuItem value="mailgun">Mailgun</MenuItem>
                  <MenuItem value="brevo">Brevo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.email?.useApi || false}
                    onChange={(e) => handleSettingChange('email', 'useApi', e.target.checked)}
                    color="primary"
                  />
                }
                label="Usar API (en lugar de SMTP)"
              />
            </Grid>
            
            {!settings.email?.useApi && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Configuración SMTP
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Servidor SMTP"
                    value={settings.email?.smtpHost || ''}
                    onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Puerto SMTP"
                    type="number"
                    value={settings.email?.smtpPort || 587}
                    onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Usuario SMTP"
                    value={settings.email?.smtpUser || ''}
                    onChange={(e) => handleSettingChange('email', 'smtpUser', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contraseña SMTP"
                    type={showSecrets.smtpPassword ? 'text' : 'password'}
                    value={settings.email?.smtpPassword || ''}
                    onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowSecrets({...showSecrets, smtpPassword: !showSecrets.smtpPassword})}
                            edge="end"
                          >
                            {showSecrets.smtpPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Cifrado SMTP</InputLabel>
                    <Select
                      value={settings.email?.smtpEncryption || 'tls'}
                      onChange={(e) => handleSettingChange('email', 'smtpEncryption', e.target.value)}
                      label="Cifrado SMTP"
                    >
                      <MenuItem value="tls">TLS</MenuItem>
                      <MenuItem value="ssl">SSL</MenuItem>
                      <MenuItem value="none">Ninguno</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            
            {settings.email?.useApi && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Configuración de API
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Clave API"
                    type={showSecrets.apiKey ? 'text' : 'password'}
                    value={settings.email?.apiKey || ''}
                    onChange={(e) => handleSettingChange('email', 'apiKey', e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowSecrets({...showSecrets, apiKey: !showSecrets.apiKey})}
                            edge="end"
                          >
                            {showSecrets.apiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Prueba de Correo Electrónico
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Destinatario"
                value={emailTestData.to}
                onChange={(e) => setEmailTestData({...emailTestData, to: e.target.value})}
                placeholder="Ingresa tu correo electrónico para la prueba"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Asunto"
                value={emailTestData.subject}
                onChange={(e) => setEmailTestData({...emailTestData, subject: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mensaje"
                multiline
                rows={3}
                value={emailTestData.text}
                onChange={(e) => setEmailTestData({...emailTestData, text: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                onClick={handleSendTestEmail}
                disabled={sendingTest || !emailTestData.to}
              >
                {sendingTest ? 'Enviando...' : 'Enviar Correo de Prueba'}
              </Button>
            </Grid>
            
            {testResult && (
              <Grid item xs={12}>
                <Alert severity={testResult.success ? 'success' : 'error'} onClose={() => setTestResult(null)}>
                  {testResult.message}
                </Alert>
              </Grid>
            )}
          </Grid>
        </TabPanel>
        
        {/* Panel de configuración de eventos */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Configuración de Eventos
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Entradas Mínimas por Compra"
                type="number"
                value={settings.events?.minTicketsPerPurchase || 1}
                onChange={(e) => handleSettingChange('events', 'minTicketsPerPurchase', parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Entradas Máximas por Compra"
                type="number"
                value={settings.events?.maxTicketsPerPurchase || 10}
                onChange={(e) => handleSettingChange('events', 'maxTicketsPerPurchase', parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duración Predeterminada del Evento (minutos)"
                type="number"
                value={settings.events?.defaultEventDuration || 120}
                onChange={(e) => handleSettingChange('events', 'defaultEventDuration', parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 15 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.events?.allowGuestCheckout || false}
                    onChange={(e) => handleSettingChange('events', 'allowGuestCheckout', e.target.checked)}
                    color="primary"
                  />
                }
                label="Permitir Compra como Invitado"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.events?.requirePhoneNumber || false}
                    onChange={(e) => handleSettingChange('events', 'requirePhoneNumber', e.target.checked)}
                    color="primary"
                  />
                }
                label="Requerir Número de Teléfono"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.events?.requireAddress || false}
                    onChange={(e) => handleSettingChange('events', 'requireAddress', e.target.checked)}
                    color="primary"
                  />
                }
                label="Requerir Dirección"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Política de Reembolsos
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.events?.enableRefunds || false}
                    onChange={(e) => handleSettingChange('events', 'enableRefunds', e.target.checked)}
                    color="primary"
                  />
                }
                label="Habilitar Reembolsos"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Período de Reembolso (días)"
                type="number"
                value={settings.events?.refundPeriodDays || 7}
                onChange={(e) => handleSettingChange('events', 'refundPeriodDays', parseInt(e.target.value))}
                disabled={!settings.events?.enableRefunds}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.events?.enablePartialRefunds || false}
                    onChange={(e) => handleSettingChange('events', 'enablePartialRefunds', e.target.checked)}
                    color="primary"
                    disabled={!settings.events?.enableRefunds}
                  />
                }
                label="Permitir Reembolsos Parciales"
              />
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Panel de configuración de seguridad */}
        <TabPanel value={activeTab} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Seguridad de Cuentas
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security?.requireEmailVerification || true}
                    onChange={(e) => handleSettingChange('security', 'requireEmailVerification', e.target.checked)}
                    color="primary"
                  />
                }
                label="Requerir Verificación de Correo"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security?.twoFactorAuthEnabled || false}
                    onChange={(e) => handleSettingChange('security', 'twoFactorAuthEnabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="Habilitar Autenticación de Dos Factores"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Requisitos de Contraseña
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Longitud Mínima de Contraseña"
                type="number"
                value={settings.security?.passwordMinLength || 8}
                onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 6 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security?.passwordRequireSpecialChars || true}
                    onChange={(e) => handleSettingChange('security', 'passwordRequireSpecialChars', e.target.checked)}
                    color="primary"
                  />
                }
                label="Requerir Caracteres Especiales"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security?.passwordRequireNumbers || true}
                    onChange={(e) => handleSettingChange('security', 'passwordRequireNumbers', e.target.checked)}
                    color="primary"
                  />
                }
                label="Requerir Números"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security?.passwordRequireUppercase || true}
                    onChange={(e) => handleSettingChange('security', 'passwordRequireUppercase', e.target.checked)}
                    color="primary"
                  />
                }
                label="Requerir Letras Mayúsculas"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Configuración de Sesiones
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tiempo de Expiración del JWT (horas)"
                type="number"
                value={settings.security?.jwtExpirationTime || 24}
                onChange={(e) => handleSettingChange('security', 'jwtExpirationTime', parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tiempo de Sesión (minutos)"
                type="number"
                value={settings.security?.sessionTimeout || 60}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 5 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Intentos de Bloqueo de Cuenta"
                type="number"
                value={settings.security?.accountLockoutAttempts || 5}
                onChange={(e) => handleSettingChange('security', 'accountLockoutAttempts', parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 3 } }}
              />
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Panel de configuración de privacidad */}
        <TabPanel value={activeTab} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Configuración Legal
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="URL de Política de Privacidad"
                value={settings.privacy?.privacyPolicyUrl || ''}
                onChange={(e) => handleSettingChange('privacy', 'privacyPolicyUrl', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="URL de Términos de Servicio"
                value={settings.privacy?.termsOfServiceUrl || ''}
                onChange={(e) => handleSettingChange('privacy', 'termsOfServiceUrl', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="URL de Política de Cookies"
                value={settings.privacy?.cookiePolicyUrl || ''}
                onChange={(e) => handleSettingChange('privacy', 'cookiePolicyUrl', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacy?.cookieConsentRequired || true}
                    onChange={(e) => handleSettingChange('privacy', 'cookieConsentRequired', e.target.checked)}
                    color="primary"
                  />
                }
                label="Requerir Consentimiento de Cookies"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacy?.gdprCompliant || true}
                    onChange={(e) => handleSettingChange('privacy', 'gdprCompliant', e.target.checked)}
                    color="primary"
                  />
                }
                label="Cumplimiento del RGPD"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Período de Eliminación de Datos (días)"
                type="number"
                value={settings.privacy?.dataDeletionPeriod || 365}
                onChange={(e) => handleSettingChange('privacy', 'dataDeletionPeriod', parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 30 } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Analíticas
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacy?.analyticsEnabled || false}
                    onChange={(e) => handleSettingChange('privacy', 'analyticsEnabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="Habilitar Analíticas"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!settings.privacy?.analyticsEnabled}>
                <InputLabel>Proveedor de Analíticas</InputLabel>
                <Select
                  value={settings.privacy?.analyticsProvider || 'google'}
                  onChange={(e) => handleSettingChange('privacy', 'analyticsProvider', e.target.value)}
                  label="Proveedor de Analíticas"
                >
                  <MenuItem value="google">Google Analytics</MenuItem>
                  <MenuItem value="matomo">Matomo</MenuItem>
                  <MenuItem value="plausible">Plausible</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ID de Seguimiento de Analíticas"
                value={settings.privacy?.analyticsTrackingId || ''}
                onChange={(e) => handleSettingChange('privacy', 'analyticsTrackingId', e.target.value)}
                disabled={!settings.privacy?.analyticsEnabled}
                placeholder="G-XXXXXXXXXX"
              />
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Panel de configuración de usuarios */}
        <TabPanel value={activeTab} index={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Registro y Acceso
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.users?.allowUserRegistration || true}
                    onChange={(e) => handleSettingChange('users', 'allowUserRegistration', e.target.checked)}
                    color="primary"
                  />
                }
                label="Permitir Registro de Usuario"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.users?.allowSocialLogin || false}
                    onChange={(e) => handleSettingChange('users', 'allowSocialLogin', e.target.checked)}
                    color="primary"
                  />
                }
                label="Permitir Acceso con Redes Sociales"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Rol Predeterminado para Nuevos Usuarios</InputLabel>
                <Select
                  value={settings.users?.defaultUserRole || 'user'}
                  onChange={(e) => handleSettingChange('users', 'defaultUserRole', e.target.value)}
                  label="Rol Predeterminado para Nuevos Usuarios"
                >
                  <MenuItem value="user">Usuario</MenuItem>
                  <MenuItem value="organizer">Organizador</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Configuración de Organizadores
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.users?.requireOrganizerApproval || true}
                    onChange={(e) => handleSettingChange('users', 'requireOrganizerApproval', e.target.checked)}
                    color="primary"
                  />
                }
                label="Requerir Aprobación de Organizador"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Eventos Máximos por Organizador"
                type="number"
                value={settings.users?.maxEventsPerOrganizer || 0}
                onChange={(e) => handleSettingChange('users', 'maxEventsPerOrganizer', parseInt(e.target.value))}
                helperText="0 = sin límite"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Asistentes Máximos por Evento"
                type="number"
                value={settings.users?.maxAttendeesPerEvent || 0}
                onChange={(e) => handleSettingChange('users', 'maxAttendeesPerEvent', parseInt(e.target.value))}
                helperText="0 = sin límite"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Comisión para Organizadores (%)"
                type="number"
                value={settings.users?.organizerCommissionRate || 5}
                onChange={(e) => handleSettingChange('users', 'organizerCommissionRate', parseFloat(e.target.value))}
                InputProps={{ 
                  inputProps: { min: 0, max: 100, step: 0.1 },
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Botones de acción */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{ mr: 1 }}
          >
            Recargar
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            disabled={saving || !hasChanges()}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default SystemSettings;