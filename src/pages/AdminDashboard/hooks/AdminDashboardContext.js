import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../services/api';

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

        // Intentar obtener la configuración de UI para verificar si el token es válido
        const response = await adminApi.getUiConfig('/admin/overview');
        setUiConfig(response.data.data);
        
        // Si llegamos aquí, el usuario está autenticado
        setIsAuthenticated(true);
        
        // Extraer información del usuario del token (si usas JWT)
        // Esta es una implementación simple; en producción, podrías querer verificar el token en el servidor
        const parseJwt = (token) => {
          try {
            return JSON.parse(atob(token.split('.')[1]));
          } catch (e) {
            return null;
          }
        };
        
        const decodedToken = parseJwt(token);
        if (decodedToken) {
          setUser({
            id: decodedToken.id,
            username: decodedToken.username,
            role: decodedToken.role,
          });
        }
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