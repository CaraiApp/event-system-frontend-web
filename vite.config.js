import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.USE_SIMPLE_MOCK === 'true' 
          ? 'http://localhost:3001'
          : 'https://event-system-backend-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
