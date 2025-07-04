import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Vite không mặc định expose process.env, cần định nghĩa tường minh
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})