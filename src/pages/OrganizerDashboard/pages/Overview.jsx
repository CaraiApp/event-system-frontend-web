import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, Button, CircularProgress, 
  Card, CardContent, CardHeader, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Divider
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  People as PeopleIcon, 
  EventAvailable as EventAvailableIcon, 
  DateRange as DateRangeIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import axios from 'axios';

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No se encontró token de autenticación');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        
        // URL correcta según la implementación en el backend
        const dashboardUrl = `${API_BASE_URL}/api/v1/dashboard/organizer/overview`;
        console.log('Conectando a:', dashboardUrl);
        
        const response = await axios.get(dashboardUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Respuesta del backend:', response.data);
        
        if (response.data && response.data.data) {
          setStats(response.data.data);
          console.log('Datos establecidos correctamente');
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (error) {
        console.error('Error al obtener datos del dashboard:', error);
        
        // Mensaje de error más detallado y útil para el usuario
        let errorMessage = 'Error al cargar datos del dashboard';
        
        if (error.response) {
          // Error de respuesta del servidor
          errorMessage += `: ${error.response.status} ${error.response.statusText}`;
          console.error('Detalles del error:', error.response.data);
        } else if (error.request) {
          // Error de conexión
          errorMessage += ': No se pudo conectar con el servidor';
        } else {
          // Otro tipo de error
          errorMessage += `: ${error.message}`;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const handleExportData = () => {
    // Implementar l�gica para exportar datos
    alert('Funci�n de exportaci�n a implementar');
  };
  
  if (loading) {
    return (
      <Box className="dashboard-loading">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: '#FFF3F3' }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }
  
  return (
    <>
      <Box className="dashboard-title">
        <Typography variant="h4" component="h1" className="dashboard-title-text">
          Panel de Control
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<DownloadIcon />}
          onClick={handleExportData}
        >
          Exportar Datos
        </Button>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper elevation={3} className="dashboard-card dashboard-stat-card" sx={{ bgcolor: '#E3F2FD' }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography color="textSecondary" gutterBottom>
                Ingresos Totales
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                �{stats.totalRevenue.toFixed(2)}
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} color="success" />
                <span>+8% desde el mes pasado</span>
              </Typography>
            </Box>
            <Box className="stat-icon">
              <TrendingUpIcon sx={{ fontSize: 64 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper elevation={3} className="dashboard-card dashboard-stat-card" sx={{ bgcolor: '#E8F5E9' }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography color="textSecondary" gutterBottom>
                Entradas Vendidas
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalTicketsSold}
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} color="success" />
                <span>+5% desde el mes pasado</span>
              </Typography>
            </Box>
            <Box className="stat-icon">
              <PeopleIcon sx={{ fontSize: 64 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper elevation={3} className="dashboard-card dashboard-stat-card" sx={{ bgcolor: '#FFF8E1' }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography color="textSecondary" gutterBottom>
                Total de Eventos
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalEvents}
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }}>
                {stats.activeEvents} eventos activos
              </Typography>
            </Box>
            <Box className="stat-icon">
              <EventAvailableIcon sx={{ fontSize: 64 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper elevation={3} className="dashboard-card dashboard-stat-card" sx={{ bgcolor: '#F3E5F5' }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography color="textSecondary" gutterBottom>
                Ocupaci�n Promedio
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                75%
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }}>
                de capacidad total
              </Typography>
            </Box>
            <Box className="stat-icon">
              <DateRangeIcon sx={{ fontSize: 64 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Upcoming Events & Recent Sales */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card className="dashboard-card">
            <CardHeader title="Pr�ximos Eventos" />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table size="small" className="dashboard-data-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Evento</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell align="right">Vendidas</TableCell>
                      <TableCell align="right">Ingresos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.upcomingEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell align="right">{event.ticketsSold}</TableCell>
                        <TableCell align="right">�{event.revenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <Card className="dashboard-card">
            <CardHeader title="Ventas Recientes" />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table size="small" className="dashboard-data-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Evento</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell align="right">Importe</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.id}</TableCell>
                        <TableCell>{sale.event}</TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell align="right">�{sale.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Overview;