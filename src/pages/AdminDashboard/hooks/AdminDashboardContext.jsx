import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../services/api.js';

// Crear contexto
const AdminDashboardContext = createContext();

// Proveedor del contexto
export const AdminDashboardProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uiConfig, setUiConfig] = useState({
    hideHeader: true,
    hideFooter: true,
    isDashboard: true,
    dashboardType: 'admin',
    navItems: []
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Parseamos el token para obtener información del usuario
        const parseJwt = (token) => {
          try {
            return JSON.parse(atob(token.split('.')[1]));
          } catch (e) {
            console.error("Error al decodificar token:", e);
            return null;
          }
        };
        
        const decodedToken = parseJwt(token);
        if (!decodedToken) {
          console.error("Token inválido o no se pudo decodificar");
          throw new Error("Token inválido");
        }
        
        // Guardar la información del usuario
        setUser({
          id: decodedToken.id,
          username: decodedToken.username || decodedToken.email,
          role: decodedToken.role,
        });
        
        // Verificar si el usuario es administrador
        if (decodedToken.role !== 'admin') {
          setError('No tienes permisos de administrador para acceder a este área.');
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Intentar obtener la configuración de UI
        try {
          const response = await adminApi.getUiConfig('/admin/overview');
          if (response && response.data && response.data.data) {
            setUiConfig(response.data.data);
          }
        } catch (uiErr) {
          console.warn('Error obteniendo configuración UI, usando configuración por defecto:', uiErr);
          // Usar configuración por defecto si falla
          setUiConfig({
            hideHeader: true,
            hideFooter: true,
            isDashboard: true,
            dashboardType: 'admin',
            navItems: [
              { path: '/admin/overview', label: 'Panel de Control', icon: 'dashboard' },
              { path: '/admin/users', label: 'Usuarios', icon: 'people' },
              { path: '/admin/organizers', label: 'Organizadores', icon: 'business' },
              { path: '/admin/events', label: 'Eventos', icon: 'event' },
              { path: '/admin/settings', label: 'Configuración', icon: 'settings' }
            ]
          });
        }
        
        // Si llegamos aquí, el usuario está autenticado
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error verificando autenticación:', err);
        setError('Error al verificar la autenticación. Por favor, inicia sesión de nuevo.');
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await adminApi.login(credentials);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      return { success: false, error: err.response?.data?.message || 'Error al iniciar sesión' };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setLoading(true);
      await adminApi.logout();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // Verificar si el usuario tiene rol de administrador
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Valores a compartir en el contexto
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    uiConfig,
    login,
    logout,
    isAdmin,
    setError,
  };

  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error('useAdminDashboard debe ser usado dentro de un AdminDashboardProvider');
  }
  return context;
};

export default AdminDashboardContext;