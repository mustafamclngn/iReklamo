import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "../backend/app/static"),
    emptyOutDir: true,
    assetsDir: "assets",

    rollupOptions: {
      input: path.resolve(__dirname, "index.html"), 
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Change this to your Flask port if different
        changeOrigin: true,
        secure: false,
      }
    }
  }
})