import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  optimizeDeps: {
    include: ['html2canvas'], // ✅ 여기에 추가!
  },
  server: {
    host: '0.0.0.0',
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
})
