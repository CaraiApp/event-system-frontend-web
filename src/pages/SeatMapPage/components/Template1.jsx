import React, { useState } from 'react';
import { Modal, Box, IconButton, Button, Typography, Paper, } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const SeatMapPage = ({event}) => {
  const location = useLocation();

 const navigate = useNavigate();
  
  // Static data for testing
  const reservedSeats = event?.reservedSeats; // Reserved seats
  const vipPrice = event?.vipprice; // Price for VIP seats
  const economyPrice = event?.economyprice; // Price for Economy seats

  // Number of seats for each section
  const vipSeatsCount =  event?.vipSize; // Total VIP seats
  const economySeatsCount =  event?.economySize; // Total Economy seats
  const seatsPerRow = 10; // Number of seats in a row


    const handleBack = () => {
      // navigate(-1);
      navigate(`/event-detail/${event?._id}`);
    };
  
 
  // Generate seat labels for VIP and Economy sections
  const generateSeats = (prefix, count) => {
    let seats = [];
    for (let i = 1; i <= count; i++) {
      seats.push(`${prefix}${i}`);
    }
    return seats;
  };

  // Generate seat arrays
  const vipSeats = generateSeats("VIP", vipSeatsCount);
  const economySeats = generateSeats("E", economySeatsCount);

  const [selectedSeats, setSelectedSeats] = useState([]); // User-selected seats

  const handleSeatClick = (seatNumber) => {
    if (reservedSeats.includes(seatNumber)) return; // Prevent reserved seats from being selected
    if (selectedSeats.includes(seatNumber)) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      // Select seat
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
      const isVip = seat.startsWith("VIP"); // VIP seat condition
      return total + (isVip ? vipPrice : economyPrice);
    }, 0);
  };
  const totalPricee = calculateTotalPrice();

  const renderSeats = (seats) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 0, // No gap between buttons
        justifyContent: "center",
        width: "fit-content",
        margin: "0 auto",
      
       
      }}
    >
      {seats.map((seat) => {
        const isReserved = reservedSeats.includes(seat);
        const isSelected = selectedSeats.includes(seat);
        const isVip = seat.startsWith("VIP");
        return (
          <Button
            key={seat}
            onClick={() => handleSeatClick(seat)}
            disabled={isReserved}
            sx={{
              width: "30px", // Fixed width
              height: "30px", // Fixed height
              backgroundColor: isReserved
                ? "#b0b0b0"
                : isSelected
                ? "green"
                : isVip
                ? "#ff0e0e"
                : "#3960ba",
              color: "white",
              border: "1px solid black",
              borderRadius: "3px",
              padding: "0",
              fontSize: "1.3rem",
              fontWeight:'bold',
              lineHeight: "1",
              margin: "0", // No margin between buttons
              cursor: isReserved ? "not-allowed" : "pointer",
            }}
          >
            {seat}
          </Button>
        );
      })}
    </Box>
  );

const handleConfirmBooking = ( ) => {
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
    bookingDate: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
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
    <Box sx={{ flex: 1, display: 'flex', backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('https://cdn.pixabay.com/photo/2016/07/30/02/31/red-1556341_960_720.jpg')`}}>
   <Box sx={{marginTop: 8, paddingBottom: 5    
   }}>

   
  
    {/* Back Icon */}
    <IconButton
      onClick={handleBack}
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        margin: 2,
      
        background: 'white', color: 'black', borderRadius:10,
        '&:hover' : {
            background: 'white', color: 'black',
        }
      }}
    >
      <ArrowBackIcon sx={{fontSize: 30, }}/> <span style={{fontSize:25, fontWeight: 'bold'}}>Back</span>
    </IconButton>

    <h2 id="responsive-modal-title" style={{ textAlign: 'center', marginTop: '20px', color: 'white' }}>
      Book Your Ticket
    </h2>
    <p id="responsive-modal-description" style={{ textAlign: 'center', marginBottom: '20px', color: 'white' }}>
      Select the seats to book your ticket
    </p>
<Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    marginRight: "20px",
  }}
>
  <Box
    sx={{
      width: "20px",
      height: "20px",
      backgroundColor: "#ff0e0e", // VIP Red Color
      borderRadius: "50%",
    }}
  />
  <Typography sx={{ marginLeft: "10px", color: 'white'}}>VIP Seat ${vipPrice}</Typography>
</Box>

<Box
  sx={{
    display: "flex",
    alignItems: "center",
  }}
>
  <Box
    sx={{
      width: "20px",
      height: "20px",
      backgroundColor: "#3960ba", // Economy Blue Color
      borderRadius: "50%",
    }}
  />
  <Typography sx={{ marginLeft: "10px", color: 'white' }}>Economy Seat ${economyPrice}</Typography>
</Box>
</Box> 

    <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "20px", // Space below the color legend
    }}
  >
    <Box
      sx={{
        padding: "25px 100px",
        backgroundColor: "white",
        borderRadius: "5px",
        color: "black",
        fontWeight: "bold",
        fontSize: "16px",
      }}
    >
      Stage
    </Box>
  </Box>
    <Box sx={{ padding: '0px 100px' }}>
      {/* <Typography variant="h4" gutterBottom align="center" sx={{color: 'black', background:'white', padding:1, borderRadius:10}}>
        Seat Picker{' '}
        <span style={{ color: 'black', fontStyle: 'italic', fontSize: 15 }}>
          (VIP Price: ${vipPrice} | Economy Price: ${economyPrice})
        </span>
      </Typography> */}

      {/* VIP Section */}
      <Typography
        variant="subtitle1"
        sx={{ marginTop: '10px', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold' , fontSize: 12, }}
      >
        VIP Section
      </Typography>
      {renderSeats(vipSeats)}

      {/* Economy Section */}
      <Typography
        variant="subtitle1"
        sx={{ marginTop: '10px', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: 12,}}
      >
        Economy Section
      </Typography>
      {renderSeats(economySeats)}

      {/* Selected Seats */}
      <Paper
        sx={{
          padding: '10px',
          marginTop: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
        }}
      >
        <Typography variant="subtitle1">Selected Seats</Typography>
        <Typography>
          {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
        </Typography>
      </Paper>

      {/* Total Price */}
      {/* <Paper
        sx={{
          padding: '10px',
          marginTop: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
        }}
      >
        <Typography variant="subtitle1">Total Price</Typography>
        <Typography>${calculateTotalPrice()}</Typography>
      </Paper> */}

      {/* Confirm Button */}
        {/* <Link to={'/event/'+3+ '/ordersummary'}> */}
      <button
        onClick={handleConfirmBooking}
        // disabled={selectedSeats.length === 0}
       className="buy-ticket-btn"
      >
          
      </button>
      {/* </Link> */}


    </Box>
  </Box>
  </Box>
  );
};

export default SeatMapPage;