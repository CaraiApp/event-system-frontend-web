import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent,
  CardActions,
  Divider,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import axios from 'axios';

const UserOverview = () => {
  const [user, setUser] = useState({});
  const [tickets, setTickets] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Obtener información del usuario
          const userResponse = await axios.get('/api/v1/users/getSingleUser', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(userResponse.data.data);
          
          // Aquí podrías añadir las llamadas a la API para obtener tickets, eventos próximos, etc.
          // Por ahora usaremos datos de ejemplo
          
          // Datos de ejemplo
          setTickets([
            { id: 1, eventName: 'Concierto de Rock', date: '2023-12-15', status: 'active' },
            { id: 2, eventName: 'Festival de Jazz', date: '2023-12-28', status: 'active' },
          ]);
          
          setUpcomingEvents([
            { id: 101, name: 'Opera en el Teatro', date: '2023-12-20', location: 'Teatro Principal' },
            { id: 102, name: 'Exposición de Arte', date: '2023-12-22', location: 'Museo Central' },
          ]);
          
          setRecentPurchases([
            { id: 201, itemName: 'Entrada VIP Concierto', date: '2023-12-01', amount: 85.00 },
            { id: 202, itemName: 'Entrada Festival de Jazz', date: '2023-11-28', amount: 45.50 },
          ]);
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error al cargar datos del dashboard:', error);
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, []);

  // Función para dar formato a la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Estado del ticket con color
  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <Chip label="Activo" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pendiente" color="warning" size="small" />;
      case 'expired':
        return <Chip label="Expirado" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Bienvenido, {user.username || 'Usuario'}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Tarjetas de resumen */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#e3f2fd' }}>
            <ConfirmationNumberIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {tickets.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Entradas Activas
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#e8f5e9' }}>
            <EventIcon sx={{ fontSize: 40, color: '#388e3c', mb: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {upcomingEvents.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Próximos Eventos
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#fff8e1' }}>
            <HistoryIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {recentPurchases.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Compras Recientes
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#fce4ec' }}>
            <FavoriteIcon sx={{ fontSize: 40, color: '#d81b60', mb: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Eventos Guardados
            </Typography>
          </Paper>
        </Grid>
        
        {/* Mis entradas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                Mis Entradas
              </Typography>
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => navigate('/account/tickets')}
              >
                Ver todas
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <Card key={ticket.id} sx={{ mb: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                      {ticket.eventName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha: {formatDate(ticket.date)}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {getStatusChip(ticket.status)}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/account/tickets/${ticket.id}`)}>
                      Ver Detalles
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No tienes entradas activas en este momento.
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Próximos eventos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                Próximos Eventos
              </Typography>
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => navigate('/events')}
              >
                Ver más eventos
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Card key={event.id} sx={{ mb: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                      {event.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha: {formatDate(event.date)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lugar: {event.location}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/event-detail/${event.id}`)}>
                      Ver Evento
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No hay eventos próximos programados.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserOverview;