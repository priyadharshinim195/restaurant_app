import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Frames and images are served from /public, so they are available at /restaurant-frames/... and /images/...
export default defineConfig({
  plugins: [react()],
});
