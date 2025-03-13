# Configuración de Variables de Entorno en Vercel

Este documento explica cómo configurar correctamente las variables de entorno para el despliegue en Vercel.

## Variables de Entorno Requeridas

- `VITE_REACT_APP_BACKEND_BASEURL`: URL base del API backend (ej: https://event-system-backend-production.up.railway.app)

## Pasos para Configurar en Vercel

1. Accede al dashboard de Vercel
2. Selecciona el proyecto
3. Ve a "Settings" -> "Environment Variables"
4. Agrega cada variable con su valor correspondiente
5. Selecciona los entornos donde aplicar (Production, Preview, Development)
6. Guarda los cambios
7. Redespliega el proyecto para aplicar las nuevas variables

## Notas Importantes

- Los archivos `.env` no se suben al repositorio por razones de seguridad
- Las variables configuradas en Vercel tienen prioridad sobre las definidas en `vercel.json`
- Si no se configuran variables, el sistema usará la URL base de la aplicación como fallback

## Solución de Problemas

Si tienes problemas de conexión con el backend, verifica:

1. Que las variables están correctamente definidas en Vercel
2. Que la URL del API es accesible desde donde se despliega tu aplicación
3. Los logs de la consola del navegador para mensajes de error específicos

Para más información, consulta la [documentación de Vercel sobre variables de entorno](https://vercel.com/docs/concepts/projects/environment-variables).