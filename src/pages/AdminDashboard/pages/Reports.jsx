import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, CircularProgress,
  FormControl, MenuItem, Select, InputLabel, Button, Divider,
  Tabs, Tab, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, TextField
} from '@mui/material';
import { 
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  CloudDownload as CloudDownloadIcon,
  DateRange as DateRangeIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  CompareArrows as CompareArrowsIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';

// Componentes de gráficos (simulados para mostrar la estructura)
const RevenueChart = () => (
  <Box
    sx={{
      height: 300,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      borderRadius: 1,
      border: '1px dashed #ccc'
    }}
  >
    <Typography variant="body2" color="text.secondary">
      Aquí se mostraría un gráfico de ingresos
    </Typography>
  </Box>
);

const SalesComparisonChart = () => (
  <Box
    sx={{
      height: 300,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      borderRadius: 1,
      border: '1px dashed #ccc'
    }}
  >
    <Typography variant="body2" color="text.secondary">
      Aquí se mostraría un gráfico comparativo de ventas
    </Typography>
  </Box>
);

const UserGrowthChart = () => (
  <Box
    sx={{
      height: 300,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      borderRadius: 1,
      border: '1px dashed #ccc'
    }}
  >
    <Typography variant="body2" color="text.secondary">
      Aquí se mostraría un gráfico de crecimiento de usuarios
    </Typography>
  </Box>
);

const CategoryDistributionChart = () => (
  <Box
    sx={{
      height: 300,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      borderRadius: 1,
      border: '1px dashed #ccc'
    }}
  >
    <Typography variant="body2" color="text.secondary">
      Aquí se mostraría un gráfico de distribución por categorías
    </Typography>
  </Box>
);

// TabPanel para las pestañas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
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

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareStartDate, setCompareStartDate] = useState(null);
  const [compareEndDate, setCompareEndDate] = useState(null);
  
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      
      try {
        // En producción, aquí se realizará la petición real a la API
        // const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        // const params = new URLSearchParams({
        //   reportType,
        //   dateRange,
        //   startDate: startDate?.toISOString(),
        //   endDate: endDate?.toISOString(),
        //   compareStartDate: compareStartDate?.toISOString(),
        //   compareEndDate: compareEndDate?.toISOString(),
        //   compareMode: compareMode ? 'true' : 'false'
        // });
        // const response = await axios.get(`${API_BASE_URL}/api/v1/admin/reports?${params}`);
        
        // Datos de prueba
        setTimeout(() => {
          // Simulación de datos según el tipo de informe seleccionado
          let mockData;
          
          if (reportType === 'sales') {
            mockData = {
              summary: {
                totalSales: 12850,
                totalRevenue: 327450.75,
                averageTicketPrice: 25.48,
                refunds: 15,
                refundAmount: 382.20
              },
              salesByMonth: {
                'Ene': 25600.50,
                'Feb': 28750.25,
                'Mar': 32100.00,
                'Abr': 29500.75,
                'May': 31200.50,
                'Jun': 35600.25,
                'Jul': 38700.00,
                'Ago': 42500.50,
                'Sep': 40200.75,
                'Oct': 35800.25,
                'Nov': 0,
                'Dic': 0
              },
              salesByCategory: {
                'Música': 125800.50,
                'Deportes': 85600.25,
                'Teatro': 64200.75,
                'Conferencias': 32500.50,
                'Arte': 19350.75
              },
              topEvents: [
                { id: 'e1', name: 'Festival de Jazz', category: 'Música', sales: 350, revenue: 17500.00 },
                { id: 'e4', name: 'Congreso de Tecnología', category: 'Conferencias', sales: 248, revenue: 14880.00 },
                { id: 'e7', name: 'Carrera Solidaria', category: 'Deportes', sales: 752, revenue: 12032.00 },
                { id: 'e5', name: 'Exposición de Arte Contemporáneo', category: 'Arte', sales: 215, revenue: 7525.00 },
                { id: 'e2', name: 'Torneo de Fútbol', category: 'Deportes', sales: 650, revenue: 7150.00 }
              ],
              salesByPaymentMethod: {
                'Tarjeta de crédito': 65.5,
                'PayPal': 25.8,
                'Transferencia bancaria': 8.7
              }
            };
          } else if (reportType === 'users') {
            mockData = {
              summary: {
                totalUsers: 1250,
                newUsers: 125,
                activeUsers: 850,
                organizerCount: 45
              },
              userGrowth: {
                'Ene': 58,
                'Feb': 75,
                'Mar': 98,
                'Abr': 115,
                'May': 135,
                'Jun': 165,
                'Jul': 198,
                'Ago': 240,
                'Sep': 278,
                'Oct': 315,
                'Nov': 0,
                'Dic': 0
              },
              usersByType: {
                'Usuarios regulares': 1205,
                'Organizadores': 45
              },
              topOrganizers: [
                { id: 'org4', name: 'Carlos Rodríguez', company: 'Conciertos Inolvidables', events: 12, revenue: 45800.50 },
                { id: 'org2', name: 'Juan Martínez', company: 'Cultura en Vivo', events: 10, revenue: 38600.25 },
                { id: 'org3', name: 'Ana García', company: 'Deportes Express', events: 8, revenue: 32500.75 },
                { id: 'org1', name: 'María López', company: 'EventosPro', events: 7, revenue: 28950.50 }
              ],
              userActivity: {
                'Compra de entradas': 65.2,
                'Navegación': 24.8,
                'Búsqueda': 10.0
              }
            };
          } else if (reportType === 'events') {
            mockData = {
              summary: {
                totalEvents: 86,
                activeEvents: 35,
                pendingEvents: 12,
                completedEvents: 39
              },
              eventsByMonth: {
                'Ene': 6,
                'Feb': 8,
                'Mar': 10,
                'Abr': 7,
                'May': 9,
                'Jun': 12,
                'Jul': 14,
                'Ago': 10,
                'Sep': 8,
                'Oct': 2,
                'Nov': 0,
                'Dic': 0
              },
              eventsByCategory: {
                'Música': 32,
                'Deportes': 18,
                'Teatro': 15,
                'Conferencias': 12,
                'Arte': 9
              },
              mostPopularEvents: [
                { id: 'e7', name: 'Carrera Solidaria', attendance: 94, capacity: 100 },
                { id: 'e1', name: 'Festival de Jazz', attendance: 88, capacity: 100 },
                { id: 'e4', name: 'Congreso de Tecnología', attendance: 85, capacity: 100 },
                { id: 'e5', name: 'Exposición de Arte Contemporáneo', attendance: 82, capacity: 100 },
                { id: 'e2', name: 'Torneo de Fútbol', attendance: 75, capacity: 100 }
              ]
            };
          }
          
          setReportData(mockData);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setError('Error al cargar los datos del informe');
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [reportType, dateRange, startDate, endDate, compareMode, compareStartDate, compareEndDate]);
  
  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };
  
  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
    
    // Establecer fechas predefinidas según el rango seleccionado
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (event.target.value) {
      case 'today':
        setStartDate(today);
        setEndDate(today);
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        setStartDate(yesterday);
        setEndDate(yesterday);
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        setStartDate(weekStart);
        setEndDate(today);
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        setStartDate(monthStart);
        setEndDate(today);
        break;
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        setStartDate(yearStart);
        setEndDate(today);
        break;
      case 'custom':
        // Mantener las fechas actuales o establecer un rango por defecto
        if (!startDate || !endDate) {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          setStartDate(monthStart);
          setEndDate(today);
        }
        break;
      default:
        break;
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    
    if (!compareMode && !compareStartDate && !compareEndDate) {
      // Establecer período de comparación por defecto (mismo período del año anterior)
      if (startDate && endDate) {
        const compareStart = new Date(startDate);
        compareStart.setFullYear(compareStart.getFullYear() - 1);
        
        const compareEnd = new Date(endDate);
        compareEnd.setFullYear(compareEnd.getFullYear() - 1);
        
        setCompareStartDate(compareStart);
        setCompareEndDate(compareEnd);
      }
    }
  };
  
  const handleExportReport = () => {
    alert('Funcionalidad de exportación de informes a implementar');
  };
  
  const handlePrintReport = () => {
    window.print();
  };
  
  const handleShareReport = () => {
    alert('Funcionalidad de compartir informes a implementar');
  };
  
  const handleApplyFilters = () => {
    setLoading(true);
    // La recarga de datos ya está manejada por el efecto
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-ES').format(number);
  };
  
  const formatPercentage = (value) => {
    return new Intl.NumberFormat('es-ES', { style: 'percent', maximumFractionDigits: 1 }).format(value / 100);
  };
  
  if (loading && !reportData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="admin-title">
        <Typography variant="h4" component="h1" className="admin-title-text">
          Informes y Analíticas
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<CloudDownloadIcon />}
            onClick={handleExportReport}
          >
            Exportar
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />}
            onClick={handlePrintReport}
          >
            Imprimir
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />}
            onClick={handleShareReport}
          >
            Compartir
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Filtros de Informe */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="report-type-label">Tipo de Informe</InputLabel>
              <Select
                labelId="report-type-label"
                id="report-type"
                value={reportType}
                label="Tipo de Informe"
                onChange={handleReportTypeChange}
              >
                <MenuItem value="sales">Ventas e Ingresos</MenuItem>
                <MenuItem value="users">Usuarios</MenuItem>
                <MenuItem value="events">Eventos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="date-range-label">Período</InputLabel>
              <Select
                labelId="date-range-label"
                id="date-range"
                value={dateRange}
                label="Período"
                onChange={handleDateRangeChange}
              >
                <MenuItem value="today">Hoy</MenuItem>
                <MenuItem value="yesterday">Ayer</MenuItem>
                <MenuItem value="week">Esta semana</MenuItem>
                <MenuItem value="month">Este mes</MenuItem>
                <MenuItem value="year">Este año</MenuItem>
                <MenuItem value="custom">Personalizado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {dateRange === 'custom' && (
            <>
              <Grid item xs={12} md={2}>
                <DatePicker
                  label="Fecha inicial"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <DatePicker
                  label="Fecha final"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={6} md={1}>
            <Tooltip title="Activar comparación">
              <Button
                variant={compareMode ? "contained" : "outlined"}
                color={compareMode ? "primary" : "inherit"}
                onClick={toggleCompareMode}
                sx={{ height: '100%' }}
              >
                <CompareArrowsIcon />
              </Button>
            </Tooltip>
          </Grid>
          
          <Grid item xs={6} md={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              startIcon={<FilterListIcon />}
              sx={{ height: '100%' }}
            >
              Aplicar
            </Button>
          </Grid>
        </Grid>
        
        {compareMode && (
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="subtitle2" gutterBottom>
              Comparar con:
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Fecha inicial de comparación"
                  value={compareStartDate}
                  onChange={setCompareStartDate}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Fecha final de comparación"
                  value={compareEndDate}
                  onChange={setCompareEndDate}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
      
      {/* Indicadores Principales */}
      {reportData && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {reportType === 'sales' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Ventas Totales
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(reportData.summary.totalRevenue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatNumber(reportData.summary.totalSales)} transacciones
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Valor Medio por Entrada
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(reportData.summary.averageTicketPrice)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      por transacción
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Categoría más Vendida
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      Música
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(reportData.salesByCategory['Música'])}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Reembolsos
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(reportData.summary.refundAmount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reportData.summary.refunds} devoluciones
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
          
          {reportType === 'users' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Usuarios Totales
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {formatNumber(reportData.summary.totalUsers)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reportData.summary.newUsers} nuevos este mes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Usuarios Activos
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {formatNumber(reportData.summary.activeUsers)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round((reportData.summary.activeUsers / reportData.summary.totalUsers) * 100)}% del total
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Organizadores
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {formatNumber(reportData.summary.organizerCount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round((reportData.summary.organizerCount / reportData.summary.totalUsers) * 100)}% del total
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Actividad Principal
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      Compras
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reportData.userActivity['Compra de entradas']}% de acciones
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
          
          {reportType === 'events' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Eventos Totales
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {formatNumber(reportData.summary.totalEvents)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      en la plataforma
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Eventos Activos
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {formatNumber(reportData.summary.activeEvents)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      próximos a realizarse
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Categoría Principal
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      Música
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reportData.eventsByCategory['Música']} eventos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Ocupación Promedio
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      84.8%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      para eventos completados
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      )}
      
      {/* Pestañas de Informes Detallados */}
      {reportData && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
              <Tab icon={<BarChartIcon />} iconPosition="start" label="Gráficos" />
              <Tab icon={<TimelineIcon />} iconPosition="start" label="Tendencias" />
              <Tab icon={<PieChartIcon />} iconPosition="start" label="Distribución" />
              <Tab icon={<DateRangeIcon />} iconPosition="start" label="Detalle" />
            </Tabs>
          </Box>
          
          {/* Contenido de Pestañas */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              {reportType === 'sales' ? 'Análisis de Ventas' : reportType === 'users' ? 'Análisis de Usuarios' : 'Análisis de Eventos'}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                {reportType === 'sales' && <RevenueChart />}
                {reportType === 'users' && <UserGrowthChart />}
                {reportType === 'events' && <SalesComparisonChart />}
              </Grid>
              <Grid item xs={12} md={4}>
                {reportType === 'sales' && (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Evento</TableCell>
                          <TableCell align="right">Ingresos</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportData.topEvents.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell>{event.name}</TableCell>
                            <TableCell align="right">{formatCurrency(event.revenue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                {reportType === 'users' && (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Organizador</TableCell>
                          <TableCell align="right">Eventos</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportData.topOrganizers.map((organizer) => (
                          <TableRow key={organizer.id}>
                            <TableCell>{organizer.name}</TableCell>
                            <TableCell align="right">{organizer.events}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                {reportType === 'events' && (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Evento</TableCell>
                          <TableCell align="right">Ocupación</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportData.mostPopularEvents.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell>{event.name}</TableCell>
                            <TableCell align="right">{Math.round((event.attendance / event.capacity) * 100)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Tendencias
            </Typography>
            {reportType === 'sales' && <SalesComparisonChart />}
            {reportType === 'users' && <UserGrowthChart />}
            {reportType === 'events' && <SalesComparisonChart />}
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Distribución
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <CategoryDistributionChart />
              </Grid>
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Categoría</TableCell>
                        {reportType === 'sales' && <TableCell align="right">Ingresos</TableCell>}
                        {reportType === 'users' && <TableCell align="right">Usuarios</TableCell>}
                        {reportType === 'events' && <TableCell align="right">Eventos</TableCell>}
                        <TableCell align="right">Porcentaje</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportType === 'sales' && Object.entries(reportData.salesByCategory).map(([category, amount]) => (
                        <TableRow key={category}>
                          <TableCell>{category}</TableCell>
                          <TableCell align="right">{formatCurrency(amount)}</TableCell>
                          <TableCell align="right">
                            {formatPercentage(amount / reportData.summary.totalRevenue * 100)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {reportType === 'users' && Object.entries(reportData.usersByType).map(([type, count]) => (
                        <TableRow key={type}>
                          <TableCell>{type}</TableCell>
                          <TableCell align="right">{formatNumber(count)}</TableCell>
                          <TableCell align="right">
                            {formatPercentage(count / reportData.summary.totalUsers * 100)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {reportType === 'events' && Object.entries(reportData.eventsByCategory).map(([category, count]) => (
                        <TableRow key={category}>
                          <TableCell>{category}</TableCell>
                          <TableCell align="right">{count}</TableCell>
                          <TableCell align="right">
                            {formatPercentage(count / reportData.summary.totalEvents * 100)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Datos Detallados
            </Typography>
            {reportType === 'sales' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Evento</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell align="right">Ventas</TableCell>
                      <TableCell align="right">Ingresos</TableCell>
                      <TableCell align="right">Precio Medio</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.topEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.category}</TableCell>
                        <TableCell align="right">{formatNumber(event.sales)}</TableCell>
                        <TableCell align="right">{formatCurrency(event.revenue)}</TableCell>
                        <TableCell align="right">{formatCurrency(event.revenue / event.sales)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {reportType === 'users' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Organizador</TableCell>
                      <TableCell>Empresa</TableCell>
                      <TableCell align="right">Eventos</TableCell>
                      <TableCell align="right">Ingresos</TableCell>
                      <TableCell align="right">Promedio por Evento</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.topOrganizers.map((organizer) => (
                      <TableRow key={organizer.id}>
                        <TableCell>{organizer.name}</TableCell>
                        <TableCell>{organizer.company}</TableCell>
                        <TableCell align="right">{organizer.events}</TableCell>
                        <TableCell align="right">{formatCurrency(organizer.revenue)}</TableCell>
                        <TableCell align="right">{formatCurrency(organizer.revenue / organizer.events)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {reportType === 'events' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Evento</TableCell>
                      <TableCell align="right">Capacidad</TableCell>
                      <TableCell align="right">Asistencia</TableCell>
                      <TableCell align="right">Ocupación</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.mostPopularEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.name}</TableCell>
                        <TableCell align="right">{event.capacity}</TableCell>
                        <TableCell align="right">{event.attendance}</TableCell>
                        <TableCell align="right">{Math.round((event.attendance / event.capacity) * 100)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </>
      )}
      
      {loading && reportData && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </LocalizationProvider>
  );
};

export default Reports;