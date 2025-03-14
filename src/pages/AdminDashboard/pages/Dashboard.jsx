import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, Card, CardContent, CardHeader, Divider,
  Avatar, List, ListItem, ListItemAvatar, ListItemText, Button, IconButton,
  CircularProgress, Chip, LinearProgress
} from '@mui/material';
import { 
  People as PeopleIcon,
  Event as EventIcon,
  AttachMoney as AttachMoneyIcon,
  Speed as SpeedIcon,
  More as MoreIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
  CalendarMonth as CalendarMonthIcon,
  FolderSpecial as FolderSpecialIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Chart component placeholder - you would import actual charts here
const SalesChart = () => (
  <Box
    sx={{
      height: 250,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      borderRadius: 1,
      border: '1px dashed #ccc'
    }}
  >
    <Typography variant="body2" color="text.secondary">
      Aqu� se mostrar�a un gr�fico de ventas
    </Typography>
  </Box>
);

const UserActivityChart = () => (
  <Box
    sx={{
      height: 250,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      borderRadius: 1,
      border: '1px dashed #ccc'
    }}
  >
    <Typography variant="body2" color="text.secondary">
      Aqu� se mostrar�a un gr�fico de actividad de usuarios
    </Typography>
  </Box>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No se encontr� token de autenticaci�n');
        setLoading(false);
        return;
      }
      
      try {
        // Llamada a la API real
        const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        const response = await axios.get(`${API_BASE_URL}/api/v1/dashboard/admin/overview`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data.data);
        
        // Datos de prueba
        setTimeout(() => {
          const mockStats = {
            totalUsers: 542,
            totalEvents: 78,
            totalRevenue: 32750.50,
            totalBookings: 1254,
            activeEvents: 25,
            pendingEvents: 5,
            pendingOrganizers: 3,
            systemHealth: 98, // percentage
            popularCategories: [
              { name: 'M�sica', count: 32 },
              { name: 'Deportes', count: 18 },
              { name: 'Teatro', count: 15 },
              { name: 'Conferencias', count: 8 },
              { name: 'Otros', count: 5 }
            ],
            revenueByMonth: {
              Jan: 2500,
              Feb: 3200,
              Mar: 4100,
              Apr: 3800,
              May: 5200,
              Jun: 4700,
              Jul: 5100,
              Aug: 4100
            },
            userGrowth: {
              Jan: 48,
              Feb: 65,
              Mar: 83,
              Apr: 95,
              May: 110,
              Jun: 135,
              Jul: 148,
              Aug: 542
            }
          };
          
          const mockRecentEvents = [
            {
              id: 'e1',
              title: 'Festival de Jazz',
              organizer: 'Carlos Ruiz',
              date: '2023-09-20T19:00:00',
              status: 'active',
              attendees: 120,
              capacity: 150
            },
            {
              id: 'e2',
              title: 'Torneo de Ajedrez',
              organizer: 'Mar�a L�pez',
              date: '2023-09-25T10:00:00',
              status: 'active',
              attendees: 40,
              capacity: 50
            },
            {
              id: 'e3',
              title: 'Exposici�n de Arte',
              organizer: 'Juan Garc�a',
              date: '2023-10-05T11:00:00',
              status: 'pending',
              attendees: 0,
              capacity: 200
            },
            {
              id: 'e4',
              title: 'Conferencia Tech',
              organizer: 'Ana Mart�nez',
              date: '2023-10-10T09:00:00',
              status: 'active',
              attendees: 75,
              capacity: 250
            }
          ];
          
          const mockRecentUsers = [
            {
              id: 'u1',
              name: 'Laura G�mez',
              email: 'laura@example.com',
              role: 'user',
              status: 'active',
              joinDate: '2023-08-15T10:35:00',
              avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
            },
            {
              id: 'u2',
              name: 'Miguel Torres',
              email: 'miguel@example.com',
              role: 'organizer',
              status: 'pending',
              joinDate: '2023-08-16T14:22:00',
              avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
            },
            {
              id: 'u3',
              name: 'Sof�a Navarro',
              email: 'sofia@example.com',
              role: 'user',
              status: 'active',
              joinDate: '2023-08-17T09:15:00',
              avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
            },
            {
              id: 'u4',
              name: 'David Fern�ndez',
              email: 'david@example.com',
              role: 'organizer',
              status: 'active',
              joinDate: '2023-08-18T16:40:00',
              avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
            }
          ];
          
          setStats(mockStats);
          setRecentEvents(mockRecentEvents);
          setRecentUsers(mockRecentUsers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Error al cargar los datos del dashboard');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <Chip label="Activo" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pendiente" color="warning" size="small" />;
      case 'inactive':
        return <Chip label="Inactivo" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  const getRoleChip = (role) => {
    switch (role) {
      case 'admin':
        return <Chip label="Admin" color="primary" size="small" />;
      case 'organizer':
        return <Chip label="Organizador" color="secondary" size="small" />;
      case 'user':
        return <Chip label="Usuario" color="default" size="small" />;
      default:
        return <Chip label={role} size="small" />;
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: '#FFF3F3', my: 2 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }
  
  return (
    <>
      <Box className="admin-title">
        <Typography variant="h4" component="h1" className="admin-title-text">
          Panel de Control
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link}
            to="/admin/reports"
            sx={{ mr: 1 }}
          >
            Generar Informes
          </Button>
          <Button 
            variant="outlined" 
            component={Link}
            to="/admin/settings"
          >
            Configuraci�n
          </Button>
        </Box>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} className="admin-dashboard-card admin-stat-card">
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography color="textSecondary" gutterBottom>
                Usuarios Totales
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalUsers}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} color="success" />
                <span>+12% este mes</span>
              </Typography>
            </Box>
            <Box className="stat-icon">
              <PeopleIcon sx={{ fontSize: 64 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} className="admin-dashboard-card admin-stat-card">
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography color="textSecondary" gutterBottom>
                Eventos Activos
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalEvents}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {stats.activeEvents} activos, {stats.pendingEvents} pendientes
              </Typography>
            </Box>
            <Box className="stat-icon">
              <EventIcon sx={{ fontSize: 64 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} className="admin-dashboard-card admin-stat-card">
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography color="textSecondary" gutterBottom>
                Ingresos Totales
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                �{stats.totalRevenue.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} color="success" />
                <span>+8% este mes</span>
              </Typography>
            </Box>
            <Box className="stat-icon">
              <AttachMoneyIcon sx={{ fontSize: 64 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} className="admin-dashboard-card admin-stat-card">
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography color="textSecondary" gutterBottom>
                Salud del Sistema
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.systemHealth}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.systemHealth} 
                    color={stats.systemHealth > 90 ? "success" : "warning"} 
                    sx={{ height: 8, borderRadius: 1 }} 
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="textSecondary">
                    {stats.systemHealth}%
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box className="stat-icon">
              <SpeedIcon sx={{ fontSize: 64 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title="Ingresos y Ventas"
              action={
                <IconButton aria-label="more">
                  <MoreIcon />
                </IconButton>
              }
              sx={{ pb: 0 }}
            />
            <CardContent>
              <SalesChart />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader
              title="Crecimiento de Usuarios"
              action={
                <IconButton aria-label="more">
                  <MoreIcon />
                </IconButton>
              }
              sx={{ pb: 0 }}
            />
            <CardContent>
              <UserActivityChart />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">�ltimos Eventos</Typography>
                  <Chip 
                    label={`${stats.pendingEvents} pendientes`} 
                    color="warning" 
                    size="small" 
                    sx={{ ml: 1 }} 
                  />
                </Box>
              }
              action={
                <Button 
                  color="primary" 
                  size="small" 
                  component={Link} 
                  to="/admin/events"
                >
                  Ver todos
                </Button>
              }
            />
            <Divider />
            <List sx={{ p: 0 }}>
              {recentEvents.map((event) => (
                <React.Fragment key={event.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: event.status === 'pending' ? 'warning.main' : 'primary.main' }}>
                        {event.status === 'pending' ? <CalendarMonthIcon /> : <EventIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" component="span">
                            {event.title}
                          </Typography>
                          {getStatusChip(event.status)}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary" component="span">
                            {event.organizer} " {formatDate(event.date)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" component="span">
                              Asistentes: {event.attendees}/{event.capacity}
                            </Typography>
                            <Box sx={{ width: '50%', ml: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={(event.attendees / event.capacity) * 100} 
                                sx={{ height: 4, borderRadius: 1 }} 
                              />
                            </Box>
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" variant="inset" />
                </React.Fragment>
              ))}
            </List>
          </Card>
          
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">Usuarios Recientes</Typography>
                  <Chip 
                    label={`${stats.pendingOrganizers} por aprobar`} 
                    color="warning" 
                    size="small" 
                    sx={{ ml: 1 }} 
                  />
                </Box>
              }
              action={
                <Button 
                  color="primary" 
                  size="small" 
                  component={Link} 
                  to="/admin/users"
                >
                  Ver todos
                </Button>
              }
            />
            <Divider />
            <List sx={{ p: 0 }}>
              {recentUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar src={user.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" component="span">
                            {user.name}
                          </Typography>
                          {getRoleChip(user.role)}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary" component="span">
                            {user.email}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Box 
                              component="span" 
                              sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: user.status === 'active' ? 'success.main' : 'warning.main',
                                display: 'inline-block',
                                mr: 0.5
                              }} 
                            />
                            <Typography variant="body2" color="text.secondary" component="span">
                              {user.status === 'active' ? 'Activo' : 'Pendiente'} " Registrado: {formatDate(user.joinDate)}
                            </Typography>
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" variant="inset" />
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>
        
        {/* Popular Categories */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Categor�as Populares"
              action={
                <Button 
                  color="primary" 
                  size="small" 
                  component={Link} 
                  to="/admin/categories"
                >
                  Administrar
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {stats.popularCategories.map((category) => (
                  <Grid item xs={6} sm={4} md={2.4} key={category.name}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 2,
                        bgcolor: '#f8f9fa'
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.light', 
                          mb: 1, 
                          width: 48, 
                          height: 48 
                        }}
                      >
                        <FolderSpecialIcon />
                      </Avatar>
                      <Typography variant="subtitle2" gutterBottom>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.count} eventos
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* System Notices */}
      <Box sx={{ mt: 4 }}>
        <Paper 
          sx={{ 
            p: 2, 
            bgcolor: 'info.light', 
            color: 'info.contrastText',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <InfoIcon sx={{ mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              Pr�ximamente: Actualizaci�n de la plataforma
            </Typography>
            <Typography variant="body2">
              Se lanzar� una nueva versi�n del sistema con mejoras en rendimiento y seguridad. Est� atento a los pr�ximos anuncios.
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            sx={{ 
              ml: 2, 
              color: 'info.contrastText', 
              borderColor: 'info.contrastText',
              '&:hover': {
                borderColor: 'info.contrastText',
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            M�s informaci�n
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default Dashboard;