import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Button, Chip, CircularProgress,
  Card, CardContent, Grid, TextField, MenuItem, InputAdornment,
  Divider, IconButton, Menu
} from '@mui/material';
import { 
  FilterList as FilterListIcon, 
  GetApp as GetAppIcon,
  CloudDownload as DownloadIcon,
  Today as TodayIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Download as DownloadTicketIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterEvent, setFilterEvent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalRevenue: 0,
    averageTicketValue: 0,
    commissionPaid: 0
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  
  useEffect(() => {
    const fetchSalesData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No se encontró token de autenticación');
        setLoading(false);
        return;
      }
      
      try {
        // Usamos el nuevo endpoint del backend
        const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        // Llamada real al endpoint para obtener los datos de ventas
        const response = await axios.get(`${API_BASE_URL}/api/v1/dashboard/organizer/sales-report`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            startDate: filterDateFrom ? filterDateFrom.toISOString() : undefined,
            endDate: filterDateTo ? filterDateTo.toISOString() : undefined,
            eventId: filterEvent || undefined
          }
        });
        
        if (response.data && response.data.data) {
          setSales(response.data.data.detailedSales || []);
          setSummary({
            totalSales: response.data.data.summary.totalBookings || 0,
            totalRevenue: response.data.data.summary.totalRevenue || 0,
            averageTicketValue: response.data.data.summary.totalRevenue / response.data.data.summary.totalBookings || 0,
            commissionPaid: response.data.data.summary.commissionPaid || 0
          });
          // Extraer eventos únicos de las ventas para el filtro
          const eventOptions = [...new Set(response.data.data.salesByEvent.map(event => event.id))];
          setEvents(eventOptions);
          setLoading(false);
          return;
        }
        
        // Datos de prueba
        setTimeout(() => {
          const mockEvents = [
            { id: 1, name: 'Concierto de Jazz' },
            { id: 2, name: 'Teatro Infantil' },
            { id: 3, name: 'Torneo de Ajedrez' },
            { id: 4, name: 'Festival de Danza' },
            { id: 5, name: 'Concierto de Rock' }
          ];
          
          const mockSales = [
            { 
              id: 1001, 
              event: 'Concierto de Jazz', 
              eventId: 1,
              customer: 'Juan P�rez', 
              email: 'juan@example.com',
              date: '2023-08-28T14:30:00', 
              tickets: 2, 
              amount: 60.00,
              commissionRate: 5,
              commission: 3.00,
              status: 'completed',
              paymentMethod: 'credit_card'
            },
            { 
              id: 1002, 
              event: 'Teatro Infantil', 
              eventId: 2,
              customer: 'Mar�a Garc�a', 
              email: 'maria@example.com',
              date: '2023-08-27T10:15:00', 
              tickets: 3, 
              amount: 45.00,
              commissionRate: 5,
              commission: 2.25,
              status: 'completed',
              paymentMethod: 'paypal'
            },
            { 
              id: 1003, 
              event: 'Concierto de Jazz', 
              eventId: 1,
              customer: 'Pedro Rodr�guez', 
              email: 'pedro@example.com',
              date: '2023-08-27T16:45:00', 
              tickets: 1, 
              amount: 30.00,
              commissionRate: 5,
              commission: 1.50,
              status: 'completed',
              paymentMethod: 'credit_card'
            },
            { 
              id: 1004, 
              event: 'Torneo de Ajedrez', 
              eventId: 3,
              customer: 'Ana Mart�nez', 
              email: 'ana@example.com',
              date: '2023-08-26T09:20:00', 
              tickets: 1, 
              amount: 20.00,
              commissionRate: 5,
              commission: 1.00,
              status: 'completed',
              paymentMethod: 'bank_transfer'
            },
            { 
              id: 1005, 
              event: 'Teatro Infantil', 
              eventId: 2,
              customer: 'Carlos S�nchez', 
              email: 'carlos@example.com',
              date: '2023-08-25T13:10:00', 
              tickets: 2, 
              amount: 30.00,
              commissionRate: 5,
              commission: 1.50,
              status: 'completed',
              paymentMethod: 'credit_card'
            },
            { 
              id: 1006, 
              event: 'Festival de Danza', 
              eventId: 4,
              customer: 'Laura G�mez', 
              email: 'laura@example.com',
              date: '2023-08-24T18:30:00', 
              tickets: 4, 
              amount: 100.00,
              commissionRate: 5,
              commission: 5.00,
              status: 'completed',
              paymentMethod: 'paypal'
            },
            { 
              id: 1007, 
              event: 'Concierto de Rock', 
              eventId: 5,
              customer: 'Roberto Fern�ndez', 
              email: 'roberto@example.com',
              date: '2023-08-23T20:00:00', 
              tickets: 2, 
              amount: 70.00,
              commissionRate: 5,
              commission: 3.50,
              status: 'completed',
              paymentMethod: 'credit_card'
            },
            { 
              id: 1008, 
              event: 'Concierto de Jazz', 
              eventId: 1,
              customer: 'Elena Torres', 
              email: 'elena@example.com',
              date: '2023-08-22T19:15:00', 
              tickets: 3, 
              amount: 90.00,
              commissionRate: 5,
              commission: 4.50,
              status: 'completed',
              paymentMethod: 'credit_card'
            },
            { 
              id: 1009, 
              event: 'Torneo de Ajedrez', 
              eventId: 3,
              customer: 'Javier L�pez', 
              email: 'javier@example.com',
              date: '2023-08-21T10:45:00', 
              tickets: 2, 
              amount: 40.00,
              commissionRate: 5,
              commission: 2.00,
              status: 'pending',
              paymentMethod: 'bank_transfer'
            },
            { 
              id: 1010, 
              event: 'Festival de Danza', 
              eventId: 4,
              customer: 'Sofia Navarro', 
              email: 'sofia@example.com',
              date: '2023-08-20T15:30:00', 
              tickets: 1, 
              amount: 25.00,
              commissionRate: 5,
              commission: 1.25,
              status: 'completed',
              paymentMethod: 'paypal'
            }
          ];
          
          setEvents(mockEvents);
          setSales(mockSales);
          
          // Calcular resumen
          const totalSales = mockSales.length;
          const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.amount, 0);
          const commissionPaid = mockSales.reduce((sum, sale) => sum + sale.commission, 0);
          const averageTicketValue = totalRevenue / totalSales;
          
          setSummary({
            totalSales,
            totalRevenue,
            averageTicketValue,
            commissionPaid
          });
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setError('Error al cargar los datos de ventas');
        setLoading(false);
      }
    };
    
    fetchSalesData();
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
  
  const handleExportData = () => {
    alert('Funci�n de exportaci�n de datos a implementar');
  };
  
  const handleMenuClick = (event, bookingId) => {
    setAnchorEl(event.currentTarget);
    setSelectedBookingId(bookingId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBookingId(null);
  };
  
  const handleViewBooking = () => {
    alert(`Ver detalles de la reserva ${selectedBookingId}`);
    handleMenuClose();
  };
  
  const handleDownloadTicket = () => {
    alert(`Descargar entrada ${selectedBookingId}`);
    handleMenuClose();
  };
  
  const handleSendEmail = () => {
    alert(`Enviar email para la reserva ${selectedBookingId}`);
    handleMenuClose();
  };
  
  // Filtrar ventas
  const filteredSales = sales.filter(sale => {
    // Filtrar por evento
    if (filterEvent && sale.eventId.toString() !== filterEvent) return false;
    
    // Filtrar por estado
    if (filterStatus && sale.status !== filterStatus) return false;
    
    // Filtrar por fecha desde
    if (filterDateFrom && new Date(sale.date) < filterDateFrom) return false;
    
    // Filtrar por fecha hasta
    if (filterDateTo) {
      const dateTo = new Date(filterDateTo);
      dateTo.setHours(23, 59, 59, 999); // Establecer al final del d�a
      if (new Date(sale.date) > dateTo) return false;
    }
    
    return true;
  });
  
  // Calcular paginaci�n
  const paginatedSales = filteredSales.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip label="Completado" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pendiente" color="warning" size="small" />;
      case 'cancelled':
        return <Chip label="Cancelado" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'credit_card':
        return 'Tarjeta de cr�dito';
      case 'paypal':
        return 'PayPal';
      case 'bank_transfer':
        return 'Transferencia bancaria';
      default:
        return method;
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="dashboard-title">
        <Typography variant="h4" component="h1" className="dashboard-title-text">
          Ventas
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
        <Grid item xs={12} md={6} lg={3}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Total Ventas
              </Typography>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                {summary.totalSales}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Entradas vendidas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Ingresos Totales
              </Typography>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
                �{summary.totalRevenue.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Antes de comisiones
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Valor Medio
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                �{summary.averageTicketValue.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Por venta
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Comisi�n Pagada
              </Typography>
              <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold' }}>
                �{summary.commissionPaid.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                5% sobre ventas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
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
              <MenuItem value="completed">Completados</MenuItem>
              <MenuItem value="pending">Pendientes</MenuItem>
              <MenuItem value="cancelled">Cancelados</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Desde"
              value={filterDateFrom}
              onChange={setFilterDateFrom}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TodayIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Hasta"
              value={filterDateTo}
              onChange={setFilterDateTo}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TodayIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
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
              setFilterDateFrom(null);
              setFilterDateTo(null);
            }}
          >
            Limpiar Filtros
          </Button>
        </Box>
      </Paper>
      
      {/* Sales Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Evento</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell align="center">Entradas</TableCell>
                <TableCell align="right">Importe</TableCell>
                <TableCell align="right">Comisi�n</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">M�todo Pago</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSales.map((sale) => (
                <TableRow
                  hover
                  key={sale.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {sale.id}
                  </TableCell>
                  <TableCell>{formatDate(sale.date)}</TableCell>
                  <TableCell>{sale.event}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{sale.customer}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {sale.email}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{sale.tickets}</TableCell>
                  <TableCell align="right">�{sale.amount.toFixed(2)}</TableCell>
                  <TableCell align="right">�{sale.commission.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    {getStatusChip(sale.status)}
                  </TableCell>
                  <TableCell align="center">
                    {getPaymentMethodText(sale.paymentMethod)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="more"
                      id={`sale-menu-${sale.id}`}
                      aria-controls={`sale-menu-${sale.id}`}
                      aria-haspopup="true"
                      onClick={(e) => handleMenuClick(e, sale.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              
              {paginatedSales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      No se encontraron ventas
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Divider />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
          <Button startIcon={<GetAppIcon />} onClick={handleExportData}>
            Exportar a Excel
          </Button>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredSales.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por p�gina:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Box>
      </Paper>
      
      {/* Booking Actions Menu */}
      <Menu
        id="booking-actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewBooking}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Ver Detalles
        </MenuItem>
        <MenuItem onClick={handleDownloadTicket}>
          <DownloadTicketIcon fontSize="small" sx={{ mr: 1 }} />
          Descargar Entrada
        </MenuItem>
        <MenuItem onClick={handleSendEmail}>
          <EmailIcon fontSize="small" sx={{ mr: 1 }} />
          Enviar Email
        </MenuItem>
      </Menu>
    </LocalizationProvider>
  );
};

export default Sales;