import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist' // ✅ indique le dossier de build pour Vercel
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 8080
  }
})
