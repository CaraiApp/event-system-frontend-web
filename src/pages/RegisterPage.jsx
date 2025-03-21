// /* eslint-disable no-empty */
// import { Link, Navigate } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";

// export default function RegisterPage() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [redirect, setRedirect] = useState('');
  

//   async function registerUser(ev){
//     ev.preventDefault();

//     if (password !== confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }

//     try{
//       await axios.post('/register', {
//         name,
//         email,
//         password,
        
//       });
//       alert('Registration Successful')
//       setRedirect(true)
//     }catch(e){
//       alert('Registration failed')
//     }
//   }

//   if (redirect){
//     return <Navigate to={'/login'} />
//   }

//   return (
    
//     <div className ="flex w-full h-full lg:-ml-24 px-10 py-10 justify-between place-items-center mt-12">
//       <div className= "hidden lg:flex flex-col right-box ">
//         <div className="flex flex-col gap-3">
//         <div className="text-3xl font-black">Welcome to</div>

//           <div>
//           <img src="../src/assets/login-page.jpg" alt="" style={{ width: '300px', height: '200px'}}/>
//           </div>  
//         </div>

//         <div className="ml-48 w-80 mt-6">
//         <img src="../src/assets/signuppic.svg" alt="" className='w-full'/>
//         </div>   
      
//     </div>
//       <div className= "bg-white w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl justify-center align-middle ">
    
//         <form className="flex flex-col w-auto items-center" onSubmit={registerUser}>
//             <h1 className='px-3 font-extrabold mb-5 text-primarydark text-2xl'>Sign Up</h1>

//             <div className= "input">
//               {/* <img src={account} alt="Name" className="name"/> */}
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//                 <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
//               </svg>

//               <input type ="text"  placeholder="Name" className="input-et" value={name} onChange={ev => setName(ev.target.value)}/>
//             </div>

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

//               <input type ="password"  placeholder="Password" className="input-et" value={password} onChange={ev => setPassword(ev.target.value)}/>
//             </div>

//             <div className= "input">
//               {/* <img src={account} alt="Name" className="name"/> */}
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
//                 <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clipRule="evenodd" />
//               </svg>
//               <input type ="password"  placeholder="Confirm password" className="input-et" value={confirmPassword} onChange={ev => setConfirmPassword(ev.target.value)}/>
//             </div>

            
//             <div className="w-full py-4">
//               <button type="submit" className="primary w-full"> Create Account </button>
//             </div>

//             <div className="container2">
//               <div className="w-full h-full p-1">
//                 <Link to={'/login'}>
//                   <button type="submit" className="text-black cursor-pointer rounded w-full h-full font-bold" > Sign In</button>
//                 </Link>
//               </div>
//               <div className="w-full h-full p-1">
//                 <Link to={'/register'}>
//                   <button type="submit" className="text-white cursor-pointer rounded w-full h-full bg-primary font-bold" > Sign Up</button>
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

    
//   </div>
//   )
// }

import * as React from "react";
import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
  Grid,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  styled,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
  CircularProgress,
  Box
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
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
      borderColor: "#6497df"
    },
    "&:hover fieldset": {
      borderColor: "white"
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6497df"
    }
  },
  "& .MuiInputLabel-root": {
    fontSize: "1.3rem", // Increase label font size
  },
  "& .MuiInputBase-input": {
    fontSize: "1.3rem", // Increase input font size
  },
  "& .MuiInputBase-input::placeholder": {
    fontSize: "1.1rem", // Increase placeholder font size
  },
});

const SignUp = () => {
  const mediaLessthanmd = useMediaQuery(theme.breakpoints.down("md"));
  const userName = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  
  // Campos adicionales para usuario
  const phoneNumber = useRef();
  const fullName = useRef();
  const address = useRef();
  const city = useRef();
  
  // Campos adicionales para organizador
  const companyName = useRef();
  const taxId = useRef();
  const contactName = useRef();
  const companyAddress = useRef();
  const companyPhone = useRef();
  const website = useRef();
  
  const [role, setRole] = useState("user"); // Default to user role
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous errors and success messages
    setError("");
    setSuccess("");
    setPasswordError("");

    // Check if passwords match
    if (password?.current?.value !== confirmPassword?.current?.value) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    // Create base user object
    let user = {
      username: userName.current.value,
      email: email.current.value.toLowerCase(),
      password: password.current.value,
      role: role || "user", // Include the selected role, default to user
    };
    
    // Añadir campos adicionales según el rol
    if (role === "user") {
      user = {
        ...user,
        fullName: fullName.current?.value || "",
        phoneNumber: phoneNumber.current?.value || "",
        address: address.current?.value || "",
        city: city.current?.value || "",
      };
    } else if (role === "organizer") {
      user = {
        ...user,
        companyName: companyName.current?.value || "",
        taxId: taxId.current?.value || "",
        contactName: contactName.current?.value || "",
        companyAddress: companyAddress.current?.value || "",
        companyPhone: companyPhone.current?.value || "",
        website: website.current?.value || "",
        isApproved: false, // Los organizadores deben ser aprobados por un administrador
      };
    }

    try {
      // Set loading state to true while making the request
      setLoading(true);

      // Usar el servicio API centralizado
      const { default: api } = await import('../services/api.js');
      
      // Hacer la petición a través del servicio API
      const response = await api.auth.register(user);
      
      // Acceder directamente a la respuesta
      const data = response.data;
      
      console.log("User created successfully:", data);
      
      // Mostrar mensaje de éxito con información adicional
      setSuccess(
        `¡Registro exitoso! Por favor, revisa tu correo electrónico (${user.email}) para activar tu cuenta. 
        Si no recibes el correo en unos minutos, verifica tu carpeta de spam o solicita un nuevo correo de verificación en la página de inicio de sesión.`
      );
      
      // Redirigir al login después de 5 segundos
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      console.error("Error completo:", error);
      
      // Mostrar mensaje de error específico del backend si está disponible
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Error al crear la cuenta. Por favor, inténtalo de nuevo.");
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
  
  React.useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider theme={theme}>
             

      <Container component="main" style={{ display: "flex", minHeight: "100vh", marginTop: 50, padding: "20px" }}>
        <CssBaseline />
        {loading && (
          
            <LoadingScreen  />
         
        )}
        <Grid container sx={{ justifyContent: "center" }}>
          <Grid
            item
            md={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              backgroundColor: mediaLessthanmd ? "#f5f5f5" : "transparent",
              padding: mediaLessthanmd ? "20px" : "40px",
            }}
          >
            <form style={{ width: "100%", maxWidth: "400px" }} onSubmit={handleSubmit}>
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
                Crear cuenta
              </Typography>
              
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
              
              {/* Success message display */}
              {success && (
                <Box 
                  sx={{
                    p: 2,
                    mb: 2,
                    width: '100%',
                    borderRadius: 1,
                    bgcolor: '#e8f5e9',
                    color: '#2e7d32',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#2e7d32" style={{marginRight: '8px'}}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  {success}
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CssTextField
                    label="Nombre de usuario"
                    variant="outlined"
                    fullWidth
                    required
                    autoFocus
                    inputRef={userName}
                    InputProps={{
                      style: { fontSize: '1rem' },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '1rem' },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CssTextField
                    label="Correo electrónico"
                    variant="outlined"
                    fullWidth
                    required
                    inputRef={email}
                    type="email"
                    InputProps={{
                      style: { fontSize: '1rem', textTransform: 'lowercase' },
                      inputProps: {
                        style: { textTransform: 'lowercase' }
                      }
                    }}
                    inputProps={{
                      style: { textTransform: 'lowercase' },
                      autoCapitalize: "off"
                    }}
                    InputLabelProps={{
                      style: { fontSize: '1rem' },
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
                      style: { fontSize: '1rem' },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '1rem' },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CssTextField
                    label="Confirmar contraseña"
                    variant="outlined"
                    fullWidth
                    required
                    inputRef={confirmPassword}
                    type="password"
                    error={!!passwordError}
                    helperText={passwordError}
                    InputProps={{
                      style: { fontSize: '1rem' },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '1rem' },
                    }}
                    FormHelperTextProps={{
                      style: { 
                        fontSize: '0.8rem',
                        color: '#d32f2f',
                        marginLeft: 0,
                        marginTop: '4px'
                      }
                    }}
                  />
                </Grid>

                {/* Role Selection Dropdown */}
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="role-select-label" style={{ fontSize: '1rem' }}>Tipo de cuenta</InputLabel>
                    <Select
                      labelId="role-select-label"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      label="Tipo de cuenta"
                      fullWidth
                      style={{ fontSize: '1rem' }}
                    >
                      <MenuItem value="user" style={{ fontSize: '1rem' }}>Usuario</MenuItem>
                      <MenuItem value="organizer" style={{ fontSize: '1rem' }}>Organizador</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Campos adicionales para usuarios */}
                {role === "user" && (
                  <>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold", color: "#444" }}>
                        Información personal
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <CssTextField
                        label="Nombre completo"
                        variant="outlined"
                        fullWidth
                        required
                        inputRef={fullName}
                        InputProps={{
                          style: { fontSize: '1rem' },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '1rem' },
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <CssTextField
                        label="Número de teléfono"
                        variant="outlined"
                        fullWidth
                        inputRef={phoneNumber}
                        InputProps={{
                          style: { fontSize: '1rem' },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '1rem' },
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <CssTextField
                        label="Dirección"
                        variant="outlined"
                        fullWidth
                        inputRef={address}
                        InputProps={{
                          style: { fontSize: '1rem' },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '1rem' },
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <CssTextField
                        label="Ciudad"
                        variant="outlined"
                        fullWidth
                        inputRef={city}
                        InputProps={{
                          style: { fontSize: '1rem' },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '1rem' },
                        }}
                      />
                    </Grid>
                  </>
                )}
                
                {/* Campos adicionales para organizadores */}
                {role === "organizer" && (
                  <>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold", color: "#444" }}>
                        Información de la empresa
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                        Los organizadores requieren aprobación por parte de los administradores antes de poder crear eventos.
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <CssTextField
                        label="Nombre de la empresa"
                        variant="outlined"
                        fullWidth
                        required
                        inputRef={companyName}
                        InputProps={{
                          style: { fontSize: '1rem' },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '1rem' },
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <CssTextField
                        label="CIF/NIF"
                        variant="outlined"
                        fullWidth
                        required
                        inputRef={taxId}
                        InputProps={{
                          style: { fontSize: '1rem' },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '1rem' },
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <CssTextField
                        label="Persona de contacto"
                        variant="outlined"
                        fullWidth
                        required
                        inputRef={contactName}
                        InputProps={{
                          style: { fontSize: '1rem' },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '1rem' },
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <CssTextField
                        label="Dirección de la empresa"
                        variant="outlined"
                        fullWidth
                        required
                        inputRef={companyAddress}
                        InputProps={{
                          style: { fontSize: '1rem' },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '1rem' },
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <CssTextField
                        label="Teléfono de la empresa"
                        variant="outlined"
                        fullWidth
                        required
                        inputRef={companyPhone}
                        InputProps={{
                          style: { fontSize: '1rem' },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '1rem' },
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <CssTextField
                        label="Sitio web"
                        variant="outlined"
                        fullWidth
                        inputRef={website}
                        InputProps={{
                          style: { fontSize: '1rem' },
                        }}
                        InputLabelProps={{
                          style: { fontSize: '1rem' },
                        }}
                      />
                    </Grid>
                  </>
                )}

                <Grid item md={12} xs={12} justifyContent="center">
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
                    disabled={loading || success !== ""} // Disable button while loading or after success
                  >
                    {loading ? 
                      <CircularProgress size={24} color="inherit" /> : 
                      'Crear cuenta'
                    }
                  </Button>
                </Grid>
              </Grid>

              <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Grid item>
                  <Link 
                    to="/login" 
                    style={{ 
                      fontSize: '0.95rem', 
                      fontWeight: 'bold', 
                      textDecoration: 'none', 
                      color: '#6497df'
                    }}
                  >
                    ¿Ya tienes una cuenta? Iniciar sesión
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
