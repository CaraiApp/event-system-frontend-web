import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, CardActions, CardMedia,
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, CircularProgress, Alert, Snackbar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Switch, FormControlLabel,
  Divider, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  PhotoCamera as PhotoCameraIcon,
  Category as CategoryIcon,
  Event as EventIcon,
  Colorize as ColorizeIcon
} from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import axios from 'axios';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#1976d2',
    active: true,
    image: null,
    imageUrl: ''
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No se encontró token de autenticación');
        setLoading(false);
        return;
      }
      
      try {
        // En producción, aquí se realizará la petición real a la API
        // const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        // const response = await axios.get(`${API_BASE_URL}/api/v1/admin/categories`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        
        // Datos de prueba
        setTimeout(() => {
          const mockCategories = [
            {
              id: 'cat1',
              name: 'Música',
              description: 'Conciertos, festivales y todo tipo de eventos musicales',
              icon: '<µ',
              color: '#E91E63',
              active: true,
              imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
              eventCount: 32,
              featured: true,
              createdAt: '2023-01-15T10:30:00'
            },
            {
              id: 'cat2',
              name: 'Deportes',
              description: 'Eventos deportivos, competiciones y actividades físicas',
              icon: '½',
              color: '#2196F3',
              active: true,
              imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
              eventCount: 18,
              featured: true,
              createdAt: '2023-01-15T11:15:00'
            },
            {
              id: 'cat3',
              name: 'Teatro',
              description: 'Obras de teatro, monólogos y espectáculos escénicos',
              icon: '<­',
              color: '#FF9800',
              active: true,
              imageUrl: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d',
              eventCount: 15,
              featured: false,
              createdAt: '2023-01-16T09:45:00'
            },
            {
              id: 'cat4',
              name: 'Conferencias',
              description: 'Charlas, conferencias, talleres y eventos educativos',
              icon: '<¤',
              color: '#4CAF50',
              active: true,
              imageUrl: 'https://images.unsplash.com/photo-1560523159-4a9692d222f9',
              eventCount: 12,
              featured: false,
              createdAt: '2023-01-18T14:20:00'
            },
            {
              id: 'cat5',
              name: 'Arte',
              description: 'Exposiciones, galerías y eventos artísticos',
              icon: '<¨',
              color: '#9C27B0',
              active: true,
              imageUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968',
              eventCount: 9,
              featured: true,
              createdAt: '2023-01-20T16:30:00'
            },
            {
              id: 'cat6',
              name: 'Cine',
              description: 'Proyecciones, festivales de cine y eventos cinematográficos',
              icon: '<¬',
              color: '#795548',
              active: false,
              imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26',
              eventCount: 0,
              featured: false,
              createdAt: '2023-01-25T12:10:00'
            }
          ];
          
          setCategories(mockCategories);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error al cargar las categorías');
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };
  
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewCategory({
      name: '',
      description: '',
      icon: '',
      color: '#1976d2',
      active: true,
      image: null,
      imageUrl: ''
    });
  };
  
  const handleNewCategoryChange = (e) => {
    const { name, value, checked } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: name === 'active' ? checked : value
    }));
  };
  
  const handleColorChange = (color) => {
    if (openEditDialog) {
      setSelectedCategory(prev => ({
        ...prev,
        color: color.hex
      }));
    } else {
      setNewCategory(prev => ({
        ...prev,
        color: color.hex
      }));
    }
  };
  
  const handleOpenColorPicker = () => {
    setOpenColorPicker(true);
  };
  
  const handleCloseColorPicker = () => {
    setOpenColorPicker(false);
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (openEditDialog) {
          setSelectedCategory(prev => ({
            ...prev,
            image: file,
            imageUrl: reader.result
          }));
        } else {
          setNewCategory(prev => ({
            ...prev,
            image: file,
            imageUrl: reader.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddCategory = async () => {
    setLoading(true);
    
    try {
      // En producción, aquí se realizará la petición real a la API
      // const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
      // const formData = new FormData();
      // Object.keys(newCategory).forEach(key => {
      //   if (key === 'image' && newCategory.image) {
      //     formData.append('image', newCategory.image);
      //   } else if (key !== 'imageUrl') {
      //     formData.append(key, newCategory[key]);
      //   }
      // });
      // 
      // const token = localStorage.getItem('token');
      // const response = await axios.post(`${API_BASE_URL}/api/v1/admin/categories`, formData, {
      //   headers: { 
      //     Authorization: `Bearer ${token}`,
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      
      // Simulación de respuesta
      setTimeout(() => {
        const newCategoryObj = {
          id: `cat${categories.length + 1}`,
          name: newCategory.name,
          description: newCategory.description,
          icon: newCategory.icon,
          color: newCategory.color,
          active: newCategory.active,
          imageUrl: newCategory.imageUrl || 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968',
          eventCount: 0,
          featured: false,
          createdAt: new Date().toISOString()
        };
        
        setCategories([...categories, newCategoryObj]);
        setSuccess('Categoría añadida correctamente');
        handleCloseAddDialog();
        
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Error al añadir la categoría');
      setLoading(false);
    }
  };
  
  const handleMenuClick = (event, categoryId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategoryId(categoryId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategoryId(null);
  };
  
  const handleOpenEditDialog = () => {
    const category = categories.find(c => c.id === selectedCategoryId);
    if (category) {
      setSelectedCategory({
        ...category,
        image: null
      });
      setOpenEditDialog(true);
    }
    handleMenuClose();
  };
  
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedCategory(null);
  };
  
  const handleEditCategoryChange = (e) => {
    const { name, value, checked } = e.target;
    setSelectedCategory(prev => ({
      ...prev,
      [name]: name === 'active' ? checked : value
    }));
  };
  
  const handleUpdateCategory = async () => {
    setLoading(true);
    
    try {
      // En producción, aquí se realizará la petición real a la API
      // const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
      // const formData = new FormData();
      // Object.keys(selectedCategory).forEach(key => {
      //   if (key === 'image' && selectedCategory.image) {
      //     formData.append('image', selectedCategory.image);
      //   } else if (key !== 'imageUrl' && key !== 'id') {
      //     formData.append(key, selectedCategory[key]);
      //   }
      // });
      // 
      // const token = localStorage.getItem('token');
      // const response = await axios.put(`${API_BASE_URL}/api/v1/admin/categories/${selectedCategory.id}`, formData, {
      //   headers: { 
      //     Authorization: `Bearer ${token}`,
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      
      // Simulación de respuesta
      setTimeout(() => {
        const updatedCategories = categories.map(category => 
          category.id === selectedCategory.id ? selectedCategory : category
        );
        
        setCategories(updatedCategories);
        setSuccess('Categoría actualizada correctamente');
        handleCloseEditDialog();
        
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Error al actualizar la categoría');
      setLoading(false);
    }
  };
  
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  
  const handleDeleteCategory = async () => {
    setLoading(true);
    
    try {
      // En producción, aquí se realizará la petición real a la API
      // const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
      // const token = localStorage.getItem('token');
      // await axios.delete(`${API_BASE_URL}/api/v1/admin/categories/${selectedCategoryId}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Simulación de respuesta
      setTimeout(() => {
        const updatedCategories = categories.filter(category => category.id !== selectedCategoryId);
        
        setCategories(updatedCategories);
        setSuccess('Categoría eliminada correctamente');
        handleCloseDeleteDialog();
        
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Error al eliminar la categoría');
      setLoading(false);
    }
  };
  
  const handleToggleActive = async () => {
    try {
      const category = categories.find(c => c.id === selectedCategoryId);
      
      // En producción, aquí se realizará la petición real a la API
      // const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
      // const token = localStorage.getItem('token');
      // await axios.patch(`${API_BASE_URL}/api/v1/admin/categories/${selectedCategoryId}/toggle-active`, {
      //   active: !category.active
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Actualizar estado local
      const updatedCategories = categories.map(c => 
        c.id === selectedCategoryId ? { ...c, active: !c.active } : c
      );
      
      setCategories(updatedCategories);
      setSuccess(`Categoría ${category.active ? 'desactivada' : 'activada'} correctamente`);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error toggling category active state:', error);
      setError('Error al cambiar el estado de la categoría');
    }
    
    handleMenuClose();
  };
  
  const handleToggleFeatured = async () => {
    try {
      const category = categories.find(c => c.id === selectedCategoryId);
      
      // En producción, aquí se realizará la petición real a la API
      // const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
      // const token = localStorage.getItem('token');
      // await axios.patch(`${API_BASE_URL}/api/v1/admin/categories/${selectedCategoryId}/toggle-featured`, {
      //   featured: !category.featured
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Actualizar estado local
      const updatedCategories = categories.map(c => 
        c.id === selectedCategoryId ? { ...c, featured: !c.featured } : c
      );
      
      setCategories(updatedCategories);
      setSuccess(`Categoría ${category.featured ? 'quitada de' : 'marcada como'} destacada correctamente`);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error toggling category featured state:', error);
      setError('Error al cambiar el estado de destacado');
    }
    
    handleMenuClose();
  };
  
  if (loading && !categories.length) {
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
          Gestión de Categorías
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Añadir Categoría
        </Button>
      </Box>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={3000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      {/* Resumen de Categorías */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total de Categorías
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {categories.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {categories.filter(c => c.active).length} activas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Categorías Destacadas
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {categories.filter(c => c.featured).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                mostradas en página principal
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
                {categories.find(c => c.name === 'Música')?.eventCount || 0} eventos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Eventos Categorizados
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {categories.reduce((sum, category) => sum + category.eventCount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                en total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Lista de Categorías */}
      <Paper sx={{ mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Categoría</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Destacada</TableCell>
                <TableCell align="center">Eventos</TableCell>
                <TableCell align="center">Fecha Creación</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: category.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          fontSize: '1.2rem'
                        }}
                      >
                        {category.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">{category.name}</Typography>
                        <Box 
                          sx={{ 
                            width: 80, 
                            height: 4, 
                            bgcolor: category.color, 
                            borderRadius: 1, 
                            mt: 0.5 
                          }} 
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {category.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={category.active ? 'Activa' : 'Inactiva'} 
                      color={category.active ? 'success' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    {category.featured ? (
                      <Chip 
                        label="Destacada" 
                        color="primary" 
                        size="small" 
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {category.eventCount}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="more"
                      id={`category-menu-${category.id}`}
                      aria-controls={`category-menu-${category.id}`}
                      aria-haspopup="true"
                      onClick={(e) => handleMenuClick(e, category.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      No se encontraron categorías
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Vista de Categorías */}
      <Typography variant="h6" gutterBottom>
        Vista Previa
      </Typography>
      <Grid container spacing={3}>
        {categories.filter(category => category.active).map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image={category.imageUrl}
                alt={category.name}
              />
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: category.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1,
                      fontSize: '1rem'
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Typography variant="h6" component="div">
                    {category.name}
                  </Typography>
                  {category.featured && (
                    <Chip 
                      label="Destacada" 
                      color="primary" 
                      size="small" 
                      sx={{ ml: 'auto' }} 
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                  {category.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {category.eventCount} eventos
                </Typography>
                <Button size="small" startIcon={<EventIcon />}>
                  Ver Eventos
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {categories.filter(category => category.active).length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                No hay categorías activas
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      {/* Menú de Acciones */}
      <Menu
        id="category-actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenEditDialog}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar Categoría</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleActive}>
          <ListItemIcon>
            {categories.find(c => c.id === selectedCategoryId)?.active ? (
              <VisibilityOffIcon fontSize="small" />
            ) : (
              <VisibilityIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {categories.find(c => c.id === selectedCategoryId)?.active ? 'Desactivar' : 'Activar'} Categoría
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleFeatured}>
          <ListItemIcon>
            <CategoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {categories.find(c => c.id === selectedCategoryId)?.featured ? 'Quitar de Destacados' : 'Destacar Categoría'}
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar Categoría</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Diálogo Añadir Categoría */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        aria-labelledby="add-category-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="add-category-dialog-title">Añadir Nueva Categoría</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Nombre de la categoría"
                name="name"
                value={newCategory.name}
                onChange={handleNewCategoryChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Icono"
                name="icon"
                value={newCategory.icon}
                onChange={handleNewCategoryChange}
                placeholder="Emoji (ej: <µ)"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={newCategory.description}
                onChange={handleNewCategoryChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Color
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: newCategory.color,
                      mr: 2,
                      border: '1px solid rgba(0, 0, 0, 0.12)'
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<ColorizeIcon />}
                    onClick={handleOpenColorPicker}
                    size="small"
                  >
                    Cambiar Color
                  </Button>
                </Box>
                {openColorPicker && (
                  <Box sx={{ position: 'relative', marginTop: 2 }}>
                    <Box
                      sx={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        zIndex: 1
                      }}
                      onClick={handleCloseColorPicker}
                    />
                    <Box sx={{ position: 'absolute', zIndex: 2 }}>
                      <ChromePicker 
                        color={newCategory.color} 
                        onChange={handleColorChange} 
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Imagen
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCameraIcon />}
                    size="small"
                  >
                    Subir Imagen
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {newCategory.imageUrl && (
                    <Box sx={{ mt: 2, width: '100%', maxHeight: 100, overflow: 'hidden', borderRadius: 1 }}>
                      <img 
                        src={newCategory.imageUrl} 
                        alt="Preview" 
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newCategory.active}
                    onChange={handleNewCategoryChange}
                    name="active"
                    color="primary"
                  />
                }
                label="Categoría activa"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancelar</Button>
          <Button 
            onClick={handleAddCategory} 
            variant="contained" 
            color="primary"
            disabled={!newCategory.name || !newCategory.icon || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Añadir'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo Editar Categoría */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        aria-labelledby="edit-category-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        {selectedCategory && (
          <>
            <DialogTitle id="edit-category-dialog-title">Editar Categoría</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Nombre de la categoría"
                    name="name"
                    value={selectedCategory.name}
                    onChange={handleEditCategoryChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Icono"
                    name="icon"
                    value={selectedCategory.icon}
                    onChange={handleEditCategoryChange}
                    placeholder="Emoji (ej: <µ)"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    name="description"
                    value={selectedCategory.description}
                    onChange={handleEditCategoryChange}
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Color
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: selectedCategory.color,
                          mr: 2,
                          border: '1px solid rgba(0, 0, 0, 0.12)'
                        }}
                      />
                      <Button
                        variant="outlined"
                        startIcon={<ColorizeIcon />}
                        onClick={handleOpenColorPicker}
                        size="small"
                      >
                        Cambiar Color
                      </Button>
                    </Box>
                    {openColorPicker && (
                      <Box sx={{ position: 'relative', marginTop: 2 }}>
                        <Box
                          sx={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            zIndex: 1
                          }}
                          onClick={handleCloseColorPicker}
                        />
                        <Box sx={{ position: 'absolute', zIndex: 2 }}>
                          <ChromePicker 
                            color={selectedCategory.color} 
                            onChange={handleColorChange} 
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Imagen
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<PhotoCameraIcon />}
                        size="small"
                      >
                        Cambiar Imagen
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </Button>
                      <Box sx={{ mt: 2, width: '100%', maxHeight: 100, overflow: 'hidden', borderRadius: 1 }}>
                        <img 
                          src={selectedCategory.image ? selectedCategory.imageUrl : selectedCategory.imageUrl} 
                          alt={selectedCategory.name} 
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedCategory.active}
                        onChange={handleEditCategoryChange}
                        name="active"
                        color="primary"
                      />
                    }
                    label="Categoría activa"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedCategory.featured}
                        onChange={handleEditCategoryChange}
                        name="featured"
                        color="primary"
                      />
                    }
                    label="Categoría destacada"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog}>Cancelar</Button>
              <Button 
                onClick={handleUpdateCategory} 
                variant="contained" 
                color="primary"
                disabled={!selectedCategory.name || !selectedCategory.icon || loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Diálogo Eliminar Categoría */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-category-dialog-title"
      >
        <DialogTitle id="delete-category-dialog-title">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar la categoría "
            {categories.find(c => c.id === selectedCategoryId)?.name}"?
          </Typography>
          {(categories.find(c => c.id === selectedCategoryId)?.eventCount || 0) > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Esta categoría tiene {categories.find(c => c.id === selectedCategoryId)?.eventCount} eventos asociados. 
              Al eliminarla, estos eventos quedarán sin categoría.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button 
            onClick={handleDeleteCategory} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoryManagement;