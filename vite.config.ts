// vite.config.js
import reactRefresh from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [reactRefresh()],
  css: {
    modules: {}, // Enable CSS modules
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`, // Optional: Import additional SCSS files
      },
    },
  },
});
