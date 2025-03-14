import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Container,
  Badge, Menu, MenuItem, ListSubheader
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  ChevronLeft as ChevronLeftIcon, 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
  Extension as ExtensionIcon,
  Receipt as ReceiptIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Category as CategoryIcon,
  CreditCard as CreditCardIcon,
  Email as EmailIcon,
  Apartment as ApartmentIcon,
  ContactSupport as ContactSupportIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import axios from 'axios';
import './AdminDashboard.css';

const drawerWidth = 280;

const AdminDashboard = () => {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const isMenuOpen = Boolean(anchorEl);
  const isNotificationsOpen = Boolean(notificationAnchorEl);
  
  // Verificar autenticaci�n y rol de usuario
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Solo permitir acceso a administradores
    if (role !== 'admin') {
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
  
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationsOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    handleUserMenuClose();
  };
  
  const navigationItems = [
    { text: 'Panel Principal', icon: <DashboardIcon />, path: '/admin' },
    { 
      subheader: 'Gestión de Usuarios',
      items: [
        { text: 'Todos los Usuarios', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Organizadores', icon: <ApartmentIcon />, path: '/admin/organizers' }
      ]
    },
    { 
      subheader: 'Contenido',
      items: [
        { text: 'Eventos', icon: <EventIcon />, path: '/admin/events' },
        { text: 'Categorías', icon: <CategoryIcon />, path: '/admin/categories' },
        { text: 'Plantillas', icon: <ExtensionIcon />, path: '/admin/templates' }
      ]
    },
    { 
      subheader: 'Finanzas',
      items: [
        { text: 'Informes', icon: <ReceiptIcon />, path: '/admin/reports' },
        { text: 'Comisiones', icon: <CreditCardIcon />, path: '/admin/reports' }
      ]
    },
    { 
      subheader: 'Sistema',
      items: [
        { text: 'Configuración', icon: <SettingsIcon />, path: '/admin/settings' },
        { text: 'Comunicaciones', icon: <EmailIcon />, path: '/admin/communications' },
        { text: 'Soporte', icon: <ContactSupportIcon />, path: '/admin/settings' }
      ]
    }
  ];
  
  const mockNotifications = [
    { id: 1, title: 'Nuevo organizador', message: 'Luis Rodríguez ha solicitado ser organizador', time: '10 min' },
    { id: 2, title: 'Evento reportado', message: 'El evento "Concierto de Jazz" ha sido reportado', time: '30 min' },
    { id: 3, title: 'Actualización del sistema', message: 'Nueva versión disponible', time: '1 hora' },
  ];
  
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
          backgroundColor: '#1a1a2e',
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
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontWeight: 'bold',
              flexGrow: 1
            }}
          >
            Panel de Administración
          </Typography>
          
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
          
          {/* Notifications icon */}
          <IconButton
            color="inherit"
            aria-label="show notifications"
            onClick={handleNotificationsOpen}
            size="large"
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={unreadNotifications} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          {/* Profile menu */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleUserMenuOpen}
            color="inherit"
          >
            <Avatar 
              alt={user?.username || 'Admin'} 
              src={user?.photo}
              sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
            >
              {user?.username ? user.username[0].toUpperCase() : 'A'}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Left Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#0f0f1e',
            color: '#ffffff',
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
            backgroundColor: '#14142a',
          }}
        >
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                display: open ? 'block' : 'none',
                fontWeight: 'bold',
                ml: 1
              }}
            >
              EntradasMelilla
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
        
        <Box sx={{ overflow: 'auto', py: 1 }}>
          {navigationItems.map((item, index) => (
            item.subheader ? (
              <React.Fragment key={item.subheader}>
                {index > 0 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', my: 1 }} />}
                {open && (
                  <ListSubheader
                    sx={{ 
                      backgroundColor: 'transparent', 
                      color: 'rgba(255,255,255,0.5)', 
                      fontSize: '0.7rem',
                      lineHeight: '30px',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {item.subheader}
                  </ListSubheader>
                )}
                {item.items.map((subItem) => (
                  <ListItem key={subItem.text} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        backgroundColor: location.pathname === subItem.path ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        },
                        borderLeft: location.pathname === subItem.path ? '3px solid #3f51b5' : '3px solid transparent',
                      }}
                      onClick={() => handleNavigation(subItem.path)}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color: location.pathname === subItem.path ? '#3f51b5' : 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={subItem.text} 
                        sx={{ 
                          opacity: open ? 1 : 0,
                          color: location.pathname === subItem.path ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </React.Fragment>
            ) : (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    },
                    borderLeft: location.pathname === item.path ? '3px solid #3f51b5' : '3px solid transparent',
                  }}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: location.pathname === item.path ? '#3f51b5' : 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      opacity: open ? 1 : 0,
                      color: location.pathname === item.path ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          ))}
        </Box>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mt: 'auto' }} />
        
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
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Cerrar Sesi�n" 
                sx={{ opacity: open ? 1 : 0, color: 'rgba(255, 255, 255, 0.7)' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f5f5f9',
          minHeight: '100vh',
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
          <Outlet /> {/* Renders child routes */}
        </Container>
      </Box>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={isMenuOpen}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
            },
          },
        }}
      >
        <MenuItem onClick={() => handleNavigation('/admin/profile')}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>
        <MenuItem onClick={() => handleNavigation('/admin/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Configuraci�n
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Cerrar Sesi�n
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        id="notifications-menu"
        open={isNotificationsOpen}
        onClose={handleNotificationsClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 360,
            maxHeight: '70vh',
            overflowY: 'auto',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notificaciones</Typography>
          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setUnreadNotifications(0);
              handleNotificationsClose();
            }}
          >
            Marcar todas como le�das
          </Typography>
        </Box>
        <Divider />
        {mockNotifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationsClose} sx={{ py: 1.5 }}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {notification.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {notification.message}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <Box sx={{ textAlign: 'center', py: 1.5 }}>
          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ cursor: 'pointer' }}
            onClick={() => handleNavigation('/admin/notifications')}
          >
            Ver todas las notificaciones
          </Typography>
        </Box>
      </Menu>
    </Box>
  );
};

export default AdminDashboard;