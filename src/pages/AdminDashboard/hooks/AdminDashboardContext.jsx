import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../services/api.js';
import { jwtDecode } from 'jwt-decode';

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
    navItems: [
      { path: '/admin/overview', label: 'Dashboard', icon: 'dashboard' },
      { path: '/admin/users', label: 'Usuarios', icon: 'people' },
      { path: '/admin/organizers', label: 'Organizadores', icon: 'business' },
      { path: '/admin/events', label: 'Eventos', icon: 'event' },
      { path: '/admin/categories', label: 'Categorías', icon: 'category' },
      { path: '/admin/reports', label: 'Informes', icon: 'bar_chart' },
      { path: '/admin/settings', label: 'Configuración', icon: 'settings' }
    ]
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log('[AdminDashboardContext] Iniciando verificación de autenticación');
        
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('[AdminDashboardContext] No hay token disponible');
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Decodificar token para obtener información del usuario
        try {
          const decodedToken = jwtDecode(token);
          console.log('[AdminDashboardContext] Token decodificado:', 
                      decodedToken ? { id: decodedToken.id, role: decodedToken.role } : 'Inválido');
                      
          if (!decodedToken) {
            console.error("[AdminDashboardContext] Token inválido o no se pudo decodificar");
            throw new Error("Token inválido");
          }
          
          // Guardar la información del usuario
          const userData = {
            id: decodedToken.id,
            username: decodedToken.username || decodedToken.email,
            role: decodedToken.role,
          };
          console.log('[AdminDashboardContext] Información de usuario extraída:', userData);
          setUser(userData);
          
          // Verificar si el usuario es administrador
          if (decodedToken.role !== 'admin') {
            console.warn('[AdminDashboardContext] Usuario no tiene rol de administrador:', decodedToken.role);
            setError('No tienes permisos de administrador para acceder a este área.');
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }

          console.log('[AdminDashboardContext] Autenticación satisfactoria como administrador');
          
          // Usar configuración estática de UI para evitar problemas en producción
          console.log('[AdminDashboardContext] Configuración estática cargada');
          
          // Si llegamos aquí, el usuario está autenticado
          setIsAuthenticated(true);
        } catch (err) {
          console.error("[AdminDashboardContext] Error decodificando token:", err);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('[AdminDashboardContext] Error verificando autenticación:', err);
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
      
      if (response.data && response.data.data && response.data.data.token) {
        const { token, user } = response.data.data;
        
        localStorage.setItem('token', token);
        setUser(user);
        setIsAuthenticated(true);
        setError(null);
        
        return { success: true };
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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