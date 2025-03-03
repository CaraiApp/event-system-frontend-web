// import React from 'react'
// import {Routes, Route, Navigate} from 'react-router-dom'
// import Login from "../pages/LoginPage"
// import Register from "../pages/RegisterPage"
// import CreateEvent from "../pages/CreateEvent"
// import Home from '../pages/Home';
// import Events from '../pages/Events';
// import EventPage from "../pages/EventPage/EventPage";
// import OrderSummary from "../pages/OrderSummary/OrderSummary";
// import Wallet from "../pages/Wallet/Wallet";
// // import About from '../pages/About'
// // import Login from '../pages/Login'
// // import Register from '../pages/Register'
// // import Events from '../pages/Events'
// // import EventDetails from '../pages/EventDetails'
// // import Notification from '../pages/Notification'
// // import SearchResultList from '../pages/SearchResultList'
// // import Gallery from '../pages/Gallery'
// // import Team from '../pages/Team'

// const About = () => <div style={{ padding: "20px" }}>This is the About page</div>;
// // const Login = () => <div style={{ padding: "20px" }}>This is the Books page</div>;
// // const Register = () => <div style={{ padding: "20px" }}>This is the FAQs page</div>;
// // const Events = () => <div style={{ padding: "20px" }}>404: Page Not Found</div>;

// // const EventDetails = () => <div style={{ padding: "20px" }}>This is the About page</div>;
// const Notification = () => <div style={{ padding: "20px" }}>This is the Books page</div>;
// const SearchResultList = () => <div style={{ padding: "20px" }}>This is the FAQs page</div>;
// const Gallery = () => <div style={{ padding: "20px" }}>404: Page Not Found</div>;
// const Team = () => <div style={{ padding: "20px" }}>404: Page Not Found</div>;

// const Routers = () => {
//   return (
//     <Routes>
//         <Route path = '/' element = {<Navigate to = '/home'/>} />
//         <Route path = '/home' element = {<Home/>} />
//         <Route path = '/create-event' element = {<CreateEvent/>} />
//         <Route path = '/events' element = {<Events/>} />
//         <Route path = '/event-detail' element = {<EventPage/>} />
//                <Route path='/event/:id/ordersummary' element = {<OrderSummary />} />
//                <Route path='/wallet' element = {<Wallet />} />

//         <Route path = '/about' element = {<About/>} />
//         <Route path = '/team' element = {<Team/>} />
//         <Route path = '/gallery' element = {<Gallery/>} />
//         <Route path = '/login' element = {<Login/>} />
//         <Route path = '/register' element = {<Register/>} />
//         <Route path = '/events' element = {<Events/>} />
//         {/* <Route path = '/events/:id'  element = {<EventDetails/>} /> */}
//         <Route path = '/events/search'  element = {<SearchResultList/>} />
//         <Route path = '/notification' element = {<Notification/>} />

//     </Routes>
//   )
// }

// export default Routers


import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import Login from "../pages/LoginPage"
import Register from "../pages/RegisterPage"
import CreateEvent from "../pages/CreateEvent"
import Home from '../pages/Home';
import Events from '../pages/Events';
import EventPage from "../pages/EventPage/EventPage";
import OrderSummary from "../pages/OrderSummary/OrderSummary";
import Wallet from "../pages/Wallet/Wallet";
import PrivateRoute from "./PrivateRoute";
import SeatMapPage from '../pages/SeatMapPage/SeatMapPage'
import AboutUs from '../pages/AboutUs'
import ContactUs from '../pages/ContactUs'
import Pricing from '../pages/Pricing';
import Pricingg from '../pages/Pricingg';

import WalkIn from '../pages/WalkIn'
import SeatMapModal from '../pages/SeatMapPage/SeatMapPage'
import OrganizorMapPage from '../pages/OrganizerMap/OrganizorMapPage'
import PaymentSuccess from '../pages/PaymentSuccess'
// import About from '../pages/About'
// import Login from '../pages/Login'
// import Register from '../pages/Register'
// import Events from '../pages/Events'
// import EventDetails from '../pages/EventDetails'
// import Notification from '../pages/Notification'
// import SearchResultList from '../pages/SearchResultList'
// import Gallery from '../pages/Gallery'
// import Team from '../pages/Team'

const About = () => <div style={{ padding: "20px" }}>This is the About page</div>;
// const Login = () => <div style={{ padding: "20px" }}>This is the Books page</div>;
// const Register = () => <div style={{ padding: "20px" }}>This is the FAQs page</div>;
// const Events = () => <div style={{ padding: "20px" }}>404: Page Not Found</div>;

// const EventDetails = () => <div style={{ padding: "20px" }}>This is the About page</div>;
const Notification = () => <div style={{ padding: "20px" }}>This is the Books page</div>;
const SearchResultList = () => <div style={{ padding: "20px" }}>This is the FAQs page</div>;
const Gallery = () => <div style={{ padding: "20px" }}>404: Page Not Found</div>;
const Team = () => <div style={{ padding: "20px" }}>404: Page Not Found</div>;

const Routers = () => {
  const token = localStorage.getItem('token');
  return (
    // <>

    // <Routes>
    //   {/* Public Routes */}
    //   <Route path="/login" element={<Login />} />
    //   <Route path="/register" element={<Register />} />

    //   {/* Private Routes */}
    //   <Route path="/" element={token ? <Navigate to="/home" />: <Navigate to="/login" />} />
    //   <Route path="/home" element={<PrivateRoute element={<Home />} />} />
    //   <Route path="/create-event" element={<PrivateRoute element={<CreateEvent />} />} />
    //   <Route path="/events" element={<PrivateRoute element={<Events />} />} />
    //   <Route path="/event-detail/:id" element={<PrivateRoute element={<EventPage />} />} />
    //   <Route path="/seatMap" element={<PrivateRoute element={<SeatMapPage />} />} />

    //   <Route path="/event/ordersummary" element={<PrivateRoute element={<OrderSummary />} />} />
    //   <Route path="/wallet" element={<PrivateRoute element={<Wallet />} />} />
    //   <Route path="/about" element={<PrivateRoute element={<AboutUs />} />} />
    //   <Route path="/contact" element={<PrivateRoute element={<ContactUs />} />} />
    //   <Route path="/team" element={<PrivateRoute element={<Team />} />} />
    //   <Route path="/gallery" element={<PrivateRoute element={<Gallery />} />} />

    //   {/* Public Routes */}
    //   <Route path="/events/search" element={<SearchResultList />} />
    //   <Route path="/notification" element={<Notification />} />
    // </Routes>
    // </>

    <>

    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/" element={<Navigate to="/CreateEvent" />} />
      <Route path="/create-event" element={<CreateEvent/> } /> */}


      

   <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/create-event" element={<PrivateRoute element={<CreateEvent />} />} />
      <Route path="/events"  element={<Events />}  />
      <Route path="/event-detail/:id" element={<EventPage />} />
      <Route path="/seatMap" element={<PrivateRoute element={<SeatMapPage />} />} />
      <Route path="/pricing" element={<PrivateRoute element={<Pricing />} />} />
      <Route path="/pricingg" element={<Pricingg />} />
      <Route path="/event/ordersummary" element={<PrivateRoute element={<OrderSummary />} />} />
      <Route path="/wallet" element={<PrivateRoute element={<Wallet />} />} />
      <Route path="/about" element={<AboutUs />}  />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/congrtspaymentsuccess" element={<PaymentSuccess />} />

      <Route path="/team" element={<PrivateRoute element={<Team />} />} />
      <Route path="/gallery" element={<PrivateRoute element={<Gallery />} />} />
      <Route path="/walk-in-events" element={<WalkIn  />} />
 <Route path="/template" element={<OrganizorMapPage />} />
   
      <Route path="/events/search" element={<SearchResultList />} />
      <Route path="/notification" element={<Notification />} />
    </Routes>
    </>
  )
}

export default Routers
