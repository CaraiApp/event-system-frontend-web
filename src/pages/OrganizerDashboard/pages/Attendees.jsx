import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Button, Chip, CircularProgress,
  TextField, MenuItem, IconButton, Menu, InputAdornment, Grid, Card, CardContent,
  Alert
} from '@mui/material';
import { 
  FilterList as FilterListIcon, 
  GetApp as GetAppIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CloudDownload as DownloadIcon,
  PeopleOutline as PeopleOutlineIcon,
  Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';
import { COMMON_STRINGS } from '../../../utils/strings';

const Attendees = () => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterEvent, setFilterEvent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAttendeeId, setSelectedAttendeeId] = useState(null);
  const [summary, setSummary] = useState({
    totalAttendees: 0,
    confirmedAttendees: 0,
    pendingAttendees: 0
  });
  
  useEffect(() => {
    const fetchAttendeesData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError(COMMON_STRINGS.noToken);
        setLoading(false);
        return;
      }
      
      try {
        console.group('🎫 DEBUG - Attendees.jsx - Obtención de asistentes');
        console.log('🎫 Intentando obtener datos de asistentes...');
        
        // Usar variable de entorno para URL base
        const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        console.log('🎫 URL base API:', API_BASE_URL);
        
        // Primero obtener los eventos del organizador
        console.log('🎫 Obteniendo eventos del organizador...');
        try {
          const eventsResponse = await axios.get(`${API_BASE_URL}/api/v1/events/getuserEvent`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log('🎫 Eventos obtenidos correctamente:', eventsResponse.data);
          
          let userEvents = [];
          if (eventsResponse.data && eventsResponse.data.data) {
            userEvents = eventsResponse.data.data.map(event => ({
              id: event._id,
              name: event.name || event.title
            }));
            setEvents(userEvents);
          }
          
          // Ahora obtener los asistentes de cada evento
          console.log('🎫 Obteniendo asistentes para cada evento...');
          
          try {
            // Intenta obtener asistentes desde el endpoint específico
            const attendeesResponse = await axios.get(`${API_BASE_URL}/api/v1/attendees`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (attendeesResponse.data && attendeesResponse.data.data) {
              console.log('🎫 Asistentes obtenidos correctamente:', attendeesResponse.data);
              
              const attendeesData = attendeesResponse.data.data;
              setAttendees(attendeesData);
              
              // Calcular resumen
              const totalAttendees = attendeesData.length;
              const confirmedAttendees = attendeesData.filter(a => a.status === 'confirmed' || a.checkedIn).length;
              const pendingAttendees = attendeesData.filter(a => a.status === 'pending' || (!a.checkedIn && a.status !== 'cancelled')).length;
              
              setSummary({
                totalAttendees,
                confirmedAttendees,
                pendingAttendees
              });
            } else {
              console.log('🎫 No se encontraron asistentes registrados');
              // Si no hay asistentes, establecer arrays vacíos
              setAttendees([]);
              setSummary({
                totalAttendees: 0,
                confirmedAttendees: 0,
                pendingAttendees: 0
              });
            }
          } catch (attendeesError) {
            console.error('🎫 Error al obtener asistentes:', attendeesError);
            
            // Intenta método alternativo: buscar tickets en eventos
            console.log('🎫 Intentando obtener asistentes desde eventos...');
            let allAttendees = [];
            
            for (const event of userEvents) {
              try {
                const eventDetailsResponse = await axios.get(`${API_BASE_URL}/api/v1/events/${event.id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                
                if (eventDetailsResponse.data && eventDetailsResponse.data.data && 
                    eventDetailsResponse.data.data.tickets && eventDetailsResponse.data.data.tickets.length > 0) {
                  
                  const eventTickets = eventDetailsResponse.data.data.tickets.map(ticket => ({
                    id: ticket._id,
                    name: ticket.buyerName || 'Asistente',
                    email: ticket.buyerEmail || 'No disponible',
                    phone: ticket.buyerPhone || 'No disponible',
                    ticketId: ticket.code || `TKT-${ticket._id.substring(0, 6)}`,
                    event: event.name,
                    eventId: event.id,
                    purchaseDate: ticket.createdAt || new Date().toISOString(),
                    checkedIn: ticket.used || false,
                    status: ticket.cancelled ? 'cancelled' : ticket.used ? 'confirmed' : 'pending',
                    seatInfo: ticket.seatNumber || 'No asignado'
                  }));
                  
                  allAttendees = [...allAttendees, ...eventTickets];
                }
              } catch (eventError) {
                console.error(`🎫 Error al obtener tickets para evento ${event.id}:`, eventError);
              }
            }
            
            if (allAttendees.length > 0) {
              console.log('🎫 Asistentes obtenidos desde eventos:', allAttendees);
              setAttendees(allAttendees);
              
              // Calcular resumen
              const totalAttendees = allAttendees.length;
              const confirmedAttendees = allAttendees.filter(a => a.status === 'confirmed' || a.checkedIn).length;
              const pendingAttendees = allAttendees.filter(a => a.status === 'pending' || (!a.checkedIn && a.status !== 'cancelled')).length;
              
              setSummary({
                totalAttendees,
                confirmedAttendees,
                pendingAttendees
              });
            } else {
              console.log('🎫 No se encontraron asistentes en ninguna fuente');
              setAttendees([]);
              setSummary({
                totalAttendees: 0,
                confirmedAttendees: 0,
                pendingAttendees: 0
              });
            }
          }
        } catch (eventsError) {
          console.error('🎫 Error al obtener eventos:', eventsError);
          // Establecer arrays vacíos para evitar errores
          setEvents([]);
          setAttendees([]);
          setSummary({
            totalAttendees: 0,
            confirmedAttendees: 0,
            pendingAttendees: 0
          });
        }
        
        console.groupEnd();
        setLoading(false);
      } catch (error) {
        console.error('Error general al obtener datos:', error);
        setError(COMMON_STRINGS.errorCargarEventos);
        setLoading(false);
      }
    };
    
    fetchAttendeesData();
  }, []);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleEventFilterChange = (event) => {
    setFilterEvent(event.target.value);
    setPage(0);
  };
  
  const handleStatusFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleExportData = () => {
    alert('Funci�n de exportaci�n de datos a implementar');
  };
  
  const handleMenuClick = (event, attendeeId) => {
    setAnchorEl(event.currentTarget);
    setSelectedAttendeeId(attendeeId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAttendeeId(null);
  };
  
  const handleViewAttendee = () => {
    alert(`Ver detalles del asistente ${selectedAttendeeId}`);
    handleMenuClose();
  };
  
  const handleSendEmail = () => {
    alert(`Enviar email al asistente ${selectedAttendeeId}`);
    handleMenuClose();
  };
  
  const handleToggleCheckIn = () => {
    // Implementaci�n para marcar como asistido
    const attendee = attendees.find(a => a.id === selectedAttendeeId);
    
    if (attendee) {
      const updatedAttendees = attendees.map(a => 
        a.id === selectedAttendeeId 
          ? { ...a, checkedIn: !a.checkedIn } 
          : a
      );
      
      setAttendees(updatedAttendees);
      alert(`${attendee.checkedIn ? 'Desmarcado' : 'Marcado'} como asistido: ${attendee.name}`);
    }
    
    handleMenuClose();
  };
  
  // Filtrar asistentes
  const filteredAttendees = attendees.filter(attendee => {
    // Filtrar por evento
    if (filterEvent && attendee.eventId && attendee.eventId.toString() !== filterEvent) return false;
    
    // Filtrar por estado
    if (filterStatus && attendee.status !== filterStatus) return false;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const name = (attendee.name || attendee.buyerName || '').toLowerCase();
      const email = (attendee.email || attendee.buyerEmail || '').toLowerCase();
      const ticketId = (attendee.ticketId || attendee.code || '').toLowerCase();
      const phone = (attendee.phone || attendee.buyerPhone || '').toLowerCase();
      
      return (
        name.includes(term) ||
        email.includes(term) ||
        ticketId.includes(term) ||
        phone.includes(term)
      );
    }
    
    return true;
  });
  
  // Calcular paginaci�n
  const paginatedAttendees = filteredAttendees.slice(
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
      case 'confirmed':
        return <Chip label="Confirmado" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pendiente" color="warning" size="small" />;
      case 'cancelled':
        return <Chip label="Cancelado" color="error" size="small" />;
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
      <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
    );
  }
  
  return (
    <>
      <Box className="dashboard-title">
        <Typography variant="h4" component="h1" className="dashboard-title-text">
          Asistentes
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<DownloadIcon />}
          onClick={handleExportData}
        >
          Exportar Datos
        </Button>
      </Box>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleOutlineIcon color="primary" sx={{ fontSize: 56, mr: 2, opacity: 0.7 }} />
                <Box>
                  <Typography variant="h6" gutterBottom color="textSecondary">
                    Total Asistentes
                  </Typography>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                    {summary.totalAttendees}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 56, mr: 2, opacity: 0.7 }} />
                <Box>
                  <Typography variant="h6" gutterBottom color="textSecondary">
                    Confirmados
                  </Typography>
                  <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {summary.confirmedAttendees}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0Ij48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZmlsbD0iI2ZmYTAwMCIgZD0iTTExIDdoMnYyaC0yem0wIDRoMnY2aC0yem0xLTlDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjwvc3ZnPg==" 
                  alt="Pending Icon"
                  style={{ width: 56, height: 56, marginRight: 16, opacity: 0.7 }}
                />
                <Box>
                  <Typography variant="h6" gutterBottom color="textSecondary">
                    Pendientes
                  </Typography>
                  <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    {summary.pendingAttendees}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Evento"
              value={filterEvent}
              onChange={handleEventFilterChange}
              variant="outlined"
              size="small"
            >
              <MenuItem value="">Todos los eventos</MenuItem>
              {events.map((event) => (
                <MenuItem key={event.id} value={event.id.toString()}>
                  {event.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Estado"
              value={filterStatus}
              onChange={handleStatusFilterChange}
              variant="outlined"
              size="small"
            >
              <MenuItem value="">Todos los estados</MenuItem>
              <MenuItem value="confirmed">Confirmados</MenuItem>
              <MenuItem value="pending">Pendientes</MenuItem>
              <MenuItem value="cancelled">Cancelados</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar"
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Nombre, email, teléfono o ID de entrada"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            startIcon={<FilterListIcon />}
            color="primary"
            onClick={() => {
              setFilterEvent('');
              setFilterStatus('');
              setSearchTerm('');
            }}
          >
            Limpiar Filtros
          </Button>
        </Box>
      </Paper>
      
      {/* Attendees Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <TableHead>
              <TableRow>
                <TableCell>ID Entrada</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Evento</TableCell>
                <TableCell>Lugar</TableCell>
                <TableCell>Fecha Compra</TableCell>
                <TableCell align="center">Asistencia</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAttendees.map((attendee) => (
                <TableRow
                  hover
                  key={attendee.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{attendee.ticketId || attendee.code || `TICKET-${attendee.id ? attendee.id.substring(0, 6) : 'N/A'}`}</TableCell>
                  <TableCell>{attendee.name || attendee.buyerName || 'Asistente'}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{attendee.email || attendee.buyerEmail || 'No disponible'}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {attendee.phone || attendee.buyerPhone || 'No disponible'}
                    </Typography>
                  </TableCell>
                  <TableCell>{attendee.event || attendee.eventName || 'Evento'}</TableCell>
                  <TableCell>{attendee.seatInfo || attendee.seat || attendee.seatNumber || 'No asignado'}</TableCell>
                  <TableCell>{formatDate(attendee.purchaseDate || attendee.createdAt)}</TableCell>
                  <TableCell align="center">
                    {attendee.checkedIn ? (
                                  <Chip 
                        icon={<CheckCircleIcon />} 
                        label="Asistió" 
                        color="success" 
                        size="small" 
                      />
                    ) : (
                      <Chip 
                        icon={<CancelIcon />} 
                        label="No asistió" 
                        variant="outlined" 
                        size="small" 
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {getStatusChip(attendee.status)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="more"
                      id={`attendee-menu-${attendee.id}`}
                      aria-controls={`attendee-menu-${attendee.id}`}
                      aria-haspopup="true"
                      onClick={(e) => handleMenuClick(e, attendee.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              
              {paginatedAttendees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                    <Box sx={{ textAlign: 'center', my: 3 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {COMMON_STRINGS.noAsistentesCreados}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {COMMON_STRINGS.mensajeCrearEvento}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        href="/pricing"
                        sx={{ mt: 2 }}
                      >
                        {COMMON_STRINGS.crearEvento}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
          <Button startIcon={<GetAppIcon />} onClick={handleExportData}>
            Exportar Lista
          </Button>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredAttendees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={COMMON_STRINGS.filasPorPagina}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Box>
      </Paper>
      
      {/* Attendee Actions Menu */}
      <Menu
        id="attendee-actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewAttendee}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Ver Detalles
        </MenuItem>
        <MenuItem onClick={handleSendEmail}>
          <EmailIcon fontSize="small" sx={{ mr: 1 }} />
          Enviar Email
        </MenuItem>
        <MenuItem onClick={handleToggleCheckIn}>
          {attendees.find(a => a.id === selectedAttendeeId)?.checkedIn ? (
            <>
              <CancelIcon fontSize="small" sx={{ mr: 1 }} />
              Desmarcar Asistencia
            </>
          ) : (
            <>
              <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
              Marcar Asistencia
            </>
          )}
        </MenuItem>
      </Menu>
    </>
  );
};

export default Attendees;