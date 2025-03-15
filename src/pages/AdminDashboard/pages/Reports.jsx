import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  Grid,
  Button,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DateRangeIcon from '@mui/icons-material/DateRange';
import RefreshIcon from '@mui/icons-material/Refresh';
import PageHeader from '../components/PageHeader';
import Chart from '../components/Chart';
import DataTable from '../components/DataTable';
import adminApi from '../services/api';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Función para cargar datos según la pestaña activa
  const fetchData = async () => {
    setLoading(true);
    try {
      // Datos de ejemplo para el panel de informes
      if (activeTab === 0) {
        // Datos de ventas
        const salesByDay = [];
        
        // Generar datos de ejemplo para los últimos 30 días
        for (let i = 30; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const formattedDate = date.toISOString().split('T')[0];
          
          salesByDay.push({
            date: formattedDate,
            sales: Math.floor(Math.random() * 5000) + 1000,
            tickets: Math.floor(Math.random() * 50) + 10,
          });
        }
        
        setSalesData(salesByDay);
      } else if (activeTab === 1) {
        // Datos de actividad
        const activityLogs = [];
        
        // Generar registros de actividad de ejemplo
        for (let i = 0; i < 50; i++) {
          const date = new Date();
          date.setHours(date.getHours() - i);
          
          const actions = [
            'Inicio de sesión',
            'Creación de evento',
            'Actualización de usuario',
            'Eliminación de evento',
            'Cambio de configuración',
            'Aprobación de evento',
            'Rechazo de evento',
            'Cambio de contraseña',
          ];
          
          const users = [
            'admin@example.com',
            'organizador1@example.com',
            'organizador2@example.com',
            'usuario@example.com',
            'soporte@example.com',
          ];
          
          activityLogs.push({
            id: `log-${i}`,
            timestamp: date.toISOString(),
            action: actions[Math.floor(Math.random() * actions.length)],
            user: users[Math.floor(Math.random() * users.length)],
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            details: `Detalles de la acción ${i + 1}`
          });
        }
        
        setActivityLog(activityLogs);
      }
    } catch (error) {
      console.error('Error al cargar datos de informes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };

  const handleFilterByDate = () => {
    fetchData();
  };

  const handleExportReport = () => {
    // En una implementación real, aquí se generaría y descargaría un informe
    alert('Funcionalidad de exportación de informes en desarrollo');
  };

  // Preparar datos para gráficos
  const prepareSalesChartData = () => {
    return salesData.map(item => ({
      name: item.date.split('-').slice(1).join('/'), // Formato MM/DD
      sales: item.sales / 100,
      tickets: item.tickets
    }));
  };

  // Columnas para la tabla de registro de actividad
  const activityColumns = [
    { 
      field: 'timestamp', 
      headerName: 'Fecha y Hora', 
      sortable: true,
      type: 'date',
      width: '20%',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleString('es-ES');
      }
    },
    { 
      field: 'action', 
      headerName: 'Acción', 
      sortable: true,
      width: '20%'
    },
    { 
      field: 'user', 
      headerName: 'Usuario', 
      sortable: true,
      width: '20%'
    },
    { 
      field: 'ip', 
      headerName: 'Dirección IP', 
      sortable: true,
      width: '15%'
    },
    { 
      field: 'details', 
      headerName: 'Detalles', 
      sortable: false,
      width: '25%'
    }
  ];

  // Columnas para la tabla de ventas diarias
  const salesColumns = [
    { 
      field: 'date', 
      headerName: 'Fecha', 
      sortable: true,
      type: 'date',
      width: '20%',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('es-ES');
      }
    },
    { 
      field: 'sales', 
      headerName: 'Ventas', 
      sortable: true,
      width: '40%',
      render: (value) => formatCurrency(value / 100)
    },
    { 
      field: 'tickets', 
      headerName: 'Entradas Vendidas', 
      sortable: true,
      type: 'number',
      width: '40%'
    }
  ];

  return (
    <Box>
      <PageHeader 
        title="Informes y Análisis"
        subtitle="Visualiza y analiza datos de ventas, usuarios y actividad del sistema"
        button={{
          label: "Exportar Informe",
          icon: <DownloadIcon />,
          onClick: handleExportReport
        }}
      />
      
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Ventas y Estadísticas" />
          <Tab label="Registro de Actividad" />
          <Tab label="Rendimiento del Sistema" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Controles para filtrado por fecha */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <TextField
              name="startDate"
              label="Fecha Inicio"
              type="date"
              value={startDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              name="endDate"
              label="Fecha Fin"
              type="date"
              value={endDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              variant="contained" 
              onClick={handleFilterByDate}
              startIcon={<RefreshIcon />}
            >
              Aplicar Filtro
            </Button>
          </Box>
          
          {/* Contenido de las pestañas */}
          {activeTab === 0 && (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                  <Chart
                    type="line"
                    title="Ventas por Día"
                    data={prepareSalesChartData()}
                    xKey="name"
                    series={[
                      { dataKey: 'sales', name: 'Ventas (€)', color: '#4caf50' },
                      { dataKey: 'tickets', name: 'Entradas', color: '#2196f3' }
                    ]}
                    height={400}
                  />
                </Grid>
              </Grid>
              
              <DataTable 
                columns={salesColumns}
                data={salesData}
                loading={loading}
                title="Detalle de Ventas Diarias"
                onRefresh={fetchData}
              />
            </>
          )}
          
          {activeTab === 1 && (
            <DataTable 
              columns={activityColumns}
              data={activityLog}
              loading={loading}
              title="Registro de Actividad del Sistema"
              onRefresh={fetchData}
              pagination={true}
            />
          )}
          
          {activeTab === 2 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Rendimiento del Sistema
              </Typography>
              <Typography>
                Próximamente: Métricas de rendimiento del sistema, uso de recursos y tiempos de respuesta.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Reports;