import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Button, Chip, CircularProgress,
  InputBase, IconButton, Tabs, Tab, Card, CardContent, Grid, Menu, MenuItem
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No se encontró token de autenticación');
        setLoading(false);
        return;
      }
      
      try {
        // En producción, aquí se realizará la petición real a la API
        // const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        // const response = await axios.get(`${API_BASE_URL}/api/v1/events/getuserEvent`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setEvents(response.data.data);
        
        // Datos de prueba
        setTimeout(() => {
          const mockEvents = [
            {
              _id: '1',
              title: 'Concierto de Jazz',
              description: 'Noche de jazz con los mejores artistas locales',
              date: '2023-09-15T20:00:00.000Z',
              location: 'Teatro Principal',
              totalTickets: 150,
              soldTickets: 120,
              price: 30.00,
              status: 'active',
              createdAt: '2023-07-20T10:00:00.000Z'
            },
            {
              _id: '2',
              title: 'Teatro Infantil',
              description: 'Obra de teatro para toda la familia',
              date: '2023-09-22T18:00:00.000Z',
              location: 'Centro Cultural',
              totalTickets: 100,
              soldTickets: 85,
              price: 15.00,
              status: 'active',
              createdAt: '2023-07-25T11:30:00.000Z'
            },
            {
              _id: '3',
              title: 'Torneo de Ajedrez',
              description: 'Competición abierta a todos los niveles',
              date: '2023-10-05T09:00:00.000Z',
              location: 'Club de Ajedrez',
              totalTickets: 50,
              soldTickets: 40,
              price: 20.00,
              status: 'active',
              createdAt: '2023-08-01T14:45:00.000Z'
            },
            {
              _id: '4',
              title: 'Festival de Danza',
              description: 'Exhibición de danzas tradicionales y modernas',
              date: '2023-10-12T19:30:00.000Z',
              location: 'Teatro Municipal',
              totalTickets: 200,
              soldTickets: 80,
              price: 25.00,
              status: 'active',
              createdAt: '2023-08-05T09:15:00.000Z'
            },
            {
              _id: '5',
              title: 'Concierto de Rock',
              description: 'Lo mejor del rock nacional',
              date: '2023-08-20T21:00:00.000Z',
              location: 'Estadio Cubierto',
              totalTickets: 500,
              soldTickets: 450,
              price: 35.00,
              status: 'finished',
              createdAt: '2023-06-10T16:20:00.000Z'
            },
            {
              _id: '6',
              title: 'Exposición de Arte',
              description: 'Muestra de artistas emergentes',
              date: '2023-08-05T10:00:00.000Z',
              location: 'Galería Moderna',
              totalTickets: 300,
              soldTickets: 275,
              price: 10.00,
              status: 'finished',
              createdAt: '2023-06-15T13:10:00.000Z'
            },
            {
              _id: '7',
              title: 'Conferencia Tecnológica',
              description: 'Últimas tendencias en desarrollo web',
              date: '2023-11-10T09:00:00.000Z',
              location: 'Centro de Convenciones',
              totalTickets: 150,
              soldTickets: 0,
              price: 50.00,
              status: 'draft',
              createdAt: '2023-08-10T11:05:00.000Z'
            }
          ];
          
          setEvents(mockEvents);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Error al cargar los eventos');
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when searching
  };
  
  const handleMenuClick = (event, eventId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEventId(null);
  };
  
  const handleViewDetails = () => {
    navigate(`/events/${selectedEventId}`);
    handleMenuClose();
  };
  
  const handleViewAnalytics = () => {
    navigate(`/organizer/events/${selectedEventId}/analytics`);
    handleMenuClose();
  };
  
  const handleEditEvent = () => {
    navigate(`/events/edit/${selectedEventId}`);
    handleMenuClose();
  };
  
  // Filter events based on tab and search term
  const filteredEvents = events.filter(event => {
    // Filter by tab (status)
    if (tabValue === 1 && event.status !== 'active') return false;
    if (tabValue === 2 && event.status !== 'finished') return false;
    if (tabValue === 3 && event.status !== 'draft') return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
  
  // Calculate pagination
  const paginatedEvents = filteredEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <Chip label="Activo" color="success" size="small" />;
      case 'finished':
        return <Chip label="Finalizado" color="default" size="small" />;
      case 'draft':
        return <Chip label="Borrador" color="warning" size="small" />;
      default:
        return <Chip label={status} size="small" />;
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
      <Box className="dashboard-title">
        <Typography variant="h4" component="h1" className="dashboard-title-text">
          Mis Eventos
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link}
          to="/pricing"
        >
          Crear Nuevo Evento
        </Button>
      </Box>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total de Eventos
              </Typography>
              <Typography variant="h3" color="primary">
                {events.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Eventos Activos
              </Typography>
              <Typography variant="h3" color="success.main">
                {events.filter(e => e.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Entradas Vendidas
              </Typography>
              <Typography variant="h3" color="secondary.main">
                {events.reduce((total, event) => total + event.soldTickets, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="event status tabs">
          <Tab label="Todos" />
          <Tab label="Activos" />
          <Tab label="Finalizados" />
          <Tab label="Borradores" />
        </Tabs>
      </Box>
      
      {/* Search and Filter Bar */}
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', flex: 1, mr: 2 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Buscar eventos"
            inputProps={{ 'aria-label': 'buscar eventos' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <Button startIcon={<FilterListIcon />} variant="outlined">
          Filtros
        </Button>
      </Box>
      
      {/* Events Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Evento</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="center">Entradas Vendidas</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEvents.map((event) => (
                <TableRow
                  hover
                  key={event._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="subtitle2">{event.title}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {event.description.substring(0, 60)}
                      {event.description.length > 60 ? '...' : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(event.date)}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell align="right">¬{event.price.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    {event.soldTickets}/{event.totalTickets}
                    <Box sx={{ width: '100%', mt: 1 }}>
                      <Box
                        sx={{
                          width: '100%',
                          backgroundColor: '#e0e0e0',
                          borderRadius: 1,
                          height: 4
                        }}
                      >
                        <Box
                          sx={{
                            width: `${(event.soldTickets / event.totalTickets) * 100}%`,
                            backgroundColor: 'primary.main',
                            borderRadius: 1,
                            height: 4
                          }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {getStatusChip(event.status)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="more"
                      id={`event-menu-${event._id}`}
                      aria-controls={`event-menu-${event._id}`}
                      aria-haspopup="true"
                      onClick={(e) => handleMenuClick(e, event._id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              
              {paginatedEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      No se encontraron eventos
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEvents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
      
      {/* Event Actions Menu */}
      <Menu
        id="event-actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Ver Detalles
        </MenuItem>
        <MenuItem onClick={handleViewAnalytics}>
          <BarChartIcon fontSize="small" sx={{ mr: 1 }} />
          Ver Estadísticas
        </MenuItem>
        <MenuItem onClick={handleEditEvent}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar Evento
        </MenuItem>
      </Menu>
    </>
  );
};

export default Events;

// Importing BarChartIcon for the menu
const BarChartIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/>
    </svg>
  );
};