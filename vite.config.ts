import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
// Enable more detailed error reporting

export default defineConfig({
  root: '.', // Set the root to the current directory
  publicDir: 'public', // Specify the public directory for static assets
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: {
      overlay: true
    },
    // Display detailed error messages
    host: true,
    port: 3000
  },
});
