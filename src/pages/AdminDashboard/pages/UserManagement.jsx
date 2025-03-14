import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Button, Chip, CircularProgress,
  Card, TextField, MenuItem, IconButton, Menu, Avatar, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, Tabs, Tab, Grid, Alert, Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Mail as MailIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  VerifiedUser as VerifiedUserIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import axios from 'axios';

// Componente TabPanel para las pesta�as
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editUser, setEditUser] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    status: '',
    phone: '',
    company: ''
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
    confirmPassword: '',
    phone: '',
    company: ''
  });
  
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No se encontr� token de autenticaci�n');
        setLoading(false);
        return;
      }
      
      try {
        // Llamada a la API real - usando los datos simulados en caso de error
        try {
          const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
          const response = await axios.get(`${API_BASE_URL}/api/v1/dashboard/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              role: filterRole || undefined,
              status: filterStatus || undefined,
              search: searchTerm || undefined,
              page: page + 1,
              limit: rowsPerPage
            }
          });
          setUsers(response.data.data.users);
          setLoading(false);
          return; // Salimos para no mostrar datos de prueba
        } catch (apiError) {
          console.warn('Error al cargar usuarios:', apiError);
          console.warn('Usando datos de prueba como fallback');
          // Continuamos con datos de prueba
        }
        
        // Datos de prueba
        setTimeout(() => {
          const mockUsers = [
            {
              id: 'u1',
              name: 'Laura G�mez',
              email: 'laura@example.com',
              role: 'user',
              status: 'active',
              joinDate: '2023-08-15T10:35:00',
              lastLogin: '2023-08-28T14:20:00',
              avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
              verified: true,
              phone: '+34 612345678',
              orders: 5
            },
            {
              id: 'u2',
              name: 'Miguel Torres',
              email: 'miguel@example.com',
              role: 'organizer',
              status: 'pending',
              joinDate: '2023-08-16T14:22:00',
              lastLogin: '2023-08-27T09:45:00',
              avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
              verified: false,
              phone: '+34 623456789',
              company: 'Eventos MT',
              events: 3
            },
            {
              id: 'u3',
              name: 'Sof�a Navarro',
              email: 'sofia@example.com',
              role: 'user',
              status: 'active',
              joinDate: '2023-08-17T09:15:00',
              lastLogin: '2023-08-26T16:30:00',
              avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
              verified: true,
              phone: '+34 634567890',
              orders: 2
            },
            {
              id: 'u4',
              name: 'David Fern�ndez',
              email: 'david@example.com',
              role: 'organizer',
              status: 'active',
              joinDate: '2023-08-18T16:40:00',
              lastLogin: '2023-08-28T11:10:00',
              avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
              verified: true,
              phone: '+34 645678901',
              company: 'EventosPro',
              events: 8
            },
            {
              id: 'u5',
              name: 'Ana Mart�nez',
              email: 'ana@example.com',
              role: 'admin',
              status: 'active',
              joinDate: '2023-07-10T08:30:00',
              lastLogin: '2023-08-28T15:45:00',
              avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
              verified: true,
              phone: '+34 656789012'
            },
            {
              id: 'u6',
              name: 'Carlos Rodr�guez',
              email: 'carlos@example.com',
              role: 'user',
              status: 'inactive',
              joinDate: '2023-08-01T11:20:00',
              lastLogin: '2023-08-15T10:25:00',
              avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
              verified: true,
              phone: '+34 667890123',
              orders: 1
            },
            {
              id: 'u7',
              name: 'Elena L�pez',
              email: 'elena@example.com',
              role: 'organizer',
              status: 'pending',
              joinDate: '2023-08-20T13:50:00',
              lastLogin: null,
              avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
              verified: false,
              phone: '+34 678901234',
              company: 'Eventos Elena'
            },
            {
              id: 'u8',
              name: 'Javier Garc�a',
              email: 'javier@example.com',
              role: 'user',
              status: 'active',
              joinDate: '2023-08-05T09:25:00',
              lastLogin: '2023-08-27T17:30:00',
              avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
              verified: true,
              phone: '+34 689012345',
              orders: 7
            },
            {
              id: 'u9',
              name: 'Mar�a S�nchez',
              email: 'maria@example.com',
              role: 'user',
              status: 'active',
              joinDate: '2023-07-25T10:15:00',
              lastLogin: '2023-08-28T12:40:00',
              avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
              verified: true,
              phone: '+34 690123456',
              orders: 3
            },
            {
              id: 'u10',
              name: 'Roberto D�az',
              email: 'roberto@example.com',
              role: 'organizer',
              status: 'active',
              joinDate: '2023-08-10T14:30:00',
              lastLogin: '2023-08-28T09:20:00',
              avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
              verified: true,
              phone: '+34 601234567',
              company: 'RD Eventos',
              events: 5
            }
          ];
          
          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error al cargar los usuarios');
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleRoleFilterChange = (event) => {
    setFilterRole(event.target.value);
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
  
  const handleMenuClick = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleRefresh = () => {
    setLoading(true);
    // Aqu� se recargar�an los datos reales
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const handleEditClick = () => {
    const user = users.find(u => u.id === selectedUserId);
    if (user) {
      setEditUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone || '',
        company: user.company || ''
      });
      setOpenEditDialog(true);
    }
    handleMenuClose();
  };
  
  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };
  
  const handleEditSubmit = async () => {
    try {
      // Llamar a la API para actualizar el usuario
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró token de autenticación');
        return;
      }
      
      try {
        const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        await axios.patch(
          `${API_BASE_URL}/api/v1/dashboard/admin/users/${editUser.id}`,
          {
            role: editUser.role,
            status: editUser.status,
            fullname: editUser.name,
            phoneNumber: editUser.phone,
            companyName: editUser.company
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        // Actualizar la lista de usuarios localmente
        const updatedUsers = users.map(user => 
          user.id === editUser.id ? { ...user, ...editUser } : user
        );
        
        setUsers(updatedUsers);
        setSuccess('Usuario actualizado correctamente');
      } catch (apiError) {
        console.warn('Error al actualizar usuario:', apiError);
        // Actualizar de todos modos en modo de prueba
        const updatedUsers = users.map(user => 
          user.id === editUser.id ? { ...user, ...editUser } : user
        );
        setUsers(updatedUsers);
        setSuccess('Usuario actualizado (modo simulado)');
      }
    } catch (error) {
      console.error('Error en actualización de usuario:', error);
      setError('Error al actualizar usuario');
    } finally {
      setOpenEditDialog(false);
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    }
  };
  
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };
  
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      // Llamar a la API para eliminar el usuario
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró token de autenticación');
        return;
      }
      
      try {
        const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        await axios.delete(
          `${API_BASE_URL}/api/v1/dashboard/admin/users/${selectedUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        // Actualizar la lista de usuarios localmente
        const updatedUsers = users.filter(user => user.id !== selectedUserId);
        setUsers(updatedUsers);
        setSuccess('Usuario eliminado correctamente');
      } catch (apiError) {
        console.warn('Error al eliminar usuario:', apiError);
        // Actualizar de todos modos en modo de prueba
        const updatedUsers = users.filter(user => user.id !== selectedUserId);
        setUsers(updatedUsers);
        setSuccess('Usuario eliminado (modo simulado)');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setError('Error al eliminar usuario');
    } finally {
      setOpenDeleteDialog(false);
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    }
  };
  
  const handleSendEmail = () => {
    alert(`Enviar email al usuario con ID: ${selectedUserId}`);
    handleMenuClose();
  };
  
  const handleApproveOrganizer = () => {
    const updatedUsers = users.map(user => 
      user.id === selectedUserId ? { ...user, status: 'active', verified: true } : user
    );
    
    setUsers(updatedUsers);
    setSuccess('Organizador aprobado correctamente');
    handleMenuClose();
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };
  
  const handleRejectOrganizer = () => {
    const updatedUsers = users.map(user => 
      user.id === selectedUserId ? { ...user, status: 'inactive' } : user
    );
    
    setUsers(updatedUsers);
    setSuccess('Organizador rechazado correctamente');
    handleMenuClose();
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };
  
  const handleAddUserClick = () => {
    setOpenAddUserDialog(true);
  };
  
  const handleAddUserDialogClose = () => {
    setOpenAddUserDialog(false);
    setNewUser({
      name: '',
      email: '',
      role: 'user',
      password: '',
      confirmPassword: '',
      phone: '',
      company: ''
    });
  };
  
  const handleNewUserChange = (event) => {
    const { name, value } = event.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddUserSubmit = () => {
    // Aqu� se implementar�a la llamada a la API para crear el usuario
    const newUserObj = {
      id: `u${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      joinDate: new Date().toISOString(),
      lastLogin: null,
      avatar: `https://randomuser.me/api/portraits/${newUser.role === 'admin' ? 'men' : 'women'}/${users.length + 1}.jpg`,
      verified: true,
      phone: newUser.phone,
      company: newUser.company,
      orders: 0,
      events: 0
    };
    
    setUsers([...users, newUserObj]);
    setSuccess('Usuario creado correctamente');
    setOpenAddUserDialog(false);
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };
  
  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    // Filtrar por pesta�a
    if (tabValue === 1 && user.role !== 'user') return false;
    if (tabValue === 2 && user.role !== 'organizer') return false;
    if (tabValue === 3 && user.role !== 'admin') return false;
    
    // Filtrar por rol (dropdown)
    if (filterRole && user.role !== filterRole) return false;
    
    // Filtrar por estado
    if (filterStatus && user.status !== filterStatus) return false;
    
    // Filtrar por t�rmino de b�squeda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.phone && user.phone.toLowerCase().includes(term)) ||
        (user.company && user.company.toLowerCase().includes(term))
      );
    }
    
    return true;
  });
  
  // Paginaci�n
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <Chip label="Activo" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pendiente" color="warning" size="small" />;
      case 'inactive':
        return <Chip label="Inactivo" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  const getRoleChip = (role) => {
    switch (role) {
      case 'admin':
        return <Chip label="Admin" color="primary" size="small" icon={<AdminIcon />} />;
      case 'organizer':
        return <Chip label="Organizador" color="secondary" size="small" icon={<StoreIcon />} />;
      case 'user':
        return <Chip label="Usuario" color="default" size="small" icon={<PersonIcon />} />;
      default:
        return <Chip label={role} size="small" />;
    }
  };
  
  const getVerifiedBadge = (verified) => {
    return verified ? (
      <Tooltip title="Usuario verificado">
        <VerifiedUserIcon color="primary" fontSize="small" />
      </Tooltip>
    ) : null;
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <>
      <Box className="admin-title">
        <Typography variant="h4" component="h1" className="admin-title-text">
          Gesti�n de Usuarios
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddUserClick}
        >
          A�adir Usuario
        </Button>
      </Box>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="user role tabs"
          sx={{ '& .MuiTab-root': { fontWeight: 'medium' } }}
        >
          <Tab label="Todos los Usuarios" />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Usuarios</Typography>
                <Chip 
                  label={users.filter(u => u.role === 'user').length} 
                  size="small"
                  sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Organizadores</Typography>
                <Chip 
                  label={users.filter(u => u.role === 'organizer').length} 
                  size="small"
                  sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Administradores</Typography>
                <Chip 
                  label={users.filter(u => u.role === 'admin').length} 
                  size="small"
                  sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                />
              </Box>
            } 
          />
        </Tabs>
      </Box>
      
      {/* Filtros */}
      <Card sx={{ p: 2, mb: 3, mt: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar por nombre, email, tel�fono..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="role-filter-label">Filtrar por Rol</InputLabel>
              <Select
                labelId="role-filter-label"
                id="role-filter"
                value={filterRole}
                label="Filtrar por Rol"
                onChange={handleRoleFilterChange}
              >
                <MenuItem value="">Todos los roles</MenuItem>
                <MenuItem value="admin">Administradores</MenuItem>
                <MenuItem value="organizer">Organizadores</MenuItem>
                <MenuItem value="user">Usuarios</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Filtrar por Estado</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={filterStatus}
                label="Filtrar por Estado"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="">Todos los estados</MenuItem>
                <MenuItem value="active">Activos</MenuItem>
                <MenuItem value="pending">Pendientes</MenuItem>
                <MenuItem value="inactive">Inactivos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button 
              startIcon={<RefreshIcon />} 
              onClick={handleRefresh}
              variant="outlined"
            >
              Actualizar
            </Button>
          </Grid>
        </Grid>
      </Card>
      
      {/* Tabla de Usuarios */}
      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Tel�fono</TableCell>
                  <TableCell>Fecha de Registro</TableCell>
                  <TableCell>�ltimo Acceso</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={user.avatar} sx={{ mr: 2 }} />
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {user.name}
                            </Typography>
                            {getVerifiedBadge(user.verified)}
                          </Box>
                          {user.company && (
                            <Typography variant="caption" color="text.secondary">
                              {user.company}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{getRoleChip(user.role)}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>{formatDate(user.joinDate)}</TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell>{getStatusChip(user.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="more"
                        id={`user-menu-${user.id}`}
                        aria-controls={`user-menu-${user.id}`}
                        aria-haspopup="true"
                        onClick={(e) => handleMenuClick(e, user.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">
                        No se encontraron usuarios
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por p�gina:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Tel�fono</TableCell>
                  <TableCell>Fecha de Registro</TableCell>
                  <TableCell>�ltimo Acceso</TableCell>
                  <TableCell>Compras</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={user.avatar} sx={{ mr: 2 }} />
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {user.name}
                            </Typography>
                            {getVerifiedBadge(user.verified)}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>{formatDate(user.joinDate)}</TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell>{user.orders || 0}</TableCell>
                    <TableCell>{getStatusChip(user.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="more"
                        id={`user-menu-${user.id}`}
                        aria-controls={`user-menu-${user.id}`}
                        aria-haspopup="true"
                        onClick={(e) => handleMenuClick(e, user.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">
                        No se encontraron usuarios
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por p�gina:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Organizador</TableCell>
                  <TableCell>Empresa</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Tel�fono</TableCell>
                  <TableCell>Fecha de Registro</TableCell>
                  <TableCell>Eventos</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={user.avatar} sx={{ mr: 2 }} />
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {user.name}
                            </Typography>
                            {getVerifiedBadge(user.verified)}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.company || '-'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>{formatDate(user.joinDate)}</TableCell>
                    <TableCell>{user.events || 0}</TableCell>
                    <TableCell>{getStatusChip(user.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="more"
                        id={`user-menu-${user.id}`}
                        aria-controls={`user-menu-${user.id}`}
                        aria-haspopup="true"
                        onClick={(e) => handleMenuClick(e, user.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">
                        No se encontraron organizadores
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por p�gina:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Administrador</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Tel�fono</TableCell>
                  <TableCell>Fecha de Registro</TableCell>
                  <TableCell>�ltimo Acceso</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={user.avatar} sx={{ mr: 2 }} />
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {user.name}
                            </Typography>
                            {getVerifiedBadge(user.verified)}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>{formatDate(user.joinDate)}</TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell>{getStatusChip(user.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="more"
                        id={`user-menu-${user.id}`}
                        aria-controls={`user-menu-${user.id}`}
                        aria-haspopup="true"
                        onClick={(e) => handleMenuClick(e, user.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">
                        No se encontraron administradores
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por p�gina:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>
      </TabPanel>
      
      {/* Men� de Acciones */}
      <Menu
        id="user-actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar Usuario
        </MenuItem>
        <MenuItem onClick={handleSendEmail}>
          <MailIcon fontSize="small" sx={{ mr: 1 }} />
          Enviar Email
        </MenuItem>
        
        {/* Mostrar opciones espec�ficas para organizadores pendientes */}
        {users.find(u => u.id === selectedUserId)?.role === 'organizer' && 
         users.find(u => u.id === selectedUserId)?.status === 'pending' && (
          <>
            <Divider />
            <MenuItem onClick={handleApproveOrganizer}>
              <CheckIcon fontSize="small" sx={{ mr: 1 }} color="success" />
              Aprobar Organizador
            </MenuItem>
            <MenuItem onClick={handleRejectOrganizer}>
              <CloseIcon fontSize="small" sx={{ mr: 1 }} color="error" />
              Rechazar Organizador
            </MenuItem>
          </>
        )}
        
        <Divider />
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Eliminar Usuario
        </MenuItem>
      </Menu>
      
      {/* Di�logo Editar Usuario */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditDialogClose}
        aria-labelledby="edit-user-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="edit-user-dialog-title">Editar Usuario</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tel�fono"
                name="phone"
                value={editUser.phone}
                onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  value={editUser.role}
                  label="Rol"
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                >
                  <MenuItem value="user">Usuario</MenuItem>
                  <MenuItem value="organizer">Organizador</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {editUser.role === 'organizer' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Empresa"
                  name="company"
                  value={editUser.company}
                  onChange={(e) => setEditUser({ ...editUser, company: e.target.value })}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={editUser.status}
                  label="Estado"
                  onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="pending">Pendiente</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancelar</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Di�logo Confirmar Eliminaci�n */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-user-dialog-title"
      >
        <DialogTitle id="delete-user-dialog-title">
          Confirmar Eliminaci�n
        </DialogTitle>
        <DialogContent>
          <Typography>
            �Est�s seguro de que deseas eliminar este usuario? Esta acci�n no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Di�logo A�adir Usuario */}
      <Dialog
        open={openAddUserDialog}
        onClose={handleAddUserDialogClose}
        aria-labelledby="add-user-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="add-user-dialog-title">A�adir Nuevo Usuario</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={newUser.name}
                onChange={handleNewUserChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleNewUserChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contrase�a"
                name="password"
                type="password"
                value={newUser.password}
                onChange={handleNewUserChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirmar Contrase�a"
                name="confirmPassword"
                type="password"
                value={newUser.confirmPassword}
                onChange={handleNewUserChange}
                required
                error={newUser.password !== newUser.confirmPassword && newUser.confirmPassword !== ''}
                helperText={
                  newUser.password !== newUser.confirmPassword && newUser.confirmPassword !== ''
                    ? 'Las contrase�as no coinciden'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tel�fono"
                name="phone"
                value={newUser.phone}
                onChange={handleNewUserChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  value={newUser.role}
                  label="Rol"
                  onChange={handleNewUserChange}
                >
                  <MenuItem value="user">Usuario</MenuItem>
                  <MenuItem value="organizer">Organizador</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {newUser.role === 'organizer' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Empresa"
                  name="company"
                  value={newUser.company}
                  onChange={handleNewUserChange}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddUserDialogClose}>Cancelar</Button>
          <Button 
            onClick={handleAddUserSubmit} 
            variant="contained" 
            color="primary"
            disabled={
              !newUser.name || 
              !newUser.email || 
              !newUser.password || 
              !newUser.confirmPassword || 
              newUser.password !== newUser.confirmPassword
            }
          >
            A�adir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserManagement;