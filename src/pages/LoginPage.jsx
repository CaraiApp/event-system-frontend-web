// import { useContext, useEffect, useState } from 'react'
// import { Link, Navigate } from 'react-router-dom'
// import axios from 'axios'
// import { UserContext } from '../UserContext'


// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [redirect, setRedirect] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const {setUser} = useContext(UserContext);


//   //! Fetch users from the server --------------------------------------------------------------
//   useEffect(() => {
//     const storedEmail = localStorage.getItem('rememberedEmail');
//     const storedPass = localStorage.getItem('rememberedpass')
//     if (storedEmail) {
//       setEmail(storedEmail);
//       setPassword(storedPass);
//     }
//   }, []);


//   async function loginUser(ev){
//       ev.preventDefault();

//       try{
//         const {data} = await axios.post('/login', {email, password})
//         setUser(data);
//         alert('Login success');

//         if (rememberMe) {
//           // If the user checked, store their email in localStorage.
//           localStorage.setItem('rememberedEmail', email);
//           localStorage.setItem('rememberedpass', password);
//         } else {
//           // If the user didnt checked, remove their email from localStorage.
//           localStorage.removeItem('rememberedEmail');
//         }

//         setRedirect(true)
//       }catch(e){
//         alert('Login failed');
//       }
//   }

//   if(redirect){
//     return <Navigate to={'/'}/>
//   }
  
//   return (
//     <div className ="flex w-full h-full lg:ml-24 px-10 py-10 justify-between place-items-center mt-20">
//       <div className= "bg-white w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl justify-center align-middle">
    
//         <form className="flex flex-col w-auto items-center" onSubmit={loginUser}>
//             <h1 className='px-3 font-extrabold mb-5 text-primarydark text-2xl '></h1>


//             <div className= "input">
//               {/* <img src={account} alt="Name" className="name"/> */}
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
//                 <path fillRule="evenodd" d="M17.834 6.166a8.25 8.25 0 100 11.668.75.75 0 011.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0121.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 11-.82-6.26V8.25a.75.75 0 011.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 00-2.416-5.834zM15.75 12a3.75 3.75 0 10-7.5 0 3.75 3.75 0 007.5 0z" clipRule="evenodd" />
//               </svg>

//               <input type ="email"  placeholder="Email" className="input-et" value={email} onChange={ev => setEmail(ev.target.value)}/>
//             </div>

//             <div className= "input">
//               {/* <img src={account} alt="Name" className="name"/> */}
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
//                 <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clipRule="evenodd" />
//               </svg>

//               <input type ={showPassword ? 'text' : 'password'}  placeholder="Password" className="input-et" value={password} onChange={ev => setPassword(ev.target.value)}/>
//               <div type='button' className="" onClick={() => setShowPassword((prev) => !prev)}>
//                 {showPassword ? (
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//                     <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
//                     <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
//                   </svg>
//                 ) : (
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//                     <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
//                     <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
//                     <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
//                   </svg>
//                     )}
//               </div>
//             </div>

//             <div className='flex w-full h-full mt-4 justify-between px-1'>
//               <div className='flex gap-2'>
//               <input  type="checkbox" checked={rememberMe} onChange={() => setRememberMe(prev => !prev)}/> 
//               Remember Me
//               </div>
//               <div>
//                 <Link to={'/forgotpassword'}>
//                   Forgot Password ?
//                 </Link>
//               </div>
              
//             </div>

            
//             <div className="w-full py-4">
//               <button type="submit" className="primary w-full"> Sign in </button>
//             </div>

//             <div className="container2 ">
//               <div className="w-full h-full p-1">
//                 <Link to={'/login'}>
//                   <button type="submit" className="text-white cursor-pointer rounded w-full h-full bg-primary font-bold" > Sign In</button>
//                 </Link>
//               </div>
//               <div className="w-full h-full p-1">
//                 <Link to={'/register'}>
//                   <button type="submit" className="text-black cursor-pointer rounded w-full h-full font-bold" > Sign Up</button>
//                 </Link>
//               </div>
//             </div>

//             <Link to={'/'} className="">
//               <button className="secondary">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                   <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
//                 </svg> 
//                 Back 
//               </button>
//             </Link>

//         </form>

//     </div>
   
//     <div className= "hidden lg:flex flex-col right-box">
//       <div className='flex flex-col -ml-96 gap-3'>
//         <div className='text-3xl font-black'>Welcome to</div>
//         <div>
//           <img src="../src/assets/login-page.jpg" alt="" style={{ width: '300px', height: '200px'}}/>
//         </div>
//       </div>

//         <div className="-ml-48 w-80 mt-12">
//           <img src="../src/assets/signinpic.svg" alt="" className='w-full'/>
//         </div>   
        
//     </div>
    
//   </div>
//   )
// }


import * as React from "react";
import { useState } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  styled,
  Box,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

const theme = createTheme({
  typography: {
    fontSize: 16, // Aumentar el tamaño base de la fuente
    h5: {
      fontSize: '1.6rem', // Tamaño más grande para los encabezados h5
      fontWeight: 600,
    },
    body1: {
      fontSize: '1.1rem', // Texto normal más grande
    },
    body2: {
      fontSize: '1rem', // Texto secundario más grande
    },
  },
});

const CssTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#6497df",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6497df",
    },
  },
});

const SignIn = () => {

  const [loading, setLoading] = useState(false); // Loading state
  const [resendLoading, setResendLoading] = useState(false); // Loading state for resend verification
  const [showResendForm, setShowResendForm] = useState(false); // Show resend verification form
  const [resendSuccess, setResendSuccess] = useState(""); // Success message for resend

  const mediaLessthanmd = useMediaQuery(theme.breakpoints.down("md"));
  const email = useRef();
  const password = useRef();
  const resendEmail = useRef();

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [resendError, setResendError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      email: email.current.value.toLowerCase(),
      password: password.current.value,
    };

    try {
      // Reset error message
      setError("");
      // Set loading state to true while making the request
      setLoading(true);

      // Usar axios para aprovechar el proxy CORS
      const { default: axios } = await import('axios');
      
      // Hacer la petición a través de axios que ya tiene configurado el proxy CORS
      const response = await axios.post('/api/v1/users/loginUser', user);
      
      // Usar directamente la respuesta de axios
      const data = response.data;

      // La respuesta de axios es exitosa si llega aquí (sin excepciones)
      console.log("Login successful:", data);

      // Store token and role in localStorage
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("role", data.data.user.role);
      
      // Verificar si hay un parámetro de redirección en la URL
      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get('redirect');
      
      if (redirectPath) {
        // Si hay una ruta de redirección, navegar a ella
        navigate(redirectPath);
      } else {
        // Si no hay redirección, ir a la página de inicio por defecto
        navigate("/home");
      }
    } catch (error) {
      console.error("Error completo:", error);
      
      // Mostrar mensaje de error específico del backend si está disponible
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Correo electrónico o contraseña incorrectos");
        console.log("Error del servidor:", error.response.data);
      } else {
        setError("Error de conexión. Por favor, inténtalo de nuevo más tarde.");
        console.log("Error de conexión:", error.message);
      }
    } finally {
      // Set loading state to false once the request is complete
      setLoading(false);
    }
  };

  // Manejar el reenvío del correo de verificación
  const handleResendVerification = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setResendError("");
    setResendSuccess("");
    
    // Validar el correo electrónico
    if (!resendEmail.current.value) {
      setResendError("Por favor, introduce tu correo electrónico");
      return;
    }
    
    try {
      setResendLoading(true);
      
      // Importar el servicio API
      const { default: api } = await import('../services/api.js');
      
      // Llamar al endpoint de reenvío
      await api.auth.resendVerificationEmail(resendEmail.current.value);
      
      // Mostrar mensaje de éxito
      setResendSuccess(`Se ha enviado un nuevo correo de verificación a ${resendEmail.current.value}. Por favor, revisa tu bandeja de entrada y carpeta de spam.`);
      
      // Ocultar el formulario después de 5 segundos
      setTimeout(() => {
        setShowResendForm(false);
        setResendSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Error al reenviar correo de verificación:", error);
      
      // Mostrar mensaje de error
      if (error.response && error.response.data) {
        setResendError(error.response.data.message || "Error al reenviar el correo de verificación");
      } else {
        setResendError("Error de conexión. Por favor, inténtalo de nuevo más tarde.");
      }
    } finally {
      setResendLoading(false);
    }
  };
  
  const [redirectInfo, setRedirectInfo] = React.useState("");

  React.useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
    
    // Verificar si hay un parámetro de redirección en la URL
    const searchParams = new URLSearchParams(window.location.search);
    const redirectPath = searchParams.get('redirect');
    
    if (redirectPath) {
      // Si el redirect es hacia el panel de administrador, mostrar un mensaje informativo
      if (redirectPath.startsWith('/admin')) {
        setRedirectInfo("Para acceder al Panel de Administración, primero debes iniciar sesión con una cuenta de administrador.");
      }
    }
  }, []);


  return (
    <>
        
    
      <ThemeProvider theme={theme}>
        <Container
          component="main"
          style={{ display: "flex", minHeight: "100vh", marginTop: 50, padding: "20px"}}
        >
           {loading && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 9999, // Make sure it overlays the content
                      }}
                    >
                      <LoadingScreen  />
                    </Box>
                  )}
          <CssBaseline />
          <Grid container sx={{ justifyContent: "center" }}>
            <Grid
              item
              md={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                // alignItems: {md: 'center'},
                backgroundColor: mediaLessthanmd ? "#f5f5f5" : "transparent",
                padding: mediaLessthanmd ? "20px" : "40px",
              }}
            >
              <form
                style={{ width: "100%", maxWidth: "400px" }}
                onSubmit={handleSubmit}
              >
                <Typography
                  component="h1"
                  variant="h5"
                  sx={{ 
                    mb: 3, 
                    textAlign: "center",
                    fontWeight: "600",
                    textTransform: "none",
                    fontSize: "1.75rem",
                    color: "#2c3e50"
                  }}
                >
                  Iniciar sesión
                </Typography>

                {/* Redirect info display */}
                {redirectInfo && (
                  <Box 
                    sx={{
                      p: 2,
                      mb: 2,
                      width: '100%',
                      borderRadius: 1,
                      bgcolor: '#e3f2fd',
                      color: '#0d47a1',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#0d47a1" style={{marginRight: '8px'}}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    {redirectInfo}
                  </Box>
                )}
                
                {/* Error message display */}
                {error && (
                  <Box 
                    sx={{
                      p: 2,
                      mb: 2,
                      width: '100%',
                      borderRadius: 1,
                      bgcolor: '#ffebee',
                      color: '#d32f2f',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#d32f2f" style={{marginRight: '8px'}}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    {error}
                  </Box>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CssTextField
                      label="Correo electrónico"
                      variant="outlined"
                      fullWidth
                      required
                      inputRef={email}
                      type="email"
                      InputProps={{
                        style: { fontSize: '1.1rem', textTransform: 'lowercase' },
                        inputProps: {
                          style: { textTransform: 'lowercase' }
                        }
                      }}
                      inputProps={{
                        style: { textTransform: 'lowercase' },
                        autoCapitalize: "off"
                      }}
                      InputLabelProps={{
                        style: { fontSize: '1.1rem' },
                      }}
                      sx={{ 
                        "& input": { 
                          textTransform: "lowercase" 
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CssTextField
                      label="Contraseña"
                      variant="outlined"
                      fullWidth
                      required
                      inputRef={password}
                      type="password"
                      InputProps={{
                        style: { fontSize: '1.1rem' },
                      }}
                      InputLabelProps={{
                        style: { fontSize: '1.1rem' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ 
                        mt: 3, 
                        mb: 2,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)'
                      }}
                      disabled={loading} // Disable button while loading
                    >
                      {loading ? 
                        <CircularProgress size={24} color="inherit" /> : 
                        'Iniciar sesión'
                      }
                    </Button>
                  </Grid>
                </Grid>

                <Grid container justifyContent="space-between" style={{marginTop: '20px'}}>
                  <Grid item>
                    <Link to="/forgot-password" style={{
                      textDecoration: 'none', 
                      color: '#6497df',
                      fontSize: '0.95rem'
                    }}>
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link to="/register" style={{
                      fontSize: '0.95rem', 
                      fontWeight: 'bold', 
                      textDecoration: 'none', 
                      color: '#6497df',
                      display: 'inline-block'
                    }}>
                      ¿No tienes una cuenta? Inscribirse
                    </Link>
                  </Grid>
                </Grid>
                
                {/* Link para reenviar correo de verificación */}
                <Grid container justifyContent="center" style={{marginTop: '20px'}}>
                  <Grid item>
                    <Button 
                      variant="text" 
                      onClick={() => setShowResendForm(!showResendForm)}
                      sx={{
                        fontSize: '0.9rem',
                        color: '#6497df',
                        textTransform: 'none'
                      }}
                    >
                      {showResendForm ? 'Ocultar formulario' : '¿No recibiste el correo de verificación?'}
                    </Button>
                  </Grid>
                </Grid>
                
                {/* Formulario para reenviar correo de verificación */}
                {showResendForm && (
                  <Box 
                    component="form" 
                    onSubmit={handleResendVerification}
                    sx={{ 
                      mt: 2, 
                      p: 2, 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 1,
                      bgcolor: '#f5f5f5'
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Reenviar correo de verificación
                    </Typography>
                    
                    {/* Mensaje de éxito */}
                    {resendSuccess && (
                      <Box 
                        sx={{
                          p: 2,
                          mb: 2,
                          width: '100%',
                          borderRadius: 1,
                          bgcolor: '#e8f5e9',
                          color: '#2e7d32',
                          fontSize: '0.9rem'
                        }}
                      >
                        {resendSuccess}
                      </Box>
                    )}
                    
                    {/* Mensaje de error */}
                    {resendError && (
                      <Box 
                        sx={{
                          p: 2,
                          mb: 2,
                          width: '100%',
                          borderRadius: 1,
                          bgcolor: '#ffebee',
                          color: '#d32f2f',
                          fontSize: '0.9rem'
                        }}
                      >
                        {resendError}
                      </Box>
                    )}
                    
                    <CssTextField
                      label="Correo electrónico"
                      variant="outlined"
                      fullWidth
                      required
                      inputRef={resendEmail}
                      type="email"
                      size="small"
                      sx={{ mb: 2 }}
                      InputProps={{
                        style: { fontSize: '1rem', textTransform: 'lowercase' }
                      }}
                      InputLabelProps={{
                        style: { fontSize: '0.9rem' }
                      }}
                    />
                    
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="small"
                      disabled={resendLoading}
                      sx={{ 
                        textTransform: 'none',
                        fontSize: '0.9rem'
                      }}
                    >
                      {resendLoading ? 
                        <CircularProgress size={20} color="inherit" /> : 
                        'Enviar correo de verificación'
                      }
                    </Button>
                  </Box>
                )}
              </form>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default SignIn;
