# Admin Dashboard

Este directorio contiene la implementación del panel de administración para la plataforma de eventos.

## Estructura

- `AdminDashboard.jsx`: Componente principal que maneja las rutas y la autenticación.
- `hooks/AdminDashboardContext.jsx`: Contexto para gestionar el estado del dashboard.
- `components/`: Componentes reutilizables.
  - `Chart.jsx`: Gráficos para visualización de datos.
  - `DashboardLayout.jsx`: Layout principal con barra lateral y header.
  - `DataTable.jsx`: Tabla de datos con ordenación, filtrado y paginación.
  - `PageHeader.jsx`: Encabezado de página con título, subtítulo y acciones.
  - `StatCard.jsx`: Tarjetas para mostrar estadísticas.
- `pages/`: Páginas del dashboard.
  - `Overview.jsx`: Panel principal con resumen de métricas.
  - `UserManagement.jsx`: Gestión de usuarios y organizadores.
  - `EventManagement.jsx`: Gestión de eventos.
  - `CategoryManagement.jsx`: Gestión de categorías.
  - `Reports.jsx`: Informes y análisis.
  - `SystemSettings.jsx`: Configuración del sistema.
- `services/`: Servicios para comunicación con la API.
  - `api.js`: Cliente API con implementación de datos estáticos.

## Características

- Autenticación y autorización basada en JWT
- Protección de rutas para administradores
- Gestión completa de usuarios y organizadores
- Gestión de eventos (aprobación, rechazo, destacados)
- Gestión de categorías
- Informes y análisis
- Configuración del sistema y correo electrónico

## Implementación

La implementación utiliza React Router para navegación, Material UI para componentes, y un sistema de contexto para estado global. Los datos se obtienen a través de servicios API con implementación de fallback para datos estáticos.

## Uso

Para acceder al dashboard, navega a `/admin`. Se requiere autenticación con rol de administrador.