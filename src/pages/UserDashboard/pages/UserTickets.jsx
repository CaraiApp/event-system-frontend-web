import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import QrCodeIcon from '@mui/icons-material/QrCode';
import axios from 'axios';

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // En producción, aquí iría la llamada a la API real
          // Por ahora, usamos datos de ejemplo
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simular retardo de red
          
          const mockTickets = [
            {
              id: 1,
              eventName: 'Concierto de Rock',
              eventDate: '2023-12-15',
              location: 'Auditorio Municipal',
              ticketType: 'VIP',
              seatLocation: 'Sección A, Fila 3, Asiento 12',
              price: 95.00,
              status: 'active',
              qrCode: 'https://example.com/qr/123456'
            },
            {
              id: 2,
              eventName: 'Festival de Jazz',
              eventDate: '2023-12-28',
              location: 'Parque Central',
              ticketType: 'General',
              seatLocation: 'Entrada General',
              price: 45.50,
              status: 'active',
              qrCode: 'https://example.com/qr/789012'
            },
            {
              id: 3,
              eventName: 'Teatro Clásico',
              eventDate: '2023-10-10',
              location: 'Teatro Principal',
              ticketType: 'Premium',
              seatLocation: 'Palco 2, Asiento 4',
              price: 75.00,
              status: 'used',
              qrCode: 'https://example.com/qr/345678'
            },
            {
              id: 4,
              eventName: 'Exposición de Arte',
              eventDate: '2023-11-05',
              location: 'Museo Central',
              ticketType: 'General',
              seatLocation: 'Entrada General',
              price: 20.00,
              status: 'expired',
              qrCode: 'https://example.com/qr/901234'
            }
          ];
          
          setTickets(mockTickets);
          setFilteredTickets(mockTickets);
          setLoading(false);
        } catch (error) {
          console.error('Error al cargar los tickets:', error);
          setLoading(false);
        }
      }
    };
    
    fetchTickets();
  }, []);

  // Manejar cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Filtrar por estado según la pestaña seleccionada
    if (newValue === 0) { // Todos
      setFilteredTickets(tickets.filter(ticket => 
        ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else if (newValue === 1) { // Activos
      setFilteredTickets(tickets.filter(ticket => 
        ticket.status === 'active' && 
        ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else if (newValue === 2) { // Usados
      setFilteredTickets(tickets.filter(ticket => 
        ticket.status === 'used' && 
        ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else if (newValue === 3) { // Expirados
      setFilteredTickets(tickets.filter(ticket => 
        ticket.status === 'expired' && 
        ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  };

  // Manejar búsqueda
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Filtrar por término de búsqueda y estado actual
    let filtered = tickets;
    
    // Aplicar filtro de estado según la pestaña
    if (tabValue === 1) { // Activos
      filtered = filtered.filter(ticket => ticket.status === 'active');
    } else if (tabValue === 2) { // Usados
      filtered = filtered.filter(ticket => ticket.status === 'used');
    } else if (tabValue === 3) { // Expirados
      filtered = filtered.filter(ticket => ticket.status === 'expired');
    }
    
    // Aplicar término de búsqueda
    filtered = filtered.filter(ticket => 
      ticket.eventName.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredTickets(filtered);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener chip de estado
  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <Chip label="Activo" color="success" size="small" />;
      case 'used':
        return <Chip label="Utilizado" color="default" size="small" />;
      case 'expired':
        return <Chip label="Expirado" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Mis Entradas
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={`Todos (${tickets.length})`} />
            <Tab label={`Activos (${tickets.filter(t => t.status === 'active').length})`} />
            <Tab label={`Utilizados (${tickets.filter(t => t.status === 'used').length})`} />
            <Tab label={`Expirados (${tickets.filter(t => t.status === 'expired').length})`} />
          </Tabs>
        </Box>
        
        <TextField
          fullWidth
          placeholder="Buscar por nombre de evento"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        {filteredTickets.length > 0 ? (
          <Grid container spacing={3}>
            {filteredTickets.map((ticket) => (
              <Grid item xs={12} sm={6} key={ticket.id}>
                <Card sx={{ boxShadow: '0 2px 6px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        {ticket.eventName}
                      </Typography>
                      {getStatusChip(ticket.status)}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(ticket.eventDate)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {ticket.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ConfirmationNumberIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {ticket.ticketType} - {ticket.seatLocation}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" sx={{ color: '#3795d6', fontWeight: 'bold', mt: 2 }}>
                      {ticket.price.toFixed(2)} €
                    </Typography>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      startIcon={<QrCodeIcon />}
                      disabled={ticket.status !== 'active'}
                    >
                      Ver QR
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained"
                      disabled={ticket.status !== 'active'}
                    >
                      Descargar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No se encontraron entradas que coincidan con tu búsqueda.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UserTickets;