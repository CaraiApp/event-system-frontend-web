import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Card, CardContent, 
  CircularProgress, Divider, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI, bookingAPI } from '../../../services/api';
import { COMMON_STRINGS } from '../../../utils/strings';

const EventStatistics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        // Get event details
        const eventResponse = await eventAPI.getEvent(id);
        
        if (eventResponse.data && eventResponse.data.data) {
          setEvent(eventResponse.data.data);
          
          // Get bookings for this event
          try {
            const bookingsResponse = await axios.get(
              `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/booking/geteventbooking?event_id=${id}`
            );
            
            if (bookingsResponse.data && bookingsResponse.data.data) {
              setBookings(bookingsResponse.data.data);
            }
          } catch (bookingError) {
            console.error('Error fetching bookings:', bookingError);
          }
        }
      } catch (err) {
        console.error('Error fetching event data:', err);
        setError(COMMON_STRINGS.errorCargarEventos);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventData();
    }
  }, [id]);

  // Calculate statistics
  const calculateStats = () => {
    if (!event || !bookings.length) return null;

    // Calculate total revenue
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
    // Calculate sold tickets percentage
    const totalCapacity = event.TotalCapacity || 0;
    const soldTickets = bookings.reduce((sum, booking) => sum + (booking.guestSize || 0), 0);
    const soldPercentage = totalCapacity > 0 ? (soldTickets / totalCapacity) * 100 : 0;
    
    // Data for ticket type distribution
    const vipTickets = bookings.filter(b => 
      b.seatNumbers && b.seatNumbers.some(seat => 
        event.vipSeats && event.vipSeats.includes(seat)
      )
    ).length;
    
    const regularTickets = soldTickets - vipTickets;
    
    const ticketTypeData = [
      { name: 'VIP', value: vipTickets },
      { name: 'Económica', value: regularTickets }
    ];

    // Bookings by date
    const bookingsByDate = {};
    bookings.forEach(booking => {
      const date = new Date(booking.bookingDate).toLocaleDateString();
      bookingsByDate[date] = (bookingsByDate[date] || 0) + 1;
    });

    const bookingsChartData = Object.keys(bookingsByDate).map(date => ({
      date,
      bookings: bookingsByDate[date]
    }));

    return {
      totalRevenue,
      soldTickets,
      totalCapacity,
      soldPercentage,
      ticketTypeData,
      bookingsChartData
    };
  };

  const stats = calculateStats();

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

  if (!event) {
    return (
      <Paper sx={{ p: 3, my: 2 }}>
        <Typography>No se encontró información del evento.</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/organizer/events')}
          sx={{ mt: 2 }}
        >
          Volver a Eventos
        </Button>
      </Paper>
    );
  }

  return (
    <>
      <Box className="dashboard-title">
        <Typography variant="h4" component="h1" className="dashboard-title-text">
          Estadísticas de Evento
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => navigate('/organizer/events')}
        >
          Volver a Eventos
        </Button>
      </Box>

      {/* Event Info */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <img 
              src={event.photo || 'https://via.placeholder.com/300x200'} 
              alt={event.name || 'Evento'} 
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" component="h2">{event.name || 'Sin título'}</Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {event.desc || 'Sin descripción'}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="textSecondary">Fecha</Typography>
                <Typography variant="body2">{new Date(event.eventDate).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="textSecondary">Hora</Typography>
                <Typography variant="body2">{new Date(event.eventTime).toLocaleTimeString()}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="textSecondary">Lugar</Typography>
                <Typography variant="body2">{event.venue || 'No especificado'}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="textSecondary">Estado</Typography>
                <Typography variant="body2" sx={{ 
                  color: event.status === 'active' ? 'success.main' : 
                         event.status === 'finished' ? 'text.secondary' :
                         event.status === 'cancelled' ? 'error.main' : 'warning.main'
                }}>
                  {event.status === 'active' ? 'Activo' : 
                   event.status === 'finished' ? 'Finalizado' :
                   event.status === 'cancelled' ? 'Cancelado' : 'Borrador'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ingresos Totales
              </Typography>
              <Typography variant="h3" color="primary">
                {stats ? `${COMMON_STRINGS.euro}${stats.totalRevenue.toFixed(2)}` : '€0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Entradas Vendidas
              </Typography>
              <Typography variant="h3" color="success.main">
                {stats ? `${stats.soldTickets}/${stats.totalCapacity}` : '0/0'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stats ? `${stats.soldPercentage.toFixed(1)}% de ocupación` : '0% de ocupación'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reservas
              </Typography>
              <Typography variant="h3" color="secondary.main">
                {bookings.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Ticket Type Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Tipos de Entradas
            </Typography>
            <Box sx={{ height: 300 }}>
              {stats && stats.ticketTypeData && stats.ticketTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.ticketTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.ticketTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} entradas`, 'Cantidad']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="textSecondary">
                    No hay datos disponibles
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Bookings Timeline */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reservas por Fecha
            </Typography>
            <Box sx={{ height: 300 }}>
              {stats && stats.bookingsChartData && stats.bookingsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.bookingsChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} reservas`, 'Reservas']} />
                    <Legend />
                    <Bar dataKey="bookings" name="Reservas" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="textSecondary">
                    No hay datos disponibles
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bookings List */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Listado de Reservas
        </Typography>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Asientos</TableCell>
                  <TableCell>Invitados</TableCell>
                  <TableCell>Fecha de Reserva</TableCell>
                  <TableCell align="right">Importe</TableCell>
                  <TableCell align="center">Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <TableRow key={index}>
                      <TableCell>{booking.user_id?.username || 'Usuario desconocido'}</TableCell>
                      <TableCell>{booking.seatNumbers?.join(', ') || '-'}</TableCell>
                      <TableCell>{booking.guestSize || 0}</TableCell>
                      <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                      <TableCell align="right">{COMMON_STRINGS.euro}{booking.totalPrice?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell align="center">
                        {booking.paymentStatus === 'paid' ? 
                          <Box component="span" sx={{ color: 'success.main', fontWeight: 'bold' }}>Pagado</Box> : 
                          <Box component="span" sx={{ color: 'warning.main', fontWeight: 'bold' }}>Pendiente</Box>
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No hay reservas para este evento
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
};

export default EventStatistics;