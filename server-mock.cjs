const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Datos de ejemplo
const mockUsers = [
  {
    _id: "user1",
    username: "admin_user",
    email: "admin@example.com",
    role: "admin",
    fullname: "Admin User",
    status: "active",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    events: 5,
    bookings: 12
  },
  {
    _id: "user2",
    username: "org_user1",
    email: "organizer1@example.com",
    role: "organizer",
    fullname: "Organizer One",
    companyName: "Events Company",
    status: "active",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    events: 8,
    bookings: 0
  },
  {
    _id: "user3",
    username: "org_user2",
    email: "organizer2@example.com",
    role: "organizer",
    fullname: "Organizer Two",
    companyName: "Another Events",
    status: "inactive",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    events: 3,
    bookings: 0
  },
  {
    _id: "user4",
    username: "normal_user1",
    email: "user1@example.com",
    role: "user",
    fullname: "Regular User One",
    status: "active",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    events: 0,
    bookings: 5
  },
  {
    _id: "user5",
    username: "normal_user2",
    email: "user2@example.com",
    role: "user",
    fullname: "Regular User Two",
    status: "active",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    events: 0,
    bookings: 3
  },
  {
    _id: "user6",
    username: "normal_user3",
    email: "user3@example.com",
    role: "user",
    fullname: "Regular User Three",
    status: "suspended",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    events: 0,
    bookings: 1
  }
];

// Endpoint para obtener configuración UI del dashboard
app.get('/api/templates/ui-config', (req, res) => {
  console.log('Solicitud recibida en /api/templates/ui-config');
  
  // Configuración base del UI
  const baseConfig = {
    hideHeader: true,
    hideFooter: true,
    isDashboard: true,
    dashboardType: 'admin',
    navItems: [
      { path: '/admin/overview', label: 'Panel de Control', icon: 'dashboard' },
      { path: '/admin/users', label: 'Usuarios', icon: 'people' },
      { path: '/admin/organizers', label: 'Organizadores', icon: 'business' },
      { path: '/admin/events', label: 'Eventos', icon: 'event' },
      { path: '/admin/settings', label: 'Configuración', icon: 'settings' }
    ]
  };
  
  // Devolver respuesta en formato API
  return res.status(200).json({
    statusCode: 200,
    data: baseConfig,
    message: 'UI configuration retrieved successfully',
    success: true
  });
});

// Endpoint para gestión de usuarios
app.get('/api/v1/dashboard/admin/users', (req, res) => {
  console.log('Solicitud recibida en /api/v1/dashboard/admin/users');
  
  // Parámetros de paginación
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, mockUsers.length);
  
  // Filtrar por rol si se especifica
  let filteredUsers = mockUsers;
  if (req.query.role) {
    filteredUsers = mockUsers.filter(user => user.role === req.query.role);
  }
  
  // Datos paginados
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  // Devolver datos en formato esperado por el frontend
  return res.status(200).json({
    success: true,
    data: {
      users: paginatedUsers,
      totalCount: filteredUsers.length,
      page,
      limit
    }
  });
});

// Endpoint específico para organizadores
app.get('/api/v1/dashboard/admin/organizers', (req, res) => {
  console.log('Solicitud recibida en /api/v1/dashboard/admin/organizers');
  
  // Parámetros de paginación
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Filtrar solo organizadores
  const organizers = mockUsers.filter(user => user.role === 'organizer');
  
  // Aplicar paginación
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, organizers.length);
  const paginatedOrganizers = organizers.slice(startIndex, endIndex);
  
  // Devolver datos en formato esperado por el frontend
  return res.status(200).json({
    success: true,
    data: {
      users: paginatedOrganizers,
      totalCount: organizers.length,
      page,
      limit
    }
  });
});

// Endpoint para usuarios (ruta alternativa)
app.get('/api/v1/users', (req, res) => {
  console.log('Solicitud recibida en /api/v1/users');
  
  return res.status(200).json({
    status: 'éxito',
    success: 'true',
    message: 'Éxito.',
    count: mockUsers.length,
    data: mockUsers
  });
});

// Rutas fallback para datos que no están implementados específicamente
app.use('/api/*', (req, res) => {
  console.log(`Solicitud no manejada específicamente: ${req.method} ${req.originalUrl}`);
  
  // Devolver respuesta genérica para cualquier otra ruta
  if (req.originalUrl.includes('/events')) {
    return res.status(200).json({
      success: true,
      data: []
    });
  }
  
  return res.status(200).json({
    success: true,
    message: 'API Mock is working, but this specific endpoint is not fully implemented',
    data: null
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor mock ejecutándose en http://localhost:${PORT}`);
});