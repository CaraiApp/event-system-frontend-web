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
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/booking/sessionBookingDetails`,
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
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/getUser`, {
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
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/booking/getuserbooking?user_id=${user?._id}`,
         
        );
        setPayments(response.data.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, [user]);
  return (
    <Box sx={{ padding: 3, marginTop: 10 }}>
    <Typography variant="h4" gutterBottom sx={{textAlign: 'center', fontWeight: 'bold'}}>
    Administre su billetera e historial de pagos aquí


    </Typography>
    <Grid container spacing={3}>
    {payments.map((payment, index) => (
  <Grid item xs={12} sm={6} md={4} key={index}>
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
        Nombre del evento
        : {payment.event_id.name}
        </Typography>
        <Typography variant="body1">
          <strong>Evento:</strong> {payment.event_id.venue} {/* FIX HERE */}
        </Typography>
        <Typography variant="body1">
          <strong>Asientos reservados
          :</strong> {payment.seatNumbers.join(", ")}
        </Typography>
        <Typography variant="body1">
          <strong>Tamaño del huésped
          :</strong> {payment.guestSize}
        </Typography>
        <Typography variant="body1">
          <strong>Fecha de reserva
          :</strong> {new Date(payment.bookingDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body1">
          <strong>Precio Total
          :</strong> ${payment.totalPrice}
        </Typography>
        <Typography variant="body1">
          <strong>Estado de pago
:</strong> {payment.paymentStatus}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <img
            src={payment.qrCodeUrl}
            alt="QR Code"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2, width: "100%" }}
          onClick={() => window.open(payment.qrCodeUrl, "_blank")}
        >
          Ver código QR

        </Button>
      </CardContent>
    </Card>
  </Grid>
))}

    </Grid>
  </Box>
  );
};

export default Wallet;
