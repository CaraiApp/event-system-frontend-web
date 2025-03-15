import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BugReportIcon from '@mui/icons-material/BugReport';
import DebugPanel from '../../components/DebugPanel/DebugPanel';
import axios from 'axios';
import './UserDashboard.css';

const drawerWidth = 250;

// Componente principal del Dashboard
const UserDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  // Manejar el toggle del menú lateral en dispositivos móviles
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Manejar el clic en el avatar para mostrar menú
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Cerrar el menú de avatar
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  // Alternar la visualización del panel de depuración
  const toggleDebugPanel = () => {
    setShowDebugPanel(prev => !prev);
  };

  // Obtener información del usuario
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/v1/users/getSingleUser', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.data);
        } catch (error) {
          console.error('Error al obtener usuario:', error);
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          }
        }
      }
    };

    fetchUser();
  }, [navigate]);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Elementos del menú lateral
  const menuItems = [
    { text: 'Panel Principal', icon: <HomeIcon />, path: '/account' },
    { text: 'Mi Perfil', icon: <AccountCircleIcon />, path: '/account/profile' },
    { text: 'Mis Entradas', icon: <ConfirmationNumberIcon />, path: '/account/tickets' },
    { text: 'Historial de Compras', icon: <HistoryIcon />, path: '/account/orders' },
    { text: 'Eventos Guardados', icon: <FavoriteIcon />, path: '/account/favorites' },
    { text: 'Configuración', icon: <SettingsIcon />, path: '/account/settings' },
  ];

  // Contenido del menú lateral
  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          Mi Cuenta
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => { 
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#f0f7ff',
                  borderLeft: '4px solid #3795d6',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  }
                },
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                }
              }}
            >
              <ListItemIcon 
                sx={{
                  color: location.pathname === item.path ? '#3795d6' : 'inherit'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === item.path ? 'bold' : 'regular',
                    color: location.pathname === item.path ? '#3795d6' : 'inherit'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* Barra superior */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'black',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Panel del Usuario'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Debug Panel Toggle */}
            <IconButton 
              color="inherit" 
              onClick={toggleDebugPanel} 
              title="Panel de depuración"
            >
              <BugReportIcon />
            </IconButton>
            
            {/* Icono de notificaciones */}
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            
            {/* Avatar y menú del usuario */}
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleMenu}>
              <Avatar 
                sx={{ 
                  bgcolor: '#3795d6', 
                  width: 35, 
                  height: 35,
                  marginLeft: 1
                }}
              >
                {user.username ? user.username[0].toUpperCase() : 'U'}
              </Avatar>
              <Typography variant="body1" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
                {user.username || 'Usuario'}
              </Typography>
              <ArrowDropDownIcon />
            </Box>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { navigate('/account/profile'); handleClose(); }}>Mi Perfil</MenuItem>
              <MenuItem onClick={() => { navigate('/account/settings'); handleClose(); }}>Configuración</MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Menú lateral */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="carpetas"
      >
        {/* Versión móvil */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Mejor rendimiento en dispositivos móviles
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Versión de escritorio */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Contenido principal */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f9f9f9',
          height: '100%',
          overflow: 'auto'
        }}
      >
        <Toolbar /> {/* Espaciado para la barra superior */}
        <Box sx={{ mb: 2 }}>
          <Outlet /> {/* Renderiza la ruta anidada activa */}
        </Box>
        {showDebugPanel && <DebugPanel />}
      </Box>
    </Box>
  );
};

export default UserDashboard;