import { defineConfig } from 'vite';

export default defineConfig({
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
  build: {
    assetsDir: 'css' 
  }
});




