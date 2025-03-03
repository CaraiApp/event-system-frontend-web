import React, { useEffect, useMemo, useState } from "react";
import "./EventPage.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import PaidIcon from "@mui/icons-material/Paid";
import GroupsIcon from "@mui/icons-material/Groups";
import ChairIcon from "@mui/icons-material/Chair";
import { BsCheckCircle } from "react-icons/bs";
import { Check, LocalActivity, Payment } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
// import SeatMapModal from "../../ComponentsHome/SeatMapModal/SeatMapModal";
import axios from "axios";
import { Grid, Card, CardContent, Typography, Button, Box , CardMedia} from "@mui/material";
import { CircularProgress } from "@mui/material"; // Add CircularProgress from MUI for the loader
import Swal from "sweetalert2";

import DynamicGallery from "./components/DynamicGallery";


export default function EventPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userRole = localStorage.getItem("role");

  const [loading, setLoading] = useState(true); // State for loading
  const [eventData, setEventData] = useState(null);
  const [payments, setPayments] = useState([]);

  const fetchEventData = useMemo(() => {
    return async () => {
      const url = `https://demoticket.inasnapmarketing.ai/api/v1/events/getsingleEvent?id=${id}`;
      try {
        const response = await axios.get(url);
        setEventData(response.data.data);
        setLoading(false); // Stop the loader after fetching data
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false); // Stop the loader even if there's an error
      }
    };
  }, [id]);
  const images = [
     "https://picsum.photos/id/1018/1000/600/",
      
   
    "https://picsum.photos/id/1015/1000/600/",
      
    "https://picsum.photos/id/1019/1000/600/",
      
   
  ];
  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (eventData?._id && userRole !== "user") {
      const fetchPayments = async () => {
        try {
          const response = await axios.get(
            `https://demoticket.inasnapmarketing.ai/api/v1/booking/geteventbooking?event_id=${eventData._id}`
          );
          setPayments(response.data.data);
        } catch (error) {
          console.error("Error fetching payments:", error);
        }
      };

      fetchPayments();
    }
  }, [eventData?._id, userRole]);

  const handleBookNow = () => {
    if (userRole !== "user" || !userRole) {
      Swal.fire({
        title: "Por favor inicie sesión o regístrese",
        text: "Para continuar con el proceso de reserva, inicie sesión o registre su cuenta.",
        icon: "info",
        confirmButtonText: "Bueno",
        confirmButtonColor: "#007bff",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      // Show template selection UI
      // navigate("/seatMap", { state: { event: eventData} });
      Swal.fire({
        title: "Elija una fecha",
        html: `
          <div style="display: flex; flex-direction: column; gap: 10px; text-align: center;">
            <button id="firstDateBtn" style="padding: 10px; border-radius: 8px; border: 2px solid #007bff; background-color: #f7f7f7; cursor: pointer; font-weight: bold;">
              ${new Date(eventData?.eventDateSec).toDateString()} <br/> ${new Date(eventData?.eventTimeSec).toLocaleTimeString()}
            </button>
            <button id="secondDateBtn" style="padding: 10px; border-radius: 8px; border: 2px solid #007bff; background-color: #f7f7f7; cursor: pointer; font-weight: bold;">
              ${new Date(eventData?.eventDate).toDateString()} <br/> ${new Date(eventData?.eventTime).toLocaleTimeString()}
            </button>
          </div>
        `,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d33",
        didOpen: () => {
          document.getElementById("firstDateBtn").addEventListener("click", () => {
            Swal.close();
            navigate("/seatMap", { state: { event: eventData, selectionDate: "first" } });
          });
  
          document.getElementById("secondDateBtn").addEventListener("click", () => {
            Swal.close();
            navigate("/seatMap", { state: { event: eventData, selectionDate: "second" } });
          });
        },
      });

    }
  };

  return (
    <>
      {loading ? ( // Render the loader while loading is true
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>

        <div className="event-details-container">
          <div className="event-details-wrapper">
            <img
              src={eventData?.photo}
              alt="Event"
              className="event-image"
            />
            <div className="event-info">
              <div className="event-header">
                <h1 className="event-heading">{eventData?.name}</h1>
                <div className="price-badge">
                  Personaje: {eventData?.vipprice} {eventData?.currency}
                </div>
                <div className="price-badge">
                  Económica: {eventData?.economyprice} {eventData?.currency}
                </div>
              </div>
              <div className="event-header" style={{ marginBottom: 8 }}>
               
                <p className="event-location">
                  <LocationOnIcon fontSize="small" />{" "}
                  {eventData?.venue}, {eventData?.address}
                </p>
                <p className="event-location" style={{color: 'orangered'}}>
                  <LocalActivity fontSize="small" style={{color: 'orangered'}}/>{" "}
                  {eventData?.ticket == 'Online'? 'En línea Pagar' : 'Sin-cita previa Pagar'}
                </p>
              </div>
              <div className="event-header" style={{  marginBottom: 15 }}>
                <p className="event-dates">
                  <EventIcon fontSize="small" />{" "}
                  {new Date(eventData?.eventDateSec).toDateString()} en{" "}
                  {new Date(eventData?.eventTimeSec).toLocaleTimeString()}
                </p>
                <p className="event-dates">
                  <EventIcon fontSize="small" />{" "}
                  {new Date(eventData?.eventDate).toDateString()} en{" "}
                  {new Date(eventData?.eventTime).toLocaleTimeString()}
                </p>
              </div>
              <div className="event-header">
                <div className="event-pricing">
                  <div className="capacity-detail">
                    <GroupsIcon fontSize="small" /> Capacidad total
                    :{" "}
                    {eventData?.TotalCapacity}
                  </div>
                  <div className="capacity-detail">
                    <ChairIcon fontSize="small" /> Asientos VIP
                    : {eventData?.vipSize}, Asientos económicos
                    :{" "}
                    {eventData?.economySize}
                  </div>
                  <div className="capacity-detail">
                    <ChairIcon fontSize="small" /> Asientos disponibles
                    :{" "}
                    {eventData?.vipSize + eventData?.economySize - eventData?.reservedSeats?.length}
                  </div>
                </div>
                <div className="event-pricing">
                  <div className="capacity-detail" style={{ color: "orangered" }}>
                    <Check fontSize="large" /> Opciones económicas

                  </div>
                  <div className="capacity-detail" style={{ color: "orangered" }}>
                    <Check fontSize="large" /> Experiencias inolvidables

                  </div>
                  <div className="capacity-detail" style={{ color: "orangered" }}>
                    <Check fontSize="large" /> Planificación sin estrés

                  </div>
                </div>
              </div>
              <div className="organizer">
                <img
                  src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Organizer"
                  className="organizer-image"
                />
                <div className="organizer-details">
                  <p className="organizer-name">{eventData?.owner?.username}</p>
                  <p className="organizer-role">Organizador de eventos</p>
                </div>
              </div>
              <div className="description">
                <h3 className="description-heading">Descripción</h3>
                <p className="description-text">
                  {eventData?.desc}Únase a nosotros para
                  {eventData?.name}, un evento emocionante
                  ¡Eso promete inspirar, educar y entretener! Si eres un profesional [industria/profesión], un entusiasta o simplemente buscas una experiencia única, ¡no te puedes perder este evento!
                </p>
              </div>
           


<DynamicGallery gallery={eventData?.gallery} />

{(userRole === "user" || !userRole )  && eventData?.ticket !== "Walk-in" && (
                <button onClick={handleBookNow} className="buy-ticket-btn">
                 RESERVAR AHORA

                </button>
              )}
              {userRole && userRole !== "user" && (
                <Box sx={{ padding: 3, marginTop: 10 }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    Historial de pagos aquí
                    {" "}
                    <span style={{ color: "grey", fontStyle: "italic" }}>
                      (Total: {payments?.length})
                    </span>
                  </Typography>
                  <Grid container spacing={3}>
                    {payments.map((payment, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ boxShadow: 3 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                            Usuaria: {payment?.user_id?.username}
                            </Typography>
                            {/* <Typography variant="body1">
                              <strong>Venue:</strong> {payment.event_id.venue}
                            </Typography> */}
                            <Typography variant="body1">
                              <strong>Asientos reservados
                              :</strong>{" "}
                              {payment.seatNumbers.join(", ")}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Tamaño del huésped
                              :</strong> {payment.guestSize}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Fecha de reserva
                              :</strong>{" "}
                              {new Date(payment.bookingDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Precio total
                              :</strong> ${payment.totalPrice}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Estado de pago
                              :</strong>{" "}
                              {payment.paymentStatus}
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
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                              />
                            </Box>
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ marginTop: 2, width: "100%" }}
                              onClick={() =>
                                window.open(payment.qrCodeUrl, "_blank")
                              }
                            >
                              Ver código QR

                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </div>
          </div>
        </div>
        </>
      )}

   
    </>
  );
}