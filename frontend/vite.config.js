import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ relative path pour corriger Vercel
  build: {
    outDir: 'dist'
  }
});