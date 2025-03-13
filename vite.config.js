import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:8000'
          : 'https://event-system-backend-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
