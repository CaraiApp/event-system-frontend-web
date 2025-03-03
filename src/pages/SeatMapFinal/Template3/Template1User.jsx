 // Curve Template 1 User
 import React, { useState } from "react";
 import { Box, Button, Typography, Paper, Tooltip, IconButton  } from "@mui/material";
 import { EventSeat } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

 const FinalSeatMapWithDynamicSections = ({event, selectionDate}) => {
  //  // Final array after drag-and-drop adjustments by the organizer
  //  const finalSeats = ['VIP1', 'VIP2', 'VIP3', 'VIP4', 'E9', 'E5', 'VIP7', 'VIP8', 'VIP9', 'VIP10', 'VIP11', 'VIP12', 'VIP13', 'VIP14', 'VIP15', 'VIP16', 'VIP17', 'VIP18', 'VIP19', 'VIP20', 'VIP21', 'VIP22', 'VIP23', 'VIP24', 'VIP25', 'VIP26', 'VIP27', 'VIP28', 'VIP29', 'VIP30', 'VIP31', 'VIP32', 'VIP33', 'VIP34', 'VIP35', 'VIP36', 'VIP37', 'VIP38', 'VIP39', 'VIP40', 'VIP41', 'VIP42', 'VIP43', 'VIP44', 'VIP45', 'E1', 'VIP47', 'VIP48', 'VIP49', 'E13', 'VIP46', 'E2', 'E3', 'E4', 'VIP6', 'E6', 'E7', 'E8', 'VIP5', 'E10', 'E11', 'E12', 'VIP50', 'E14', 'E15']
  //  const reservedSeats = ['VIP1', 'VIP2', 'VIP3', 'VIP4', 'E9', 'E5']
  //  const originalVipCount = 50; // Organizer-defined count of VIP seats
 const navigate = useNavigate();
    // Final array after drag-and-drop adjustments by the organizer
    const comingSeats = event?.finalSeats;
    const finalSeats = comingSeats[0].split(",");
    const reservedSeats =selectionDate !== "first" ? event?.reservedSeats : event?.reservedSeatsSec;
    const originalVipCount = Number(event?.vipSize); // Organizer-defined count of VIP seats
    console.log(Number(event?.vipSize), 'sizeofvip')
   const [selectedSeats, setSelectedSeats] = useState([]);
 
   const middleSeats = finalSeats.slice(0, originalVipCount); 
   const remainingSeats = finalSeats.slice(originalVipCount); 
   
   // Divide the remaining seats into left and right sections
   const halfRemaining = Math.ceil(remainingSeats.length / 2);
   const leftSeats = remainingSeats.slice(0, halfRemaining); 
   const rightSeats = remainingSeats.slice(halfRemaining); 
   
   const handleSeatClick = (seat) => {
 
     if (reservedSeats.includes(seat)) return; // Prevent reserved seats from being selected
 
     setSelectedSeats((prev) =>
       prev.includes(seat)
         ? prev.filter((s) => s !== seat)
         : [...prev, seat]
     );
   };
 
   const calculateTotalPrice = () => {
    const vipPrice = event?.vipprice;;
     const economyPrice = event?.economyprice;;
 
     return selectedSeats.reduce((total, seat) => {
       const isVip = seat.startsWith("VIP");
       return total + (isVip ? vipPrice : economyPrice);
     }, 0);
   };
 
   const renderSeats = (seats, gridTemplateColumns) => (
     <Box
       sx={{
         display: "grid",
         gridTemplateColumns,
         gap: "5px",
         justifyItems: "center",
       }}
     >
       {seats.map((seat) => {
         const isVip = seat.startsWith("VIP");
         const isSelected = selectedSeats.includes(seat);
         const isReserved = reservedSeats.includes(seat);
         return (
           <Tooltip title={isReserved ? "Reserved" : isSelected ? "Selected" : "Available"}
           componentsProps={{
            tooltip: {
              sx: {
                fontSize: "1.2rem", // Adjust the font size as needed,
              },
            },
          }}>
 
           <Box
             key={seat}
             onClick={() => handleSeatClick(seat)}
             sx={{
             //   width: "20px",
             //   height: "20px",
              //  padding: "10px",
               backgroundColor: isReserved ? 
               "grey" : isSelected
                 ? "green"
                 : isVip
                 ? "#ff0e0e"
                 : "#3960ba" ,
               color: "white",
               border: "1px solid black",
              //  borderTopRightRadius: "50%",
               fontSize: "8px",
               borderRadius: '50%',
               padding:0.4
              
              
             }}
             // startIcon={}
             
           >
            <EventSeat />
 
            
           </Box>
           </Tooltip>
           
         );
       })}
     </Box>
   );
      const handleConfirmBooking = () => {
         if (selectedSeats.length === 0) {
           Swal.fire({
             icon: "warning",
             title: " No hay asientos seleccionados",
             text: "Seleccione los asientos antes de continuar con la reserva.",
             confirmButtonText: "DE ACUERDO",
             customClass: {
               confirmButton: "custom-swal-button", // Apply custom class
                 confirmButtonColor: "#d33",
             },
           });
           return; // Stop further execution if no seats are selected
         }
         const payload = {
           event_id: event?._id, // Assuming event object contains _id for the event
           eventName: event?.name,
           // bookingDate: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
           bookingDate: selectionDate !== "first" ? event?.eventDate : event?.eventDateSec, // Current date in YYYY-MM-DD format
     
           guestSize: selectedSeats.length, // Length of selected seats
           seatNumbers: selectedSeats, // Selected seats
           totalPrice: calculateTotalPrice(), // Total price calculated
           currency: event?.currency
       
         };
         console.log(payload)
         navigate("/event/ordersummary", { state: { payload } });
         // alert(calculateTotalPrice())
        }
    
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
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.pexels.com/photos/22737901/pexels-photo-22737901/free-photo-of-birds-eye-view-on-a-city-of-manchester-stadium.jpeg?auto=compress&cs=tinysrgb&w=600')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "white",
      borderRadius: 30,
      overflowY: "auto", // Enables vertical scrolling
      padding: 2, // Optional: Adds spacing to prevent content from sticking to edges
    }}
     >
       <IconButton
       onClick={() => navigate(-1)} // Moves back in history
        sx={{
          position: "absolute",
          top: "20px",
          left: "70px",
          background: "white",
          color: "black",
          borderRadius: "50%",
          "&:hover": { background: "white", color: "black" },
        }}
      >
        <ArrowBackIcon sx={{fontSize: 18}}/>
      </IconButton>
       <Typography variant="h4" sx={{ marginTop: "20px", marginBottom: "10px" }}>
       Seleccione sus asientos
       </Typography>
      
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
                     <Typography sx={{ marginLeft: "10px" }}>asiento vip</Typography>
                   </Box>
                   <Box sx={{ display: "flex", alignItems: "center",  marginRight: "20px" }}>
                     <Box
                       sx={{
                         width: "20px",
                         height: "20px",
                         backgroundColor: "#3960ba",
                         borderRadius: "50%",
                       }}
                     />
                     <Typography sx={{ marginLeft: "10px" }}>asiento económico</Typography>
                   </Box>
                   <Box sx={{ display: "flex", alignItems: "center" ,  marginRight: "20px"}}>
                     <Box
                       sx={{
                         width: "20px",
                         height: "20px",
                         backgroundColor: "grey",
                         borderRadius: "50%",
                       }}
                     />
                     <Typography sx={{ marginLeft: "10px" }}>Asiento reservado</Typography>
                   </Box>
                   <Box sx={{ display: "flex", alignItems: "center" }}>
                     <Box
                       sx={{
                         width: "20px",
                         height: "20px",
                         backgroundColor: "green",
                         borderRadius: "50%",
                       }}
                     />
                     <Typography sx={{ marginLeft: "10px" }}>Asiento seleccionado</Typography>
                   </Box>
                 </Box>
 
       {/* Stage */}
        <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz9-QuSeVQBmr3klIM5NxEBfJjbuiaSoKhmQ&s')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          width: "30%", // Adjust width as needed
          minHeight: "100px", // Use minHeight instead of height
          display: "flex",
          marginBottom: 2,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.5)",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background for text
            padding: "10px 20px",
            borderRadius: "5px",
          }}
        >
          columpios

        </Typography>
      </Box>
 
       {/* Seats */}
       <Box
         sx={{
           display: "flex",
           justifyContent: "center",
           alignItems: "flex-start",
           gap: "50px",
           width: "100%",
         }}
       >
         {/* Left Section */}
         <Box>
           {renderSeats(leftSeats, "repeat(5, 1fr)")}
         </Box>
 
         {/* Middle (VIP) Section */}
         <Box>
           {renderSeats(middleSeats, "repeat(5, 1fr)")}
         </Box>
 
         {/* Right Section */}
         <Box>
           {renderSeats(rightSeats, "repeat(5, 1fr)")}
         </Box>
       </Box>
 
       {/* Selected Seats */}
       <Paper
         sx={{
           padding: "10px",
           marginTop: "20px",
           backgroundColor: "rgba(255, 255, 255, 0.8)",
           textAlign: "center",
         }}
       >
         <Typography sx={{fontSize:15}} variant="subtitle2">Asientos seleccionados</Typography>
         <Typography>
           {selectedSeats.length > 0 ? selectedSeats.join(", ") : "No hay asientos seleccionados"}
         </Typography>
       </Paper>
 
       {/* Total Price */}
       <Paper
         sx={{
           padding: "10px",
           marginTop: "10px",
           backgroundColor: "rgba(255, 255, 255, 0.8)",
           textAlign: "center",
         }}
       >
         <Typography variant="subtitle1">Precio total</Typography>
         <Typography>${calculateTotalPrice()}</Typography>
       </Paper>
 
       <Button
         onClick={handleConfirmBooking}
         disabled={selectedSeats.length === 0}
         variant="contained"
         sx={{
          marginTop: "10px",
          fontSize:12,
          fontWeight: 'bold',
          padding: "10px 80px", // Adjust padding as needed
          backgroundColor: "green",
          "&:hover": {
            backgroundColor: "darkgreen", // Optional: Change color on hover
          },
        }}
       >
        Confirmar reserva
       </Button>
     </Box>
   );
 };
 
 export default FinalSeatMapWithDynamicSections;
 