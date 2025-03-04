// import React from 'react'
// import EventCard from '../EventCard/EventCard'
// import eventData from '../../assetsHome/data/FeaturedEvents.js'
// import './FeaturedEvents.css'

// const FeaturedEventsList = ({events}) => {
//   const userRole = localStorage.getItem('role');
//   return (
//     <div className="featured-event-section">
//     {events?.filter((event) => {
//       if (userRole === "admin") {
//         // Admin can see all events
//         return true;
//       }
//       // Organizers and users can only see events with published: true
//       if (userRole === "organizer" || userRole === "user") {
//         return event.published === true;
//       }
//       return false; // Default case for other roles
//     }).length > 0 ? (
//       events
//         .filter((event) => {
//           if (userRole === "admin") {
//             return true;
//           }
//           if (userRole === "organizer" || userRole === "user") {
//             return event.published === true;
//           }
//           return false;
//         })
//         .map((event) => (
//           <div key={event._id}>
//             <EventCard event={event} />
//           </div>
//         ))
//     ) : (
//       <div style={{  marginTop: "20px", color: "#666" }}>
//         <p style={{textAlign: 'center'}}>No events found.</p>
//       </div>
//     )}
//   </div>
  

//   )
// }

// export default FeaturedEventsList
import React, { useState } from "react";
import EventCard from "../EventCard/EventCard";
import "./FeaturedEvents.css";
import { Tabs, Tab, Box, Modal, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const FeaturedEventsList = ({ events, loading , setEvents}) => {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [selectedTab, setSelectedTab] = useState(0);

  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [updatedEvent, setUpdatedEvent] = useState({});

console.log(updatedEvent, 'updated event')


  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const fetchAllEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/events/getAllEvents`);
      setEvents(response.data.data);
     
    } catch (error) {
      console.error("Error fetching events:", error);
     
    }
  };
  const handlePublish = async (eventId) => {

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/events/publishedEvent`,
        {eventId},  // If you need to send additional data in the body, add it here
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token in the Authorization header
          },
        }
      );
      await fetchAllEvents();
    } catch (error) {
      console.error("Error publishing event:", error);
    }
  };

  const handleFeature = async (eventId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/events/featuredEvent`,
        {eventId},  // If you need to send additional data in the body, add it here
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token in the Authorization header
          },
        }
      );
      await fetchAllEvents(eventId);

    } catch (error) {
      console.error("Error featuring event:", error);
    }
  };


   // Handle Open Modal for Editing
   const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setUpdatedEvent(event);
    setOpen(true);
  };

  // Handle Close Modal
  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

    // Handle Input Change
    const handleChange = (e) => {
      setUpdatedEvent({
        ...updatedEvent,
        [e.target.name]: e.target.value,
      });
    };
    const handleFileChange = (e) => {
      setUpdatedEvent({ ...updatedEvent, photo: e.target.files[0] });
    };
      // Handle Update Event API Call
  const handleUpdateEvent = async () => {
    console.log(updatedEvent)

    const payload = {
      name: updatedEvent?.name,
      // venue: updatedEvent?.venue,
      // address: updatedEvent?.address,
      // desc: updatedEvent?.desc,
      // vipprice: updatedEvent?.vipprice,
      // vipSize: updatedEvent?.vipSize,
      // economySize: updatedEvent?.economySize,
      // economyprice: updatedEvent?.economyprice,
      // currency: updatedEvent?.currency,
      // eventDate: updatedEvent?.eventDate,
      // eventTime: updatedEvent?.eventTime,
      // eventDateSec: updatedEvent?.eventDateSec,
      // eventTimeSec : updatedEvent?.eventTimeSec,
      // category: updatedEvent?.category,
      // ticket: updatedEvent?.ticket,
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/events/updateEvent?id=${selectedEvent._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchAllEvents();
      handleClose();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };
  const handleDelete = async (eventId) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
  
    if (result.isConfirmed) {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/events/deleteEvent?id=${eventId}`,
          {}, // Additional data (if any) can be sent in the body here
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token in the Authorization header
            },
          }
        );
  
        // Show success alert
        Swal.fire({
          title: "Eliminada!",
          text: "El evento se ha eliminado correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
  
        // Refresh the events list
        await fetchAllEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
  
        // Show error alert
        Swal.fire({
          title: "Error!",
          text: "Algo salió mal al eliminar el evento.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };


  const filteredEvents = events?.length > 0 
  ? events.filter((event) => {
      if (userRole === "user") {
        return event.published; // Show only published events for users
      }

      switch (selectedTab) {
        case 1: // Published
          return event.published;
        case 2: // Pending
          return !event.published;
        case 3: // Featured
          return event.featured;
        default: // All
          return true;
      }
    })
  : [];


  return (
    <Box mt={5}>
      {(userRole === "admin" || userRole === "organizer") && (
  <Tabs value={selectedTab} onChange={handleTabChange} centered>
    <Tab label="Toda"   sx={{
         
          "@media (min-width: 1024px)": {
            fontWeight: "bold", // Bold font for laptop screens and above
            fontSize: "18px", // Larger font size for laptop screens,
          
          },
        }}/>
    <Tab label="Publicada"   sx={{
         
          "@media (min-width: 1024px)": {
            fontWeight: "bold", // Bold font for laptop screens and above
            fontSize: "18px", // Larger font size for laptop screens
          },
        }}/>
    <Tab label="Pendiente"   sx={{
          
          "@media (min-width: 1024px)": {
            fontWeight: "bold", // Bold font for laptop screens and above
            fontSize: "18px", // Larger font size for laptop screens
          },
        }}/>
    {userRole === "admin" && <Tab label="Presentada"  sx={{
          
          "@media (min-width: 1024px)": {
            fontWeight: "bold", // Bold font for laptop screens and above
            fontSize: "18px", // Larger font size for laptop screens
          },
        }}/>}
  </Tabs>
)}


      <div className="featured-event-section">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event._id}>
              <EventCard
                event={event}
                onPublish={() => handlePublish(event._id)}
                onFeature={() => handleFeature(event._id)}
                onDelete={() => handleDelete(event._id)}
                onUpdate={() => handleOpenModal(event)}
              />
            </div>
          ))
        ) : (
          <div style={{ marginTop: "20px", color: "#666" }}>
            <p style={{ textAlign: "center" }}>No se encontraron eventos.
            </p>
          </div>
        )}
      </div>

       {/* Update Event Modal */}
       <Modal open={open} onClose={handleClose}>
       <Box
        sx={{
          width: 700,
          maxHeight: "80vh", // Maximum height
          bgcolor: "white",
          borderRadius: 2,
          p: 4,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
        }}
      >          <Typography variant="h6">Editar Evento</Typography>
       {/* Scrollable content */}
       <Box
          sx={{
            maxHeight: "50vh", // Limits height for scrolling
            overflowY: "auto",
            mt: 2,
            p:1
          }}
        >
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            name="name"
            value={updatedEvent.name}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px' }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Evento"
            name="venue"
            value={updatedEvent.venue}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px' }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="DIRECCIÓN"
            name="address"
            value={updatedEvent.address}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px' }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            name="desc"
            value={updatedEvent.desc}
            onChange={handleChange}
            required
            multiline
            rows={4}
            sx={{ fontSize: '16px' }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Precio VIP"
            name="vipPrice"
            type="number"
            value={updatedEvent.vipprice}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px' }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Asientos VIP"
            name="vipSize"
            type="number"
            value={updatedEvent.vipSize}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px' }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Asientos económicos"
            name="economySize"
            type="number"
            value={updatedEvent.economySize}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px' }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Precio económico"
            name="economyPrice"
            type="number"
            value={updatedEvent.economyprice}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px' }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />

<FormControl fullWidth margin="normal">
  <InputLabel style={{ fontSize: '16px' }}>Divisa</InputLabel>
  <Select
    name="currency"
    value={updatedEvent.currency || ''}
    onChange={handleChange}
    style={{ fontSize: '16px' }}
    required
  >
    <MenuItem value="USD">USD</MenuItem>
    <MenuItem value="EUR">EUR</MenuItem>
    {/* <MenuItem value="PKR">PKR</MenuItem> */}
    <MenuItem value="INR">INR</MenuItem>
    <MenuItem value="GBP">GBP</MenuItem>
  </Select>
</FormControl>
          {/* <labe></labe> */}
          <Typography mt={2} sx={{ fontSize: '18px', fontWeight: 600}}>Fecha y hora del evento
          </Typography>
          {/* <TextField
            fullWidth
            margin="normal"
            // label="Event Date & Time"
            name="eventDate"
            type="datetime-local"
            value={updatedEvent.eventDate}
            onChange={handleChange}
            required
          /> */}

<Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Día 1"
            name="eventDate"
            type="datetime-local"
            value={updatedEvent.eventDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true,     sx: { fontSize: "13px", fontWeight: "bold"  }, // Increase font size
          }}

            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Día 2"
            name="eventDate2"
            type="datetime-local"
            value={updatedEvent.eventDate2}
            onChange={handleChange}
            InputLabelProps={{ shrink: true,     sx: { fontSize: "13px", fontWeight: "bold" }, // Increase font size
          }}            required
          />
        </Grid>
      </Grid>


          <FormControl fullWidth margin="normal">
            <Typography variant="body1" sx={{ fontSize: '18px', fontWeight: 600 }}>
            Categoría

            </Typography>
            <Select
              name="category"
              value={updatedEvent.category}
              onChange={handleChange}
              required
            > 
              <MenuItem value="Música">Música</MenuItem>
              <MenuItem value="Deportes">Sports</MenuItem>
              <MenuItem value="Conferencia">Conferencia
              </MenuItem>

              <MenuItem value="Taller">Tecnología</MenuItem>
              <MenuItem value="Teatro">Teatro
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl component="fieldset" margin="normal">
            <Typography variant="body1" sx={{ fontSize: '18px', marginBottom: 1 , fontWeight: 600}}>
            Método de pago de entradas

            </Typography>
            <RadioGroup
              name="paymentMethod"
              value={updatedEvent.paymentMethod}
              onChange={handleChange}
              row
            >
              <FormControlLabel
  value="Online"
  control={<Radio sx={{ transform: 'scale(1.5)' }} />} // Scales the size of the radio button
  label={
    <Typography sx={{ fontSize: '1.25rem' }}>Pago en línea
</Typography> // Increases label size
  }
/>
<FormControlLabel
  value="Walk-in"
  control={<Radio sx={{ transform: 'scale(1.5)' }} />}
  label={
    <Typography sx={{ fontSize: '1.25rem' }}>Pago sin cita previa
</Typography>
  }
/>
            </RadioGroup>
          </FormControl>
        

                   {/* <Button
            variant="contained"
            component="label"
            fullWidth
            margin="normal"
            sx={{background: 'orangered'}}
          >
           + Subir foto de banner

            <input
              type="file"
              accept="image/*" // Restricts selection to image files

              hidden
              onChange={handleFileChange}
            />
          </Button>
          {updatedEvent.photo && ( 
            <Box>
              <Typography variant="body2">
                {updatedEvent.photo.name}
                <Button onClick={() => setFormData({ ...updatedEvent, photo: null })} sx={{color: 'red', fontWeight:'bold'}}>
                Eliminar

                </Button>
              </Typography>
            </Box>
          )} */}
            </Box>
            
        <Button variant="contained" color="primary" onClick={handleUpdateEvent} sx={{ mt: 2 }}>
            Guardar Cambios
          </Button>
        </Box>
      </Modal>


    </Box>
  );
};

export default FeaturedEventsList;