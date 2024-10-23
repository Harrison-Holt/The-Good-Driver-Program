import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';  // Use named import

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        process: true,    // Polyfill for `process`
        Buffer: true,     // Correct the property to 'Buffer'
      },
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser polyfill
      define: {
        global: 'globalThis',  // Polyfill for `global`
      },
    },
  },
  resolve: {
    alias: {
      // Polyfill for Buffer
      buffer: 'buffer',
    },
  },
});
