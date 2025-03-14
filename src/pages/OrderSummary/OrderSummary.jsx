import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Divider, Typography, Stack } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import './OrderSummary.css';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';

export default function OrderSummary() {
    const location = useLocation();
    const navigate = useNavigate();
    const { payload } = location.state;
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token");
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    const handleCheckboxChange = (e) => {
        setIsCheckboxChecked(e.target.checked);
    };
  
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
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);
    
    useEffect(() => {
        fetchUser();
    }, [token]);

    const handleConfirmBooking = async () => {
        setLoading(true);

        const payloadData = {
          user_id: user?._id,
          event_id: payload?.event_id,
          bookingDate: payload?.bookingDate,
          guestSize: payload?.guestSize,
          seatNumbers: payload?.seatNumbers,
          totalPrice: payload?.totalPrice,
        };
        
        console.log(payloadData);
        
        try {
          // Verificar si es un evento gratuito
          const isFreeEvent = payload?.isFree === true || payload?.totalPrice === 0;
          
          let response;
          
          if (isFreeEvent) {
            // Usar la ruta para eventos gratuitos
            console.log("Procesando evento gratuito");
            response = await axios.post(
              `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/booking/free`,
              payloadData
            );
            
            console.log("Respuesta de evento gratuito:", response);
            
            // Para eventos gratuitos, redirigir a la página de éxito directamente
            if (response.data && response.data.status === "success") {
              navigate('/congrtspaymentsuccess', { 
                state: { 
                  bookingId: response.data.data._id,
                  eventName: payload?.eventName,
                  qrCodeUrl: response.data.qrCodeUrl,
                  isFreeEvent: true
                } 
              });
            } else {
              console.error("Error en la reserva gratuita");
            }
          } else {
            // Proceso normal para eventos de pago usando Stripe
            response = await axios.post(
              `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/booking/stripe`,
              payloadData
            );
            
            console.log("Respuesta de Stripe:", response);
            
            if (response.data && response.data.stripeUrl) {
              // Redirect to the Stripe URL after a successful response
              window.location.href = response.data.stripeUrl;
            } else {
              console.error("Stripe URL not found in response");
            }
          }
        } catch (err) {
          console.error("Error during booking:", err);
          alert("Ha ocurrido un error al procesar la reserva. Por favor, inténtelo de nuevo.");
        } finally {
          setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };
    
    return (
      <>
        <div style={{ padding: "90px 0px" }}>
            {/* <Link> */}
                <button 
                    className="inline-flex mt-12 gap-2 p-3 ml-12 bg-gray-100 justify-center items-center text-blue-700 font-bold rounded-md"
                    style={{ fontSize: 16 }}
                    onClick={handleBack}
                >
                    <IoMdArrowBack className="font-bold w-7 h-7 gap-2" /> 
                    Atrás
                </button>
            {/* </Link> */}
            {loading && <LoadingScreen/>} 

            <div className="flex flex-col px-4 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-5 mt-8">
                    {/* Terms & Conditions */}
                    <div className="p-4 bg-gray-100 w-full lg:w-3/4 mb-12">
                        <h2 
                            style={{ fontSize: 16, fontWeight: 'bold' }}
                            className="text-left font-bold"
                        >
                            Términos y condiciones
                        </h2>
                        <br />
                        <div>
                            <ul 
                                className="custom-list"
                                style={{ fontSize: 15, lineHeight: 1.5 }}
                            >
                                <li> Se otorgarán reembolsos por cancelaciones de boletos realizadas hasta 14 días antes de la fecha del evento. Después de este período, no se emitirán reembolsos. Para solicitar un reembolso, por favor contacte a nuestro equipo de atención al cliente. </li> <li> Los boletos serán enviados a su dirección de correo electrónico registrada como boletos electrónicos. Puede imprimir el boleto electrónico o mostrarlo en su dispositivo móvil para ingresar al evento. </li> <li> Cada persona puede comprar un máximo de 2 boletos para este evento para garantizar una distribución equitativa. </li> <li> En el raro caso de cancelación o aplazamiento, los asistentes serán notificados por correo electrónico. Los reembolsos se procesarán automáticamente para los eventos cancelados. </li> <li> Los boletos para eventos aplazados no serán reembolsados y se considerarán válidos en la fecha del aplazamiento. </li> <li> Su privacidad es importante para nosotros. Nuestra política de privacidad describe cómo recopilamos, usamos y protegemos su información personal. Al usar nuestra aplicación, usted acepta nuestra política de privacidad. </li> <li> Antes de proceder con la compra de su boleto, por favor revise y acepte nuestros términos y condiciones, los cuales rigen el uso de nuestra aplicación y servicios de boletos. </li>
                            </ul>
                        </div>
                        <div className="mt-5 text-center">
                            {/* <Link to={'/wallet'}> */}
                            <button 
                                onClick={handleConfirmBooking} 
                                className="buy-ticket-btn"
                                disabled={!isCheckboxChecked}
                            >
                                {payload?.isFree || payload?.totalPrice === 0 
                                    ? "Registrarse para evento gratuito" 
                                    : "Proceder al pago"}
                            </button>
                            {/* </Link> */}
                        </div>
                    </div>
                    
                    {/* Booking Summary */}
                    <div className="w-full lg:w-1/4 bg-blue-100 p-4">
                    <Box
                      sx={{
                        padding: "20px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "10px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        maxWidth: "400px",
                        margin: "auto",
                      }}
                    >
                      {/* Event Name */}
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <EventIcon color="primary" />
                        <Typography variant="h5" fontWeight="bold">
                        {payload?.eventName}
                        </Typography>
                      </Stack>

                      {/* Divider */}
                      <Divider sx={{ marginY: "15px" }} />

                      {/* Total Price */}
                      <Stack direction="row" alignItems="center" spacing={2} marginBottom="10px">
                        <AttachMoneyIcon color={payload?.isFree || payload?.totalPrice === 0 ? "success" : "primary"} />
                        <Typography sx={{fontSize:14}}>
                        Precio Total
                        :{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {payload?.isFree || payload?.totalPrice === 0 
                              ? "Gratis" 
                              : `${payload?.totalPrice} ${payload?.currency}`}
                          </span>
                        </Typography>
                      </Stack>

                      {/* Booked Seats */}
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <AirlineSeatReclineExtraIcon color="secondary" />
                        <Typography sx={{fontSize:14}}>
                        Asientos reservados
                        :{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {payload?.seatNumbers && payload?.seatNumbers.length > 0 
                              ? payload?.seatNumbers.join(', ') 
                              : 'No se requiere selección de asientos'}
                          </span>
                        </Typography>
                      </Stack>
                    </Box>
                        
                    <div className="flex items-center mt-5">
                        <input 
                            className="h-5" 
                            type="checkbox" 
                            onChange={handleCheckboxChange}
                            checked={isCheckboxChecked} 
                        />
                        <div className="px-2 text-lg" style={{ fontSize: 13, lineHeight: 1.5 }}>
                            He verificado el nombre, la fecha y la hora del evento antes de proceder. Acepto términos y condiciones.
                        </div>
                    </div>
                  </div>
                </div>
            </div> 
        </div>
      </>
    );
}