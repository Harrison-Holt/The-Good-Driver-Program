import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser polyfill
      define: {
        global: 'globalThis',  // Polyfill for `global`
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,    // Polyfill for `process`
          buffer: true,     // Polyfill for `Buffer`
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  resolve: {
    alias: {
      // Polyfill for Buffer
      buffer: 'buffer',
    },
  },
});
