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
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");

      // if (!token) {
      //   console.error("No token found, please login.");
      //   setLoading(false);
      //   return;
      // }

      // Determine the appropriate endpoint based on the user role
      const endpoint = userRole === "organizer" 
        ? '/api/v1/events/getuserEvent'
        : '/api/v1/events/getAllEvents';
        
      try {
        // Usar axios con la configuración global
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        });
        setEvents(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
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
