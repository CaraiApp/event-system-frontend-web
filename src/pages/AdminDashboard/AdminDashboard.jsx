import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import UserManagement from './pages/UserManagement';
import EventManagement from './pages/EventManagement';
import CategoryManagement from './pages/CategoryManagement';
import Reports from './pages/Reports';
import SystemSettings from './pages/SystemSettings';
import { AdminDashboardProvider, useAdminDashboard } from './hooks/AdminDashboardContext';

// Componente de protección de rutas admin
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, error } = useAdminDashboard();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirigir a login con redireccionamiento para volver después de login
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isAdmin()) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          No tienes permiso para acceder a esta área. Se requiere rol de administrador.
        </Alert>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return children;
};

// Dashboard principal
const AdminDashboardContent = () => {
  const { loading } = useAdminDashboard();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Si estás en /admin exacto, redirige a /admin/overview
    if (location.pathname === '/admin') {
      navigate('/admin/overview');
    }
  }, [location, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="overview" element={<Overview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="organizers" element={<UserManagement isOrganizers />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<SystemSettings />} />
        
        {/* Ruta por defecto y manejo de rutas no encontradas */}
        <Route path="*" element={<Navigate to="/admin/overview" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

// Componente principal con el contexto
const AdminDashboard = () => {
  return (
    <AdminDashboardProvider>
      <AdminProtectedRoute>
        <AdminDashboardContent />
      </AdminProtectedRoute>
    </AdminDashboardProvider>
  );
};

export default AdminDashboard;