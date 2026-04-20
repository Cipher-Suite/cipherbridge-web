import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api':    { target: 'https://gateway.cipherbridge.cloud', changeOrigin: true, secure: true },
      '/health': { target: 'https://gateway.cipherbridge.cloud', changeOrigin: true, secure: true },
      '/bridge': { target: 'https://gateway.cipherbridge.cloud', changeOrigin: true, secure: true },
      '/ws':     { target: 'wss://gateway.cipherbridge.cloud', changeOrigin: true, ws: true, secure: true },
      '/node':   { target: 'wss://gateway.cipherbridge.cloud', changeOrigin: true, ws: true, secure: true },
    },
  },
});