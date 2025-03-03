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
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");

      // if (!token) {
      //   console.error("No token found, please login.");
      //   setLoading(false);
      //   return;
      // }

      // Determine the appropriate URL based on the user role
      const url =
        userRole === "organizer"
          ? `https://demoticket.inasnapmarketing.ai/api/v1/events/getuserEvent`
          : "https://demoticket.inasnapmarketing.ai/api/v1/events/getAllEvents";
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
