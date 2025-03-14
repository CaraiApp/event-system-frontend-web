import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Button, Chip, CircularProgress,
  Card, TextField, MenuItem, IconButton, Menu, Avatar, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, Grid, Alert, Tabs, Tab, Tooltip, Badge, Divider,
  CardContent, CardMedia, CardActions, Switch, FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Event as EventIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  Groups as GroupsIcon,
  AttachMoney as AttachMoneyIcon,
  Mail as MailIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Componente TabPanel
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`event-tabpanel-${index}`}
      aria-labelledby={`event-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterOrganizer, setFilterOrganizer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [openEventDetailsDialog, setOpenEventDetailsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
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
        // const response = await axios.get(`${API_BASE_URL}/api/v1/admin/events`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        
        // Datos de prueba
        setTimeout(() => {
          const mockCategories = [
            { id: 'cat1', name: 'Música' },
            { id: 'cat2', name: 'Deportes' },
            { id: 'cat3', name: 'Teatro' },
            { id: 'cat4', name: 'Conferencias' },
            { id: 'cat5', name: 'Arte' }
          ];
          
          const mockOrganizers = [
            { id: 'org1', name: 'María López', company: 'EventosPro' },
            { id: 'org2', name: 'Juan Martínez', company: 'Cultura en Vivo' },
            { id: 'org3', name: 'Ana García', company: 'Deportes Express' },
            { id: 'org4', name: 'Carlos Rodríguez', company: 'Conciertos Inolvidables' }
          ];
          
          const mockEvents = [
            {
              id: 'e1',
              title: 'Festival de Jazz',
              description: 'Un día completo de jazz con los mejores artistas nacionales e internacionales.',
              image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
              category: { id: 'cat1', name: 'Música' },
              organizer: { id: 'org4', name: 'Carlos Rodríguez', company: 'Conciertos Inolvidables' },
              location: 'Teatro Municipal',
              address: 'Calle Principal 123, Melilla',
              date: '2023-10-15T19:00:00',
              endDate: '2023-10-15T23:00:00',
              status: 'published',
              featured: true,
              price: {
                vip: 50,
                standard: 25
              },
              capacity: 500,
              soldTickets: 320,
              createdAt: '2023-08-01T10:30:00',
              updatedAt: '2023-08-20T15:45:00'
            },
            {
              id: 'e2',
              title: 'Torneo de Fútbol',
              description: 'Torneo amistoso entre equipos locales con grandes premios para los ganadores.',
              image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e',
              category: { id: 'cat2', name: 'Deportes' },
              organizer: { id: 'org3', name: 'Ana García', company: 'Deportes Express' },
              location: 'Estadio Ciudad de Melilla',
              address: 'Avda. del Deporte 45, Melilla',
              date: '2023-10-22T10:00:00',
              endDate: '2023-10-22T18:00:00',
              status: 'published',
              featured: false,
              price: {
                vip: 15,
                standard: 8
              },
              capacity: 1000,
              soldTickets: 450,
              createdAt: '2023-08-05T09:15:00',
              updatedAt: '2023-08-18T12:30:00'
            },
            {
              id: 'e3',
              title: 'Romeo y Julieta - Teatro Clásico',
              description: 'La famosa obra de Shakespeare interpretada por la compañía de teatro nacional.',
              image: 'https://images.unsplash.com/photo-1503095396549-807759245b35',
              category: { id: 'cat3', name: 'Teatro' },
              organizer: { id: 'org2', name: 'Juan Martínez', company: 'Cultura en Vivo' },
              location: 'Teatro Principal',
              address: 'Plaza de las Artes 7, Melilla',
              date: '2023-10-28T20:00:00',
              endDate: '2023-10-28T22:30:00',
              status: 'pending',
              featured: false,
              price: {
                vip: 35,
                standard: 20
              },
              capacity: 300,
              soldTickets: 0,
              createdAt: '2023-08-12T14:20:00',
              updatedAt: '2023-08-12T14:20:00'
            },
            {
              id: 'e4',
              title: 'Congreso de Tecnología',
              description: 'Charlas y talleres sobre las últimas tendencias en tecnología y desarrollo.',
              image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
              category: { id: 'cat4', name: 'Conferencias' },
              organizer: { id: 'org1', name: 'María López', company: 'EventosPro' },
              location: 'Centro de Convenciones',
              address: 'Calle Tecnología 90, Melilla',
              date: '2023-11-05T09:00:00',
              endDate: '2023-11-06T18:00:00',
              status: 'published',
              featured: true,
              price: {
                vip: 80,
                standard: 45
              },
              capacity: 250,
              soldTickets: 180,
              createdAt: '2023-07-28T11:40:00',
              updatedAt: '2023-08-15T16:50:00'
            },
            {
              id: 'e5',
              title: 'Exposición de Arte Contemporáneo',
              description: 'Muestra de arte contemporáneo con obras de artistas locales e internacionales.',
              image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6',
              category: { id: 'cat5', name: 'Arte' },
              organizer: { id: 'org2', name: 'Juan Martínez', company: 'Cultura en Vivo' },
              location: 'Galería de Arte Moderna',
              address: 'Avda. de las Artes 23, Melilla',
              date: '2023-10-10T11:00:00',
              endDate: '2023-10-30T19:00:00',
              status: 'published',
              featured: false,
              price: {
                vip: 12,
                standard: 8
              },
              capacity: 150,
              soldTickets: 95,
              createdAt: '2023-08-03T13:25:00',
              updatedAt: '2023-08-17T10:15:00'
            },
            {
              id: 'e6',
              title: 'Concierto de Rock',
              description: 'Noche de rock con bandas locales y nacionales. Un evento para todos los amantes del género.',
              image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
              category: { id: 'cat1', name: 'Música' },
              organizer: { id: 'org4', name: 'Carlos Rodríguez', company: 'Conciertos Inolvidables' },
              location: 'Estadio Cubierto',
              address: 'Calle del Rock 45, Melilla',
              date: '2023-11-18T21:00:00',
              endDate: '2023-11-19T01:00:00',
              status: 'pending',
              featured: false,
              price: {
                vip: 40,
                standard: 25
              },
              capacity: 600,
              soldTickets: 0,
              createdAt: '2023-08-19T16:10:00',
              updatedAt: '2023-08-19T16:10:00'
            },
            {
              id: 'e7',
              title: 'Carrera Solidaria',
              description: 'Carrera popular con fines benéficos. Todas las inscripciones serán donadas a causas sociales.',
              image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e',
              category: { id: 'cat2', name: 'Deportes' },
              organizer: { id: 'org3', name: 'Ana García', company: 'Deportes Express' },
              location: 'Parque Central',
              address: 'Avda. Central s/n, Melilla',
              date: '2023-10-08T09:00:00',
              endDate: '2023-10-08T12:00:00',
              status: 'published',
              featured: true,
              price: {
                vip: 15,
                standard: 10
              },
              capacity: 800,
              soldTickets: 650,
              createdAt: '2023-07-15T10:30:00',
              updatedAt: '2023-08-20T09:45:00'
            }
          ];
          
          setCategories(mockCategories);
          setOrganizers(mockOrganizers);
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
  
  const handleCategoryFilterChange = (event) => {
    setFilterCategory(event.target.value);
    setPage(0);
  };
  
  const handleStatusFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };
  
  const handleOrganizerFilterChange = (event) => {
    setFilterOrganizer(event.target.value);
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
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
    const event = events.find(e => e.id === selectedEventId);
    if (event) {
      setSelectedEvent(event);
      setOpenEventDetailsDialog(true);
    }
    handleMenuClose();
  };
  
  const handleRefresh = () => {
    setLoading(true);
    // Aquí se recargarían los datos reales
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  
  const handleDeleteClick = () => {
    const event = events.find(e => e.id === selectedEventId);
    if (event) {
      setSelectedEvent(event);
      setOpenDeleteDialog(true);
    }
    handleMenuClose();
  };
  
  const handleEventDetailsDialogClose = () => {
    setOpenEventDetailsDialog(false);
    setSelectedEvent(null);
  };
  
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedEvent(null);
  };
  
  const handleDeleteConfirm = () => {
    // Aquí se implementaría la llamada a la API para eliminar el evento
    const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
    
    setEvents(updatedEvents);
    setSuccess('Evento eliminado correctamente');
    setOpenDeleteDialog(false);
    
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };
  
  const handleApproveEvent = () => {
    const updatedEvents = events.map(event => 
      event.id === selectedEventId ? { ...event, status: 'published' } : event
    );
    
    setEvents(updatedEvents);
    setSuccess('Evento aprobado correctamente');
    handleMenuClose();
    
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };
  
  const handleRejectEvent = () => {
    const updatedEvents = events.map(event => 
      event.id === selectedEventId ? { ...event, status: 'rejected' } : event
    );
    
    setEvents(updatedEvents);
    setSuccess('Evento rechazado correctamente');
    handleMenuClose();
    
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };
  
  const handleToggleFeatured = () => {
    const updatedEvents = events.map(event => 
      event.id === selectedEventId ? { ...event, featured: !event.featured } : event
    );
    
    setEvents(updatedEvents);
    
    const event = events.find(e => e.id === selectedEventId);
    setSuccess(`Evento ${event.featured ? 'quitado de' : 'marcado como'} destacado correctamente`);
    handleMenuClose();
    
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };
  
  const handleContactOrganizer = () => {
    const event = events.find(e => e.id === selectedEventId);
    alert(`Contactar al organizador ${event.organizer.name}`);
    handleMenuClose();
  };
  
  // Filtrar eventos
  const filteredEvents = events.filter(event => {
    // Filtrar por pestaña
    if (tabValue === 1 && event.status !== 'published') return false;
    if (tabValue === 2 && event.status !== 'pending') return false;
    if (tabValue === 3 && !event.featured) return false;
    
    // Filtrar por categoría
    if (filterCategory && event.category.id !== filterCategory) return false;
    
    // Filtrar por estado
    if (filterStatus && event.status !== filterStatus) return false;
    
    // Filtrar por organizador
    if (filterOrganizer && event.organizer.id !== filterOrganizer) return false;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        event.address.toLowerCase().includes(term) ||
        event.organizer.name.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
  
  // Calcular paginación
  const paginatedEvents = filteredEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const sameDay = start.toDateString() === end.toDateString();
    const startOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const endOptions = sameDay ? { hour: '2-digit', minute: '2-digit' } : startOptions;
    
    return `${start.toLocaleDateString(undefined, startOptions)} - ${end.toLocaleString(undefined, endOptions)}`;
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'published':
        return <Chip label="Publicado" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pendiente" color="warning" size="small" />;
      case 'rejected':
        return <Chip label="Rechazado" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  const getFeaturedBadge = (featured) => {
    return featured ? (
      <Tooltip title="Evento destacado">
        <StarIcon color="warning" fontSize="small" />
      </Tooltip>
    ) : null;
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <>
      <Box className="admin-title">
        <Typography variant="h4" component="h1" className="admin-title-text">
          Gestión de Eventos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined"
            onClick={() => handleViewModeChange('table')}
            color={viewMode === 'table' ? 'primary' : 'inherit'}
            sx={{ minWidth: '40px', px: 1 }}
          >
            <IconButton>
              <ListIcon />
            </IconButton>
          </Button>
          <Button 
            variant="outlined"
            onClick={() => handleViewModeChange('grid')}
            color={viewMode === 'grid' ? 'primary' : 'inherit'}
            sx={{ minWidth: '40px', px: 1 }}
          >
            <IconButton>
              <GridViewIcon />
            </IconButton>
          </Button>
        </Box>
      </Box>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="event tabs"
          sx={{ '& .MuiTab-root': { fontWeight: 'medium' } }}
        >
          <Tab label="Todos los Eventos" />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Publicados</Typography>
                <Chip 
                  label={events.filter(e => e.status === 'published').length} 
                  size="small"
                  sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Pendientes</Typography>
                <Badge 
                  badgeContent={events.filter(e => e.status === 'pending').length} 
                  color="warning"
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem', height: 20, minWidth: 20 } }}
                >
                  <Typography>Pendientes</Typography>
                </Badge>
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Destacados</Typography>
                <Chip 
                  label={events.filter(e => e.featured).length} 
                  size="small"
                  sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                />
              </Box>
            } 
          />
        </Tabs>
      </Box>
      
      {/* Filtros */}
      <Card sx={{ p: 2, mb: 3, mt: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-filter-label">Categoría</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={filterCategory}
                label="Categoría"
                onChange={handleCategoryFilterChange}
              >
                <MenuItem value="">Todas</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Estado</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={filterStatus}
                label="Estado"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="published">Publicados</MenuItem>
                <MenuItem value="pending">Pendientes</MenuItem>
                <MenuItem value="rejected">Rechazados</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="organizer-filter-label">Organizador</InputLabel>
              <Select
                labelId="organizer-filter-label"
                id="organizer-filter"
                value={filterOrganizer}
                label="Organizador"
                onChange={handleOrganizerFilterChange}
              >
                <MenuItem value="">Todos</MenuItem>
                {organizers.map((organizer) => (
                  <MenuItem key={organizer.id} value={organizer.id}>
                    {organizer.name} ({organizer.company})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button 
              startIcon={<RefreshIcon />} 
              onClick={handleRefresh}
              variant="outlined"
            >
              Actualizar
            </Button>
          </Grid>
        </Grid>
      </Card>
      
      {/* Contenido según la pestaña */}
      <TabPanel value={tabValue} index={0}>
        {viewMode === 'table' ? (
          <TableView 
            events={paginatedEvents}
            page={page}
            rowsPerPage={rowsPerPage}
            filteredEventsCount={filteredEvents.length}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            formatDate={formatDate}
            getStatusChip={getStatusChip}
            getFeaturedBadge={getFeaturedBadge}
            handleMenuClick={handleMenuClick}
          />
        ) : (
          <GridView 
            events={paginatedEvents}
            page={page}
            rowsPerPage={rowsPerPage}
            filteredEventsCount={filteredEvents.length}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            formatDate={formatDate}
            getStatusChip={getStatusChip}
            getFeaturedBadge={getFeaturedBadge}
            handleMenuClick={handleMenuClick}
          />
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {viewMode === 'table' ? (
          <TableView 
            events={paginatedEvents}
            page={page}
            rowsPerPage={rowsPerPage}
            filteredEventsCount={filteredEvents.length}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            formatDate={formatDate}
            getStatusChip={getStatusChip}
            getFeaturedBadge={getFeaturedBadge}
            handleMenuClick={handleMenuClick}
          />
        ) : (
          <GridView 
            events={paginatedEvents}
            page={page}
            rowsPerPage={rowsPerPage}
            filteredEventsCount={filteredEvents.length}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            formatDate={formatDate}
            getStatusChip={getStatusChip}
            getFeaturedBadge={getFeaturedBadge}
            handleMenuClick={handleMenuClick}
          />
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {viewMode === 'table' ? (
          <TableView 
            events={paginatedEvents}
            page={page}
            rowsPerPage={rowsPerPage}
            filteredEventsCount={filteredEvents.length}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            formatDate={formatDate}
            getStatusChip={getStatusChip}
            getFeaturedBadge={getFeaturedBadge}
            handleMenuClick={handleMenuClick}
          />
        ) : (
          <GridView 
            events={paginatedEvents}
            page={page}
            rowsPerPage={rowsPerPage}
            filteredEventsCount={filteredEvents.length}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            formatDate={formatDate}
            getStatusChip={getStatusChip}
            getFeaturedBadge={getFeaturedBadge}
            handleMenuClick={handleMenuClick}
          />
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        {viewMode === 'table' ? (
          <TableView 
            events={paginatedEvents}
            page={page}
            rowsPerPage={rowsPerPage}
            filteredEventsCount={filteredEvents.length}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            formatDate={formatDate}
            getStatusChip={getStatusChip}
            getFeaturedBadge={getFeaturedBadge}
            handleMenuClick={handleMenuClick}
          />
        ) : (
          <GridView 
            events={paginatedEvents}
            page={page}
            rowsPerPage={rowsPerPage}
            filteredEventsCount={filteredEvents.length}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            formatDate={formatDate}
            getStatusChip={getStatusChip}
            getFeaturedBadge={getFeaturedBadge}
            handleMenuClick={handleMenuClick}
          />
        )}
      </TabPanel>
      
      {/* Menú de Acciones */}
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
        <MenuItem 
          onClick={handleToggleFeatured}
          disabled={!events.find(e => e.id === selectedEventId)?.status === 'published'}
        >
          {events.find(e => e.id === selectedEventId)?.featured ? (
            <>
              <StarBorderIcon fontSize="small" sx={{ mr: 1 }} />
              Quitar de Destacados
            </>
          ) : (
            <>
              <StarIcon fontSize="small" sx={{ mr: 1 }} />
              Marcar como Destacado
            </>
          )}
        </MenuItem>
        
        {/* Mostrar opciones específicas para eventos pendientes */}
        {events.find(e => e.id === selectedEventId)?.status === 'pending' && (
          <>
            <Divider />
            <MenuItem onClick={handleApproveEvent}>
              <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} color="success" />
              Aprobar Evento
            </MenuItem>
            <MenuItem onClick={handleRejectEvent}>
              <CancelIcon fontSize="small" sx={{ mr: 1 }} color="error" />
              Rechazar Evento
            </MenuItem>
          </>
        )}
        
        <Divider />
        <MenuItem onClick={handleContactOrganizer}>
          <MailIcon fontSize="small" sx={{ mr: 1 }} />
          Contactar Organizador
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Eliminar Evento
        </MenuItem>
      </Menu>
      
      {/* Diálogo de Detalles del Evento */}
      <Dialog
        open={openEventDetailsDialog}
        onClose={handleEventDetailsDialogClose}
        aria-labelledby="event-details-dialog-title"
        maxWidth="md"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle id="event-details-dialog-title" sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                  {selectedEvent.title}
                  {getFeaturedBadge(selectedEvent.featured)}
                </Typography>
                {getStatusChip(selectedEvent.status)}
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <img 
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                    />
                  </Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Descripción
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedEvent.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Detalles del Evento
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">
                        Categoría: <b>{selectedEvent.category.name}</b>
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">
                        Organizador: <b>{selectedEvent.organizer.name}</b> ({selectedEvent.organizer.company})
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">
                        Ubicación: <b>{selectedEvent.location}</b>
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ ml: 4 }}>
                        Dirección: {selectedEvent.address}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <DateRangeIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">
                        Fecha: <b>{formatDateRange(selectedEvent.date, selectedEvent.endDate)}</b>
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">
                        Precios: <b>VIP: ¬{selectedEvent.price.vip}</b> | Estándar: ¬{selectedEvent.price.standard}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <GroupsIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">
                        Capacidad: <b>{selectedEvent.capacity}</b> personas
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ ml: 4 }}>
                        Entradas vendidas: <b>{selectedEvent.soldTickets}</b> ({Math.round((selectedEvent.soldTickets / selectedEvent.capacity) * 100)}%)
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Información Adicional
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">
                        Creado: <b>{formatDate(selectedEvent.createdAt)}</b>
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">
                        Última actualización: <b>{formatDate(selectedEvent.updatedAt)}</b>
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedEvent.featured}
                          disabled
                          color="warning"
                        />
                      }
                      label="Evento destacado"
                    />
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedEvent.status === 'pending' && (
                <>
                  <Button 
                    color="success" 
                    variant="contained"
                    onClick={() => {
                      handleApproveEvent();
                      handleEventDetailsDialogClose();
                    }}
                  >
                    Aprobar
                  </Button>
                  <Button 
                    color="error" 
                    variant="contained"
                    onClick={() => {
                      handleRejectEvent();
                      handleEventDetailsDialogClose();
                    }}
                  >
                    Rechazar
                  </Button>
                </>
              )}
              <Button onClick={handleEventDetailsDialogClose}>Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Diálogo Confirmar Eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-event-dialog-title"
      >
        <DialogTitle id="delete-event-dialog-title">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el evento "{selectedEvent?.title}"? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Vista de Tabla
const TableView = ({ events, page, rowsPerPage, filteredEventsCount, handleChangePage, handleChangeRowsPerPage, formatDate, getStatusChip, getFeaturedBadge, handleMenuClick }) => {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Evento</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Organizador</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="center">Ocupación</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 1, overflow: 'hidden', mr: 2 }}>
                      <img 
                        src={event.image}
                        alt={event.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {event.title}
                        </Typography>
                        {getFeaturedBadge(event.featured)}
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {event.description.substring(0, 50)}...
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{event.category.name}</TableCell>
                <TableCell>
                  <Typography variant="body2">{event.organizer.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{event.organizer.company}</Typography>
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{formatDate(event.date)}</TableCell>
                <TableCell align="right">
                  <Typography variant="body2">VIP: ¬{event.price.vip}</Typography>
                  <Typography variant="body2">Std: ¬{event.price.standard}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="body2">
                      {event.soldTickets}/{event.capacity}
                    </Typography>
                    <Box sx={{ width: '100%', mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(event.soldTickets / event.capacity) * 100}
                        sx={{ height: 4, borderRadius: 1 }}
                      />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">{getStatusChip(event.status)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="more"
                    id={`event-menu-${event.id}`}
                    aria-controls={`event-menu-${event.id}`}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuClick(e, event.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {events.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
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
        count={filteredEventsCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  );
};

// Vista de Grid
const GridView = ({ events, page, rowsPerPage, filteredEventsCount, handleChangePage, handleChangeRowsPerPage, formatDate, getStatusChip, getFeaturedBadge, handleMenuClick }) => {
  return (
    <>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={event.image}
                  alt={event.title}
                />
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10, 
                    display: 'flex', 
                    gap: 0.5 
                  }}
                >
                  {getFeaturedBadge(event.featured)}
                  {getStatusChip(event.status)}
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {event.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(event.date)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.organizer.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {event.description.substring(0, 100)}...
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    ¬{event.price.standard} - ¬{event.price.vip}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <GroupsIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.soldTickets}/{event.capacity}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ width: '100%', mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(event.soldTickets / event.capacity) * 100}
                    sx={{ height: 4, borderRadius: 1 }}
                  />
                </Box>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button 
                  size="small" 
                  component={Link} 
                  to={`/event-detail/${event.id}`}
                >
                  Ver Página
                </Button>
                <IconButton
                  aria-label="more"
                  id={`event-grid-menu-${event.id}`}
                  aria-controls={`event-grid-menu-${event.id}`}
                  aria-haspopup="true"
                  onClick={(e) => handleMenuClick(e, event.id)}
                >
                  <MoreVertIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {events.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                No se encontraron eventos
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
      <Box sx={{ mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={filteredEventsCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Eventos por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Box>
    </>
  );
};

// Íconos adicionales
const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
    <path d="M360-320h400v-80H360v80Zm0-120h400v-80H360v80Zm0-120h400v-80H360v80ZM200-320q17 0 28.5-11.5T240-360q0-17-11.5-28.5T200-400q-17 0-28.5 11.5T160-360q0 17 11.5 28.5T200-320Zm0-120q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm0-120q17 0 28.5-11.5T240-600q0-17-11.5-28.5T200-640q-17 0-28.5 11.5T160-600q0 17 11.5 28.5T200-560ZM120-120q-33 0-56.5-23.5T40-200v-560q0-33 23.5-56.5T120-840h720q33 0 56.5 23.5T920-760v560q0 33-23.5 56.5T840-120H120Z"/>
  </svg>
);

const GridViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
    <path d="M120-520v-240h240v240H120Zm0 400v-240h240v240H120Zm320-400v-240h240v240H440Zm0 400v-240h240v240H440Zm320-400v-240h80v240h-80Zm0 400v-240h80v240h-80Z"/>
  </svg>
);

const CategoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
    <path d="M320-120 80-360l81-81 159 160 159-160 81 81-240 240Zm0-360L80-720l81-81 159 160 159-160 81 81-240 240Zm400 280-81-81 160-160-160-160 81-81 240 240-240 242Z"/>
  </svg>
);

export default EventManagement;