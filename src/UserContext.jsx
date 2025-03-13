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
          
          // Intentamos con la ruta completa absoluta en lugar de relativa
          const apiUrl = `${axios.defaults.baseURL}/api/v1/users/getSingleUser`;
          console.log('API URL for user fetch:', apiUrl);
          
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            // Asegurar que se envían cookies y credenciales
            withCredentials: true
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