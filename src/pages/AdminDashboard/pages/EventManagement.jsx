import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import adminApi from '../services/api';

const EventManagement = () => {
  const theme = useTheme();
  // Estado para eventos
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEvents, setTotalEvents] = useState(0);
  
  // Estado para la paginación y filtros
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    organizer: '',
    search: ''
  });
  
  // Estado para diálogos
  const [viewDialog, setViewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estado para acciones
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);
  
  // Cargar eventos
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await adminApi.getEvents({
          page: page + 1, // La API espera que la página comience en 1
          limit: rowsPerPage,
          ...filters
        });
        
        setEvents(response.data.data.events || []);
        setTotalEvents(response.data.data.totalEvents || 0);
      } catch (err) {
        console.error('Error al cargar eventos:', err);
        setError('Error al cargar la lista de eventos. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [page, rowsPerPage, filters]);

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejar búsqueda
  const handleSearch = (event) => {
    const { value } = event.target;
    setFilters(prev => ({ ...prev, search: value }));
    setPage(0);
  };

  // Manejar cambio de filtros
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0);
  };

  // Reiniciar filtros
  const handleResetFilters = () => {
    setFilters({
      status: '',
      category: '',
      organizer: '',
      search: ''
    });
    setPage(0);
  };

  // Ver detalles del evento
  const handleViewEvent = (event) => {
    setCurrentEvent(event);
    setViewDialog(true);
  };

  // Eliminar evento
  const handleDeleteEvent = (event) => {
    setCurrentEvent(event);
    setDeleteDialog(true);
  };

  // Confirmar eliminación de evento
  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      setActionError(null);
      
      await adminApi.deleteEvent(currentEvent.id);
      
      setActionSuccess('Evento eliminado correctamente');
      setDeleteDialog(false);
      
      // Recargar la lista de eventos
      const response = await adminApi.getEvents({
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      });
      
      setEvents(response.data.data.events || []);
      setTotalEvents(response.data.data.totalEvents || 0);
      
    } catch (err) {
      console.error('Error al eliminar evento:', err);
      const errorMessage = err.response?.data?.message || 'Error al eliminar el evento';
      setActionError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Cambiar estado de publicación del evento
  const handleToggleEventStatus = async (event) => {
    try {
      setActionLoading(true);
      setActionError(null);
      
      // Determinar el nuevo estado
      const newStatus = event.status === 'published' ? 'pending' : 'published';
      
      await adminApi.updateEventStatus(event.id, newStatus);
      
      setActionSuccess(`Evento ${newStatus === 'published' ? 'publicado' : 'despublicado'} correctamente`);
      
      // Actualizar el evento en la lista local
      setEvents(prev => 
        prev.map(e => 
          e.id === event.id ? { ...e, status: newStatus } : e
        )
      );
      
    } catch (err) {
      console.error('Error al cambiar estado del evento:', err);
      setActionError('Error al cambiar el estado del evento. Por favor, inténtalo de nuevo.');
    } finally {
      setActionLoading(false);
    }
  };

  // Cambiar estado de destacado del evento
  const handleToggleEventFeatured = async (event) => {
    try {
      setActionLoading(true);
      setActionError(null);
      
      // Determinar el nuevo estado
      const newFeatured = !event.featured;
      
      await adminApi.toggleEventFeatured(event.id, newFeatured);
      
      setActionSuccess(`Evento ${newFeatured ? 'destacado' : 'quitado de destacados'} correctamente`);
      
      // Actualizar el evento en la lista local
      setEvents(prev => 
        prev.map(e => 
          e.id === event.id ? { ...e, featured: newFeatured } : e
        )
      );
      
    } catch (err) {
      console.error('Error al cambiar estado destacado del evento:', err);
      setActionError('Error al cambiar el estado destacado del evento. Por favor, inténtalo de nuevo.');
    } finally {
      setActionLoading(false);
    }
  };

  // Limpiar mensajes de éxito o error después de un tiempo
  useEffect(() => {
    if (actionSuccess || actionError) {
      const timer = setTimeout(() => {
        setActionSuccess(null);
        setActionError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [actionSuccess, actionError]);

  // Definir columnas para la tabla
  const columns = [
    { 
      id: 'title', 
      header: 'Título', 
      minWidth: 180,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" fontWeight="medium">
            {row.title}
          </Typography>
          {row.featured && (
            <Tooltip title="Evento destacado">
              <StarIcon 
                fontSize="small" 
                color="warning" 
                sx={{ ml: 1 }} 
              />
            </Tooltip>
          )}
        </Box>
      )
    },
    { 
      id: 'category', 
      header: 'Categoría', 
      minWidth: 120
    },
    { 
      id: 'date', 
      header: 'Fecha', 
      type: 'date',
      minWidth: 120
    },
    { 
      id: 'organizer', 
      header: 'Organizador', 
      accessor: row => row.organizer.name,
      renderCell: (row) => (
        <Tooltip title={row.organizer.company || ''}>
          <Typography variant="body2">
            {row.organizer.name}
          </Typography>
        </Tooltip>
      )
    },
    { 
      id: 'status', 
      header: 'Estado', 
      type: 'status'
    },
    { 
      id: 'capacity', 
      header: 'Ocupación', 
      renderCell: (row) => {
        const attendance = row.soldTickets || 0;
        const capacity = row.totalCapacity || 100;
        const percentage = Math.min(Math.round((attendance / capacity) * 100), 100);
        const color = 
          percentage < 30 ? theme.palette.info.main : 
          percentage < 70 ? theme.palette.success.main : 
          percentage < 90 ? theme.palette.warning.main : 
          theme.palette.error.main;
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box sx={{ width: '70%', mr: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={percentage} 
                sx={{ 
                  height: 8, 
                  borderRadius: 5,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: color
                  }
                }}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">
                {attendance}/{capacity}
              </Typography>
            </Box>
          </Box>
        );
      }
    }
  ];

  return (
    <Box>
      <PageHeader 
        title="Gestión de Eventos" 
        subtitle="Administra los eventos del sistema. Puedes ver, publicar/despublicar, destacar y eliminar eventos."
        action={true}
        actionText="Crear Evento"
        actionIcon={<AddIcon />}
        onActionClick={() => alert('Esta funcionalidad aún no está implementada')}
      />
      
      {/* Alertas de acción */}
      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {actionSuccess}
        </Alert>
      )}
      
      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      )}
      
      {/* Filtros y búsqueda */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar por título, descripción, ubicación..."
                value={filters.search}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={8}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  size="small"
                >
                  Filtros
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleResetFilters}
                  size="small"
                  disabled={!filters.status && !filters.category && !filters.organizer && !filters.search}
                >
                  Reiniciar
                </Button>
              </Box>
            </Grid>
            
            {showFilters && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Estado</InputLabel>
                    <Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      label="Estado"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="published">Publicado</MenuItem>
                      <MenuItem value="pending">Pendiente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      label="Categoría"
                    >
                      <MenuItem value="">Todas</MenuItem>
                      <MenuItem value="Música">Música</MenuItem>
                      <MenuItem value="Deportes">Deportes</MenuItem>
                      <MenuItem value="Conferencia">Conferencia</MenuItem>
                      <MenuItem value="Taller">Taller</MenuItem>
                      <MenuItem value="Teatro">Teatro</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
      
      {/* Tabla de eventos */}
      <DataTable
        columns={columns}
        data={events}
        totalCount={totalEvents}
        page={page}
        rowsPerPage={rowsPerPage}
        loading={loading}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleView={handleViewEvent}
        handleDelete={handleDeleteEvent}
        handleToggleStatus={handleToggleEventStatus}
        handleToggleFeatured={handleToggleEventFeatured}
        title="Eventos del Sistema"
      />
      
      {/* Diálogo de vista detallada del evento */}
      <Dialog
        open={viewDialog}
        onClose={() => setViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalles del Evento
        </DialogTitle>
        <DialogContent dividers>
          {currentEvent && (
            <Grid container spacing={3}>
              {/* Información principal */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Información General
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Título</Typography>
                    <Typography variant="body1">{currentEvent.title}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Categoría</Typography>
                    <Typography variant="body1">{currentEvent.category || 'No especificada'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Estado</Typography>
                    <Chip
                      label={currentEvent.status === 'published' ? 'Publicado' : 'Pendiente'}
                      color={currentEvent.status === 'published' ? 'success' : 'warning'}
                      size="small"
                      icon={currentEvent.status === 'published' ? <CheckCircleIcon /> : <CancelIcon />}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Fecha</Typography>
                    <Typography variant="body1">
                      {currentEvent.date ? new Date(currentEvent.date).toLocaleDateString() : 'No especificada'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Destacado</Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      {currentEvent.featured ? (
                        <>
                          <StarIcon fontSize="small" color="warning" sx={{ mr: 0.5 }} />
                          Sí
                        </>
                      ) : (
                        <>
                          <StarOutlineIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          No
                        </>
                      )}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Descripción</Typography>
                    <Typography variant="body2">
                      {currentEvent.description || 'Sin descripción'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              {/* Ubicación y organizador */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Ubicación y Organizador
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Ubicación</Typography>
                    <Typography variant="body1">{currentEvent.location || 'No especificada'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Dirección</Typography>
                    <Typography variant="body1">{currentEvent.address || 'No especificada'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Organizador</Typography>
                    <Typography variant="body1">{currentEvent.organizer?.name || 'No especificado'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Empresa</Typography>
                    <Typography variant="body1">{currentEvent.organizer?.company || 'No especificada'}</Typography>
                  </Grid>
                </Grid>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Capacidad y Precios
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Capacidad Total</Typography>
                    <Typography variant="body1">{currentEvent.totalCapacity || '0'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Entradas Vendidas</Typography>
                    <Typography variant="body1">{currentEvent.soldTickets || '0'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Precio Estándar</Typography>
                    <Typography variant="body1">
                      {currentEvent.price?.standard 
                        ? `${currentEvent.price.standard} €` 
                        : 'No especificado'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Precio VIP</Typography>
                    <Typography variant="body1">
                      {currentEvent.price?.vip 
                        ? `${currentEvent.price.vip} €` 
                        : 'No especificado'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDialog
        open={deleteDialog}
        title="Eliminar Evento"
        message={`¿Estás seguro de que deseas eliminar el evento "${currentEvent?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialog(false)}
        confirmColor="error"
        loading={actionLoading}
      />
    </Box>
  );
};

export default EventManagement;