import React, { useEffect, useState } from 'react';
import VideoSlider from '../ComponentsHome/VideoSlider/VideoSlider.jsx';
import Subtitle from '../ComponentsHome/Subtitle/Subtitle.jsx';
import EventTypes from '../ComponentsHome/EventTypes/EventTypes.jsx';
import SearchBar from '../ComponentsHome/SearchBar/SearchBar.jsx';
import Services from '../ComponentsHome/Services/Services.jsx';
// import FeaturedEventsList from '../ComponentsHome/FeaturedEvents/FeaturedEventsList.jsx'
import Experience from '../ComponentsHome/Experience/Experience.jsx';
import Testimonials from '../ComponentsHome/Testimonials/Testimonials.jsx';

import EventCategories from '../ComponentsHome/EventsCategories/EventCategories.jsx';
import { Box } from '@mui/material';
import axios from 'axios';
import FeaturedEventsList from '../ComponentsHome/FeaturedEvents/FeaturedEventsList.jsx';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen.jsx';
import DebugPanel from '../components/DebugPanel/DebugPanel.jsx';
import { getEvents } from '../utils/apiHelper.js';
const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Usar axios con la configuración global
        const response = await axios.get('/api/v1/users/getUser', {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in headers
          },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  };

    useEffect(() => {
      fetchUser();
     
    }, []);


  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        // Obtener el rol del usuario
        const userRole = localStorage.getItem("role") || 'user';
        console.log(`Obteniendo eventos para rol: ${userRole}`);
        
        // Usar el helper con múltiples rutas alternativas
        const response = await getEvents(userRole);
        console.log('Respuesta final de eventos:', response);
        
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
        
        console.log('Eventos extraídos correctamente:', eventsData.length);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error final al obtener eventos:", error);
        console.error("Detalles del error:", error.response?.data || error.message);
        // En caso de error, inicializar con array vacío
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

   // Render loader or main content
   if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <LoadingScreen />
      </Box>
    );
  }
  return (
    <>
               

     {/* <Header/> */}
    {/* ----------------------------------- VideoSlider section ---------------------------------------- */}

     {(user?.role == 'user' || !user?.role) && 

    <>
    <VideoSlider/>
   
    <Subtitle title={'Eventos que organizamos'}/>
    <EventTypes/>
   
    <SearchBar/>
  

<EventCategories/>

    <Subtitle title={'¿Por qué elegirnos?'}/>
    <Services/>
    </>
     } 
    {/* ------------------x---------------- Services section --------------x---------------------------- */}
    {/* ----------------------------------- Featured-Events section ------------------------------------ */}
    <Box mt={(user?.role && user?.role !== 'user'  ) ? 15: 8}>
    <Subtitle title={'Eventos destacados'}/>
    <FeaturedEventsList events={events} loading={loading} setEvents={setEvents}/>
    </Box>
  
    {/* ------------------x---------------- Featured-Events section --------------x--------------------- */}
    {/* -------------------------------------- Experience section -------------------------------------- */}
    <Experience/>
    {/* ------------------x------------------- Experience section ----------------x--------------------- */}
    {/* -------------------------------------- Testimonials section ------------------------------------- */}
    <Subtitle title={'Testimonios'}/>
    <Testimonials/>
    {/* ---------------------x---------------- Testimonials section ---------------x--------------------- */}
    {/* <Footer/> */}
    
    {/* Panel de depuración */}
    <DebugPanel />
    </>
  );
}

export default Home;
