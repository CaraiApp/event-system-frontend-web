import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import PageHeader from '../components/PageHeader';
import adminApi from '../services/api';

// Opciones de iconos para categorías
const CATEGORY_ICONS = [
  'music_note', // música
  'sports_soccer', // deportes
  'theater_comedy', // teatro
  'festival', // festivales
  'record_voice_over', // conferencias
  'palette', // arte
  'local_activity', // actividades
  'movie', // cine
  'restaurant', // gastronomía
  'school', // educación
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'category'
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  // Función para cargar categorías
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getCategories();
      if (response.data && response.data.data) {
        // Asegurar que categories es un array o tiene la propiedad adecuada
        if (response.data.data.categories) {
          // Si tenemos un objeto con propiedad categories
          setCategories(response.data.data.categories);
        } else if (Array.isArray(response.data.data)) {
          // Si directamente es un array
          setCategories(response.data.data);
        } else {
          // Si es otro formato, tratamos como que no hay datos disponibles
          setCategories({ dataNotAvailable: true, error: "Formato de datos no reconocido" });
        }
      } else {
        // Si no hay datos, establecer un objeto con dataNotAvailable
        setCategories({ dataNotAvailable: true });
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategories({ 
        dataNotAvailable: true, 
        error: 'Error al cargar categorías. Por favor, inténtalo de nuevo.' 
      });
      setAlert({
        open: true,
        message: 'Error al cargar categorías. Por favor, inténtalo de nuevo.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name || '',
        icon: category.icon || 'category'
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: '',
        icon: 'category'
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
      if (selectedCategory) {
        // En una implementación real, aquí iría la llamada a la API para actualizar
        // Simulamos una actualización local
        setCategories(prevCategories => 
          prevCategories.map(cat => 
            cat.id === selectedCategory.id ? { ...cat, ...formData } : cat
          )
        );
        
        setAlert({
          open: true,
          message: 'Categoría actualizada correctamente',
          severity: 'success'
        });
      } else {
        // En una implementación real, aquí iría la llamada a la API para crear
        // Simulamos una creación local
        const newCategory = {
          id: `cat-${Date.now()}`,
          ...formData,
          eventCount: 0
        };
        
        setCategories(prev => [...prev, newCategory]);
        
        setAlert({
          open: true,
          message: 'Categoría creada correctamente',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      setAlert({
        open: true,
        message: 'Error al guardar categoría. Por favor, inténtalo de nuevo.',
        severity: 'error'
      });
    }
  };

  const handleOpenDeleteDialog = (category) => {
    setSelectedCategory(category);
    setConfirmDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setConfirmDeleteDialog(false);
  };

  const handleDeleteCategory = () => {
    try {
      // En una implementación real, aquí iría la llamada a la API para eliminar
      // Simulamos una eliminación local
      setCategories(prevCategories => 
        prevCategories.filter(cat => cat.id !== selectedCategory.id)
      );
      
      setAlert({
        open: true,
        message: 'Categoría eliminada correctamente',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      setAlert({
        open: true,
        message: 'Error al eliminar categoría. Por favor, inténtalo de nuevo.',
        severity: 'error'
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  // Renderizar icono basado en el nombre
  const renderIcon = (iconName) => {
    return <CategoryIcon />;
  };

  return (
    <Box>
      <PageHeader 
        title="Gestión de Categorías"
        subtitle="Administra las categorías de eventos disponibles en la plataforma"
        button={{
          label: "Nueva Categoría",
          icon: <AddIcon />,
          onClick: () => handleOpenDialog()
        }}
      />
      
      {loading ? (
        <Typography sx={{ my: 4, textAlign: 'center' }}>Cargando categorías...</Typography>
      ) : categories.dataNotAvailable ? (
        <Alert severity="info" sx={{ mt: 4 }}>
          {categories.error || "No hay categorías disponibles. Se mostrarán cuando se creen categorías en la plataforma."}
        </Alert>
      ) : categories.length > 0 ? (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {categories.map((category) => (
            <Grid item key={category.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {category.name}
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        color: 'primary.main'
                      }}
                    >
                      {renderIcon(category.icon)}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {category.eventCount} {category.eventCount === 1 ? 'evento' : 'eventos'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog(category)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDeleteDialog(category)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography sx={{ my: 4, textAlign: 'center' }}>
          No hay categorías disponibles. Crea una nueva categoría para empezar.
        </Typography>
      )}
      
      {/* Dialog para crear/editar categoría */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCategory ? 'Editar Categoría' : 'Crear Categoría'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Nombre de Categoría"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel id="icon-label">Icono</InputLabel>
              <Select
                labelId="icon-label"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                label="Icono"
              >
                {CATEGORY_ICONS.map((icon) => (
                  <MenuItem key={icon} value={icon}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {renderIcon(icon)}
                      <Typography sx={{ ml: 1 }}>{icon.replace('_', ' ')}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            startIcon={<AddIcon />}
            disabled={!formData.name}
          >
            {selectedCategory ? 'Guardar Cambios' : 'Crear Categoría'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog para confirmar eliminar */}
      <Dialog
        open={confirmDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Eliminar Categoría</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar la categoría "{selectedCategory?.name}"? 
            {selectedCategory?.eventCount > 0 && (
              <Typography sx={{ mt: 1, color: 'error.main' }}>
                Esta categoría tiene {selectedCategory.eventCount} eventos asociados. 
                Al eliminarla, estos eventos quedarán sin categoría.
              </Typography>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteCategory} variant="contained" color="error">
            Eliminar
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

export default CategoryManagement;