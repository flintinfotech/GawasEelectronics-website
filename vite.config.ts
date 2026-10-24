import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/flint': {
        target: 'http://flintinfotech-dev.in:9443',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
