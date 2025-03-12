// import React, { useEffect, useState } from 'react'
// import {Button} from 'reactstrap'
// import {NavLink, Link} from 'react-router-dom'
// import logo from '../../assets/header-logo.png'
// import { AiOutlineMenu } from "react-icons/ai";
// import './Header.css'

// const nav__links = [
//   {
//     path: '/home',
//     display: 'Home'
//   },
//   {
//     path: '/about',
//     display: 'About'
//   },
//   {
//     path: '/events',
//     display: 'Events'
//   },
//   {
//     path: '/gallery',
//     display: 'Gallery'
//   },
//   {
//     path: '/team',
//     display: 'Team'
//   }


// ]

// const Header = () => {

//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   //for mobile menu
//   const toggleMenu = () => {
//     setIsMenuOpen((prevState) => !prevState);
//   };

//   //to close mobile menu on scroll
//   const handleScroll = () =>{
//     setIsMenuOpen(false)
//   }

//   useEffect(()=>{
//     window.addEventListener('scroll', handleScroll);

//     return ()=>{
//       window.removeEventListener('scroll', handleScroll);
//     } 
//   }, [])

//   return (
//     <header className='header'>
          
//       <div className={`menu-btn ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
//         <i><AiOutlineMenu/></i>
//       </div>

//       <div className="navbar__logo">
//         <img src={logo} alt=""/>
//       </div>

//       <nav className={`navbar__links ${isMenuOpen ? 'active' : ''}`}>
//         <ul>

//           {nav__links.map((item, index)=>(
//             <li className="navbar__links__item" key= {index} onClick={toggleMenu}>
//               <NavLink to = {item.path} className= {navClass => navClass.isActive? "active__link": ""} 
//               >{item.display}</NavLink>
//             </li>
//           ))}

//         </ul>
//       </nav>

//       <div className="navbar__right__btns">   
//         <Button style={{color: '#3795d6'}} className='btn secondary__btn'><Link to = '/login'>Login</Link></Button>
//         <Button style={{background: '#3795d6'}} className='btn primary__btn'><Link to = '/register'>Register</Link></Button>
//       </div>
//   </header>
//   )
// }

// export default Header
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'reactstrap';
import { NavLink, Link, useNavigate, useLoaderData, useLocation } from 'react-router-dom';
import logo from '../../assets/header-logo.png';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { RxExit } from 'react-icons/rx';
import './Header.css';
import { Avatar } from '@mui/material';
import axios from 'axios';

const nav__links = [
  { path: '/home', display: 'Hogar' },
  { path: '/events', display: 'Eventos' },
  { path: '/about', display: 'Sobre nosotras' },
  { path: '/pricingg', display: 'Precios' },
  { path: '/contact', display: 'Contacto' },
  
  { path: '/walk-in-events', display: 'Entrar' },
];

const Header = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation(); // Track route changes

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const dropdownRef = useRef(null); // Reference for the dropdown container

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen((prevState) => !prevState);

  // Toggle profile dropdown
  const toggleDropdown = () => setIsDropdownOpen((prevState) => !prevState);

  // Close mobile menu on scroll
  const handleScroll = () => setIsMenuOpen(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  console.log(isMobile, 'is mobileee')
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Fetch user details
  const fetchUser = async () => {
    if (token) {
      try {
        console.log("Fetching user with token:", token);
        // Use direct URL for Railway backend
        const response = await axios.get(`https://event-system-backend-production.up.railway.app/api/v1/users/getSingleUser`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in headers
          },
        });
        console.log("User data response:", response.data);
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        if (error.response && error.response.status === 401) {
          // Clear local storage and handle unauthorized access
          console.log("Unauthorized access, clearing token");
          localStorage.clear();
          // Optionally, redirect to login page
        } else {
          console.error('Detailed error info:', error.response || error.message || error);
        }
      }
    }
  };
  

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close the dropdown
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchUser();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="header">
      {/* Mobile menu toggle button */}
      <div className={`menu-btn ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <i>
          <AiOutlineMenu />
        </i>
      </div>

      {/* Logo */}

      {!isMobile && (
      <div className="navbar__logo">
      <img src={logo} alt="Logo" />
    </div>
      )}


      {/* Navigation Links */}
      {/* {token && ( */}
        <nav className={`navbar__links ${isMenuOpen ? 'active' : ''}`}>

        

          <ul>
            {nav__links.map((item, index) => (
              <li className="navbar__links__item"  key={index} onClick={toggleMenu}>
                <NavLink
                  to={item.path}
                  className={(navClass) => (navClass.isActive ? 'active__link' : '')}
                >
                  {item.display}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      {/* )} */}

      {/* Right-side Buttons */}
      <div className="navbar__right__btns">
        {token ? (
          <>
            {user?.role === 'organizer' && (
              <Button className="btn primary__btn">
                <Link to="/pricing">
                
                {isMobile ? 'Add Event' :  'Create Event'}</Link>
              </Button>
            )}
{user?.username && (
  <div className="profile-container" ref={dropdownRef}>
              <div className="profile-wrapper" onClick={toggleDropdown}>
                <div className="profile-avatar">
                  <Avatar
                    alt={user?.username || 'User'}
                    sx={{ bgcolor: '#2A2A35', cursor: 'pointer',
                      width: { xs: 30, sm: 35, md: 48 }, // Smaller width for mobile
                      height: { xs: 30, sm: 35, md: 48 }, // Smaller height for mobile
                      fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' } // Adjust font size
                     }}
                  >
                    {user?.username ? user?.username[0].toUpperCase() : 'U'}
                  </Avatar>
                </div>
                <div className="profile-info">
                  <span className="profile-name">{user?.username}</span>
                  <BsFillCaretDownFill
                    className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}
                  />
                </div>
              </div>

              {/* Custom Dropdown */}
              {isDropdownOpen && (
                <div className="custom-dropdown">
                 {user?.role === "user" && (
                  <Link to="/wallet" className="dropdown-item">
                    Billetera
                  </Link>
                 )} 
                  <div className="dropdown-item" onClick={handleLogout}>
                    <RxExit />
                    Finalizar la sesión

                  </div>
                </div>
              )}
            </div>
)}
            
          </>
        ) : (
          <>
           <Link to="/login">
            <Button
              className="btn secondary__btn"
              style={{
                backgroundColor: 'rgb(247, 245, 245)',
                border: '2.3px solid #2A2A35',
                fontWeight: 'bold',
                color: '#3795D6'
              }}
            >
             Acceso
            </Button>
            </Link>

            <Link to="/register">
            <Button
              className="btn secondary__btn"
              style={{
                backgroundColor: 'rgb(247, 245, 245)',
                border: '2.3px solid #2A2A35',
                fontWeight: 'bold',
                color: '#3795D6'
              }}
            >
              Registro
            </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
