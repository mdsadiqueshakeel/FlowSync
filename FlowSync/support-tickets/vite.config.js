import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'support_tickets',
      filename: 'remoteEntry.js',
      exposes: {
        './TicketsApp': './src/TicketsApp.jsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  // PostCSS configuration is handled by postcss.config.js
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5001,
  },
});
