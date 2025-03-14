import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Container,
  Menu, MenuItem, ListItemAvatar, Tooltip
} from '@mui/material';
import { 
  Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, Dashboard as DashboardIcon,
  EventNote as EventNoteIcon, BarChart as BarChartIcon, People as PeopleIcon,
  Settings as SettingsIcon, Logout as LogoutIcon, Home as HomeIcon,
  Person as PersonIcon, AccountCircle as AccountCircleIcon, Map as MapIcon
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
    navigate('/profile');
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
        const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        const response = await axios.get(`${API_BASE_URL}/api/v1/users/getSingleUser`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
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
  
  const menuItems = [
    { text: COMMON_STRINGS.panelPrincipal, icon: <DashboardIcon />, path: '/organizer' },
    { text: COMMON_STRINGS.misEventos, icon: <EventNoteIcon />, path: '/organizer/events' },
    { text: COMMON_STRINGS.ventas, icon: <BarChartIcon />, path: '/organizer/sales' },
    { text: COMMON_STRINGS.asistentes, icon: <PeopleIcon />, path: '/organizer/attendees' },
    { text: COMMON_STRINGS.gestionMapas, icon: <MapIcon />, path: '/organizer/map-manager' },
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
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
          <Outlet /> {/* Renders child routes */}
        </Container>
      </Box>
    </Box>
  );
};

export default OrganizerDashboard;