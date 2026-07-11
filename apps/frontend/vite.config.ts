import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add Tailwind CSS plugin
  ],
  define: {
    global: 'window', // Define global variable for window object
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://equipment-rental-backend:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/equipment_rental/api/v1'),
      },
      '/ws-chat': {
        target: 'http://equipment-rental-backend:8080',
        ws: true, // Required for WebSocket connections
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws-chat/, '/equipment_rental/ws-chat'),
      },
    },
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500, // Adjust this value as needed to fix waring chunk size limit js files
  },
});
