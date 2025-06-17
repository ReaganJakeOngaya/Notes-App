import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://notes-app-20no.onrender.com' || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true
      },
      '/auth': {
        target: 'https://notes-app-20no.onrender.com' || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});