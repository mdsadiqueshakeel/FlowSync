// frontend-shell/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      remotes: {
        support_tickets: 'http://localhost:5001/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  // PostCSS configuration is handled by postcss.config.js
  server: {
    port: 5173,
    strictPort: false,
  },
});
