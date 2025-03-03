// Curve Template 1 Organizer

import React, { useState } from "react";
import { Box, Button, styled, Typography, IconButton } from "@mui/material";
import { EventSeat } from "@mui/icons-material";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const SeatMapModal = ({formData, gallery, template}) => {
   
const navigate = useNavigate();
      const economySize = Number(formData.economySize);
    const vipSeatsCount = Number(formData.vipSize); // Total VIP seats
    const economySeatsCount = economySize; // Total Economy seats
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const generateSeats = (prefix, count) =>
    Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`).filter(Boolean);

  // Combined seats array: VIP seats first, then Economy seats
  const [seats, setSeats] = useState([
    ...generateSeats("VIP", vipSeatsCount),
    ...generateSeats("E", economySeatsCount),
  ]);
  const [draggedSeat, setDraggedSeat] = useState(null);

  const handleDragStart = (seat) => {
    setDraggedSeat(seat);
  };

  const handleDrop = (targetSeat) => {
    if (!draggedSeat || !targetSeat || draggedSeat === targetSeat) return;

    setSeats((prev) => {
      const updatedSeats = [...prev];
      const draggedIndex = updatedSeats.indexOf(draggedSeat);
      const targetIndex = updatedSeats.indexOf(targetSeat);

      // Swap the seats
      [updatedSeats[draggedIndex], updatedSeats[targetIndex]] = [
        updatedSeats[targetIndex],
        updatedSeats[draggedIndex],
      ];

      return updatedSeats;
    });

    setDraggedSeat(null); // Reset dragged seat
  };

  const handleSaveSeats = async () => {
  //   console.log("Saving seats...", template);
  //   console.log("Seats:", formData.vipSize,  console.log(JSON.stringify(seats))

  // );


  // //       const formDataPayload = new FormData();
  
  // //   // Append other form data
  // //   formDataPayload.append("name", formData.name);
  // //   formDataPayload.append("template", template);
  // //   formDataPayload.append("venue", formData.venue);
  // //   formDataPayload.append("address", formData.address);
  // //   formDataPayload.append("desc", formData.desc);
  // //   formDataPayload.append("vipprice", formData.vipPrice);
  // //   formDataPayload.append("vipSize", formData.vipSize);
  // //   formDataPayload.append("economySize", formData.economySize);
  // //   formDataPayload.append("economyprice", formData.economyPrice);
  // //   formDataPayload.append("currency", formData.currency);
  // //   formDataPayload.append("ticket", formData.paymentMethod);
  // //   formDataPayload.append("category", formData.category);
  // //   formDataPayload.append("photo", formData.photo); // Assuming `photo` is a file (Blob or File)
  // //   formDataPayload.append("eventDate", formData.eventDate); // Assuming eventDate is a string
  // //   formDataPayload.append("eventTime", formData.eventDate); // Combining event date and time
  // //   formDataPayload.append("eventDateSec", formData.eventDate2); // Assuming eventDate is a string
  // //   formDataPayload.append("eventTimeSec", formData.eventDate2); // Combining event date and time
  // //   formDataPayload.append("finalSeats", seats); // Combining event date and time

  // //   // Append gallery files as binary
  // //   gallery.forEach((item, index) => {
  // //     if (item.file) {
  // //       formDataPayload.append(`gallery[${index}]`, item.file);
  // //     }
  // //   });
  // //  const token = localStorage.getItem('token'); // Replace this with your actual token
  // //  setIsLoading(true); // Set loading state to true when request starts
  // //   try {
  // //     // Make the API request using Axios
  // //     const response = await axios.post('https://demoticket.inasnapmarketing.ai/api/v1/events/createEvent', formDataPayload, {
  // //       headers: {
  // //         'Content-Type': 'multipart/form-data', // Adjust header for FormData
  // //         'Authorization': `Bearer ${token}`,   // Add the token to the Authorization header
  // //       },
  // //     });
  
  // //     // Check if the response status is 201 (Created)
  // //     if (response.status === 201) {
  // //       console.log("Event created successfully:", response.data);
  // //       localStorage.removeItem('eventForm');

  // //       navigate("/events");

  // //       // Optionally, handle any further logic after success, e.g., navigate or show a success message
  // //     } else {
  // //       console.log("Unexpected response status:", response.status);
  // //     }
  // //   } catch (err) {
  // //     console.error('Error creating event:', err);
  // //     // Optionally, handle specific error cases, e.g., if err.response is defined
  // //     if (err.response && err.response.status) {
  // //       console.error(`API returned error status: ${err.response.status}`);
  // //     }
  // //   } finally {
  // //     setIsLoading(false); // Set loading state to true when request starts

  // //   }
  console.log("Saving seats...", template);
  console.log("Seats:", seats);


      const formDataPayload = new FormData();

  // Append other form data
  formDataPayload.append("name", formData.name);
  formDataPayload.append("template", template);
  formDataPayload.append("venue", formData.venue);
  formDataPayload.append("address", formData.address);
  formDataPayload.append("desc", formData.desc);
  formDataPayload.append("vipprice", formData.vipPrice);
  formDataPayload.append("vipSize", formData.vipSize);
  formDataPayload.append("economySize", formData.economySize);
  formDataPayload.append("economyprice", formData.economyPrice);
  formDataPayload.append("currency", formData.currency);
  formDataPayload.append("ticket", formData.paymentMethod);
  formDataPayload.append("category", formData.category);
  formDataPayload.append("photo", formData.photo); // Assuming `photo` is a file (Blob or File)
  formDataPayload.append("eventDate", formData.eventDate); // Assuming eventDate is a string
  formDataPayload.append("eventTime", formData.eventDate); // Combining event date and time
  formDataPayload.append("eventDateSec", formData.eventDate2); // Assuming eventDate is a string
  formDataPayload.append("eventTimeSec", formData.eventDate2); // Combining event date and time
  formDataPayload.append("finalSeats", seats); // Combining event date and time

  // Append gallery files as binary
  gallery.forEach((item, index) => {
    if (item.file) {
      formDataPayload.append(`gallery[${index}]`, item.file);
    }
  });
 const token = localStorage.getItem('token'); // Replace this with your actual token
 setIsLoading(true); // Set loading state to true when request starts
  try {
    // Make the API request using Axios
    const response = await axios.post('https://demoticket.inasnapmarketing.ai/api/v1/events/createEvent', formDataPayload, {
      headers: {
        'Content-Type': 'multipart/form-data', // Adjust header for FormData
        'Authorization': `Bearer ${token}`,   // Add the token to the Authorization header
      },
    });

    // Check if the response status is 201 (Created)
    if (response.status === 201) {
      console.log("Event created successfully:", response.data);
       localStorage.removeItem('eventForm');
       navigate("/events");

      // Optionally, handle any further logic after success, e.g., navigate or show a success message
    } else {
      console.log("Unexpected response status:", response.status);
    }
  } catch (err) {
    console.error('Error creating event:', err);
    // Optionally, handle specific error cases, e.g., if err.response is defined
    if (err.response && err.response.status) {
      console.error(`API returned error status: ${err.response.status}`);
    }
  } finally {
    setIsLoading(false); // Set loading state to true when request starts

  }
  };

  const renderSeats = (seatsToRender, style) => (
    <Box sx={{ ...style, display: "grid", gap: "5px" }}>
      {seatsToRender.map((seat) => (
        <Button
          key={seat}
          draggable
          onDragStart={() => handleDragStart(seat)}
          onDragOver={(e) => e.preventDefault()} // Allow dropping
          onDrop={() => handleDrop(seat)}
          sx={{
            // width: "20px",
            // height: "20px",
            backgroundColor: seat.startsWith("VIP") ? "#ff0e0e" : "#3960ba",
            color: "white",
            border: "1px solid black",
            borderTopRightRadius: "50%",
            fontSize: "10px",
          
          }}
        >
         <EventSeat />{seat}
        </Button>
      ))}
    </Box>
// 

  );

  // Split seats into sections
  const vipSeats = seats.slice(0, vipSeatsCount); // Middle VIP seats
  const economySeatsLeft = seats.slice(
    vipSeatsCount,
    vipSeatsCount + Math.ceil(economySeatsCount / 2)
  ); // Left Economy seats
  const economySeatsRight = seats.slice(
    vipSeatsCount + Math.ceil(economySeatsCount / 2)
  ); // Right Economy seats

    const MarqueeBox = styled("div")({
    // backgroundColor: "#f5f5f5",
    cursor: 'pointer',
    textAlign: 'center',
    color: "yellow",
    // padding: "2px 16px",
    borderRadius: "8px",
    // whiteSpace: "nowrap",
    // overflow: "hidden",
    // position: "relative",
    fontSize: "14px",
    marginBottom: 2,
    // fontWeight: "bold",
    // marginBottom: "16px",
    // fontFamily: 'cursive',
    // "&::after": {
    //   content: '""',
    //   position: "absolute",
    //   top: 0,
    //   right: 0,
    //   width: "100%",
    //   height: "100%",
    //   animation: "marquee 5s linear infinite",
    //   background: "linear-gradient(to right, rgba(245, 245, 245, 0), rgba(245, 245, 245, 1))",
    // },
    // "@keyframes marquee": {
    //   from: { transform: "translateX(100%)" },
    //   to: { transform: "translateX(-100%)" },
    // },
  });

  return (


    <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100vw",
      height: "100vh",
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "white",
      borderRadius: 20,
      overflowY: "auto", // Enables vertical scrolling
      padding: 2, // Optional: Adds spacing to prevent content from sticking to edges
    }}
    >
      
   {isLoading && (
            
            <LoadingScreen  />
         
        )}
      {/* <Typography variant="h4" sx={{ marginTop: "20px", marginBottom: "10px" }}>
        Drag and Drop Seat Arrangement
      </Typography> */}

        {/* Back Button */}
        <IconButton
       onClick={() => navigate(-1)} // Moves back in history
        sx={{
          position: "absolute",
          top: "20px",
          left: "40px",
          background: "white",
          color: "black",
          borderRadius: "50%",
          "&:hover": { background: "white", color: "black" },
        }}
      >
        <ArrowBackIcon sx={{fontSize: 18}}/>
      </IconButton>
      <Typography variant="h4" sx={{ marginBottom: "10px" }}>
      Personalizar y organizar asientos

      </Typography>

     <MarqueeBox >Arrastre y suelte para organizar asientos VIP y económicos según sea necesario
     </MarqueeBox>


      {/* Legend */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <Box sx={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
          <Box
            sx={{
              width: "20px",
              height: "20px",
              backgroundColor: "#ff0e0e",
              borderRadius: "50%",
            }}
          />
          <Typography sx={{ marginLeft: "10px" }}>Asiento VIP
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: "20px",
              height: "20px",
              backgroundColor: "#3960ba",
              borderRadius: "50%",
            }}
          />
          <Typography sx={{ marginLeft: "10px" }}>Asiento económico
          </Typography>
        </Box>
      </Box>

      {/* Stage */}
      {/* <Box sx={{ backgroundColor: "white", padding: "10px 50px", marginBottom: "20px" }}>
        <Typography sx={{ color: "black", fontWeight: "bold" }}>Stage</Typography>
      </Box>  */}
      <Box
  sx={{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa9a29gnDVHA3V9PfL9-ciX4M69VSknuiP6w&s')`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    width: "30%", // Adjust width as needed
    minHeight: "100px", // Use minHeight instead of height
    display: "flex",
    marginBottom: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    boxShadow: "0px 4px 20px rgba(255, 255, 0, 0.4)", // Yellowish glow
  }}
>
  <Typography
    sx={{
      color: "white",
      fontWeight: "bold",
      fontSize: "24px",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background for text
      padding: "10px 20px",
      borderRadius: "5px",
    }}
  >
    Escenario

  </Typography>
</Box>
{formData.vipSize && formData.economySize && (
 <Box
 sx={{
   display: "flex",
   justifyContent: "center",
   alignItems: "flex-start",
   gap: "50px",
   width: "100%",
 }}
>
 {/* Economy Left */}
 <Box>
   {renderSeats(economySeatsLeft, {
     gridTemplateColumns: "repeat(5, 1fr)",
   })}
 </Box>
 {/* VIP */}
 <Box>
   {renderSeats(vipSeats, { gridTemplateColumns: "repeat(5, 1fr)" })}
 </Box>
 {/* Economy Right */}
 <Box>
   {renderSeats(economySeatsRight, {
     gridTemplateColumns: "repeat(5, 1fr)",
   })}
 </Box>
</Box>
)}
      {/* Seats */}
     

      {/* Save Button */}
      <Button
  onClick={handleSaveSeats}
  variant="contained"
  sx={{
    marginTop: "20px",
    fontSize:13,
    fontWeight: 'bold',
    padding: "10px 80px", // Adjust padding as needed
    backgroundColor: "green",
    "&:hover": {
      backgroundColor: "darkgreen", // Optional: Change color on hover
    },
  }}
>
Continuar creando

</Button>
    </Box>
  );
};

export default SeatMapModal;




