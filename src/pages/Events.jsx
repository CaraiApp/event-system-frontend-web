import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import SearchBar from "../ComponentsHome/SearchBarEvents/SearchBar";
import FeaturedEventsList from "../ComponentsHome/FeaturedEvents/FeaturedEventsList";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
 useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchAllEvents = async () => {
      const userRole = localStorage.getItem("role");

      // Determine the appropriate endpoint based on the user role
      const endpoint = userRole === "organizer" 
        ? '/api/v1/events/getuserEvent' 
        : '/api/v1/events/getAllEvents';
      
      try {
        console.log(`[Events.jsx] Solicitando eventos (${userRole}) desde: ${endpoint}`);
        const response = await axios.get(endpoint);
        console.log('[Events.jsx] Eventos recibidos:', response.data);
        setEvents(response.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("[Events.jsx] Error fetching events:", error);
        console.error("[Events.jsx] Detalles:", error.response?.data || error.message);
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
