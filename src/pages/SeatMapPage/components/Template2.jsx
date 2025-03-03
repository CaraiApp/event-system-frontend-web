
import React, { useState } from "react";
import { Box, Button, Typography,IconButton, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Swal from "sweetalert2";

const SeatMapModal = ({event}) => {
  const navigate = useNavigate();
  const location = useLocation();
//   const { event } = location.state;
  // Static data for testing
  const reservedSeats = event?.reservedSeats; // Reserved seats
  const vipPrice = event?.vipprice; // Price for VIP seats
  const economyPrice = event?.economyprice; // Price for Economy seats

  // Number of seats for each section
  const vipSeatsCount =  event?.vipSize; // Total VIP seats
  const economySeatsCount =  event?.economySize; // Total Economy seats
//   const seatsPerRow = 10; // Number of seats in a row

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

  const renderSeats = (seats, style) => {
    return (<>
      <Box sx={{ ...style, display: "grid", gap: "5px" }}>
      
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
                width: "20px",
                height: "20px",
                backgroundColor: isReserved
                  ? "#b0b0b0"
                  : isSelected
                  ? "green"
                  : isVip
                  ? "#ff0e0e"
                  : "#3960ba",
                color: "white",
                border: "1px solid black",
                borderRadius: "50%", // Circular shape
                fontSize: "10px",
                fontWeight: "bold",
                lineHeight: "1",
                cursor: isReserved ? "not-allowed" : "pointer",
              }}
            >
              {seat}
            </Button>
          );
        })}
      </Box>
      </>
    );
  };
  const renderSeatsDynamicRows = (seats) => {
    let rows = [];
    let seatIndex = 0;
  
    for (let row = 3; seatIndex < seats.length; row++) {
      const seatsInRow = seats.slice(seatIndex, seatIndex + row);
      rows.push(
        <Box
          key={`row-${row}`}
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "5px",
            marginBottom: "10px", // Spacing between rows
          }}
        >
          {seatsInRow.map((seat) => (
            <Button
              key={seat}
              onClick={() => handleSeatClick(seat)}
              disabled={reservedSeats.includes(seat)}
              sx={{
                width: "20px",
                height: "20px",
                backgroundColor: reservedSeats.includes(seat)
                  ? "#b0b0b0"
                  : selectedSeats.includes(seat)
                  ? "green"
                  : "#ff0e0e",
                color: "white",
                border: "1px solid black",
                borderRadius: "50%",
                fontSize: "10px",
                fontWeight: "bold",
                lineHeight: "1",
                cursor: reservedSeats.includes(seat) ? "not-allowed" : "pointer",
              }}
            >
              {seat}
            </Button>
          ))}
        </Box>
      );
      seatIndex += row;
    }
  
    return rows;
  };
  
  const renderSeatsDynamicRowsForEconomy = (seats, vipRows, seatsPerRow) => {
    let rows = [];
    let seatIndex = 0;
  
    for (let row = 1; seatIndex < seats.length; row++) {
      const isVipRow = row <= vipRows; // Determine if the row should be VIP
      const seatsInRow = seats.slice(seatIndex, seatIndex + seatsPerRow);
      rows.push(
        <Box
          key={`row-${row}`}
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "5px",
            marginBottom: "10px", // Spacing between rows
          }}
        >
          {seatsInRow.map((seat) => (
            <Button
              key={seat}
              onClick={() => handleSeatClick(seat)}
              disabled={reservedSeats.includes(seat)}
              sx={{
                width: "20px",
                height: "20px",
                backgroundColor: reservedSeats.includes(seat)
                  ? "#b0b0b0"
                  : selectedSeats.includes(seat)
                  ? "green"
                  : isVipRow
                  ? "#ff0e0e" // VIP row styling
                  : "#3960ba",
                color: "white",
                border: "1px solid black",
                borderRadius: "50%",
                fontSize: "10px",
                fontWeight: "bold",
                lineHeight: "1",
                cursor: reservedSeats.includes(seat) ? "not-allowed" : "pointer",
              }}
            >
              {seat}
            </Button>
          ))}
        </Box>
      );
      seatIndex += seatsPerRow;
    }
  
    return rows;
  };
  
  // Inside your render method
  <Box sx={{ padding: "10px 50px", display: "flex", justifyContent: "center" }}>
    {/* Economy Section - Left */}
    <Box>
      {/* VIP Rows for Left Section */}
      {renderSeatsDynamicRowsForEconomy(
        economySeats.slice(0, 10), // Assuming 5 seats per row, 2 rows × 5 seats = 10
        2, // First 2 rows are VIP
        5 // 5 seats per row
      )}
      {/* Remaining Economy Rows */}
      {renderSeats(
        economySeats.slice(10, Math.ceil(economySeats.length / 2)), // Remaining seats
        {
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(10, 1fr)",
          justifyItems: "center",
          transform: "rotate(10deg)",
          marginRight: "50px",
          marginTop: "20px", // Space below VIP rows
        }
      )}
    </Box>
  
    {/* VIP Section */}
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "black",
          background: "white",
          padding: 1,
          borderRadius: 10,
          marginBottom: "10px",
        }}
      >
        VIP Section
      </Typography>
      {renderSeatsDynamicRows(vipSeats)}
    </Box>
  
    {/* Economy Section - Right */}
    <Box>
      {/* VIP Rows for Right Section */}
      {renderSeatsDynamicRowsForEconomy(
        economySeats.slice(Math.ceil(economySeats.length / 2), Math.ceil(economySeats.length / 2) + 10), // Next 10 seats
        2, // First 2 rows are VIP
        5 // 5 seats per row
      )}
      {/* Remaining Economy Rows */}
      {renderSeats(
        economySeats.slice(Math.ceil(economySeats.length / 2) + 10), // Remaining seats
        {
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(10, 1fr)",
          justifyItems: "center",
          transform: "rotate(-10deg)",
          marginLeft: "51px",
          marginTop: "20px", // Space below VIP rows
        }
      )}
    </Box>
  </Box>;
  
const handleConfirmBooking = ( ) => {
  if (selectedSeats.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No hay asientos seleccionados",
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
    totalPrice: calculateTotalPrice(), // Total price calculated,
    currency: event?.currency
  };
  console.log(payload)
  navigate("/event/ordersummary", { state: { payload } });
  // alert(calculateTotalPrice())


}

    const handleBack = () => {
      // navigate(-1);
      navigate(`/event-detail/${event?._id}`);
    };
  return (
   



   
       <Box sx={{padding: '10px 30px', backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('https://cdn.pixabay.com/photo/2016/07/30/02/31/red-1556341_960_720.jpg')`,
        color: 'white'
       }}>
   <Box sx={{     
   }}>

   
  
    {/* Back Icon */}
    <IconButton
      onClick={handleBack}
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        margin: 2,
        marginTop:10,  
      
        background: 'white', color: 'black', borderRadius:10,
        '&:hover' : {
            background: 'white', color: 'black',
        }
      }}
    >
      <ArrowBackIcon sx={{fontSize: 30, }}/> <span style={{fontSize:25, fontWeight: 'bold'}}>Back</span>
    </IconButton>
      <h2 id="responsive-modal-title" style={{ textAlign: "center", marginTop: "20px" }}>
        Book Your Ticket
      </h2>
      <p id="responsive-modal-description" style={{ textAlign: "center", marginBottom: "20px" }}>
        Select the seats to book your ticket
      </p>
     {/* Color Legend Boxes */}
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
      <Typography sx={{ marginLeft: "10px" }}>VIP Seat ${vipPrice}</Typography>
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
      <Typography sx={{ marginLeft: "10px" }}>Economy Seat ${economyPrice}</Typography>
    </Box>
  </Box>
   {/* Stage Box */}
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

      <Box sx={{ padding: "10px 50px", display: "flex", justifyContent: "center", alignItems: "center" }}>
  {/* Left Section with Heading */}
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      
    {renderSeats(economySeats.slice(0, Math.ceil(economySeats.length / 2)), {
      gridTemplateColumns: "repeat(5, 1fr)",
      gridTemplateRows: "repeat(10, 1fr)",
      justifyItems: "center",
      transform: "rotate(10deg)",
      marginRight: "50px",
    
    })}
  </Box>

  {/* VIP Section */}
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" , marginTop: "-100px",}}>
  
    {renderSeatsDynamicRows(vipSeats)}
  </Box>

  {/* Right Section with Economy Seats */}
  {/* Right Section with Heading */}
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
   
    {renderSeats(economySeats.slice(Math.ceil(economySeats.length / 2)), {
      gridTemplateColumns: "repeat(5, 1fr)",
      gridTemplateRows: "repeat(10, 1fr)",
      justifyItems: "center",
      transform: "rotate(-10deg)",  // Rotate the seat rows on the right side
      marginLeft: "51px",
   
    })}
  </Box>
</Box>


      {/* Selected Seats */}
      <Paper sx={{ padding: "10px", marginTop: "10px", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
        <Typography variant="subtitle1">Selected Seats</Typography>
        <Typography>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "No seats selected"}</Typography>
      </Paper>

      {/* Total Price */}
      {/* <Paper sx={{ padding: "10px", marginTop: "10px", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
        <Typography variant="subtitle1">Total Price</Typography>
        <Typography>${calculateTotalPrice()}</Typography>
      </Paper> */}

      {/* Confirm Button */}
      <button onClick={handleConfirmBooking}  className="buy-ticket-btn">
        Confirm Booking
      </button>
    </Box>
    </Box>
   

  );
};

export default SeatMapModal;

