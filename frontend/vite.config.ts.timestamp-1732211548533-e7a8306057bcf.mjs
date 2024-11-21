// vite.config.ts
import { defineConfig } from "file:///Users/anthonymorales/Documents/GitHub/Team08-repo/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///Users/anthonymorales/Documents/GitHub/Team08-repo/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { nodePolyfills } from "file:///Users/anthonymorales/Documents/GitHub/Team08-repo/frontend/node_modules/vite-plugin-node-polyfills/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        process: true,
        // Polyfill for `process`
        Buffer: true
        // Correct the property to 'Buffer'
      }
    })
  ],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser polyfill
      define: {
        global: "globalThis"
        // Polyfill for `global`
      }
    }
  },
  resolve: {
    alias: {
      // Polyfill for Buffer
      buffer: "buffer"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYW50aG9ueW1vcmFsZXMvRG9jdW1lbnRzL0dpdEh1Yi9UZWFtMDgtcmVwby9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FudGhvbnltb3JhbGVzL0RvY3VtZW50cy9HaXRIdWIvVGVhbTA4LXJlcG8vZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FudGhvbnltb3JhbGVzL0RvY3VtZW50cy9HaXRIdWIvVGVhbTA4LXJlcG8vZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBub2RlUG9seWZpbGxzIH0gZnJvbSAndml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMnOyAgLy8gVXNlIG5hbWVkIGltcG9ydFxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBub2RlUG9seWZpbGxzKHtcbiAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgcHJvY2VzczogdHJ1ZSwgICAgLy8gUG9seWZpbGwgZm9yIGBwcm9jZXNzYFxuICAgICAgICBCdWZmZXI6IHRydWUsICAgICAvLyBDb3JyZWN0IHRoZSBwcm9wZXJ0eSB0byAnQnVmZmVyJ1xuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIC8vIE5vZGUuanMgZ2xvYmFsIHRvIGJyb3dzZXIgcG9seWZpbGxcbiAgICAgIGRlZmluZToge1xuICAgICAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJywgIC8vIFBvbHlmaWxsIGZvciBgZ2xvYmFsYFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIC8vIFBvbHlmaWxsIGZvciBCdWZmZXJcbiAgICAgIGJ1ZmZlcjogJ2J1ZmZlcicsXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVyxTQUFTLG9CQUFvQjtBQUNoWSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxxQkFBcUI7QUFFOUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sY0FBYztBQUFBLE1BQ1osU0FBUztBQUFBLFFBQ1AsU0FBUztBQUFBO0FBQUEsUUFDVCxRQUFRO0FBQUE7QUFBQSxNQUNWO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osZ0JBQWdCO0FBQUE7QUFBQSxNQUVkLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBO0FBQUEsTUFFTCxRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
