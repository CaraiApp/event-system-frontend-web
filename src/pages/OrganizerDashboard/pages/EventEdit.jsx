import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Button, 
  CircularProgress, Alert, Divider, FormControlLabel,
  Switch, Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI } from '../../../services/api';
import { COMMON_STRINGS } from '../../../utils/strings';
import axios from 'axios';

const EventEdit = () => {
  const { id } = useParams();
  
  // Para debugging
  console.log("EventEdit - ID del evento:", id);
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hasBookings, setHasBookings] = useState(false);
  
  // Dialog states
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    venue: '',
    address: '',
    economyprice: 0,
    vipprice: 0,
    economySize: 0,
    vipSize: 0,
    currency: '€',
    status: 'active'
  });
  
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        
        // Get event details - usando la misma URL que funciona en EventPage
        const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/events/getsingleEvent?id=${id}`;
        console.log("Obteniendo evento desde URL:", url);
        const eventResponse = await axios.get(url);
        
        if (eventResponse.data && eventResponse.data.data) {
          const eventData = eventResponse.data.data;
          setEvent(eventData);
          
          // Set form data from event
          setFormData({
            name: eventData.name || '',
            desc: eventData.desc || '',
            venue: eventData.venue || '',
            address: eventData.address || '',
            economyprice: eventData.economyprice || 0,
            vipprice: eventData.vipprice || 0,
            economySize: eventData.economySize || 0,
            vipSize: eventData.vipSize || 0,
            currency: eventData.currency || '€',
            status: eventData.status || 'active'
          });
          
          // Check if event has bookings
          try {
            const bookingsResponse = await axios.get(
              `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/booking/geteventbooking?event_id=${id}`
            );
            
            if (bookingsResponse.data && bookingsResponse.data.data) {
              setHasBookings(bookingsResponse.data.data.length > 0);
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
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked ? 'active' : 'draft'
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Format data for API
      const updateData = {
        ...formData,
        // Ensure numbers are sent as numbers
        economyprice: Number(formData.economyprice),
        vipprice: Number(formData.vipprice),
        economySize: Number(formData.economySize),
        vipSize: Number(formData.vipSize),
      };
      
      // Update the event - usando URL directa para depuración
      console.log("Actualizando evento con datos:", updateData);
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/events/${id}`;
      const response = await axios.put(url, updateData);
      
      if (response.data && response.data.success) {
        setSuccess('Evento actualizado con éxito');
        // Update local event data
        setEvent(prev => ({
          ...prev,
          ...updateData
        }));
      } else {
        setError('Error al actualizar el evento: ' + (response.data?.message || 'Error desconocido'));
      }
    } catch (err) {
      console.error('Error updating event:', err);
      setError(COMMON_STRINGS.errorActualizarEvento + ': ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancelEvent = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Set event status to cancelled
      console.log("Cancelando evento:", id);
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/events/${id}`;
      const response = await axios.put(url, { status: 'cancelled' });
      
      if (response.data && response.data.success) {
        setSuccess('Evento cancelado con éxito');
        // Update local state
        setFormData(prev => ({
          ...prev,
          status: 'cancelled'
        }));
        
        setEvent(prev => ({
          ...prev,
          status: 'cancelled'
        }));
        
        // Close dialog
        setOpenCancelDialog(false);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/organizer/events');
        }, 2000);
      } else {
        setError('Error al cancelar el evento: ' + (response.data?.message || 'Error desconocido'));
        setOpenCancelDialog(false);
      }
    } catch (err) {
      console.error('Error cancelling event:', err);
      setError(COMMON_STRINGS.errorActualizarEvento + ': ' + (err.response?.data?.message || err.message));
      setOpenCancelDialog(false);
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteEvent = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Delete the event
      const response = await eventAPI.deleteEvent(id);
      
      if (response.data && response.data.success) {
        setSuccess('Evento eliminado con éxito');
        
        // Close dialog
        setOpenDeleteDialog(false);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/organizer/events');
        }, 2000);
      } else {
        setError('Error al eliminar el evento: ' + (response.data?.message || 'Error desconocido'));
        setOpenDeleteDialog(false);
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(COMMON_STRINGS.errorEliminarEvento + ': ' + (err.response?.data?.message || err.message));
      setOpenDeleteDialog(false);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
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
          Editar Evento
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => navigate('/organizer/events')}
        >
          Volver a Eventos
        </Button>
      </Box>
      
      {/* Error and Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
      )}
      
      {/* Current Status */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="subtitle1">
            Estado del evento: 
            <Box component="span" sx={{ 
              ml: 1,
              fontWeight: 'bold', 
              color: event.status === 'active' ? 'success.main' : 
                     event.status === 'draft' ? 'warning.main' : 
                     event.status === 'cancelled' ? 'error.main' : 'text.secondary'
            }}>
              {event.status === 'active' ? 'Activo' : 
               event.status === 'draft' ? 'Borrador' : 
               event.status === 'cancelled' ? 'Cancelado' : 'Finalizado'}
            </Box>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {hasBookings ? 
              'Este evento ya tiene reservas. Algunas opciones de edición están limitadas.' : 
              'Este evento no tiene reservas.'}
          </Typography>
        </Box>
        <Box>
          {event.status !== 'cancelled' && (
            <Button 
              variant="outlined" 
              color="error" 
              onClick={() => setOpenCancelDialog(true)}
              sx={{ mr: 1 }}
            >
              Cancelar Evento
            </Button>
          )}
          {!hasBookings && event.status !== 'cancelled' && (
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => setOpenDeleteDialog(true)}
            >
              Eliminar Evento
            </Button>
          )}
        </Box>
      </Paper>
      
      {/* Edit Form */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Información Básica</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre del Evento"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={event.status === 'cancelled'}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={formData.status === 'active'} 
                    onChange={handleSwitchChange}
                    name="status"
                    color="primary"
                    disabled={event.status === 'cancelled'}
                  />
                }
                label="Evento activo"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="desc"
                value={formData.desc}
                onChange={handleInputChange}
                multiline
                rows={4}
                disabled={event.status === 'cancelled'}
              />
            </Grid>
            
            {/* Location */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Ubicación</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lugar"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                disabled={event.status === 'cancelled'}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={event.status === 'cancelled'}
              />
            </Grid>
            
            {/* Pricing */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Precios y Capacidad</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Precio VIP"
                name="vipprice"
                type="number"
                value={formData.vipprice}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <span style={{ marginRight: '8px' }}>{formData.currency}</span>,
                }}
                disabled={event.status === 'cancelled' || hasBookings}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Asientos VIP"
                name="vipSize"
                type="number"
                value={formData.vipSize}
                onChange={handleInputChange}
                disabled={event.status === 'cancelled' || hasBookings}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Precio Económico"
                name="economyprice"
                type="number"
                value={formData.economyprice}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <span style={{ marginRight: '8px' }}>{formData.currency}</span>,
                }}
                disabled={event.status === 'cancelled' || hasBookings}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Asientos Económicos"
                name="economySize"
                type="number"
                value={formData.economySize}
                onChange={handleInputChange}
                disabled={event.status === 'cancelled' || hasBookings}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/organizer/events')}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={saving || event.status === 'cancelled'}
                >
                  {saving ? <CircularProgress size={24} /> : 'Guardar Cambios'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Cancel Event Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle>Cancelar Evento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cancelar este evento? 
            {hasBookings ? 
              ' Este evento ya tiene reservas y los asistentes serán notificados de la cancelación.' : 
              ' Esta acción no se puede deshacer.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>No, Mantener Activo</Button>
          <Button onClick={handleCancelEvent} color="error" variant="contained" autoFocus>
            Sí, Cancelar Evento
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Event Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Eliminar Evento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar permanentemente este evento? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>No, Mantener Evento</Button>
          <Button onClick={handleDeleteEvent} color="error" variant="contained" autoFocus>
            Sí, Eliminar Evento
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventEdit;