 // Curve Template 1 User
 import React, { useState, useEffect } from "react";
 import { Box, Button, Typography, Paper, Tooltip, IconButton, Snackbar, Alert, CircularProgress } from "@mui/material";
 import { EventSeat, ShoppingCart, AccessTime } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCart } from "../../../CartContext";

 const FinalSeatMapWithDynamicSections = ({event, selectionDate}) => {

  const navigate = useNavigate();
  // Integrar el contexto del carrito
  const { 
    cartItems, 
    addToCart, 
    clearCart, 
    loading, 
    error, 
    timeRemaining, 
    formatTimeRemaining, 
    isSeatReserved, 
    temporarySeats,
    fetchTemporarySeats 
  } = useCart();
  
  // Estado para alertas
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  
  // Final array after drag-and-drop adjustments by the organizer
  const comingSeats = event?.finalSeats;
  const finalSeats = comingSeats[0].split(",");
  const reservedSeats = selectionDate !== "first" ? event?.reservedSeats : event?.reservedSeatsSec;
 
  const originalVipCount = Number(event?.vipSize); // Organizer-defined count of VIP seats
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Inicializar el carrito al cargar el componente
  useEffect(() => {
    if (event?._id) {
      fetchTemporarySeats(event._id);
      
      // Si ya hay asientos en el carrito para este evento, cargarlos como seleccionados
      if (cartItems && cartItems.length > 0) {
        setSelectedSeats(cartItems);
      }
    }
  }, [event]);
 
  const middleSeats = finalSeats.slice(0, originalVipCount); 
  const remainingSeats = finalSeats.slice(originalVipCount); 
   
  // Divide the remaining seats into left and right sections
  const halfRemaining = Math.ceil(remainingSeats.length / 2);
  const leftSeats = remainingSeats.slice(0, halfRemaining); 
  const rightSeats = remainingSeats.slice(halfRemaining); 
  
  // Cerrar alerta
  const handleCloseAlert = () => {
    setAlert({...alert, open: false});
  };
  
  // Verificar si un asiento está disponible
  const isSeatAvailable = (seat) => {
    // Asegurarse de que reservedSeats es un array válido
    const isPermanentlyReserved = Array.isArray(reservedSeats) && reservedSeats.includes(seat);
    const isTempReserved = temporarySeats.includes(seat) && !cartItems.includes(seat);
    
    return !isPermanentlyReserved && !isTempReserved;
  };
   
  const handleSeatClick = (seat) => {
    // No permitir selección de asientos reservados permanentemente
    if (Array.isArray(reservedSeats) && reservedSeats.includes(seat)) {
      setAlert({
        open: true,
        message: 'Este asiento ya está reservado',
        severity: 'warning'
      });
      return;
    }
    
    // Comprobar si está reservado temporalmente por otro usuario
    if (temporarySeats.includes(seat) && !cartItems.includes(seat)) {
      setAlert({
        open: true,
        message: 'Este asiento está temporalmente reservado por otro usuario',
        severity: 'warning'
      });
      return;
    }
 
    // Actualizar selección local
    const newSelectedSeats = selectedSeats.includes(seat)
      ? selectedSeats.filter(s => s !== seat)
      : [...selectedSeats, seat];
    
    setSelectedSeats(newSelectedSeats);
    
    // Si hay selección, actualizar el carrito
    if (newSelectedSeats.length > 0) {
      addToCart(event._id, newSelectedSeats).catch(err => {
        console.error('Error updating cart:', err);
        setAlert({
          open: true,
          message: err.message || 'Error al actualizar el carrito',
          severity: 'error'
        });
      });
    } else if (cartItems.length > 0) {
      // Si la selección quedó vacía, limpiar el carrito
      clearCart(event._id);
    }
  };
 
   const calculateTotalPrice = () => {
     const vipPrice = event?.vipprice;;
     const economyPrice = event?.economyprice;;
 
     return selectedSeats.reduce((total, seat) => {
       const isVip = seat.startsWith("VIP");
       return total + (isVip ? vipPrice : economyPrice);
     }, 0);
   };
 
   // Renderizar los asientos con información de estado actualizada
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
         
         // Verificar diferentes estados de reserva
         const isPermanentlyReserved = Array.isArray(reservedSeats) && reservedSeats.includes(seat);
         const isTempReservedByOthers = temporarySeats.includes(seat) && !cartItems.includes(seat);
         const isTempReservedByMe = cartItems.includes(seat);
         
         // Determinar tooltip según estado
         let tooltipTitle = "Disponible";
         if (isPermanentlyReserved) tooltipTitle = "Asiento reservado";
         else if (isTempReservedByOthers) tooltipTitle = "Temporalmente reservado por otro usuario";
         else if (isTempReservedByMe) tooltipTitle = "En tu carrito";
         else if (isSelected) tooltipTitle = "Seleccionado";
         
         return (
           <Tooltip 
             key={seat}
             title={tooltipTitle}
             componentsProps={{
              tooltip: {
                sx: {
                  fontSize: "1.2rem",
                },
              },
            }}
           >
             <span> {/* Wrapper necesario para Tooltip con botón disabled */}
               <Button
                 onClick={() => handleSeatClick(seat)}
                 disabled={isPermanentlyReserved || isTempReservedByOthers}
                 sx={{
                   backgroundColor: 
                     isPermanentlyReserved 
                       ? "grey" 
                       : isTempReservedByOthers
                         ? "#888888"
                         : isSelected
                           ? "green"
                           : isVip
                             ? "#ff0e0e"
                             : "#3960ba",
                   color: "white",
                   border: "1px solid black",
                   borderTopRightRadius: "50%",
                   fontSize: "10px",
                   opacity: (isPermanentlyReserved || isTempReservedByOthers) ? 0.6 : 1,
                   '&:hover': {
                     backgroundColor: 
                       isPermanentlyReserved 
                         ? "grey" 
                         : isTempReservedByOthers
                           ? "#888888"
                           : isSelected
                             ? "darkgreen"
                             : isVip
                               ? "#cc0000"
                               : "#2a4a8a",
                   }
                 }}
               >
                 {isTempReservedByOthers ? (
                   <AccessTime sx={{ fontSize: 16 }} />
                 ) : (
                   <EventSeat />
                 )}
                 {seat}
               </Button>
             </span>
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

      {/* Alerta para mensajes */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Indicador de carga */}
      {loading && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            bgcolor: 'rgba(0,0,0,0.7)',
            borderRadius: 2,
            p: 3
          }}
        >
          <CircularProgress color="primary" />
          <Typography sx={{ mt: 2, color: 'white' }}>
            Actualizando asientos...
          </Typography>
        </Box>
      )}

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
                        <Typography sx={{ marginLeft: "10px" }}>
                        asiento vip</Typography>
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
                        <Typography sx={{ marginLeft: "10px" }}>asiento económico
                        </Typography>
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
                        <Typography sx={{ marginLeft: "10px" }}>Asiento reservado
                        </Typography>
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
                        <Typography sx={{ marginLeft: "10px" }}>Asiento seleccionado
                        </Typography>
                      </Box>
                    </Box>
 
       {/* Stage */}
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
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
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
         <Typography variant="subtitle1">Asientos seleccionados
         </Typography>
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
         <Typography variant="subtitle1">Precio total
         </Typography>
         <Typography>{event?.currency}{calculateTotalPrice()}</Typography>
       </Paper>

       {/* Tiempo restante (solo si hay asientos en el carrito) */}
       {timeRemaining > 0 && (
         <Paper
           sx={{
             padding: "10px",
             marginTop: "10px",
             backgroundColor: timeRemaining < 60000 ? "rgba(255, 100, 100, 0.2)" : "rgba(144, 238, 144, 0.3)",
             textAlign: "center",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
             gap: 1
           }}
         >
           <AccessTime color={timeRemaining < 60000 ? "error" : "success"} />
           <Typography variant="subtitle1">
             Tiempo restante: <strong>{formatTimeRemaining()}</strong>
           </Typography>
         </Paper>
       )}
 
       <Button
         onClick={handleConfirmBooking}
        //  disabled={selectedSeats.length === 0}
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
 