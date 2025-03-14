import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Container,
  Menu, MenuItem, ListItemAvatar, Tooltip, Paper, Button
} from '@mui/material';
import { 
  Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, Dashboard as DashboardIcon,
  EventNote as EventNoteIcon, BarChart as BarChartIcon, People as PeopleIcon,
  Settings as SettingsIcon, Logout as LogoutIcon, Home as HomeIcon,
  Person as PersonIcon, AccountCircle as AccountCircleIcon, Map as MapIcon,
  BugReport as BugIcon, Close, QrCodeScanner as QrCodeScannerIcon
} from '@mui/icons-material';
import axios from 'axios';
import './OrganizerDashboard.css';
import { COMMON_STRINGS } from '../../utils/strings';

const drawerWidth = 240;

const OrganizerDashboard = () => {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null); // Para el menú desplegable de usuario
  const [showDebug, setShowDebug] = useState(false); // Para mostrar/ocultar panel de depuración
  const [debugInfo, setDebugInfo] = useState({
    user: null,
    apiCalls: [],
    errors: []
  });
  const navigate = useNavigate();
  const location = useLocation();
  
  // Manejo del menú desplegable
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleProfile = () => {
    navigate('/organizer/settings');
    handleMenuClose();
  };
  
  // Verificar autenticaci�n y rol de usuario
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Solo permitir acceso a organizadores y administradores
    if (role !== 'organizer' && role !== 'admin') {
      navigate('/home');
      return;
    }
    
    const fetchUserData = async () => {
      try {
        // Añadir información de depuración
        const startTime = performance.now();
        const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        
        // Guardar información de la solicitud
        const requestInfo = {
          type: 'GET',
          url: `${API_BASE_URL}/api/v1/users/getSingleUser`,
          headers: { Authorization: `Bearer ${token && token.length > 10 ? token.substring(0, 10) + '...' : 'token-inválido'}` },
          timestamp: new Date().toISOString(),
          pathname: location.pathname
        };
        
        console.group('🔍 DEBUG - OrganizerDashboard - fetchUserData');
        console.log('🔷 Realizando solicitud:', requestInfo);
        
        const response = await axios.get(`${API_BASE_URL}/api/v1/users/getSingleUser`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const endTime = performance.now();
        console.log(`⏱️ Tiempo de respuesta: ${(endTime - startTime).toFixed(2)}ms`);
        console.log('✅ Respuesta exitosa:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data ? 'Datos recibidos' : 'Sin datos'
        });
        
        // Actualizar datos de depuración
        setDebugInfo(prev => ({
          ...prev,
          user: response.data.data,
          apiCalls: [...prev.apiCalls, {
            ...requestInfo,
            status: response.status,
            duration: (endTime - startTime).toFixed(2),
            success: true
          }]
        }));
        
        setUser(response.data.data);
        console.groupEnd();
      } catch (error) {
        console.group('❌ ERROR - OrganizerDashboard - fetchUserData');
        console.error('Error fetching user data:', error);
        console.error('Mensaje:', error.message);
        
        if (error.response) {
          console.error('Detalles de respuesta:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          });
        }
        
        // Actualizar errores en el panel de depuración
        setDebugInfo(prev => ({
          ...prev,
          errors: [...prev.errors, {
            type: 'API_ERROR',
            message: error.message,
            response: error.response ? {
              status: error.response.status,
              statusText: error.response.statusText
            } : null,
            timestamp: new Date().toISOString(),
            pathname: location.pathname
          }]
        }));
        
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        console.groupEnd();
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  
  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
    handleMenuClose();
  };
  
  // Alternar la visualización del panel de depuración
  const toggleDebugPanel = () => {
    setShowDebug(prev => !prev);
  };
  
  const menuItems = [
    { text: COMMON_STRINGS.panelPrincipal, icon: <DashboardIcon />, path: '/organizer' },
    { text: COMMON_STRINGS.misEventos, icon: <EventNoteIcon />, path: '/organizer/events' },
    { text: COMMON_STRINGS.ventas, icon: <BarChartIcon />, path: '/organizer/sales' },
    { text: COMMON_STRINGS.asistentes, icon: <PeopleIcon />, path: '/organizer/attendees' },
    { text: COMMON_STRINGS.gestionMapas, icon: <MapIcon />, path: '/template-manager' },
    { text: "Escanear QR", icon: <QrCodeScannerIcon />, path: '/qr-scanner' },
    { text: COMMON_STRINGS.configuracion, icon: <SettingsIcon />, path: '/organizer/settings' },
  ];
  
  const handleNavigation = (path) => {
    navigate(path);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: (theme) => theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Panel de Organizador
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Home button to return to main site */}
            <IconButton
              color="inherit"
              aria-label="go to home page"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
              title="Volver a la página principal"
            >
              <HomeIcon />
            </IconButton>
            
            {/* Botón de depuración */}
            <Tooltip title="Panel de depuración">
              <IconButton
                color="inherit"
                onClick={toggleDebugPanel}
                sx={{ mr: 1 }}
              >
                <BugIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Ajustes de cuenta">
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {user?.username || 'Usuario'}
                  </Typography>
                  <Avatar
                    alt={user?.username || 'User'}
                    src={user?.photo}
                    sx={{ width: 32, height: 32 }}
                  >
                    {user?.username ? user.username[0].toUpperCase() : 'U'}
                  </Avatar>
                </Box>
              </IconButton>
            </Tooltip>
            
            {/* Menú desplegable para el usuario */}
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                {COMMON_STRINGS.miPerfil}
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                {COMMON_STRINGS.cerrarSesion}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            ...(open ? { 
              overflowX: 'hidden',
              transition: (theme) => theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            } : {
              overflowX: 'hidden',
              transition: (theme) => theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              width: (theme) => theme.spacing(7),
              [theme.breakpoints.up('sm')]: {
                width: (theme) => theme.spacing(9),
              },
            }),
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  bgcolor: location.pathname === item.path ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                }}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ opacity: open ? 1 : 0 }}
                  primaryTypographyProps={{
                    color: location.pathname === item.path ? 'primary' : 'inherit',
                    fontWeight: location.pathname === item.path ? 'bold' : 'regular',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={handleLogout}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary={COMMON_STRINGS.cerrarSesion}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      
      {/* Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: (theme) => theme.palette.grey[100],
          minHeight: '100vh',
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        {/* Panel de depuración */}
        {showDebug && (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              mb: 3,
              bgcolor: 'rgba(0, 0, 0, 0.03)',
              border: '1px solid #ccc',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                Panel de Depuración
              </Typography>
              <IconButton onClick={toggleDebugPanel} size="small">
                <Close />
              </IconButton>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Información Básica</Typography>
              <Box component="pre" sx={{ 
                p: 1, 
                bgcolor: '#f5f5f5', 
                borderRadius: 1,
                overflow: 'auto',
                fontSize: '0.75rem'
              }}>
                {JSON.stringify({
                  url: window.location.href,
                  path: location.pathname,
                  apiBaseUrl: import.meta.env.VITE_REACT_APP_BACKEND_BASEURL,
                  token: localStorage.getItem('token') ? 'Presente (truncado): ' + localStorage.getItem('token').substring(0, 15) + '...' : 'No hay token',
                  role: localStorage.getItem('role') || 'No definido',
                  user: user ? `${user.username} (${user.email})` : 'No hay datos de usuario'
                }, null, 2)}
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Llamadas a API Recientes</Typography>
              {debugInfo.apiCalls.length > 0 ? (
                <Box component="pre" sx={{ 
                  p: 1, 
                  bgcolor: '#f5f5f5', 
                  borderRadius: 1,
                  overflow: 'auto',
                  maxHeight: '150px',
                  fontSize: '0.75rem'
                }}>
                  {JSON.stringify(debugInfo.apiCalls.slice(-5), null, 2)}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No hay llamadas a API registradas</Typography>
              )}
            </Box>
            
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="error">Errores</Typography>
              {debugInfo.errors.length > 0 ? (
                <Box component="pre" sx={{ 
                  p: 1, 
                  bgcolor: '#fee', 
                  borderRadius: 1,
                  overflow: 'auto',
                  maxHeight: '150px',
                  fontSize: '0.75rem'
                }}>
                  {JSON.stringify(debugInfo.errors, null, 2)}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No hay errores registrados</Typography>
              )}
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Instrucciones de Uso</Typography>
              <Typography variant="body2">
                1. Observa la consola del navegador para información detallada de las peticiones.<br />
                2. Si una petición falla con 404, verifica que la ruta URL sea correcta y que el backend esté ejecutándose.<br />
                3. Si hay errores de autenticación (401), asegúrate de que el token sea válido y no haya expirado.<br />
                4. Comprueba los encabezados enviados en cada petición.
              </Typography>
              
              <Button 
                variant="outlined" 
                color="primary" 
                size="small" 
                onClick={() => console.clear()} 
                sx={{ mt: 1, mr: 1 }}
              >
                Limpiar Consola
              </Button>
              
              <Button 
                variant="outlined" 
                color="warning" 
                size="small" 
                onClick={() => setDebugInfo({user: null, apiCalls: [], errors: []})} 
                sx={{ mt: 1 }}
              >
                Reiniciar Datos de Depuración
              </Button>
            </Box>
          </Paper>
        )}
        
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
          <Outlet /> {/* Renders child routes */}
        </Container>
      </Box>
    </Box>
  );
};

export default OrganizerDashboard;