import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/feed': 'http://localhost:3000',
      '/status_log': 'http://localhost:3000',
      '/params': 'http://localhost:3000',
      '/logs': 'http://localhost:3000',
    },
  },
});
