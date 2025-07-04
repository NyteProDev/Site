import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ Obligatoire pour Vercel
  build: {
    outDir: 'dist'
  }
})
