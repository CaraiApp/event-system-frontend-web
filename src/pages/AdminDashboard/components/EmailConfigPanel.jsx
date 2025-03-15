import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Divider,
  Tabs,
  Tab,
  IconButton,
  FormControlLabel,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Save as SaveIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  DeleteOutline as DeleteOutlineIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Send as SendIcon
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`email-tabpanel-${index}`}
      aria-labelledby={`email-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EmailConfigPanel = ({ emailConfig, onSaveConfig, loading = false }) => {
  const [tabValue, setTabValue] = useState(0);
  const [config, setConfig] = useState(emailConfig || {
    provider: 'smtp',
    smtpSettings: {
      host: '',
      port: 587,
      secure: false,
      auth: {
        user: '',
        pass: ''
      },
      fromEmail: '',
      fromName: ''
    },
    apiSettings: {
      provider: 'sendgrid',
      apiKey: '',
      fromEmail: '',
      fromName: ''
    },
    useAPI: false // true = API, false = SMTP
  });
  
  const [testEmailDialogOpen, setTestEmailDialogOpen] = useState(false);
  const [testEmailData, setTestEmailData] = useState({
    to: '',
    subject: 'Correo de prueba de EntradasMelilla',
    text: 'Este es un correo de prueba enviado desde la configuración de EntradasMelilla'
  });
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const handleChange = (section, field, value) => {
    if (section === 'root') {
      setConfig({
        ...config,
        [field]: value
      });
    } else {
      setConfig({
        ...config,
        [section]: {
          ...config[section],
          [field]: value
        }
      });
    }
  };
  
  const handleAuthChange = (field, value) => {
    setConfig({
      ...config,
      smtpSettings: {
        ...config.smtpSettings,
        auth: {
          ...config.smtpSettings.auth,
          [field]: value
        }
      }
    });
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleToggleEmailMethod = () => {
    setConfig({
      ...config,
      useAPI: !config.useAPI
    });
    
    // Reset the tab to first when toggling
    setTabValue(0);
  };
  
  const handleSendTestEmail = async () => {
    setTestEmailLoading(true);
    setTestEmailResult(null);
    
    try {
      // En una implementación real, aquí se enviaría el correo
      // Importar el API service
      const { default: api } = await import('../../../services/api.js');
      
      // Consolidar configuración en un solo objeto
      const emailSettings = config.useAPI 
        ? { 
            provider: config.apiSettings.provider, 
            apiKey: config.apiSettings.apiKey,
            fromEmail: config.apiSettings.fromEmail,
            fromName: config.apiSettings.fromName,
            ...testEmailData
          }
        : { 
            provider: 'smtp',
            host: config.smtpSettings.host,
            port: config.smtpSettings.port,
            secure: config.smtpSettings.secure,
            auth: config.smtpSettings.auth,
            fromEmail: config.smtpSettings.fromEmail,
            fromName: config.smtpSettings.fromName,
            ...testEmailData
          };
      
      // Enviar correo de prueba
      const response = await api.system.sendTestEmail(emailSettings);
      
      setTestEmailResult({
        success: true,
        message: 'Correo enviado correctamente'
      });
      
      // Cerrar el diálogo después de 3 segundos
      setTimeout(() => {
        setTestEmailDialogOpen(false);
        setTestEmailResult(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error al enviar correo de prueba:', error);
      
      setTestEmailResult({
        success: false,
        message: error.response?.data?.message || 'Error al enviar el correo de prueba'
      });
    } finally {
      setTestEmailLoading(false);
    }
  };
  
  const handleSaveConfig = () => {
    // Llamar al callback con la configuración actualizada
    onSaveConfig(config);
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Configuración de Correo Electrónico
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            onClick={() => setTestEmailDialogOpen(true)}
          >
            Enviar Email de Prueba
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveConfig}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Método de Envío de Correos
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Servidor SMTP
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={config.useAPI}
                  onChange={handleToggleEmailMethod}
                  name="useAPI"
                  color="primary"
                />
              }
              label=""
            />
            <Typography variant="body1" sx={{ ml: 2 }}>
              API de Email (SendGrid, Mailgun, etc.)
            </Typography>
          </Box>
          
          {/* Configuración SMTP */}
          {!config.useAPI && (
            <Box>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Configuración Básica" />
                <Tab label="Configuración Avanzada" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Servidor SMTP"
                      value={config.smtpSettings.host}
                      onChange={(e) => handleChange('smtpSettings', 'host', e.target.value)}
                      margin="normal"
                      required
                      placeholder="smtp.example.com"
                      helperText="Dirección del servidor SMTP"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Puerto SMTP"
                      value={config.smtpSettings.port}
                      onChange={(e) => handleChange('smtpSettings', 'port', parseInt(e.target.value, 10) || '')}
                      margin="normal"
                      required
                      type="number"
                      placeholder="587"
                      helperText="Puerto del servidor (normalmente 587, 465 o 25)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Usuario SMTP"
                      value={config.smtpSettings.auth.user}
                      onChange={(e) => handleAuthChange('user', e.target.value)}
                      margin="normal"
                      required
                      placeholder="usuario@example.com"
                      helperText="Normalmente es tu dirección de email"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contraseña SMTP"
                      value={config.smtpSettings.auth.pass}
                      onChange={(e) => handleAuthChange('pass', e.target.value)}
                      margin="normal"
                      required
                      type={showPassword ? 'text' : 'password'}
                      placeholder="********"
                      helperText="Contraseña para autenticarse en el servidor SMTP"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre del Remitente"
                      value={config.smtpSettings.fromName}
                      onChange={(e) => handleChange('smtpSettings', 'fromName', e.target.value)}
                      margin="normal"
                      required
                      placeholder="EntradasMelilla"
                      helperText="El nombre que aparecerá como remitente"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email del Remitente"
                      value={config.smtpSettings.fromEmail}
                      onChange={(e) => handleChange('smtpSettings', 'fromEmail', e.target.value)}
                      margin="normal"
                      required
                      placeholder="info@entradasmelilla.com"
                      helperText="La dirección de email que aparecerá como remitente"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.smtpSettings.secure}
                          onChange={(e) => handleChange('smtpSettings', 'secure', e.target.checked)}
                          name="secure"
                          color="primary"
                        />
                      }
                      label="Conexión segura (SSL/TLS)"
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Detalles de Configuración SMTP
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Aquí puedes ajustar configuraciones avanzadas para el servidor SMTP.
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Estas son algunas configuraciones comunes de SMTP:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 3 }}>
                        <li>Gmail: smtp.gmail.com, Puerto 587</li>
                        <li>Outlook/Hotmail: smtp.office365.com, Puerto 587</li>
                        <li>Yahoo: smtp.mail.yahoo.com, Puerto 587</li>
                        <li>Brevo (Sendinblue): smtp-relay.brevo.com, Puerto 587</li>
                      </Box>
                    </Alert>
                  </Grid>
                  
                  {/* Aquí se podrían añadir más configuraciones avanzadas en el futuro */}
                </Grid>
              </TabPanel>
            </Box>
          )}
          
          {/* Configuración de API */}
          {config.useAPI && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="api-provider-label">Proveedor de API</InputLabel>
                  <Select
                    labelId="api-provider-label"
                    value={config.apiSettings.provider}
                    label="Proveedor de API"
                    onChange={(e) => handleChange('apiSettings', 'provider', e.target.value)}
                  >
                    <MenuItem value="sendgrid">SendGrid</MenuItem>
                    <MenuItem value="mailgun">Mailgun</MenuItem>
                    <MenuItem value="mailchimp">Mailchimp</MenuItem>
                    <MenuItem value="postmark">Postmark</MenuItem>
                    <MenuItem value="brevo">Brevo (Sendinblue)</MenuItem>
                    <MenuItem value="custom">Personalizado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="API Key"
                  value={config.apiSettings.apiKey}
                  onChange={(e) => handleChange('apiSettings', 'apiKey', e.target.value)}
                  margin="normal"
                  required
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="sk_test_xxxxxxxxxxxxxxxxxxxx"
                  helperText="Clave API proporcionada por tu proveedor de email"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle api key visibility"
                          onClick={() => setShowApiKey(!showApiKey)}
                          edge="end"
                        >
                          {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre del Remitente"
                  value={config.apiSettings.fromName}
                  onChange={(e) => handleChange('apiSettings', 'fromName', e.target.value)}
                  margin="normal"
                  required
                  placeholder="EntradasMelilla"
                  helperText="El nombre que aparecerá como remitente"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email del Remitente"
                  value={config.apiSettings.fromEmail}
                  onChange={(e) => handleChange('apiSettings', 'fromEmail', e.target.value)}
                  margin="normal"
                  required
                  placeholder="info@entradasmelilla.com"
                  helperText="La dirección de email que aparecerá como remitente"
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
      
      {/* Diálogo para enviar email de prueba */}
      <Dialog 
        open={testEmailDialogOpen} 
        onClose={() => !testEmailLoading && setTestEmailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enviar Email de Prueba</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            {testEmailResult && (
              <Alert 
                severity={testEmailResult.success ? 'success' : 'error'} 
                sx={{ mb: 2 }}
              >
                {testEmailResult.message}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Destinatario"
              value={testEmailData.to}
              onChange={(e) => setTestEmailData({ ...testEmailData, to: e.target.value })}
              margin="normal"
              required
              placeholder="destinatario@example.com"
              helperText="Dirección de correo donde se enviará la prueba"
              disabled={testEmailLoading}
            />
            
            <TextField
              fullWidth
              label="Asunto"
              value={testEmailData.subject}
              onChange={(e) => setTestEmailData({ ...testEmailData, subject: e.target.value })}
              margin="normal"
              placeholder="Correo de prueba"
              disabled={testEmailLoading}
            />
            
            <TextField
              fullWidth
              label="Contenido"
              value={testEmailData.text}
              onChange={(e) => setTestEmailData({ ...testEmailData, text: e.target.value })}
              margin="normal"
              multiline
              rows={4}
              placeholder="Este es un correo de prueba..."
              disabled={testEmailLoading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setTestEmailDialogOpen(false)}
            disabled={testEmailLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSendTestEmail}
            disabled={testEmailLoading || !testEmailData.to}
            startIcon={testEmailLoading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {testEmailLoading ? 'Enviando...' : 'Enviar Prueba'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailConfigPanel;