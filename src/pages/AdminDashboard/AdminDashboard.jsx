import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import UserManagement from './pages/UserManagement';
import EventManagement from './pages/EventManagement';
import SystemSettings from './pages/SystemSettings';
import { AdminDashboardProvider, useAdminDashboard } from './hooks/AdminDashboardContext.jsx';
import adminApi from './services/api';

// Componente de protección de rutas admin
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAdminDashboard();
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
        <Route path="organizers" element={<UserManagement />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="settings" element={<SystemSettings />} />
        
        {/* Páginas por implementar */}
        <Route path="categories" element={
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Gestión de Categorías</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Esta funcionalidad está en desarrollo.
            </Typography>
          </Box>
        } />
        
        <Route path="reports" element={
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Informes y Estadísticas</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Esta funcionalidad está en desarrollo.
            </Typography>
          </Box>
        } />
        
        <Route path="profile" element={
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Mi Perfil de Administrador</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Esta funcionalidad está en desarrollo.
            </Typography>
          </Box>
        } />
        
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