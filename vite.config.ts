import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sitio servido en la raíz del dominio propio (www.hoteltamalodge.com)
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: { outDir: 'dist', emptyOutDir: true },
});
