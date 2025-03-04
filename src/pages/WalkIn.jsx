import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import FeaturedEventsList from "../ComponentsHome/FeaturedEvents/FeaturedEventsList";
import axios from "axios";
import EventCard from "../ComponentsHome/EventCard/EventCard";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";


const WalkIn = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllEvents = async () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");

      // if (!token) {
      //   console.error("No token found, please login.");
      //   setLoading(false);
      //   return;
      // }

      // Determine the appropriate URL based on the user role
      const url =
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/events/walk-in`;
      try {
        const response = await axios.get(url , {
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
    <Box>
            

      {/* Hero Section */}
      

      {/* Add Margin to Push the FeaturedEventsList Section Down */}
      <Box sx={{ marginTop: 15 }}>
      <h3 style={{textAlign: 'center', color: 'black', fontSize: 30, fontWeight:'bold'}}>Eventos sin cita previa</h3>
        {/* <FeaturedEventsList events={events} loading={loading} setEvents={setEvents}/> */}
        <div className="featured-event-section">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id}>
              <EventCard
                event={event}
               
              />
            </div>
          ))
        ) : (
          <div style={{ marginTop: "20px", color: "#666" }}>
            <p style={{ textAlign: "center" }}>No se encontraron eventos sin cita previa.</p>
          </div>
        )}
      </div>
      </Box>
    </Box>
  );
};

export default WalkIn;
