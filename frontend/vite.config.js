import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Use relative path for proper asset loading
  server: {
    port: 5173,
    host: true,
    // Handle client-side routing for SPA in development
    historyApiFallback: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for production
    // Ensure public files like _redirects are copied to dist
    copyPublicDir: true,
  },
  // Handle client-side routing for SPA
  // This ensures that on page refresh, the server returns index.html for all routes
  // and React Router takes over
})
