import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  // If no token is found, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }
  // If token is present, allow access to the route
  return element;
};

export const AdminRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  // If no token is found, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  // If user is not an organizer (admin), redirect to home
  if (role !== 'organizer') {
    return <Navigate to="/home" />;
  }
  
  // If token is present and user is an organizer, allow access to the route
  return element;
};

export default PrivateRoute;
