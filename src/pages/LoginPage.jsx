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
import {
  Button,
  CssBaseline,
  TextField,
  Link,
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
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

const theme = createTheme();

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

  const [loading, setLoading] = React.useState(false); // Loading state

  const mediaLessthanmd = useMediaQuery(theme.breakpoints.down("md"));
  const email = useRef();
  const password = useRef();

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    e.preventDefault();

    const user = {
      email: email.current.value,
      password: password.current.value,
    };

    try {
      // Set loading state to true while making the request
      setLoading(true);

      // Use absolute URL directly for testing
      const response = await fetch('https://event-system-backend-production.up.railway.app/api/v1/users/loginUser', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User created successfully:", data);

             // Store token and role in localStorage
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("role", data.data.user.role);
        // Redirect to login page after successful signup
        navigate("/home");
      } else {
        const errorData = await response.json();
        console.log("Error:", errorData);
        // Handle error (e.g., show error message)
      }
    } catch (error) {
      console.log("Request failed:", error);
      // Handle network or other errors
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
    <>
        
    
      <ThemeProvider theme={theme}>
        <Container
          component="main"
          style={{ display: "flex", height: "100vh" , marginTop: 150}}
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
                  sx={{ mb: 3, textAlign: "center" }}
                >
                 INICIAR SESIÓN

                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CssTextField
                      label="Correo electrónico"
                      variant="outlined"
                      fullWidth
                      required
                      inputRef={email}
                      type="email"
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
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      disabled={loading} // Disable button while loading
                    >
                   Iniciar sesión


                    </Button>
                  </Grid>
                </Grid>

                <Grid container justifyContent="center">
                  {/* <Grid item>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid> */}
                  <Grid item>
                    <Link href="/register" variant="body2" style={{fontSize: 16, fontWeight: 'bold'}}>
                      {"¿No tienes una cuenta? Inscribirse"}
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default SignIn;
