import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import Swal from "sweetalert2"; // For popup messages
import { useLocation } from "react-router-dom";

const Wallet = () => {

  const location = useLocation();
  const [payments, setPayments] = useState([]);
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  // Helper function to parse query parameters
  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    const sessionId = getQueryParam("session_id");

    if (sessionId) {
      // Call API to get the receipt
      const fetchReceipt = async () => {
        try {
          const response = await axios.get(
            `https://event-system-backend-production.up.railway.app/api/v1/booking/sessionBookingDetails`,
            {
              params: { session_id: sessionId },
              responseType: "blob", // Important for handling file responses
            }
          );

          // Create a Blob URL for the PDF file
          const blob = new Blob([response.data], { type: "application/pdf" });
          const downloadUrl = window.URL.createObjectURL(blob);

          // Automatically download the file
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = "BookingReceipt.pdf"; // File name
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Show a success popup with inline styles
          Swal.fire({
            icon: "success",
            title: "Pago exitosa!",
            text: "Su pago ha sido procesado exitosamente. El recibo ha sido descargado.",
            customClass: {
              popup: "swal-custom-popup", // Assign class for width changes
            },
            didRender: () => {
              // Inline styles for OK button
              const confirmButton = document.querySelector(".swal2-confirm");
              if (confirmButton) {
                confirmButton.style.backgroundColor = "#4caf50"; // Green background
                confirmButton.style.color = "white"; // White text
                confirmButton.style.border = "none";
                confirmButton.style.borderRadius = "5px";
                confirmButton.style.padding = "10px 20px";
                confirmButton.style.fontSize = "14px";
                confirmButton.style.cursor = "pointer";
                confirmButton.style.transition = "background-color 0.3s";

                // Add hover effect
                confirmButton.addEventListener("mouseover", () => {
                  confirmButton.style.backgroundColor = "#45a049"; // Darker green
                });
                confirmButton.addEventListener("mouseout", () => {
                  confirmButton.style.backgroundColor = "#4caf50"; // Original green
                });
              }
            },
          });
        } catch (error) {
          console.error("Error fetching receipt:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo recuperar el recibo. Inténtelo de nuevo más tarde.",
            confirmButtonColor: "#000000", // Black button

          });
        }
      };

      fetchReceipt();
    }
  }, [location]);
  const fetchUser = async () => {
    
    if (token) {
      try {
        const response = await axios.get(`https://event-system-backend-production.up.railway.app/api/v1/users/getSingleUser`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in headers
          },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  };

  useEffect(() => {
    fetchUser();
   
  }, [token]);
  useEffect(() => {
    // Fetch payments history
    const fetchPayments = async () => {
      try {
        console.log("Fetching bookings for user:", user?._id);
        const response = await axios.get(
          `https://event-system-backend-production.up.railway.app/api/v1/booking/getuserbooking?user_id=${user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token in headers
            }
          }
        );
        setPayments(response.data.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, [user]);
  // Add debug information to check what's happening
  console.log("Rendering Wallet component with user:", user);
  console.log("Payments available:", payments);

  return (
    <Box sx={{ padding: 3, marginTop: 10 }}>
    <Typography variant="h4" gutterBottom sx={{textAlign: 'center', fontWeight: 'bold'}}>
    Administre su billetera e historial de pagos aquí
    </Typography>
    
    {/* Show loading or error state */}
    {!user && (
      <Typography variant="body1" sx={{textAlign: 'center'}}>
        Cargando información del usuario...
      </Typography>
    )}
    
    {user && payments.length === 0 && (
      <Typography variant="body1" sx={{textAlign: 'center'}}>
        No hay pagos o reservas en su historial.
      </Typography>
    )}
    
    <Grid container spacing={3}>
    {payments && payments.map((payment, index) => {
  // Verificar si event_id existe y si es un objeto
  const eventName = payment.event_id && typeof payment.event_id === 'object' 
    ? payment.event_id.name || 'Nombre no disponible'
    : 'Evento';
    
  const eventVenue = payment.event_id && typeof payment.event_id === 'object'
    ? payment.event_id.venue || 'Lugar no disponible'
    : 'Lugar no disponible';
    
  // Verificar si seatNumbers es un array
  const seats = Array.isArray(payment.seatNumbers)
    ? payment.seatNumbers.join(", ")
    : 'No disponible';
    
  return (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card sx={{ 
        boxShadow: 3, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {eventName}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Lugar:</strong> {eventVenue}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Asientos:</strong> {seats}
            </Typography>
            
            <Typography variant="body2">
              <strong>Cantidad:</strong> {payment.guestSize || '1'}
            </Typography>
            
            <Typography variant="body2">
              <strong>Fecha:</strong> {payment.bookingDate ? new Date(payment.bookingDate).toLocaleDateString() : 'No disponible'}
            </Typography>
            
            <Typography variant="body2">
              <strong>Precio:</strong> {payment.totalPrice ? `$${payment.totalPrice}` : 'Gratis'}
            </Typography>
            
            <Typography variant="body2" sx={{ 
              mt: 1, 
              display: 'inline-block', 
              bgcolor: payment.paymentStatus === 'paid' ? '#e8f5e9' : '#fff8e1',
              color: payment.paymentStatus === 'paid' ? '#2e7d32' : '#f57c00',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {payment.paymentStatus === 'paid' ? '✓ PAGADO' : 'PENDIENTE'}
            </Typography>
          </Box>
          
          {/* Diseño tipo ticket para el QR */}
          {payment.qrCodeUrl && (
            <Box
              sx={{
                mt: 'auto',
                p: 2,
                border: '2px dashed #ddd',
                borderRadius: 2,
                position: 'relative',
                textAlign: 'center',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  marginLeft: '-10px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  border: '2px dashed #ddd',
                }
              }}
            >
              <Typography variant="caption" display="block" gutterBottom sx={{ color: 'text.secondary' }}>
                PRESENTA ESTE QR EN LA ENTRADA
              </Typography>
              
              <Box sx={{ position: 'relative', mb: 1 }}>
                <img
                  src={payment.qrCodeUrl}
                  alt="QR Code"
                  style={{ 
                    width: "120px", 
                    height: "120px", 
                    objectFit: "cover",
                    borderRadius: '4px',
                  }}
                />
              </Box>
              
              <Button
                variant="outlined"
                size="small"
                onClick={() => window.open(payment.qrCodeUrl, "_blank")}
                sx={{ 
                  fontSize: '0.75rem',
                  textTransform: 'none'
                }}
              >
                Ver QR completo
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
})}

    </Grid>
  </Box>
  );
};

export default Wallet;