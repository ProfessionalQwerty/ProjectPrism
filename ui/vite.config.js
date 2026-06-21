import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'ES2020',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    port: 5173,
    proxy: {
      // Match API routes but not source files like api-config.ts
      '^/api(/|$)': {
        target: process.env.VITE_API_URL || 'http://localhost:19991',
        changeOrigin: true,
      },
      '/proxy': {
        target: process.env.VITE_API_URL || 'http://localhost:19991',
        changeOrigin: true,
      },
    },
  },
})
