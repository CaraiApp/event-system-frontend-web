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


import React, { Suspense } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import Login from "../pages/LoginPage"
import Register from "../pages/RegisterPage"
import ForgotPassword from "../pages/ForgotPassword"
import ResetPassword from "../pages/ResetPassword"
import CreateEvent from "../pages/CreateEvent"
import Home from '../pages/Home';
import Events from '../pages/Events';
import EventPage from "../pages/EventPage/EventPage";
import OrderSummary from "../pages/OrderSummary/OrderSummary";
import Wallet from "../pages/Wallet/Wallet";
import PrivateRoute, { AdminRoute, OrganizerRoute } from "./PrivateRoute";
import SeatMapPage from '../pages/SeatMapPage/SeatMapPage'
import AboutUs from '../pages/AboutUs'
import ContactUs from '../pages/ContactUs'
import Pricing from '../pages/Pricing';
import Pricingg from '../pages/Pricingg';

// Dashboard de Organizador
import OrganizerDashboard from '../pages/OrganizerDashboard/OrganizerDashboard';
import Overview from '../pages/OrganizerDashboard/pages/Overview';
import OrganizerEvents from '../pages/OrganizerDashboard/pages/Events';
import EventStatistics from '../pages/OrganizerDashboard/pages/EventStatistics';
import EventEdit from '../pages/OrganizerDashboard/pages/EventEdit';
import Sales from '../pages/OrganizerDashboard/pages/Sales';
import Attendees from '../pages/OrganizerDashboard/pages/Attendees';
import Settings from '../pages/OrganizerDashboard/pages/Settings';
import MapManager from '../pages/OrganizerDashboard/pages/MapManager/MapManager';

// Dashboard de Administrador
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';
import AdminHome from '../pages/AdminDashboard/pages/Dashboard';
import UserManagement from '../pages/AdminDashboard/pages/UserManagement';
import EventManagement from '../pages/AdminDashboard/pages/EventManagement';
import Reports from '../pages/AdminDashboard/pages/Reports';
import CategoryManagement from '../pages/AdminDashboard/pages/CategoryManagement';
import SystemSettings from '../pages/AdminDashboard/pages/SystemSettings';

import WalkIn from '../pages/WalkIn'
import SeatMapModal from '../pages/SeatMapPage/SeatMapPage'
import OrganizorMapPage from '../pages/OrganizerMap/OrganizorMapPage'
import PaymentSuccess from '../pages/PaymentSuccess'
import TemplateManager from '../pages/TemplateManager/TemplateManager'
import TemplateEditor from '../pages/TemplateManager/TemplateEditor'

// Placeholder for VerifyEmail component - will need to be created
const VerifyEmail = () => {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Verificación de correo electrónico</h2>
      <p>Verificando tu dirección de correo electrónico...</p>
    </div>
  );
};
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
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/restablecer-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      
      {/* Main Routes */}   
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/create-event" element={<PrivateRoute element={<CreateEvent />} />} />
      <Route path="/events"  element={<Events />}  />
      <Route path="/event-detail/:id" element={<EventPage />} />
      <Route path="/seatMap" element={<PrivateRoute element={<SeatMapPage />} />} />
      <Route path="/seatMap/:id" element={<PrivateRoute element={<SeatMapPage />} />} />
      <Route path="/pricing" element={<PrivateRoute element={<Pricing />} />} />
      <Route path="/pricingg" element={<Pricingg />} />
      <Route path="/event/ordersummary" element={<PrivateRoute element={<OrderSummary />} />} />
      <Route path="/wallet" element={<PrivateRoute element={<Wallet />} />} />
      <Route path="/about" element={<AboutUs />}  />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/congrtspaymentsuccess" element={<PaymentSuccess />} />

      {/* Dashboard de Organizador - Ruta independiente */}
      <Route path="/organizer" element={<OrganizerRoute element={<OrganizerDashboard />} />}>
        <Route index element={<Overview />} />
        <Route path="events" element={<OrganizerEvents />} />
        <Route path="events/:id/statistics" element={<EventStatistics />} />
        <Route path="events/:id/edit" element={<EventEdit />} />
        <Route path="sales" element={<Sales />} />
        <Route path="attendees" element={<Attendees />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Dashboard de Administrador - Ruta independiente */}
      <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />}>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="communications" element={<Reports />} /> {/* Falta implementar */}
        <Route path="templates" element={<CategoryManagement />} /> {/* Falta implementar */}
        <Route path="organizers" element={<UserManagement />} /> {/* Filtro especial para organizadores */}
      </Route>

      {/* Template Manager (accesible por admin y organizador) */}
      <Route path="/template-manager" element={<PrivateRoute element={<TemplateManager />} />} />
      <Route path="/template-editor" element={<PrivateRoute element={<TemplateEditor />} />} />
      
      {/* QR Scanner para validación de entradas */}
      <Route path="/qr-scanner" element={<OrganizerRoute element={React.lazy(() => import('../pages/QRScanner/QRScanner'))} />} />

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
