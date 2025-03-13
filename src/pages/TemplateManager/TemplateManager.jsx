import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import { Delete, Edit, Add, Close, Preview, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Template1 from "../../assets/c2.png";
import Template2 from "../../assets/c1.png";
import Template3 from "../../assets/c3.png";

const TemplateManager = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([
    { id: 'template1', name: 'Plantilla 1', image: Template1, isDefault: true, rows: 5, columns: 5, defaultSeats: 25 },
    { id: 'template2', name: 'Plantilla 2', image: Template2, isDefault: true, rows: 6, columns: 6, defaultSeats: 36 },
    { id: 'template3', name: 'Plantilla 3', image: Template3, isDefault: true, rows: 4, columns: 7, defaultSeats: 28 }
  ]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    rows: 5,
    columns: 5,
    templateFile: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load templates from backend and localStorage
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        
        // Usar la variable de entorno para la URL del backend
        const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        
        // Obtener las plantillas del backend
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/v1/templates`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        let backendTemplates = [];
        if (response.data && response.data.data) {
          backendTemplates = response.data.data.map(template => ({
            ...template,
            image: template.image || Template1 // Usar imagen predeterminada si no hay imagen
          }));
        }
        
        // Obtener plantillas personalizadas de localStorage como respaldo
        const customTemplatesJSON = localStorage.getItem('allTemplates');
        const customTemplates = customTemplatesJSON ? JSON.parse(customTemplatesJSON) : [];
        
        // Fusionar plantillas de backend con las predeterminadas y personalizar imagen
        const combinedTemplates = [
          ...templates.filter(t => t.isDefault), // Mantener plantillas predeterminadas
          ...backendTemplates.filter(t => !t.isDefault), // Añadir plantillas del backend
          // Añadir plantillas locales que no estén en el backend
          ...customTemplates.filter(t => 
            !t.isDefault && 
            !backendTemplates.some(bt => bt.id === t.id)
          )
        ];
        
        setTemplates(combinedTemplates);
      } catch (error) {
        console.error('Error al cargar plantillas desde el backend:', error);
        
        // Si falla el backend, cargar solo desde localStorage
        const customTemplatesJSON = localStorage.getItem('allTemplates');
        const customTemplates = customTemplatesJSON ? JSON.parse(customTemplatesJSON) : [];
        
        const combinedTemplates = [
          ...templates.filter(t => t.isDefault),
          ...customTemplates.filter(t => !t.isDefault)
        ];
        
        setTemplates(combinedTemplates);
        
        setSnackbar({
          open: true,
          message: 'Usando datos locales como respaldo.',
          severity: 'info'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadTemplates();
  }, []);

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setNewTemplate({
      name: '',
      rows: 5,
      columns: 5,
      templateFile: null
    });
  };

  const handleEditDialogOpen = (template) => {
    setSelectedTemplate(template);
    setOpenEditDialog(true);
  };
  
  const handleAdvancedEdit = (template) => {
    navigate('/template-editor', { state: { template } });
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedTemplate(null);
  };

  const handleDeleteDialogOpen = (template) => {
    setSelectedTemplate(template);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedTemplate(null);
  };

  const handleNewTemplateChange = (e) => {
    const { name, value } = e.target;
    setNewTemplate(prev => ({
      ...prev,
      [name]: name === 'rows' || name === 'columns' ? parseInt(value, 10) : value
    }));
  };

  const handleFileChange = (e) => {
    setNewTemplate(prev => ({
      ...prev,
      templateFile: e.target.files[0]
    }));
  };

  const handleEditTemplateChange = (e) => {
    const { name, value } = e.target;
    setSelectedTemplate(prev => ({
      ...prev,
      [name]: name === 'rows' || name === 'columns' ? parseInt(value, 10) : value
    }));
  };

  const handleEditFileChange = (e) => {
    setSelectedTemplate(prev => ({
      ...prev,
      templateFile: e.target.files[0],
      image: URL.createObjectURL(e.target.files[0])
    }));
  };

  const handleAddTemplate = async () => {
    setLoading(true);
    
    // Generar una ID única para la plantilla
    const templateId = `template-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // Preparar los datos de la nueva plantilla
    const newTemplateObj = {
      id: templateId,
      name: newTemplate.name,
      rows: newTemplate.rows,
      columns: newTemplate.columns,
      defaultSeats: newTemplate.rows * newTemplate.columns,
      image: newTemplate.templateFile ? URL.createObjectURL(newTemplate.templateFile) : Template1,
      isDefault: false,
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString()
    };
    
    // Usar la variable de entorno para la URL del backend
    const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
    
    try {
      // Enviar al backend
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/v1/templates`, newTemplateObj, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Añadir a la lista local
      setTemplates([...templates, newTemplateObj]);
      
      // Guardar en localStorage como respaldo
      const customTemplatesJSON = localStorage.getItem('allTemplates');
      const customTemplates = customTemplatesJSON ? JSON.parse(customTemplatesJSON) : [];
      customTemplates.push(newTemplateObj);
      localStorage.setItem('allTemplates', JSON.stringify(customTemplates));
      
      setSnackbar({
        open: true,
        message: 'Plantilla añadida correctamente en el servidor',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al guardar la plantilla en el servidor:', error);
      
      // Añadir a la lista local de todos modos
      setTemplates([...templates, newTemplateObj]);
      
      // Guardar en localStorage como respaldo
      const customTemplatesJSON = localStorage.getItem('allTemplates');
      const customTemplates = customTemplatesJSON ? JSON.parse(customTemplatesJSON) : [];
      customTemplates.push(newTemplateObj);
      localStorage.setItem('allTemplates', JSON.stringify(customTemplates));
      
      setSnackbar({
        open: true,
        message: 'No se pudo conectar con el servidor. La plantilla se guardó localmente.',
        severity: 'warning'
      });
    } finally {
      handleAddDialogClose();
      setLoading(false);
    }
  };

  const handleEditTemplate = async () => {
    setLoading(true);
    
    // Actualizar la fecha de modificación
    const updatedTemplate = {
      ...selectedTemplate,
      dateModified: new Date().toISOString()
    };
    
    try {
      // Actualizar la lista local
      const updatedTemplates = templates.map(template => 
        template.id === updatedTemplate.id ? updatedTemplate : template
      );
      setTemplates(updatedTemplates);
      
      // Actualizar en localStorage
      const customTemplatesJSON = localStorage.getItem('allTemplates');
      if (customTemplatesJSON) {
        const customTemplates = JSON.parse(customTemplatesJSON);
        const updatedCustomTemplates = customTemplates.map(template => 
          template.id === updatedTemplate.id ? updatedTemplate : template
        );
        localStorage.setItem('allTemplates', JSON.stringify(updatedCustomTemplates));
      }
      
      setSnackbar({
        open: true,
        message: 'Plantilla actualizada correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al actualizar la plantilla:', error);
      
      setSnackbar({
        open: true,
        message: 'Error al actualizar la plantilla',
        severity: 'error'
      });
    } finally {
      handleEditDialogClose();
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async () => {
    // No permitir eliminar plantillas predeterminadas
    if (selectedTemplate.isDefault) {
      setSnackbar({
        open: true,
        message: 'No se pueden eliminar las plantillas predeterminadas',
        severity: 'error'
      });
      handleDeleteDialogClose();
      return;
    }
    
    setLoading(true);
    
    try {
      // Eliminar de localStorage
      const customTemplatesJSON = localStorage.getItem('allTemplates');
      if (customTemplatesJSON) {
        const customTemplates = JSON.parse(customTemplatesJSON);
        const updatedCustomTemplates = customTemplates.filter(t => t.id !== selectedTemplate.id);
        localStorage.setItem('allTemplates', JSON.stringify(updatedCustomTemplates));
      }
      
      // Actualizar estado local
      const updatedTemplates = templates.filter(template => template.id !== selectedTemplate.id);
      setTemplates(updatedTemplates);
      
      setSnackbar({
        open: true,
        message: 'Plantilla eliminada correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al eliminar plantilla:', error);
      
      setSnackbar({
        open: true,
        message: 'Error al eliminar la plantilla',
        severity: 'error'
      });
    } finally {
      handleDeleteDialogClose();
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ mr: 2 }}
          aria-label="volver"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Gestor de Plantillas
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Información
        </Typography>
        <Typography variant="body1" paragraph>
          Las plantillas definen la disposición de asientos para los eventos. Puedes crear nuevas plantillas, 
          editar las existentes o eliminar las que ya no necesites.
        </Typography>
        <Typography variant="body1" paragraph>
          • Las plantillas predeterminadas no se pueden eliminar.<br />
          • Al crear una plantilla, defines el número de filas y columnas para la disposición de asientos.<br />
          • Los organizadores de eventos podrán elegir entre estas plantillas al crear un evento.
        </Typography>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button 
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/template-editor')}
          startIcon={<Preview />}
        >
          Crear Plantilla con Editor Avanzado
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddDialogOpen}
        >
          Añadir Plantilla
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card raised>
                <CardMedia
                  component="img"
                  height="180"
                  image={template.image}
                  alt={template.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {template.name}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Filas: {template.rows} | Columnas: {template.columns}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Asientos predeterminados: {template.defaultSeats}
                    </Typography>
                  </Box>
                  {template.isDefault && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'inline-block', 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1 
                      }}
                    >
                      Predeterminada
                    </Typography>
                  )}
                </CardContent>
                <Divider />
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<Edit />} 
                    onClick={() => handleEditDialogOpen(template)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<Preview />} 
                    color="primary"
                    onClick={() => handleAdvancedEdit(template)}
                  >
                    Editor Avanzado
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<Delete />} 
                    color="error"
                    onClick={() => handleDeleteDialogOpen(template)}
                    disabled={template.isDefault}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Template Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Añadir Nueva Plantilla
          <IconButton
            aria-label="close"
            onClick={handleAddDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nombre de la Plantilla"
            type="text"
            fullWidth
            variant="outlined"
            value={newTemplate.name}
            onChange={handleNewTemplateChange}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="rows"
                label="Número de Filas"
                type="number"
                fullWidth
                variant="outlined"
                value={newTemplate.rows}
                onChange={handleNewTemplateChange}
                InputProps={{ inputProps: { min: 1, max: 20 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="columns"
                label="Número de Columnas"
                type="number"
                fullWidth
                variant="outlined"
                value={newTemplate.columns}
                onChange={handleNewTemplateChange}
                InputProps={{ inputProps: { min: 1, max: 20 } }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Imagen de la Plantilla
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 1 }}
            >
              Subir Imagen
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {newTemplate.templateFile && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Archivo seleccionado: {newTemplate.templateFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancelar</Button>
          <Button 
            onClick={handleAddTemplate} 
            variant="contained" 
            disabled={!newTemplate.name}
          >
            Añadir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Editar Plantilla
          <IconButton
            aria-label="close"
            onClick={handleEditDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Nombre de la Plantilla"
                type="text"
                fullWidth
                variant="outlined"
                value={selectedTemplate.name}
                onChange={handleEditTemplateChange}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    name="rows"
                    label="Número de Filas"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={selectedTemplate.rows}
                    onChange={handleEditTemplateChange}
                    InputProps={{ inputProps: { min: 1, max: 20 } }}
                    disabled={selectedTemplate.isDefault}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    name="columns"
                    label="Número de Columnas"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={selectedTemplate.columns}
                    onChange={handleEditTemplateChange}
                    InputProps={{ inputProps: { min: 1, max: 20 } }}
                    disabled={selectedTemplate.isDefault}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Imagen de la Plantilla
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={selectedTemplate.image}
                    alt={selectedTemplate.name}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ mt: 1 }}
                  disabled={selectedTemplate.isDefault}
                >
                  Cambiar Imagen
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleEditFileChange}
                  />
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancelar</Button>
          <Button 
            onClick={handleEditTemplate} 
            variant="contained"
            disabled={!selectedTemplate || !selectedTemplate.name}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la plantilla "{selectedTemplate?.name}"? 
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancelar</Button>
          <Button onClick={handleDeleteTemplate} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TemplateManager;