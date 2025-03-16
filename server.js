// Servidor mock para el sistema de eventos
import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Ruta a la carpeta de datos JSON
const dataPath = path.join(__dirname, '..', 'entradasmelilladb');

// Función para cargar los archivos JSON
const loadJSON = (filePath) => {
  try {
    // En ESM usamos readFileSync directamente
    const data = JSON.parse(readFileSync(filePath, 'utf8'));
    return data;
  } catch (error) {
    console.error(`Error al cargar ${filePath}:`, error.message);
    return [];
  }
};

// Crear un objeto con todos los datos JSON
// Si los archivos no existen, usamos datos de ejemplo
const mockEvents = [];
const mockUsers = [
  {
    _id: { $oid: "67d1a62b22dd165cb748c73d" },
    username: "admin_user",
    email: "admin@example.com",
    role: "admin",
    fullname: "Admin User",
    status: "active",
    createdAt: { $date: new Date().toISOString() },
  },
  {
    _id: { $oid: "67d1a62b22dd165cb748c73e" },
    username: "org_user1",
    email: "organizer1@example.com",
    role: "organizer",
    fullname: "Organizer One",
    status: "active",
    createdAt: { $date: new Date().toISOString() },
  }
];

// Intentar cargar datos reales o usar mocks como fallback
const data = {
  events: loadJSON(path.join(dataPath, 'entradasmelilla.events.json')) || mockEvents,
  users: loadJSON(path.join(dataPath, 'entradasmelilla.users.json')) || mockUsers,
  bookings: loadJSON(path.join(dataPath, 'entradasmelilla.bookings.json')) || [],
  templates: loadJSON(path.join(dataPath, 'entradasmelilla.templates.json')) || [],
  categories: loadJSON(path.join(dataPath, 'entradasmelilla.categories.json')) || [],
  reviews: loadJSON(path.join(dataPath, 'entradasmelilla.reviews.json')) || [],
  tempbookings: loadJSON(path.join(dataPath, 'entradasmelilla.tempbookings.json')) || [],
  timeslots: loadJSON(path.join(dataPath, 'entradasmelilla.timeslots.json')) || []
};

// Crear el router con los datos
const router = jsonServer.router(data);

// Aplicar middlewares
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Middleware para simular latencia (opcional)
server.use((req, res, next) => {
  setTimeout(next, 300);
});

// Endpoints personalizados para mantener la estructura de respuesta esperada por el frontend
// Eventos
server.get('/api/v1/events', (req, res) => {
  const events = data.events;
  res.json({
    success: true,
    data: events
  });
});

server.get('/api/v1/events/getsingleEvent', (req, res) => {
  const eventId = req.query.id;
  const event = data.events.find(e => e._id.$oid === eventId);
  if (event) {
    res.json({
      success: true,
      data: event
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Evento no encontrado'
    });
  }
});

server.get('/api/v1/events/getuserEvent', (req, res) => {
  // Obtener userId del token (en una implementación real se extraería del token)
  // Para pruebas, usamos un ID fijo
  const userId = req.headers.authorization ? "67d1a62b22dd165cb748c73d" : null;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado'
    });
  }
  
  const events = data.events.filter(e => e.user_id && e.user_id.$oid === userId);
  res.json({
    success: true,
    data: events
  });
});

// Autenticación
server.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  // En un entorno real, verificaríamos la contraseña con bcrypt
  // Para pruebas, simplemente comprobamos que el email exista
  const user = data.users.find(u => u.email === email);
  
  if (user) {
    // Simular un token JWT
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDFhNjJiMjJkZDE2NWNiNzQ4YzczZCIsInJvbGUiOiJvcmdhbml6ZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.4pEgmzXlazGYsTnvTU39kzNRBF6PwLYvLyhzy4QZ8oM';
    
    res.json({
      success: true,
      data: {
        token: fakeToken,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullname: user.fullname
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }
});

// Categorías
server.get('/api/v1/categories', (req, res) => {
  res.json({
    success: true,
    data: data.categories
  });
});

// Reservas
server.get('/api/v1/booking/getuserbookings', (req, res) => {
  // En una implementación real, filtrarías por el ID de usuario del token
  res.json({
    success: true,
    data: data.bookings
  });
});

server.get('/api/v1/booking/geteventbooking', (req, res) => {
  const eventId = req.query.event_id;
  const eventBookings = data.bookings.filter(b => b.event_id && b.event_id.$oid === eventId);
  res.json({
    success: true,
    data: eventBookings
  });
});

// Plantillas
server.get('/api/v1/templates', (req, res) => {
  res.json({
    success: true,
    data: data.templates
  });
});

server.get('/api/v1/templates/:id', (req, res) => {
  const templateId = req.params.id;
  const template = data.templates.find(t => t._id.$oid === templateId || t.id === templateId);
  if (template) {
    res.json({
      success: true,
      data: template
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Plantilla no encontrada'
    });
  }
});

// Configuración UI
server.get('/api/templates/ui-config', (req, res) => {
  res.json({
    hideHeader: true,
    hideFooter: true,
    isDashboard: true,
    dashboardType: req.headers['x-route-path'] && req.headers['x-route-path'].includes('/admin') ? 'admin' : 'organizer',
    navItems: req.headers['x-route-path'] && req.headers['x-route-path'].includes('/admin') ? [
      { path: '/admin/overview', label: 'Dashboard', icon: 'dashboard' },
      { path: '/admin/users', label: 'Usuarios', icon: 'people' },
      { path: '/admin/organizers', label: 'Organizadores', icon: 'business' },
      { path: '/admin/events', label: 'Eventos', icon: 'event' },
      { path: '/admin/categories', label: 'Categorías', icon: 'category' },
      { path: '/admin/reports', label: 'Informes', icon: 'bar_chart' },
      { path: '/admin/settings', label: 'Configuración', icon: 'settings' }
    ] : [
      { path: '/organizer/overview', label: 'Dashboard', icon: 'dashboard' },
      { path: '/organizer/events', label: 'Mis Eventos', icon: 'event' },
      { path: '/organizer/sales', label: 'Ventas', icon: 'payments' },
      { path: '/organizer/attendees', label: 'Asistentes', icon: 'people' },
      { path: '/organizer/settings', label: 'Configuración', icon: 'settings' }
    ]
  });
});

// Dashboard admin
server.get('/api/v1/dashboard/admin/overview', (req, res) => {
  // Calcular algunos datos de resumen basados en los JSON
  const userCount = data.users.length;
  const newUsers = data.users.filter(u => {
    const createdAt = new Date(u.createdAt.$date);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return createdAt > oneMonthAgo;
  }).length;
  
  const totalEvents = data.events.length;
  const activeEventCount = data.events.filter(e => e.status !== 'cancelled' && e.published).length;
  const pendingEventCount = data.events.filter(e => !e.published).length;
  
  const bookingCount = data.bookings.length;
  let totalRevenue = 0;
  
  data.bookings.forEach(booking => {
    if (booking.paymentStatus === 'paid') {
      totalRevenue += booking.totalPrice || 0;
    }
  });
  
  // Categorías populares
  const categoryCounts = {};
  data.events.forEach(event => {
    if (event.category) {
      categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
    }
  });
  
  const popularCategories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Eventos recientes
  const recentEvents = [...data.events]
    .sort((a, b) => new Date(b.createdAt.$date) - new Date(a.createdAt.$date))
    .slice(0, 5);
  
  res.json({
    success: true,
    data: {
      userCount,
      newUsers,
      totalEvents,
      activeEventCount,
      pendingEventCount,
      bookingCount,
      totalRevenue,
      popularCategories,
      systemHealth: 100, // Valor simulado
      recentEvents,
      revenueByMonth: {
        "Enero": 1200,
        "Febrero": 1800,
        "Marzo": 2400,
        "Abril": 2000,
        "Mayo": 2600,
        "Junio": 3000
      },
      userGrowth: {
        "Enero": 50,
        "Febrero": 70,
        "Marzo": 90,
        "Abril": 110,
        "Mayo": 125,
        "Junio": 150
      }
    }
  });
});

// Usuarios admin
server.get('/api/v1/dashboard/admin/users', (req, res) => {
  let usersData = data.users.map(user => ({
    ...user,
    id: user._id.$oid,
    events: data.events.filter(e => e.user_id && e.user_id.$oid === user._id.$oid).length,
    bookings: data.bookings.filter(b => b.user_id && b.user_id.$oid === user._id.$oid).length,
    status: 'active'
  }));
  
  // Paginación básica
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  // Filtrado básico
  if (req.query.role) {
    usersData = usersData.filter(user => user.role === req.query.role);
  }
  
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    usersData = usersData.filter(user => 
      user.username.toLowerCase().includes(searchTerm) || 
      user.email.toLowerCase().includes(searchTerm) ||
      (user.fullname && user.fullname.toLowerCase().includes(searchTerm))
    );
  }
  
  const paginatedUsers = usersData.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      users: paginatedUsers,
      totalCount: usersData.length,
      page,
      limit
    }
  });
});

// Organizadores admin
server.get('/api/v1/dashboard/admin/organizers', (req, res) => {
  let organizersData = data.users.filter(user => user.role === 'organizer').map(user => ({
    ...user,
    id: user._id.$oid,
    events: data.events.filter(e => e.user_id && e.user_id.$oid === user._id.$oid).length,
    sales: data.bookings.filter(b => {
      const event = data.events.find(e => e._id.$oid === b.event_id.$oid);
      return event && event.user_id && event.user_id.$oid === user._id.$oid;
    }).length,
    revenue: data.bookings.filter(b => {
      const event = data.events.find(e => e._id.$oid === b.event_id.$oid);
      return event && event.user_id && event.user_id.$oid === user._id.$oid && b.paymentStatus === 'paid';
    }).reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    status: 'active'
  }));
  
  // Paginación básica
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  // Filtrado básico
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    organizersData = organizersData.filter(org => 
      org.username.toLowerCase().includes(searchTerm) || 
      org.email.toLowerCase().includes(searchTerm) ||
      (org.fullname && org.fullname.toLowerCase().includes(searchTerm))
    );
  }
  
  const paginatedOrganizers = organizersData.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      users: paginatedOrganizers,
      totalCount: organizersData.length,
      page,
      limit
    }
  });
});

// Ruta por defecto para manejar otras peticiones
server.use((req, res, next) => {
  // Loguear rutas no manejadas para identificar qué endpoints faltan
  console.log(`Ruta no manejada específicamente: ${req.method} ${req.path}`);
  next();
});

// Usar el router de json-server para las rutas no manejadas específicamente
server.use('/api/v1', router);

// Configurar puerto
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server en ejecución en http://localhost:${PORT}`);
});