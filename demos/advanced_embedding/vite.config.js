import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5123,
    // Proxy for development mode only (when running npm run dev)
    proxy: {
      '/embedding': {
        target: 'http://localhost:5132',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:5132',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
