import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const gatewayUrl = env.VITE_GATEWAY_URL || 'https://gateway.cipherbridge.cloud';

  // Build wss:// equivalent for WebSocket proxy
  const gatewayWs = gatewayUrl.replace(/^http/, 'ws');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api':    { target: gatewayUrl, changeOrigin: true, secure: true },
        '/health': { target: gatewayUrl, changeOrigin: true, secure: true },
        '/bridge': { target: gatewayUrl, changeOrigin: true, secure: true },
        '/ws':     { target: gatewayWs,  changeOrigin: true, ws: true, secure: true },
        '/node':   { target: gatewayWs,  changeOrigin: true, ws: true, secure: true },
      },
    },
  };
});