import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ FORCE les chemins absolus
  build: {
    outDir: 'dist'
  }
});