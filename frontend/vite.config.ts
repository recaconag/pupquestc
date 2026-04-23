import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
// @ts-ignore
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), flowbiteReact()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1000, 
  }
})