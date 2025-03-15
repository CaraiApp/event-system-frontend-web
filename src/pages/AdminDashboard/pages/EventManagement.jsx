import React, { useState, useEffect } from 'react';
import { Box, Button, Chip, IconButton, Menu, MenuItem, Tooltip, Switch, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import adminApi from '../services/api';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalEvents, setTotalEvents] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusDialogAction, setStatusDialogAction] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Definir columnas para la tabla de eventos
  const columns = [
    { 
      field: 'title', 
      headerName: 'Título', 
      sortable: true,
      width: '25%',
      render: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {row.image && (
            <Box
              component="img"
              src={row.image}
              alt={value}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '4px',
                mr: 2,
                objectFit: 'cover'
              }}
            />
          )}
          <Box>
            {value}
            {row.featured && (
              <Chip 
                size="small" 
                label="Destacado" 
                color="warning" 
                sx={{ ml: 1, height: 20 }} 
                icon={<StarIcon sx={{ fontSize: '0.9rem !important' }} />}
              />
            )}
          </Box>
        </Box>
      )
    },
    { 
      field: 'organizerName', 
      headerName: 'Organizador', 
      sortable: true,
      width: '15%'
    },
    { 
      field: 'date', 
      headerName: 'Fecha', 
      sortable: true,
      type: 'date',
      width: '15%'
    },
    { 
      field: 'price', 
      headerName: 'Precio', 
      sortable: true,
      type: 'price',
      width: '10%'
    },
    { 
      field: 'location', 
      headerName: 'Ubicación', 
      sortable: true,
      width: '15%'
    },
    { 
      field: 'status', 
      headerName: 'Estado', 
      sortable: true,
      type: 'status',
      width: '10%'
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      align: 'center',
      width: '10%',
      render: (_, row) => (
        <Box>
          <Tooltip title="Opciones">
            <IconButton 
              size="small"
              onClick={(e) => handleOpenMenu(e, row)}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  // Cargar eventos cuando cambia la página o filas por página
  useEffect(() => {
    fetchEvents();
  }, [page, rowsPerPage]);

  // Función para cargar eventos
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1, // La API usa 1-indexed para páginas
        limit: rowsPerPage
      };

      const response = await adminApi.getEvents(params);

      if (response.data && response.data.data) {
        setEvents(response.data.data.events || []);
        setTotalEvents(response.data.data.totalCount || 0);
      }
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      setAlert({
        open: true,
        message: 'Error al cargar eventos. Por favor, inténtalo de nuevo.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleOpenMenu = (event, row) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedEvent(row);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleOpenStatusDialog = (action) => {
    setStatusDialogAction(action);
    setOpenStatusDialog(true);
    handleCloseMenu();
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    handleCloseMenu();
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleViewEvent = () => {
    // En una implementación real, aquí se redirigiría a la página del evento
    window.open(`/events/${selectedEvent.id}`, '_blank');
    handleCloseMenu();
  };

  const handleEditEvent = () => {
    // En una implementación real, aquí se redirigiría a la página de edición del evento
    window.open(`/admin/events/${selectedEvent.id}/edit`, '_blank');
    handleCloseMenu();
  };

  const handleToggleFeatured = async () => {
    try {
      await adminApi.toggleEventFeatured(selectedEvent.id, !selectedEvent.featured);
      setAlert({
        open: true,
        message: `Evento ${selectedEvent.featured ? 'removido de' : 'marcado como'} destacado correctamente`,
        severity: 'success'
      });
      fetchEvents();
    } catch (error) {
      console.error('Error al cambiar estado destacado:', error);
      setAlert({
        open: true,
        message: 'Error al cambiar estado destacado. Por favor, inténtalo de nuevo.',
        severity: 'error'
      });
    }
    handleCloseMenu();
  };

  const handleUpdateStatus = async () => {
    try {
      const newStatus = statusDialogAction === 'approve' ? 'active' : 'inactive';
      await adminApi.updateEventStatus(selectedEvent.id, newStatus);
      setAlert({
        open: true,
        message: `Estado del evento actualizado a ${newStatus === 'active' ? 'Activo' : 'Inactivo'}`,
        severity: 'success'
      });
      fetchEvents();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setAlert({
        open: true,
        message: 'Error al actualizar estado. Por favor, inténtalo de nuevo.',
        severity: 'error'
      });
    }
    handleCloseStatusDialog();
  };

  const handleDeleteEvent = async () => {
    try {
      await adminApi.deleteEvent(selectedEvent.id);
      setAlert({
        open: true,
        message: 'Evento eliminado correctamente',
        severity: 'success'
      });
      fetchEvents();
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      setAlert({
        open: true,
        message: 'Error al eliminar evento. Por favor, inténtalo de nuevo.',
        severity: 'error'
      });
    }
    handleCloseDeleteDialog();
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <PageHeader 
        title="Gestión de Eventos"
        subtitle="Administra todos los eventos de la plataforma"
        button={{
          label: "Crear Evento",
          icon: <AddIcon />,
          onClick: () => window.open('/create-event', '_blank')
        }}
      />
      
      <DataTable 
        columns={columns}
        data={events}
        loading={loading}
        title="Eventos"
        onRefresh={fetchEvents}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalEvents}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        emptyMessage={events && events.dataNotAvailable 
          ? (events.error || "No hay eventos disponibles. Se mostrarán cuando se creen eventos en la plataforma.")
          : "No hay eventos para mostrar"}
      />
      
      {/* Menú de acciones para cada evento */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleViewEvent}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Ver Evento
        </MenuItem>
        <MenuItem onClick={handleEditEvent}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleToggleFeatured}>
          {selectedEvent?.featured ? (
            <>
              <StarBorderIcon fontSize="small" sx={{ mr: 1 }} />
              Quitar Destacado
            </>
          ) : (
            <>
              <StarIcon fontSize="small" sx={{ mr: 1 }} />
              Destacar
            </>
          )}
        </MenuItem>
        <MenuItem 
          onClick={() => handleOpenStatusDialog(selectedEvent?.status === 'active' ? 'reject' : 'approve')}
          disabled={selectedEvent?.status === 'cancelled'}
        >
          <EventNoteIcon fontSize="small" sx={{ mr: 1 }} />
          {selectedEvent?.status === 'active' ? 'Desactivar' : 'Activar'}
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>
      
      {/* Diálogo para cambiar estado */}
      <Dialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
      >
        <DialogTitle>
          {statusDialogAction === 'approve' ? 'Activar Evento' : 'Desactivar Evento'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {statusDialogAction === 'approve' 
              ? `¿Estás seguro de que quieres activar el evento "${selectedEvent?.title}"?`
              : `¿Estás seguro de que quieres desactivar el evento "${selectedEvent?.title}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancelar</Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained" 
            color={statusDialogAction === 'approve' ? 'success' : 'warning'}
          >
            {statusDialogAction === 'approve' ? 'Activar' : 'Desactivar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para eliminar evento */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Eliminar Evento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar el evento "{selectedEvent?.title}"? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteEvent} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alerta para notificaciones */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventManagement;