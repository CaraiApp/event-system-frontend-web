import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import SearchBar from "../ComponentsHome/SearchBarEvents/SearchBar";
import FeaturedEventsList from "../ComponentsHome/FeaturedEvents/FeaturedEventsList";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import { getEvents } from "../utils/apiHelper.js";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
 useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        // Obtener el rol del usuario
        const userRole = localStorage.getItem("role") || 'user';
        console.log(`[Events.jsx] Obteniendo eventos para rol: ${userRole}`);
        
        // Usar el helper con múltiples rutas alternativas
        const response = await getEvents(userRole);
        console.log('[Events.jsx] Respuesta final de eventos:', response);
        
        // Extraer datos con manejo de diferentes formatos
        let eventsData = [];
        if (response?.data?.data) {
          // Formato estándar {success: true, data: [...]}
          eventsData = response.data.data;
        } else if (Array.isArray(response?.data)) {
          // Formato directo [...]
          eventsData = response.data;
        } else if (response?.data) {
          // Cualquier otro formato que contenga datos
          eventsData = Array.isArray(response.data) ? response.data : [response.data];
        }
        
        console.log('[Events.jsx] Eventos extraídos correctamente:', eventsData.length);
        setEvents(eventsData);
      } catch (error) {
        console.error("[Events.jsx] Error final al obtener eventos:", error);
        console.error("[Events.jsx] Detalles del error:", error.response?.data || error.message);
        // En caso de error, inicializar con array vacío
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  return (
    <Box>
                 

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "400px",
          marginTop: 10,
          backgroundImage: 'url("https://cdn.pixabay.com/photo/2016/11/18/17/47/iphone-1836071_960_720.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Search Bar */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            width: "100%",
            maxWidth: "1300px",
            px: 2,
          }}
        >
          <SearchBar setEvents={setEvents} />
        </Box>
      </Box>

      {/* Add Margin to Push the FeaturedEventsList Section Down */}
      <Box sx={{ marginTop: 4 }}>
      {events?.length > 0 ? 
       
        <FeaturedEventsList events={events} loading={loading} setEvents={setEvents}/> 
        : <LoadingScreen />
      }
      </Box>
    </Box>
  );
};

export default Events;
