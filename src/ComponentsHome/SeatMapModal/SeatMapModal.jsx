// import React, { useState } from "react";
// import { Button, Typography, Paper, Box } from "@mui/material";

// export default function SeatMapModal({openModal, handleClose}) {
//   // Static data for testing
//   const reservedSeats = ["VIP1", "VIP3", "E2"]; // Reserved seats
//   const vipPrice = 100; // Price for VIP seats
//   const economyPrice = 50; // Price for Economy seats

//   // Number of seats for each section
//   const vipSeatsCount = 35; // Total VIP seats
//   const economySeatsCount = 70; // Total Economy seats
//   const seatsPerRow = 10; // Number of seats in a row

//   // Generate seat labels for VIP and Economy sections
//   const generateSeats = (prefix, count) => {
//     let seats = [];
//     for (let i = 1; i <= count; i++) {
//       seats.push(`${prefix}${i}`);
//     }
//     return seats;
//   };

//   // Generate seat arrays
//   const vipSeats = generateSeats("VIP", vipSeatsCount);
//   const economySeats = generateSeats("E", economySeatsCount);

//   const [selectedSeats, setSelectedSeats] = useState([]); // User-selected seats

//   const handleSeatClick = (seatNumber) => {
//     if (reservedSeats.includes(seatNumber)) return; // Prevent reserved seats from being selected
//     if (selectedSeats.includes(seatNumber)) {
//       // Deselect seat
//       setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
//     } else {
//       // Select seat
//       setSelectedSeats([...selectedSeats, seatNumber]);
//     }
//   };

//   const calculateTotalPrice = () => {
//     return selectedSeats.reduce((total, seat) => {
//       const isVip = seat.startsWith("VIP"); // VIP seat condition
//       return total + (isVip ? vipPrice : economyPrice);
//     }, 0);
//   };

//   const renderSeats = (seats) => (
//     <Box
//       sx={{
//         display: "flex",
//         flexWrap: "wrap",
//         gap: 0, // No gap between buttons
//         justifyContent: "center",
//         width: "fit-content",
//         margin: "0 auto",
      
       
//       }}
//     >
//       {seats.map((seat) => {
//         const isReserved = reservedSeats.includes(seat);
//         const isSelected = selectedSeats.includes(seat);
//         const isVip = seat.startsWith("VIP");
//         return (
//           <Button
//             key={seat}
//             onClick={() => handleSeatClick(seat)}
//             disabled={isReserved}
//             sx={{
//               width: "30px", // Fixed width
//               height: "30px", // Fixed height
//               backgroundColor: isReserved
//                 ? "#b0b0b0"
//                 : isSelected
//                 ? "green"
//                 : isVip
//                 ? "#ff0e0e"
//                 : "#3960ba",
//               color: "white",
//               border: "1px solid black",
//               borderRadius: "3px",
//               padding: "0",
//               fontSize: "1.3rem",
//               fontWeight:'bold',
//               lineHeight: "1",
//               margin: "0", // No margin between buttons
//               cursor: isReserved ? "not-allowed" : "pointer",
//             }}
//           >
//             {seat}
//           </Button>
//         );
//       })}
//     </Box>
//   );

//   return (
//     <Box sx={{   padding:"10px 100px",marginTop:10 }}>
//       <Typography variant="h5" gutterBottom align="center">
//         Seat Picker <span style={{color:'grey'}}>
//         VIP Price: ${vipPrice} | Economy Price: ${economyPrice}
//           </span>
//       </Typography>

   

//      {/* Economy Section */}
//      <Typography variant="subtitle1" sx={{ marginTop: "10px", marginBottom: "10px",textAlign:'center', fontWeight:'bold' }}>
//         VIP Section
//       </Typography>
//       {renderSeats(vipSeats)}

//       {/* Economy Section */}
//       <Typography variant="subtitle1" sx={{ marginTop: "10px", marginBottom: "10px",textAlign:'center', fontWeight:'bold' }}>
//         Economy Section
//       </Typography>
//       {renderSeats(economySeats)}

//       {/* Selected Seats */}
//       <Paper sx={{ padding: "10px", marginTop: "10px" }}>
//         <Typography variant="subtitle1">Selected Seats</Typography>
//         <Typography>
//           {selectedSeats.length > 0 ? selectedSeats.join(", ") : "No seats selected"}
//         </Typography>
//       </Paper>

//       {/* Total Price */}
//       <Paper sx={{ padding: "10px", marginTop: "10px" }}>
//         <Typography variant="subtitle1">Total Price</Typography>
//         <Typography>${calculateTotalPrice()}</Typography>
//       </Paper>

//       {/* Confirm Button */}
//       <Button
//         onClick={() => alert(`Seats booked: ${selectedSeats.join(", ")}`)}
//         disabled={selectedSeats.length === 0}
//         sx={{
//           marginTop: "10px",
//           padding: "5px 10px",
//           backgroundColor: selectedSeats.length === 0 ? "gray" : "blue",
//           color: "white",
//           fontWeight: "bold",
//           borderRadius: "5px",
//           fontSize: "0.8rem",
//         }}
//       >
//         Confirm Booking
//       </Button>
//     </Box>
//   );
// }

import React, { useState } from 'react';
import { Modal, Box, IconButton, Button, Typography, Paper, } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from 'react-router-dom';

const SeatMapModal = ({ open, handleClose, event }) => {

 const navigate = useNavigate();
  
  // Static data for testing
  const reservedSeats = event?.reservedSeats; // Reserved seats
  const vipPrice = event?.vipprice; // Price for VIP seats
  const economyPrice = event?.economyprice; // Price for Economy seats

  // Number of seats for each section
  const vipSeatsCount =  event?.vipSize; // Total VIP seats
  const economySeatsCount =  event?.economySize; // Total Economy seats
  const seatsPerRow = 10; // Number of seats in a row

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


}

  return (
    <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="responsive-modal-title"
  aria-describedby="responsive-modal-description"
>
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('https://cdn.pixabay.com/photo/2016/07/30/02/31/red-1556341_960_720.jpg')`, // Replace with your image URL
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column',
      color: 'white', // Ensure text is readable
    }}
  >
    {/* Back Icon */}
    <IconButton
      onClick={handleClose}
      sx={{
        position: 'absolute',
        top: '10px',
        left: '10px',
      
        background: 'white', color: 'black', borderRadius:10,
        '&:hover' : {
            background: 'white', color: 'black',
        }
      }}
    >
      <ArrowBackIcon sx={{fontSize: 30, }}/> <span style={{fontSize:25, fontWeight: 'bold'}}>Back</span>
    </IconButton>

    <h2 id="responsive-modal-title" style={{ textAlign: 'center', marginTop: '20px' }}>
      Book Your Ticket
    </h2>
    <p id="responsive-modal-description" style={{ textAlign: 'center', marginBottom: '20px' }}>
      Select the seats to book your ticket
    </p>
    <Box sx={{ padding: '10px 100px' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{color: 'black', background:'white', padding:1, borderRadius:10}}>
        Seat Picker{' '}
        <span style={{ color: 'black', fontStyle: 'italic', fontSize: 15 }}>
          (VIP Price: ${vipPrice} | Economy Price: ${economyPrice})
        </span>
      </Typography>

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
      <Paper
        sx={{
          padding: '10px',
          marginTop: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
        }}
      >
        <Typography variant="subtitle1">Total Price</Typography>
        <Typography>${calculateTotalPrice()}</Typography>
      </Paper>

      {/* Confirm Button */}
        {/* <Link to={'/event/'+3+ '/ordersummary'}> */}
      <button
        onClick={handleConfirmBooking}
        disabled={selectedSeats.length === 0}
       className="buy-ticket-btn"
      >
        Confirm Booking
      </button>
      {/* </Link> */}


    </Box>
  </Box>
</Modal>
  );
};

export default SeatMapModal;
