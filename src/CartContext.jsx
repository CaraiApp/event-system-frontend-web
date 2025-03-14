import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { bookingAPI } from './services/api';

// Duración del temporizador en milisegundos (7 minutos)
const CART_TIMEOUT = 7 * 60 * 1000;

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Generar o recuperar un ID de sesión único para este usuario/navegador
  const [sessionId, setSessionId] = useState(() => {
    const storedId = localStorage.getItem('cartSessionId');
    if (storedId) return storedId;
    
    const newId = uuidv4();
    localStorage.setItem('cartSessionId', newId);
    return newId;
  });
  
  const [cartItems, setCartItems] = useState([]);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temporarySeats, setTemporarySeats] = useState([]);
  
  // Recuperar carrito desde localStorage al inicio
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    const storedEvent = localStorage.getItem('cartEventId');
    const storedExpiry = localStorage.getItem('cartExpiryTime');
    
    if (storedCart && storedEvent && storedExpiry) {
      try {
        const parsedCart = JSON.parse(storedCart);
        const parsedExpiry = new Date(storedExpiry);
        
        // Verificar si el carrito aún no ha expirado
        if (parsedExpiry > new Date()) {
          setCartItems(parsedCart);
          setCurrentEventId(storedEvent);
          setExpiryTime(parsedExpiry);
        } else {
          // Si ha expirado, limpiar localStorage y estado
          clearCart(storedEvent);
        }
      } catch (e) {
        console.error('Error parsing stored cart:', e);
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartEventId');
        localStorage.removeItem('cartExpiryTime');
      }
    }
  }, []);
  
  // Obtener asientos temporalmente reservados por otros usuarios
  const fetchTemporarySeats = async (eventId) => {
    if (!eventId) return;
    
    try {
      // Intentar obtener asientos temporales
      const response = await bookingAPI.getTempBookedSeats(eventId);
      if (response.data && response.data.data) {
        setTemporarySeats(response.data.data);
      }
    } catch (error) {
      // Si recibimos un 404, significa que el endpoint no existe todavía
      // Esta es una solución temporal hasta que el backend se despliegue
      console.error('Error fetching temporary seats:', error);
      console.warn('El sistema de reservas temporales aún no está disponible en el servidor');
      
      // En caso de error, asumimos que no hay asientos temporalmente reservados
      setTemporarySeats([]);
    }
  };
  
  // Actualizar temporarySeats cada 15 segundos para mantener sincronización
  useEffect(() => {
    if (currentEventId) {
      fetchTemporarySeats(currentEventId);
      
      // Configurar intervalos para actualizar asientos temporales
      const interval = setInterval(() => {
        fetchTemporarySeats(currentEventId);
      }, 15000); // Cada 15 segundos
      
      return () => clearInterval(interval);
    }
  }, [currentEventId]);
  
  // Actualizar contador de tiempo restante
  useEffect(() => {
    if (!expiryTime) {
      setTimeRemaining(0);
      return;
    }
    
    const calculateRemaining = () => {
      const now = new Date();
      const expiry = new Date(expiryTime);
      const diff = expiry - now;
      setTimeRemaining(Math.max(0, diff));
      
      // Si el tiempo expiró, limpiar carrito
      if (diff <= 0 && currentEventId) {
        clearCart(currentEventId);
      }
    };
    
    calculateRemaining();
    const timer = setInterval(calculateRemaining, 1000);
    
    return () => clearInterval(timer);
  }, [expiryTime, currentEventId]);
  
  // Guardar cambios del carrito en localStorage
  useEffect(() => {
    if (cartItems.length > 0 && currentEventId && expiryTime) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      localStorage.setItem('cartEventId', currentEventId);
      localStorage.setItem('cartExpiryTime', expiryTime.toISOString());
    }
  }, [cartItems, currentEventId, expiryTime]);
  
  // Añadir asientos al carrito
  const addToCart = async (eventId, seats) => {
    setLoading(true);
    setError(null);
    
    // Si cambiamos de evento, limpiar carrito anterior
    if (currentEventId && eventId !== currentEventId && cartItems.length > 0) {
      await clearCart(currentEventId);
    }
    
    try {
      // Crear/actualizar reserva temporal en el backend
      const response = await bookingAPI.createTempBooking(eventId, seats, sessionId);
      
      if (response.data && response.data.status === "success") {
        setCartItems(seats);
        setCurrentEventId(eventId);
        setExpiryTime(new Date(response.data.data.expiryTime));
      } else {
        setError('No se pudieron reservar los asientos temporalmente');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      let errorMessage = 'Error al reservar asientos';
      
      // En caso de 404 (API no disponible todavía)
      if (error.response && error.response.status === 404) {
        console.warn('El sistema de reservas temporales aún no está disponible. Usando modo local.');
        
        // Crear una expiración local (7 minutos desde ahora)
        const expiryTime = new Date(new Date().getTime() + (7 * 60 * 1000));
        
        // Simular respuesta exitosa localmente
        setCartItems(seats);
        setCurrentEventId(eventId);
        setExpiryTime(expiryTime);
        
        // Guardar en localStorage
        localStorage.setItem('cartItems', JSON.stringify(seats));
        localStorage.setItem('cartEventId', eventId);
        localStorage.setItem('cartExpiryTime', expiryTime.toISOString());
        
        // No mostrar error
        setLoading(false);
        return;
      }
      
      if (error.response && error.response.data) {
        // Si hay asientos temporalmente reservados por otros, mostrarlos
        if (error.response.data.tempReservedSeats) {
          errorMessage = `Algunos asientos ya están reservados: ${error.response.data.tempReservedSeats.join(', ')}`;
        } 
        // Si hay asientos permanentemente reservados, mostrarlos
        else if (error.response.data.bookedSeats) {
          errorMessage = `Algunos asientos ya están reservados permanentemente: ${error.response.data.bookedSeats.join(', ')}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Limpiar carrito y liberar asientos en el backend
  const clearCart = async (eventId) => {
    setLoading(true);
    
    if (eventId) {
      try {
        await bookingAPI.releaseTempBooking(eventId, sessionId);
      } catch (error) {
        console.error('Error releasing temporary booking:', error);
        // Si es un 404, es normal (API no disponible aún)
        if (error.response && error.response.status === 404) {
          console.warn('El sistema de reservas temporales aún no está disponible en el servidor');
        }
      }
    }
    
    // Limpiar todo el estado del carrito
    setCartItems([]);
    setCurrentEventId(null);
    setExpiryTime(null);
    setError(null);
    
    // Limpiar localStorage
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartEventId');
    localStorage.removeItem('cartExpiryTime');
    
    setLoading(false);
  };
  
  // Verificar si un asiento está en el carrito o reservado temporalmente
  const isSeatReserved = (seat) => {
    // Verificar si está en el carrito actual
    const inCart = cartItems.includes(seat);
    
    // Verificar si está reservado temporalmente por otros usuarios
    const tempReserved = temporarySeats.includes(seat);
    
    return inCart || tempReserved;
  };
  
  // Formatear tiempo restante en minutos y segundos
  const formatTimeRemaining = () => {
    if (timeRemaining <= 0) return '0:00';
    
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        clearCart,
        loading,
        error,
        timeRemaining,
        formatTimeRemaining,
        isSeatReserved,
        temporarySeats,
        sessionId,
        fetchTemporarySeats
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto del carrito
export const useCart = () => useContext(CartContext);