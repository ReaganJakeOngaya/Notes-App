import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://notes-app-20no.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true
      },
      '/auth': {
        target: 'https://notes-app-20no.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
});