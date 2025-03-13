/* eslint-disable react/prop-types */
import {createContext, useEffect, useState} from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({children}){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token && !user) {
        try {
          setLoading(true);
          
          console.log('Fetching user data with token:', token);
          
          console.log('Fetching user data...');
          
          const response = await axios.get('/api/v1/users/getSingleUser', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          console.log('User fetch response:', response);
          
          if (response.data && response.data.data) {
            setUser(response.data.data);
            console.log('User data set successfully:', response.data.data);
          }
        } catch (error) {
          console.error('Error fetching user in UserContext:', error);
          console.error('Error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          });
          
          if (error.response && error.response.status === 401) {
            // Token inválido o expirado
            console.log('Removing invalid token');
            localStorage.removeItem('token');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  return (
    <UserContext.Provider value={{user, setUser, loading}}>
      {children}
    </UserContext.Provider>
  );
}