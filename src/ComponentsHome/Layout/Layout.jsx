import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../Header/Header'
import Routers from '../../router/Routers'
import Footer from '../Footer/Footer'
import { useLocation } from 'react-router-dom'

const Layout = () => {
  const location = useLocation();
  const [hideUI, setHideUI] = useState(false);

  // Rutas donde no se debe mostrar el encabezado ni el pie de página
  const isTemplateRoute = location.pathname.includes('template') || location.pathname.includes('congrtspaymentsuccess');
  const isTemplateRoutee = location.pathname.includes('seatMap') || location.pathname.includes('congrtspaymentsuccess');
  const isDashboardRoute = location.pathname.includes('/admin') || location.pathname.includes('/organizer');

  // Verificar configuración UI desde el backend cuando cambia la ruta
  useEffect(() => {
    const checkUIConfig = async () => {
      if (isDashboardRoute) {
        try {
          const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
          const response = await axios.get(`${API_BASE_URL}/api/v1/dashboard/ui-config`, {
            params: { route: location.pathname }
          });
          
          if (response.data && response.data.data) {
            setHideUI(response.data.data.hideHeader);
            console.log('UI Config recibida:', response.data.data);
          }
        } catch (error) {
          console.log('Error al obtener configuración UI:', error);
          // Si hay error, ocultamos por defecto el encabezado y el pie para las rutas de dashboard
          setHideUI(true);
        }
      } else {
        setHideUI(false);
      }
    };

    checkUIConfig();
  }, [location.pathname, isDashboardRoute]);

  // Determinar si debemos ocultar los elementos UI
  const shouldHideElements = isTemplateRoute || isTemplateRoutee || isDashboardRoute || hideUI;

  return (
    <>
      {!shouldHideElements && <Header />}
      <Routers/>
      {!shouldHideElements && <Footer />}
    </>
  )
}

export default Layout
// App.js


// // App.js
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   ButtonGroup,
//   CircularProgress,
//   Typography,
//   ThemeProvider,
//   createTheme,
//   Grid,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';

// // Mock backend data
// const mockBackendData = {
//   theater: {
//     stage: {
//       position: 'front', // Possible values: "front", "left", "right"
//     },
//     prices: {
//       vip: 150,
//       economy: 100,
//     },
//      seats: [
//       // VIP Seats (20)
//       ...Array.from({ length: 20 }, (_, i) => ({
//         id: `VIP-${i + 1}`,
//         row: `VIP-${Math.ceil((i + 1) / 5)}`, // e.g., VIP-1, VIP-2, VIP-3, VIP-4
//         number: (i % 5) + 1,
//         type: 'vip',
//         status: i % 4 === 0 ? 'reserved' : 'available', // Every 4th seat is reserved
//       })),
//       // Economy Seats (30)
//       ...Array.from({ length: 30 }, (_, i) => ({
//         id: `ECO-${i + 1}`,
//         row: `ECO-${Math.ceil((i + 1) / 6)}`, // e.g., ECO-1, ECO-2, ECO-3, ECO-4, ECO-5
//         number: (i % 6) + 1,
//         type: 'economy',
//         status: i % 5 === 0 ? 'reserved' : 'available', // Every 5th seat is reserved
//       })),
//     ],
//   },
// };

// // Styled Seat Button using MUI's styled API
// const SeatButton = styled(Button)(({ theme, type, status, selected }) => ({
//   minWidth: '25px',
//   minHeight: '25px',
//   margin: '2px',
//   padding: '0',
//   borderRadius: '4px',
//   backgroundColor:
//     status === 'reserved'
//       ? theme.palette.error.main
//       : selected
//       ? theme.palette.warning.main
//       : type === 'vip'
//       ? theme.palette.primary.main
//       : theme.palette.success.main,
//   color: '#fff',
//   fontSize: '0.7rem',
//   '&:hover': {
//     backgroundColor:
//       status === 'reserved'
//         ? theme.palette.error.dark
//         : selected
//         ? theme.palette.warning.dark
//         : type === 'vip'
//         ? theme.palette.primary.dark
//         : theme.palette.success.dark,
//   },
// }));

// const App = () => {
//   // State variables
//   const [theater, setTheater] = useState(null);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [currentTheme, setCurrentTheme] = useState('light');
//   const [loading, setLoading] = useState(true);
//   const [booking, setBooking] = useState(false);
//   const [themeDialogOpen, setThemeDialogOpen] = useState(false);
//   const [selectedThemeImage, setSelectedThemeImage] = useState(null);

//   // Themes
//   const themes = {
//     light: createTheme({
//       palette: {
//         mode: 'light',
//       },
//     }),
//     dark: createTheme({
//       palette: {
//         mode: 'dark',
//       },
//     }),
//     colorful: createTheme({
//       palette: {
//         mode: 'light',
//         primary: {
//           main: '#ff5722', // Example color
//         },
//         success: {
//           main: '#4caf50',
//         },
//         error: {
//           main: '#f44336',
//         },
//         warning: {
//           main: '#ffeb3b',
//           contrastText: '#000',
//         },
//       },
//     }),
//   };

//   // Simulate fetching data from backend
//   useEffect(() => {
//     const fetchSeats = async () => {
//       try {
//         // Simulate network delay
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         // Set theater data
//         setTheater(mockBackendData.theater);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching seats:', error);
//         setLoading(false);
//       }
//     };

//     fetchSeats();
//   }, []);

//   // Handle seat selection
//   const handleSelect = (seat) => {
//     if (seat.status === 'reserved') return;

//     if (selectedSeats.includes(seat.id)) {
//       setSelectedSeats(selectedSeats.filter((id) => id !== seat.id));
//     } else {
//       setSelectedSeats([...selectedSeats, seat.id]);
//     }
//   };

//   // Handle booking seats
//   const handleBooking = async () => {
//     setBooking(true);
//     try {
//       // Simulate booking process
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Update seat statuses
//       const updatedSeats = theater.seats.map((seat) =>
//         selectedSeats.includes(seat.id) ? { ...seat, status: 'reserved' } : seat
//       );

//       setTheater({ ...theater, seats: updatedSeats });
//       setSelectedSeats([]);
//       alert('Booking successful!');
//     } catch (error) {
//       console.error('Error booking seats:', error);
//       alert('Booking failed. Please try again.');
//     } finally {
//       setBooking(false);
//     }
//   };

//   // Calculate total amount
//   const calculateTotal = () => {
//     let total = 0;
//     selectedSeats.forEach((seatId) => {
//       const seat = theater.seats.find((s) => s.id === seatId);
//       if (seat) {
//         total += theater.prices[seat.type];
//       }
//     });
//     return total;
//   };

//   // Group seats by rows
//   const groupSeatsByRow = () => {
//     const rows = theater.seats.reduce((acc, seat) => {
//       acc[seat.row] = acc[seat.row] ? [...acc[seat.row], seat] : [seat];
//       return acc;
//     }, {});
//     return rows;
//   };

//   // Render loading state
//   if (loading) {
//     return (
//       <ThemeProvider theme={themes[currentTheme]}>
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           minHeight="100vh"
//         >
//           <CircularProgress />
//         </Box>
//       </ThemeProvider>
//     );
//   }

//   // Render error state
//   if (!theater) {
//     return (
//       <ThemeProvider theme={themes[currentTheme]}>
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           minHeight="100vh"
//         >
//           <Typography variant="h6">Failed to load seat data.</Typography>
//         </Box>
//       </ThemeProvider>
//     );
//   }

//   const rows = groupSeatsByRow();
//   const sortedRowKeys = Object.keys(rows).sort();

//   // Handle Theme Selection Dialog
//   const handleOpenThemeDialog = () => {
//     setThemeDialogOpen(true);
//   };

//   const handleCloseThemeDialog = () => {
//     setThemeDialogOpen(false);
//   };

//   const handleThemeSelection = (theme) => {
//     setCurrentTheme(theme);
//     setThemeDialogOpen(false);
//   };

//   return (
//     <ThemeProvider theme={themes[currentTheme]}>
//       <Box
//         sx={{
//           bgcolor: 'background.default',
//           color: 'text.primary',
//           minHeight: '100vh',
//           p: 2,
//         }}
//       >
//         {/* Header with Theme Switcher */}
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           mb={2}
//         >
//           <Typography variant="h4">Ticket Booking System</Typography>
//           <Button variant="contained" onClick={handleOpenThemeDialog}>
//             Select Theme
//           </Button>
//         </Box>

//         {/* Theme Selection Dialog */}
//         <Dialog open={themeDialogOpen} onClose={handleCloseThemeDialog}>
//           <DialogTitle>Select a Theme</DialogTitle>
//           <DialogContent>
//             <DialogContentText>
//               Choose one of the available themes to customize your seat map.
//             </DialogContentText>
//             <Grid container spacing={2} mt={1}>
//               {/* Theme 1 */}
//               <Grid item xs={4}>
//                 <Paper
//                   elevation={3}
//                   sx={{
//                     padding: 1,
//                     textAlign: 'center',
//                     cursor: 'pointer',
//                   }}
//                   onClick={() => handleThemeSelection('light')}
//                 >
//                   <img
//                     src="https://via.placeholder.com/100x60.png?text=Light"
//                     alt="Light Theme"
//                     style={{ width: '100%', height: 'auto' }}
//                   />
//                   <Typography variant="caption">Light</Typography>
//                 </Paper>
//               </Grid>
//               {/* Theme 2 */}
//               <Grid item xs={4}>
//                 <Paper
//                   elevation={3}
//                   sx={{
//                     padding: 1,
//                     textAlign: 'center',
//                     cursor: 'pointer',
//                   }}
//                   onClick={() => handleThemeSelection('dark')}
//                 >
//                   <img
//                     src="https://via.placeholder.com/100x60.png?text=Dark"
//                     alt="Dark Theme"
//                     style={{ width: '100%', height: 'auto' }}
//                   />
//                   <Typography variant="caption">Dark</Typography>
//                 </Paper>
//               </Grid>
//               {/* Theme 3 */}
//               <Grid item xs={4}>
//                 <Paper
//                   elevation={3}
//                   sx={{
//                     padding: 1,
//                     textAlign: 'center',
//                     cursor: 'pointer',
//                   }}
//                   onClick={() => handleThemeSelection('colorful')}
//                 >
//                   <img
//                     src="https://via.placeholder.com/100x60.png?text=Colorful"
//                     alt="Colorful Theme"
//                     style={{ width: '100%', height: 'auto' }}
//                   />
//                   <Typography variant="caption">Colorful</Typography>
//                 </Paper>
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseThemeDialog}>Cancel</Button>
//           </DialogActions>
//         </Dialog>

//         {/* Legend */}
//         <Box display="flex" justifyContent="center" mb={2}>
//           {/* VIP */}
//           <Box display="flex" alignItems="center" mr={2}>
//             <Box
//               width="15px"
//               height="15px"
//               bgcolor="primary.main"
//               mr={0.5}
//               borderRadius="2px"
//             />
//             <Typography variant="body2">VIP</Typography>
//           </Box>
//           {/* Economy */}
//           <Box display="flex" alignItems="center" mr={2}>
//             <Box
//               width="15px"
//               height="15px"
//               bgcolor="success.main"
//               mr={0.5}
//               borderRadius="2px"
//             />
//             <Typography variant="body2">Economy</Typography>
//           </Box>
//           {/* Reserved */}
//           <Box display="flex" alignItems="center" mr={2}>
//             <Box
//               width="15px"
//               height="15px"
//               bgcolor="error.main"
//               mr={0.5}
//               borderRadius="2px"
//             />
//             <Typography variant="body2">Reserved</Typography>
//           </Box>
//           {/* Selected */}
//           <Box display="flex" alignItems="center">
//             <Box
//               width="15px"
//               height="15px"
//               bgcolor="warning.main"
//               mr={0.5}
//               borderRadius="2px"
//             />
//             <Typography variant="body2">Selected</Typography>
//           </Box>
//         </Box>

//         {/* Stage */}
//         <Box
//           width="100%"
//           height="50px"
//           bgcolor="grey.800"
//           color="grey.100"
//           display="flex"
//           alignItems="center"
//           justifyContent={
//             theater.stage.position === 'front'
//               ? 'center'
//               : theater.stage.position === 'left'
//               ? 'flex-start'
//               : theater.stage.position === 'right'
//               ? 'flex-end'
//               : 'center'
//           }
//           mb={2}
//           borderRadius={1}
//         >
//           <Typography variant="h6">Stage</Typography>
//         </Box>

//         {/* Seat Map */}
//         {sortedRowKeys.map((row) => (
//           <Box
//             key={row}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//             mb={1}
//             flexWrap="wrap"
//           >
//             <Typography
//               variant="body2"
//               sx={{ width: '30px', textAlign: 'right', mr: 1 }}
//             >
//               {row}
//             </Typography>
//             {rows[row].map((seat) => (
//               <SeatButton
//                 key={seat.id}
//                 variant="contained"
//                 type="button"
//                 typeProp={seat.type}
//                 status={seat.status}
//                 selected={selectedSeats.includes(seat.id)}
//                 onClick={() => handleSelect(seat)}
//                 disabled={seat.status === 'reserved'}
//                 aria-label={`Row ${seat.row} Seat ${seat.number} ${
//                   seat.status === 'reserved' ? 'Reserved' : 'Available'
//                 }`}
//               >
//                 {seat.number}
//               </SeatButton>
//             ))}
//           </Box>
//         ))}

//         {/* Total Amount */}
//         <Box mt={2}>
//           <Typography variant="h6">Total: ${calculateTotal()}</Typography>
//         </Box>

//         {/* Booking Button */}
//         <Box display="flex" justifyContent="center" mt={2}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleBooking}
//             disabled={selectedSeats.length === 0 || booking}
//           >
//             {booking ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               'Book Selected Seats'
//             )}
//           </Button>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default App;