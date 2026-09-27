import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/module1': 'http://localhost:8000',
      '/module2': 'http://localhost:8000',
      '/module3': 'http://localhost:8000',
      '/module4': 'http://localhost:8000',
      '/module5': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    }
  }
})
