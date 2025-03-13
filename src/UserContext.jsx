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
          // Usar la URL completa con la variable de entorno
          const response = await axios.get('/api/v1/users/getSingleUser', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data && response.data.data) {
            setUser(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching user in UserContext:', error);
          if (error.response && error.response.status === 401) {
            // Token inválido o expirado
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