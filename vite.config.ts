import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Khối 'define' đã được loại bỏ để sử dụng cách xử lý biến môi trường tiêu chuẩn của Vite.
})
