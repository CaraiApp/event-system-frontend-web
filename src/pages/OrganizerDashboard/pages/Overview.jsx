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
        
        // Inicializar datos por defecto en caso de error
        const emptyData = {
          totalRevenue: 0,
          totalTicketsSold: 0,
          totalEvents: 0,
          activeEvents: 0,
          upcomingEvents: [],
          recentSales: [],
          salesByEvent: {}
        };
        
        // Intentar obtener datos del backend
        try {
          // Definir la URL correcta
          const response = await axios.get('/api/v1/dashboard/organizer/overview');
          
          console.log('Respuesta del backend:', response.data);
          
          if (response.data && response.data.data) {
            setStats(response.data.data);
            console.log('Datos establecidos correctamente');
          } else {
            console.warn('Respuesta con formato incorrecto, usando datos vacíos');
            setStats(emptyData);
          }
        } catch (apiError) {
          console.error('Error al conectar con el API:', apiError);
          
          // Si es un error 404, probablemente el endpoint no existe
          if (apiError.response && apiError.response.status === 404) {
            console.warn('El endpoint del dashboard no existe, usando datos vacíos');
            setStats(emptyData);
          } else {
            // Para otros errores, intentar usar datos de eventos directamente
            try {
              // Obtener eventos del organizador
              const eventsResponse = await axios.get('/api/v1/events/getuserEvent');
              
              if (eventsResponse.data && eventsResponse.data.data) {
                const events = eventsResponse.data.data;
                
                // Crear estadísticas básicas a partir de los eventos
                const basicStats = {
                  totalRevenue: 0, // No podemos calcular esto sin datos de reservas
                  totalTicketsSold: 0, // No podemos calcular esto sin datos de reservas
                  totalEvents: events.length,
                  activeEvents: events.filter(e => e.published).length,
                  upcomingEvents: events.slice(0, 3).map(e => ({
                    id: e._id,
                    name: e.name,
                    date: e.eventDate,
                    ticketsSold: 0,
                    revenue: 0
                  })),
                  recentSales: [],
                  salesByEvent: {}
                };
                
                setStats(basicStats);
                console.log('Usando datos básicos de eventos');
              } else {
                // Si tampoco hay eventos, usar datos vacíos
                setStats(emptyData);
              }
            } catch (eventsError) {
              console.error('Error al obtener datos de eventos:', eventsError);
              setStats(emptyData);
            }
          }
        }
      } catch (error) {
        console.error('Error general:', error);
        setError('No se pudieron cargar los datos. Por favor, intente más tarde.');
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

  // Comprobar si hay datos vacíos (todos los valores numéricos son 0 y los arrays están vacíos)
  const hasNoData = stats && 
    stats.totalEvents === 0 && 
    stats.totalTicketsSold === 0 && 
    stats.upcomingEvents.length === 0 && 
    stats.recentSales.length === 0;
  
  return (
    <>
      <Box className="dashboard-title">
        <Typography variant="h4" component="h1" className="dashboard-title-text">
          Panel de Control
        </Typography>
        {!hasNoData && (
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
          >
            Exportar Datos
          </Button>
        )}
      </Box>
      
      {/* Mensaje cuando no hay datos */}
      {hasNoData && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            textAlign: 'center',
            bgcolor: '#f9f9f9'
          }}
        >
          <Typography variant="h5" gutterBottom color="primary">
            No hay datos disponibles
          </Typography>
          <Typography variant="body1" paragraph>
            Aún no tienes eventos o reservas para mostrar estadísticas.
          </Typography>
          <Typography variant="body1" paragraph>
            Comienza creando nuevos eventos para ver información detallada en este panel.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.href = '/create-event'}
            sx={{ mt: 2 }}
          >
            Crear Nuevo Evento
          </Button>
        </Paper>
      )}
      
      {/* Stats Cards - solo mostramos si hay datos */}
      {!hasNoData && (
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
      )}
      
      {/* Upcoming Events & Recent Sales - solo mostramos si hay datos */}
      {!hasNoData && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Card className="dashboard-card">
              <CardHeader title="Próximos Eventos" />
              <Divider />
              <CardContent>
                {stats.upcomingEvents && stats.upcomingEvents.length > 0 ? (
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
                            <TableCell>{event.date ? new Date(event.date).toLocaleDateString() : 'No definida'}</TableCell>
                            <TableCell align="right">{event.ticketsSold}</TableCell>
                            <TableCell align="right">€{(event.revenue || 0).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="textSecondary">No hay próximos eventos</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <Card className="dashboard-card">
              <CardHeader title="Ventas Recientes" />
              <Divider />
              <CardContent>
                {stats.recentSales && stats.recentSales.length > 0 ? (
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
                            <TableCell align="right">€{(sale.amount || 0).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="textSecondary">No hay ventas recientes</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Overview;