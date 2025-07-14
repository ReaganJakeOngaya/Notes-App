import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://notes-app-20no.onrender.com' || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/auth': {
        target: 'https://notes-app-20no.onrender.com' || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  css: {
    modules: false,
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')]
    }
  },
  build: {
    assetsDir: 'assets'
  }
});




