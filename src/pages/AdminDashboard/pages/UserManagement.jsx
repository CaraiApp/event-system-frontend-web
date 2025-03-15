import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import adminApi from '../services/api';
import { useLocation } from 'react-router-dom';

const UserManagement = () => {
  const theme = useTheme();
  const location = useLocation();
  const isOrganizersPage = location.pathname.includes('/organizers');
  
  // Estado para los usuarios
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Estado para la paginación y filtros
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    role: isOrganizersPage ? 'organizer' : '',
    status: '',
    search: ''
  });
  
  // Estado para diálogos
  const [editDialog, setEditDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estado para la acción actual
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Usa la API adecuada dependiendo de si estamos en la página de organizadores o usuarios
        const apiCall = isOrganizersPage ? adminApi.getOrganizers : adminApi.getUsers;
        
        const response = await apiCall({
          page: page + 1, // La API espera que la página comience en 1
          limit: rowsPerPage,
          ...filters
        });
        
        setUsers(response.data.data.users || []);
        setTotalUsers(response.data.data.totalUsers || 0);
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
        setError('Error al cargar la lista de usuarios. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [page, rowsPerPage, filters, isOrganizersPage]);

  // Efecto para actualizar los filtros cuando cambia entre usuarios y organizadores
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      role: isOrganizersPage ? 'organizer' : prev.role
    }));
  }, [isOrganizersPage]);

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejar búsqueda
  const handleSearch = (event) => {
    const { value } = event.target;
    setFilters(prev => ({ ...prev, search: value }));
    setPage(0);
  };

  // Manejar cambio de filtros
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0);
  };

  // Manejar clic en editar usuario
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditDialog(true);
  };

  // Manejar clic en eliminar usuario
  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setConfirmDialog(true);
  };

  // Guardar cambios del usuario
  const handleSaveUser = async () => {
    try {
      setActionLoading(true);
      setActionError(null);
      
      await adminApi.updateUser(currentUser.id, {
        role: currentUser.role,
        status: currentUser.status,
        fullname: currentUser.fullname,
        phoneNumber: currentUser.phoneNumber,
        companyName: currentUser.company
      });
      
      setActionSuccess('Usuario actualizado correctamente');
      setEditDialog(false);
      
      // Recargar la lista de usuarios
      const apiCall = isOrganizersPage ? adminApi.getOrganizers : adminApi.getUsers;
      const response = await apiCall({
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      });
      
      setUsers(response.data.data.users || []);
      
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      setActionError('Error al actualizar el usuario. Por favor, inténtalo de nuevo.');
    } finally {
      setActionLoading(false);
    }
  };

  // Confirmar eliminación de usuario
  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      setActionError(null);
      
      await adminApi.deleteUser(currentUser.id);
      
      setActionSuccess('Usuario eliminado correctamente');
      setConfirmDialog(false);
      
      // Recargar la lista de usuarios
      const apiCall = isOrganizersPage ? adminApi.getOrganizers : adminApi.getUsers;
      const response = await apiCall({
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      });
      
      setUsers(response.data.data.users || []);
      setTotalUsers(response.data.data.totalUsers || 0);
      
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setActionError('Error al eliminar el usuario. Por favor, inténtalo de nuevo.');
    } finally {
      setActionLoading(false);
    }
  };

  // Limpiar mensajes de éxito o error después de un tiempo
  useEffect(() => {
    if (actionSuccess || actionError) {
      const timer = setTimeout(() => {
        setActionSuccess(null);
        setActionError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [actionSuccess, actionError]);

  // Reiniciar filtros
  const handleResetFilters = () => {
    setFilters({
      role: isOrganizersPage ? 'organizer' : '',
      status: '',
      search: ''
    });
    setPage(0);
  };

  // Definir columnas para la tabla
  const columns = [
    { 
      id: 'username', 
      header: 'Usuario', 
      minWidth: 120 
    },
    { 
      id: 'email', 
      header: 'Email', 
      minWidth: 180 
    },
    { 
      id: 'fullname', 
      header: 'Nombre Completo', 
      minWidth: 150 
    },
    { 
      id: 'role', 
      header: 'Rol', 
      renderCell: (row) => {
        let color;
        switch (row.role) {
          case 'admin':
            color = theme.palette.error.main;
            break;
          case 'organizer':
            color = theme.palette.warning.main;
            break;
          default:
            color = theme.palette.info.main;
        }
        
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'white',
              bgcolor: color,
              py: 0.5,
              px: 1.5,
              borderRadius: 1,
              display: 'inline-block',
              fontWeight: 'medium',
              fontSize: '0.75rem',
              textTransform: 'uppercase'
            }}
          >
            {row.role}
          </Typography>
        );
      }
    },
    { 
      id: 'company', 
      header: 'Empresa', 
      minWidth: 150 
    },
    { 
      id: 'status', 
      header: 'Estado', 
      type: 'status'
    },
    { 
      id: 'createdAt', 
      header: 'Fecha de Registro', 
      type: 'date',
      minWidth: 120
    }
  ];

  const title = isOrganizersPage ? "Gestión de Organizadores" : "Gestión de Usuarios";
  const subtitle = isOrganizersPage 
    ? "Administra los organizadores del sistema. Puedes ver, editar y eliminar organizadores desde aquí."
    : "Administra los usuarios del sistema. Puedes ver, editar y eliminar usuarios desde aquí.";

  return (
    <Box>
      <PageHeader 
        title={title} 
        subtitle={subtitle}
        action={true}
        actionText={isOrganizersPage ? "Nuevo Organizador" : "Nuevo Usuario"}
        actionIcon={<PersonAddIcon />}
        onActionClick={() => alert('Esta funcionalidad aún no está implementada')}
      />
      
      {/* Alertas de acción */}
      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {actionSuccess}
        </Alert>
      )}
      
      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      )}
      
      {/* Filtros y búsqueda */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre, correo, empresa..."
                value={filters.search}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={8}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  size="small"
                >
                  Filtros
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleResetFilters}
                  size="small"
                  disabled={!(filters.status || filters.search || (!isOrganizersPage && filters.role))}
                >
                  Reiniciar
                </Button>
              </Box>
            </Grid>
            
            {showFilters && (
              <>
                {!isOrganizersPage && (
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Rol</InputLabel>
                      <Select
                        name="role"
                        value={filters.role}
                        onChange={handleFilterChange}
                        label="Rol"
                      >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="admin">Administrador</MenuItem>
                        <MenuItem value="organizer">Organizador</MenuItem>
                        <MenuItem value="user">Usuario</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Estado</InputLabel>
                    <Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      label="Estado"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="active">Activo</MenuItem>
                      <MenuItem value="inactive">Inactivo</MenuItem>
                      <MenuItem value="pending">Pendiente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
      
      {/* Tabla de usuarios */}
      <DataTable
        columns={columns}
        data={users}
        totalCount={totalUsers}
        page={page}
        rowsPerPage={rowsPerPage}
        loading={loading}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleEdit={handleEditUser}
        handleDelete={handleDeleteUser}
        handleView={handleEditUser}
        title={isOrganizersPage ? "Organizadores del Sistema" : "Usuarios del Sistema"}
      />
      
      {/* Diálogo de edición de usuario */}
      <Dialog 
        open={editDialog} 
        onClose={() => setEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isOrganizersPage ? "Editar Organizador" : "Editar Usuario"}
        </DialogTitle>
        <DialogContent>
          {currentUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre de Usuario"
                  value={currentUser.username}
                  fullWidth
                  disabled
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={currentUser.email}
                  fullWidth
                  disabled
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Nombre Completo"
                  value={currentUser.fullname || ''}
                  onChange={(e) => setCurrentUser({...currentUser, fullname: e.target.value})}
                  fullWidth
                />
              </Grid>
              
              {!isOrganizersPage && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Rol</InputLabel>
                    <Select
                      value={currentUser.role}
                      onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                      label="Rol"
                    >
                      <MenuItem value="admin">Administrador</MenuItem>
                      <MenuItem value="organizer">Organizador</MenuItem>
                      <MenuItem value="user">Usuario</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={currentUser.status || 'active'}
                    onChange={(e) => setCurrentUser({...currentUser, status: e.target.value})}
                    label="Estado"
                  >
                    <MenuItem value="active">Activo</MenuItem>
                    <MenuItem value="inactive">Inactivo</MenuItem>
                    <MenuItem value="pending">Pendiente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Teléfono"
                  value={currentUser.phoneNumber || ''}
                  onChange={(e) => setCurrentUser({...currentUser, phoneNumber: e.target.value})}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Empresa"
                  value={currentUser.company || ''}
                  onChange={(e) => setCurrentUser({...currentUser, company: e.target.value})}
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)} disabled={actionLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveUser} 
            variant="contained" 
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            {actionLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDialog
        open={confirmDialog}
        title={isOrganizersPage ? "Eliminar Organizador" : "Eliminar Usuario"}
        message={`¿Estás seguro de que deseas eliminar ${isOrganizersPage ? 'al organizador' : 'al usuario'} ${currentUser?.username}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog(false)}
        confirmColor="error"
        loading={actionLoading}
      />
    </Box>
  );
};

export default UserManagement;