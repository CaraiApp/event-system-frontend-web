import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PaymentsIcon from '@mui/icons-material/Payments';
import StatCard from '../components/StatCard';
import Chart from '../components/Chart';
import PageHeader from '../components/PageHeader';
import adminApi from '../services/api';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const Overview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await adminApi.getDashboardOverview();
        setDashboardData(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('Error al cargar los datos del dashboard. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Preparar datos para gráficos
  const prepareChartData = () => {
    if (!dashboardData) return { revenueData: [], userGrowthData: [] };

    // Datos de ingresos mensuales
    const revenueData = Object.entries(dashboardData.revenueByMonth || {}).map(([month, revenue]) => ({
      name: month,
      value: revenue
    }));

    // Datos de crecimiento de usuarios
    const userGrowthData = Object.entries(dashboardData.userGrowth || {}).map(([month, count]) => ({
      name: month,
      value: count
    }));

    return { revenueData, userGrowthData };
  };

  const { revenueData, userGrowthData } = prepareChartData();

  // Transformar categorías populares para la gráfica circular
  const preparePopularCategoriesData = () => {
    if (!dashboardData?.popularCategories) return [];
    
    return dashboardData.popularCategories.map((category) => ({
      name: category.name,
      value: category.count
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="Panel de Control" 
        subtitle="Bienvenido al panel de administración de EntradasMelilla. Aquí puedes ver una visión general de todo el sistema."
      />

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Usuarios"
            value={dashboardData?.userCount || 0}
            subtitle="Nuevos este mes"
            change={dashboardData?.newUsers || 0}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Eventos Activos"
            value={dashboardData?.activeEventCount || 0}
            subtitle="De un total de"
            change={dashboardData?.totalEvents || 0}
            icon={<EventIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reservas"
            value={dashboardData?.bookingCount || 0}
            icon={<ConfirmationNumberIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ingresos Totales"
            value={formatCurrency(dashboardData?.totalRevenue || 0)}
            icon={<PaymentsIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Chart
            type="line"
            title="Ingresos Mensuales"
            data={revenueData}
            xKey="name"
            series={[{ dataKey: 'value', name: 'Ingresos (€)', color: '#4caf50' }]}
            height={320}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Chart
            type="pie"
            title="Categorías Populares"
            data={preparePopularCategoriesData()}
            xKey="name"
            series={[{ dataKey: 'value', name: 'Eventos' }]}
            height={320}
          />
        </Grid>
      </Grid>

      {/* Segunda fila de gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Chart
            type="bar"
            title="Crecimiento de Usuarios"
            data={userGrowthData}
            xKey="name"
            series={[{ dataKey: 'value', name: 'Nuevos Usuarios', color: '#2196f3' }]}
            height={320}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Eventos Recientes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle2">Evento</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Organizador</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Fecha</Typography></TableCell>
                  <TableCell align="right"><Typography variant="subtitle2">Asistentes</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData?.recentEvents?.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.organizer}</TableCell>
                    <TableCell>
                      {new Date(event.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      {event.attendees}/{event.capacity}
                    </TableCell>
                  </TableRow>
                ))}
                {(!dashboardData?.recentEvents || dashboardData.recentEvents.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No hay eventos recientes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;