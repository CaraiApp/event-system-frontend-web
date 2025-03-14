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
import { eventAPI } from '../../../services';
import { COMMON_STRINGS } from '../../../utils/strings';

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
        setError(COMMON_STRINGS.noToken);
        setLoading(false);
        return;
      }
      
      try {
        console.group('🎭 DEBUG - Events.jsx - Obtención de eventos');
        console.log('🎭 Intentando obtener eventos del usuario actual...');
        
        try {
          // Hacer la petición real a la API
          console.time('🎭 Tiempo de respuesta API');
          const response = await eventAPI.getUserEvents();
          console.timeEnd('🎭 Tiempo de respuesta API');
          
          if (response.data && response.data.data) {
            console.log('🎭 Eventos obtenidos exitosamente:', response.data.data);
            setEvents(response.data.data);
          } else {
            console.warn('🎭 Respuesta sin datos válidos:', response);
            setEvents([]);
          }
        } catch (apiError) {
          console.error('🎭 Error al obtener eventos desde API:', apiError);
          
          // Para desarrollo/pruebas: decidir si usar datos de ejemplo
          const useMockData = true;
          
          if (useMockData) {
            console.log('🎭 Usando datos de prueba como fallback');
            // Datos de ejemplo solo para desarrollo
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
              }
            ];
            
            setEvents(mockEvents);
          } else {
            // En producción, no mostrar datos falsos
            setEvents([]);
            throw apiError; // Propagar el error para el manejo general
          }
        }
        
        console.groupEnd();
        setLoading(false);
      } catch (error) {
        console.error('Error general al obtener eventos:', error);
        setError(COMMON_STRINGS.errorCargarEventos);
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
    // Redirección a la página de detalles del evento para clientes
    window.open(`/event-detail/${selectedEventId}`, '_blank');
    handleMenuClose();
  };
  
  const handleViewAnalytics = () => {
    // La ruta debe ser absoluta desde organizer
    navigate(`/organizer/events/${selectedEventId}/statistics`);
    handleMenuClose();
  };
  
  const handleEditEvent = () => {
    // La ruta debe ser absoluta desde organizer
    navigate(`/organizer/events/${selectedEventId}/edit`);
    handleMenuClose();
  };
  
  // Filter events based on tab and search term
  const filteredEvents = events.filter(event => {
    // Filter by tab (status)
    if (tabValue === 1 && !(event.published || event.status === 'active')) return false;
    if (tabValue === 2 && !(event.status === 'finished' || (event.eventDate && new Date(event.eventDate) < new Date()))) return false;
    if (tabValue === 3 && !(event.status === 'cancelled')) return false;
    if (tabValue === 4 && (event.published || event.status === 'active' || event.status === 'finished' || event.status === 'cancelled')) return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      
      // Support multiple field structures
      const title = (event.name || event.title || '').toLowerCase();
      const description = (event.desc || event.description || '').toLowerCase();
      const location = (event.venue || event.address || event.location || '').toLowerCase();
      
      return (
        title.includes(term) ||
        description.includes(term) ||
        location.includes(term)
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
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return dateString;
    }
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <Chip label="Activo" color="success" size="small" />;
      case 'finished':
        return <Chip label="Finalizado" color="default" size="small" />;
      case 'draft':
        return <Chip label="Borrador" color="warning" size="small" />;
      case 'cancelled':
        return <Chip label="Cancelado" color="error" size="small" sx={{ fontWeight: 'bold' }} />;
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
          {COMMON_STRINGS.crearEvento}
        </Button>
      </Box>
      
      {/* Summary Cards */}
      {events.length > 0 ? (
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
                  {events.filter(e => e.published || e.status === 'active').length}
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
                  {events.reduce((total, event) => total + (event.reservedSeats ? event.reservedSeats.length : (event.soldTickets || 0)), 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', mb: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            {COMMON_STRINGS.noEventosCreados}
          </Typography>
          <Typography variant="body1" paragraph>
            {COMMON_STRINGS.mensajeCrearPrimerEvento}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link}
            to="/pricing"
            size="large"
            sx={{ mt: 2 }}
          >
            {COMMON_STRINGS.crearEvento}
          </Button>
        </Paper>
      )}
      
      {events.length > 0 && (
        <>
          {/* Filter Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="event status tabs">
              <Tab label="Todos" />
              <Tab label="Activos" />
              <Tab label="Finalizados" />
              <Tab label="Cancelados" />
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
                    <TableCell>{COMMON_STRINGS.ubicacion}</TableCell>
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
                        <Typography variant="subtitle2">{event.name || event.title}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {event.desc || event.description || ''}
                          {(event.desc || event.description) && (event.desc || event.description).length > 60 ? '...' : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(event.eventDate || event.date)}</TableCell>
                      <TableCell>{event.venue || event.address || event.location || '-'}</TableCell>
                      <TableCell align="right">{COMMON_STRINGS.euro}{event.vipprice || event.price ? (event.vipprice || event.price).toFixed(2) : '0.00'}</TableCell>
                      <TableCell align="center">
                        {event.reservedSeats ? event.reservedSeats.length : event.soldTickets || 0}/{event.TotalCapacity || event.totalTickets || 0}
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
                                width: `${(event.TotalCapacity || event.totalTickets) ? 
                                  ((event.reservedSeats ? event.reservedSeats.length : event.soldTickets || 0) / 
                                  (event.TotalCapacity || event.totalTickets)) * 100 : 0}%`,
                                backgroundColor: 'primary.main',
                                borderRadius: 1,
                                height: 4
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {getStatusChip(event.published ? 'active' : event.status || 'draft')}
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
                          {COMMON_STRINGS.noEventosEncontrados}
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
              labelRowsPerPage={COMMON_STRINGS.filasPorPagina}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </Paper>
        </>
      )}
      
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
          {COMMON_STRINGS.verDetalles}
        </MenuItem>
        <MenuItem onClick={handleViewAnalytics}>
          <BarChartIcon fontSize="small" sx={{ mr: 1 }} />
          {COMMON_STRINGS.verEstadisticas}
        </MenuItem>
        <MenuItem onClick={handleEditEvent}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          {COMMON_STRINGS.editarEvento}
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