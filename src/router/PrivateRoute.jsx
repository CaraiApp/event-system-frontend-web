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
export default PrivateRoute;
