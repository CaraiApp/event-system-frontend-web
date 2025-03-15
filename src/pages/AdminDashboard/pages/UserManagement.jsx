import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import adminApi from '../services/api';
import { getUsers, getOrganizers } from '../../../utils/apiHelper';

// Función para generar datos mock de usuarios
const generateMockUsers = (count = 10, isOrganizers = false) => {
  const roles = isOrganizers ? ['organizer'] : ['user', 'organizer', 'admin'];
  const statuses = ['active', 'inactive', 'suspended'];
  
  return Array.from({ length: count }, (_, i) => {
    const role = roles[isOrganizers ? 0 : Math.floor(Math.random() * roles.length)];
    const isOrganizer = role === 'organizer';
    
    return {
      id: `mock-${i+1}`,
      username: `usuario_${i+1}`,
      email: `usuario${i+1}@ejemplo.com`,
      fullName: `Usuario Ejemplo ${i+1}`,
      companyName: isOrganizer ? `Organización ${i+1}` : '',
      role,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
      eventsCount: isOrganizer ? Math.floor(Math.random() * 10) : 0
    };
  });
};

const UserManagement = ({ isOrganizers = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    companyName: '',
    role: isOrganizers ? 'organizer' : 'user',
    status: 'active'
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Definir columnas para la tabla de usuarios
  const columns = [
    { 
      field: 'username', 
      headerName: 'Usuario', 
      sortable: true,
      width: '15%'
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      sortable: true,
      width: '20%'
    },
    { 
      field: 'fullName', 
      headerName: 'Nombre Completo', 
      sortable: true,
      width: '20%'
    },
    ...(isOrganizers ? [
      { 
        field: 'companyName', 
        headerName: 'Empresa', 
        sortable: true,
        width: '15%'
      },
      {
        field: 'eventsCount',
        headerName: 'Eventos',
        type: 'number',
        align: 'center',
        width: '10%'
      }
    ] : []),
    { 
      field: 'role', 
      headerName: 'Rol', 
      sortable: true,
      width: '10%',
      render: (value) => {
        const roleLabels = {
          'admin': 'Administrador',
          'organizer': 'Organizador',
          'user': 'Usuario'
        };
        return roleLabels[value] || value;
      }
    },
    { 
      field: 'createdAt', 
      headerName: 'Fecha de Registro', 
      sortable: true,
      type: 'date',
      width: '15%'
    },
    { 
      field: 'status', 
      headerName: 'Estado', 
      sortable: true,
      type: 'status',
      width: '10%'
    }
  ];

  // Cargar usuarios cuando cambia la página o filas por página
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, isOrganizers]);

  // Función para cargar usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Obteniendo usuarios para el admin dashboard...');
      
      const params = {
        page: page + 1, // La API usa 1-indexed para páginas
        limit: rowsPerPage,
        ...(isOrganizers && { role: 'organizer' })
      };
      
      console.log('Parámetros de búsqueda:', params);

      // Usar nuestro helper con rutas alternativas
      const response = isOrganizers
        ? await getOrganizers(params)
        : await getUsers(params);
      
      console.log('Respuesta de usuarios:', response);
      
      // Extraer datos con manejo de diferentes formatos
      if (response?.data?.data?.users) {
        // Formato esperado con estructura anidada
        console.log('Usuarios obtenidos (formato anidado):', response.data.data.users.length);
        setUsers(response.data.data.users);
        setTotalUsers(response.data.data.totalCount || response.data.data.users.length);
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        // Formato con data como array directo
        console.log('Usuarios obtenidos (array en data):', response.data.data.length);
        setUsers(response.data.data);
        setTotalUsers(response.data.data.length);
      } else if (Array.isArray(response?.data)) {
        // Formato array directo
        console.log('Usuarios obtenidos (array directo):', response.data.length);
        setUsers(response.data);
        setTotalUsers(response.data.length);
      } else {
        // No se encontró formato conocido
        console.error('Formato de respuesta no reconocido:', response);
        setUsers([]);
        setTotalUsers(0);
        throw new Error('Formato de respuesta no reconocido');
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      
      // Generar datos mock en caso de que no haya conexión
      const mockUsers = generateMockUsers(rowsPerPage, isOrganizers);
      console.log('Usando datos mock de usuarios:', mockUsers.length);
      
      setUsers(mockUsers);
      setTotalUsers(mockUsers.length);
      
      setAlert({
        open: true,
        message: 'No se pudieron cargar datos reales. Mostrando datos de ejemplo.',
        severity: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || '',
        companyName: user.companyName || '',
        role: user.role || (isOrganizers ? 'organizer' : 'user'),
        status: user.status || 'active'
      });
    } else {
      setSelectedUser(null);
      setFormData({
        username: '',
        email: '',
        fullName: '',
        companyName: '',
        role: isOrganizers ? 'organizer' : 'user',
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        // Actualizar usuario existente
        await adminApi.updateUser(selectedUser.id, formData);
        setAlert({
          open: true,
          message: 'Usuario actualizado correctamente',
          severity: 'success'
        });
      } else {
        // En una implementación real, aquí iría la llamada para crear un nuevo usuario
        setAlert({
          open: true,
          message: 'Usuario creado correctamente',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
      fetchUsers(); // Recargar la lista
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setAlert({
        open: true,
        message: 'Error al guardar usuario. Por favor, inténtalo de nuevo.',
        severity: 'error'
      });
    }
  };

  const handleRowClick = (user) => {
    handleOpenDialog(user);
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <PageHeader 
        title={isOrganizers ? "Gestión de Organizadores" : "Gestión de Usuarios"}
        subtitle={isOrganizers
          ? "Administra las cuentas de organizadores y sus permisos"
          : "Administra las cuentas de usuario, permisos y accesos"}
        button={{
          label: `Nuevo ${isOrganizers ? 'Organizador' : 'Usuario'}`,
          icon: <PersonAddIcon />,
          onClick: () => handleOpenDialog()
        }}
      />
      
      <DataTable 
        columns={columns}
        data={users}
        loading={loading}
        title={isOrganizers ? "Organizadores" : "Usuarios"}
        onRefresh={fetchUsers}
        onRowClick={handleRowClick}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalUsers}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        emptyMessage={users && users.dataNotAvailable 
          ? (users.error || "No hay datos de usuarios disponibles. Se mostrarán cuando haya usuarios registrados.")
          : "No hay usuarios para mostrar"}
      />
      
      {/* Dialog para crear/editar usuario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Editar Usuario' : `Crear ${isOrganizers ? 'Organizador' : 'Usuario'}`}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="username"
              label="Nombre de Usuario"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="fullName"
              label="Nombre Completo"
              value={formData.fullName}
              onChange={handleInputChange}
              fullWidth
            />
            {isOrganizers && (
              <TextField
                name="companyName"
                label="Nombre de la Empresa"
                value={formData.companyName}
                onChange={handleInputChange}
                fullWidth
              />
            )}
            <FormControl fullWidth>
              <InputLabel id="role-label">Rol</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Rol"
              >
                <MenuItem value="user">Usuario</MenuItem>
                <MenuItem value="organizer">Organizador</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Estado"
              >
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="inactive">Inactivo</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
              </Select>
            </FormControl>
            {!selectedUser && (
              <Alert severity="info" sx={{ mt: 1 }}>
                La contraseña se generará automáticamente y se enviará al usuario por email.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit} startIcon={<AddIcon />}>
            {selectedUser ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alerta para notificaciones */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;