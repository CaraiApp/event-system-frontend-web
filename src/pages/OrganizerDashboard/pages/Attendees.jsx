import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Button, Chip, CircularProgress,
  TextField, MenuItem, IconButton, Menu, InputAdornment, Grid, Card, CardContent
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
  PeopleOutline as PeopleOutlineIcon
} from '@mui/icons-material';
import axios from 'axios';

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
        setError('No se encontró token de autenticación');
        setLoading(false);
        return;
      }
      
      try {
        // Este endpoint se implementará en el backend
        // const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        // const response = await axios.get(`${API_BASE_URL}/api/v1/dashboard/attendees`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        
        // Datos de prueba
        setTimeout(() => {
          const mockEvents = [
            { id: 1, name: 'Concierto de Jazz' },
            { id: 2, name: 'Teatro Infantil' },
            { id: 3, name: 'Torneo de Ajedrez' },
            { id: 4, name: 'Festival de Danza' },
            { id: 5, name: 'Concierto de Rock' }
          ];
          
          const mockAttendees = [
            { 
              id: 1, 
              name: 'Juan Pérez', 
              email: 'juan@example.com',
              phone: '+34 612345678',
              ticketId: 'TKT-1001',
              event: 'Concierto de Jazz',
              eventId: 1,
              purchaseDate: '2023-08-15T14:30:00',
              checkedIn: true,
              status: 'confirmed',
              seatInfo: 'Fila A, Asiento 12'
            },
            { 
              id: 2, 
              name: 'María García', 
              email: 'maria@example.com',
              phone: '+34 623456789',
              ticketId: 'TKT-1002',
              event: 'Teatro Infantil',
              eventId: 2,
              purchaseDate: '2023-08-16T10:15:00',
              checkedIn: false,
              status: 'confirmed',
              seatInfo: 'Fila B, Asiento 5'
            },
            { 
              id: 3, 
              name: 'Pedro Rodríguez', 
              email: 'pedro@example.com',
              phone: '+34 634567890',
              ticketId: 'TKT-1003',
              event: 'Concierto de Jazz',
              eventId: 1,
              purchaseDate: '2023-08-16T16:45:00',
              checkedIn: true,
              status: 'confirmed',
              seatInfo: 'Fila A, Asiento 14'
            },
            { 
              id: 4, 
              name: 'Ana Martínez', 
              email: 'ana@example.com',
              phone: '+34 645678901',
              ticketId: 'TKT-1004',
              event: 'Torneo de Ajedrez',
              eventId: 3,
              purchaseDate: '2023-08-17T09:20:00',
              checkedIn: false,
              status: 'pending',
              seatInfo: 'Mesa 3'
            },
            { 
              id: 5, 
              name: 'Carlos Sánchez', 
              email: 'carlos@example.com',
              phone: '+34 656789012',
              ticketId: 'TKT-1005',
              event: 'Teatro Infantil',
              eventId: 2,
              purchaseDate: '2023-08-17T13:10:00',
              checkedIn: true,
              status: 'confirmed',
              seatInfo: 'Fila C, Asiento 8'
            },
            { 
              id: 6, 
              name: 'Laura Gómez', 
              email: 'laura@example.com',
              phone: '+34 667890123',
              ticketId: 'TKT-1006',
              event: 'Festival de Danza',
              eventId: 4,
              purchaseDate: '2023-08-18T18:30:00',
              checkedIn: false,
              status: 'confirmed',
              seatInfo: 'Fila D, Asiento 15'
            },
            { 
              id: 7, 
              name: 'Roberto Fernández', 
              email: 'roberto@example.com',
              phone: '+34 678901234',
              ticketId: 'TKT-1007',
              event: 'Concierto de Rock',
              eventId: 5,
              purchaseDate: '2023-08-18T20:00:00',
              checkedIn: false,
              status: 'cancelled',
              seatInfo: 'Fila E, Asiento 7'
            },
            { 
              id: 8, 
              name: 'Elena Torres', 
              email: 'elena@example.com',
              phone: '+34 689012345',
              ticketId: 'TKT-1008',
              event: 'Concierto de Jazz',
              eventId: 1,
              purchaseDate: '2023-08-19T19:15:00',
              checkedIn: false,
              status: 'confirmed',
              seatInfo: 'Fila B, Asiento 9'
            },
            { 
              id: 9, 
              name: 'Javier López', 
              email: 'javier@example.com',
              phone: '+34 690123456',
              ticketId: 'TKT-1009',
              event: 'Torneo de Ajedrez',
              eventId: 3,
              purchaseDate: '2023-08-19T10:45:00',
              checkedIn: false,
              status: 'pending',
              seatInfo: 'Mesa 5'
            },
            { 
              id: 10, 
              name: 'Sofia Navarro', 
              email: 'sofia@example.com',
              phone: '+34 601234567',
              ticketId: 'TKT-1010',
              event: 'Festival de Danza',
              eventId: 4,
              purchaseDate: '2023-08-20T15:30:00',
              checkedIn: true,
              status: 'confirmed',
              seatInfo: 'Fila A, Asiento 3'
            }
          ];
          
          setEvents(mockEvents);
          setAttendees(mockAttendees);
          
          // Calcular resumen
          const totalAttendees = mockAttendees.length;
          const confirmedAttendees = mockAttendees.filter(a => a.status === 'confirmed').length;
          const pendingAttendees = mockAttendees.filter(a => a.status === 'pending').length;
          
          setSummary({
            totalAttendees,
            confirmedAttendees,
            pendingAttendees
          });
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching attendees data:', error);
        setError('Error al cargar los datos de asistentes');
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
    alert('Función de exportación de datos a implementar');
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
    // Implementación para marcar como asistido
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
    if (filterEvent && attendee.eventId.toString() !== filterEvent) return false;
    
    // Filtrar por estado
    if (filterStatus && attendee.status !== filterStatus) return false;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        attendee.name.toLowerCase().includes(term) ||
        attendee.email.toLowerCase().includes(term) ||
        attendee.ticketId.toLowerCase().includes(term) ||
        attendee.phone.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
  
  // Calcular paginación
  const paginatedAttendees = filteredAttendees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
      <Paper sx={{ p: 3, bgcolor: '#FFF3F3', my: 2 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
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
                  <TableCell>{attendee.ticketId}</TableCell>
                  <TableCell>{attendee.name}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{attendee.email}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {attendee.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>{attendee.event}</TableCell>
                  <TableCell>{attendee.seatInfo}</TableCell>
                  <TableCell>{formatDate(attendee.purchaseDate)}</TableCell>
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
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      No se encontraron asistentes
                    </Typography>
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
            labelRowsPerPage="Filas por página:"
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