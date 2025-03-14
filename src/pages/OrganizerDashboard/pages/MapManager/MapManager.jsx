import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, Grid, Card, CardContent, 
  CardMedia, CardActions, Divider, Paper, CircularProgress, 
  IconButton, TextField
} from '@mui/material';
import { Map, Edit, Delete, Preview, Add, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Template1 from "../../../../assets/c2.png";
import Template2 from "../../../../assets/c1.png";
import Template3 from "../../../../assets/c3.png";
import { COMMON_STRINGS } from "../../../../utils/strings";

const MapManager = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        
        // Usar la variable de entorno para la URL del backend
        const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
        
        // Obtener token para la autenticaci�n
        const token = localStorage.getItem('token');
        
        // Hacer solicitud al backend
        const response = await axios.get(`${API_BASE_URL}/api/v1/templates`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.data) {
          // Procesar los datos recibidos del backend
          const apiTemplates = response.data.data;
          setTemplates(apiTemplates);
        } else {
          // Usar plantillas predeterminadas como respaldo
          setTemplates([
            { id: 'template1', name: 'Plantilla 1', image: Template1, isDefault: true, rows: 5, columns: 5, seats: 25 },
            { id: 'template2', name: 'Plantilla 2', image: Template2, isDefault: true, rows: 6, columns: 6, seats: 36 },
            { id: 'template3', name: 'Plantilla 3', image: Template3, isDefault: true, rows: 4, columns: 7, seats: 28 }
          ]);
        }
      } catch (error) {
        console.error('Error al cargar plantillas:', error);
        
        // Usar plantillas predeterminadas como respaldo en caso de error
        setTemplates([
          { id: 'template1', name: 'Plantilla 1', image: Template1, isDefault: true, rows: 5, columns: 5, seats: 25 },
          { id: 'template2', name: 'Plantilla 2', image: Template2, isDefault: true, rows: 6, columns: 6, seats: 36 },
          { id: 'template3', name: 'Plantilla 3', image: Template3, isDefault: true, rows: 4, columns: 7, seats: 28 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);

  // Filtrar plantillas seg�n t�rmino de b�squeda
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewTemplate = (template) => {
    navigate('/template-editor', { state: { template, readOnly: true } });
  };

  const handleEditTemplate = (template) => {
    navigate('/template-editor', { state: { template } });
  };

  const handleCreateTemplate = () => {
    navigate('/template-manager');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Gesti�n de Mapas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra y personaliza mapas de asientos para tus eventos
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Buscar plantillas..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: 300 }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />} 
            onClick={handleCreateTemplate}
          >
            Crear Nuevo Mapa
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredTemplates.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No se encontraron plantillas
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<Add />} 
                onClick={handleCreateTemplate}
                sx={{ mt: 2 }}
              >
                Crear tu primera plantilla
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredTemplates.map((template) => (
                <Grid item xs={12} sm={6} md={4} key={template.id}>
                  <Card raised sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={template.image || Template1}
                      alt={template.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {template.name}
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Filas: {template.rows} | Columnas: {template.columns}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Asientos: {template.seats || template.rows * template.columns}
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
                        startIcon={<Preview />} 
                        onClick={() => handleViewTemplate(template)}
                      >
                        Ver
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<Edit />} 
                        color="primary"
                        onClick={() => handleEditTemplate(template)}
                      >
                        Editar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default MapManager;