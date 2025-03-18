import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Port standard pentru Vite
    host: "localhost", // Permite acces doar local
    strictPort: true, // Evită schimbarea automată a portului
    cors: true, // Activează CORS pentru frontend
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Redirecționează toate cererile API către backend
        changeOrigin: true,
        secure: false
      }
    }
  }
})
