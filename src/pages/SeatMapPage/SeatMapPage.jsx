
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './SeatMapModal.css';
import Template1 from "../SeatMapFinal/Template1/Template1User";
import Template2 from "../SeatMapFinal/Template2/Template2User";
import Template3 from "../SeatMapFinal/Template3/Template1User";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, CircularProgress, Typography, Button } from "@mui/material";

const SeatMapModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [selectionDate, setSelectionDate] = useState("first");
  
  const params = useParams();
  
  // Intentar obtener evento del estado de navegación primero
  useEffect(() => {
    if (location.state && location.state.event) {
      setEvent(location.state.event);
      if (location.state.selectionDate) {
        setSelectionDate(location.state.selectionDate);
      }
    } else {
      // Si no hay estado, intentar extraer ID de params o query params
      const eventId = params.id || new URLSearchParams(location.search).get('id');
      
      if (eventId) {
        fetchEventData(eventId);
      } else {
        setError("No se pudo obtener la información del evento. Por favor, seleccione un evento desde la página de eventos.");
      }
    }
    
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, [location, params]);
  
  const fetchEventData = async (eventId) => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
      const response = await axios.get(`${API_BASE_URL}/api/v1/events/getsingleEvent?id=${eventId}`);
      
      if (response.data && response.data.data) {
        setEvent(response.data.data);
      } else {
        setError("No se encontró información para este evento.");
      }
    } catch (err) {
      console.error("Error al cargar datos del evento:", err);
      setError("Error al cargar los datos del evento. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  
  // Mostrar pantalla de carga
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3 
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Cargando mapa de asientos...
        </Typography>
      </Box>
    );
  }
  
  // Mostrar mensaje de error
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3 
      }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/events')}
          sx={{ mt: 2 }}
        >
          Ver todos los eventos
        </Button>
      </Box>
    );
  }
  
  // No mostrar nada hasta que tengamos datos del evento
  if (!event) {
    return null;
  }
  
  return (
    <>
      {event?.template === 'template1' ? (
        <Template1 event={event} selectionDate={selectionDate}/>
      ) : event?.template === 'template2' ? (
        <Template2 event={event} selectionDate={selectionDate}/>
      ) : event?.template === 'template3' ? (
        <Template3 event={event} selectionDate={selectionDate}/>
      ) : (
        <Template1 event={event} selectionDate={selectionDate}/>
      )}
    </>
  );
};

export default SeatMapModal;

