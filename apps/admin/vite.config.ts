import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const port = Number(process.env.PORT) || 3002
const strictPort = Boolean(process.env.PORT)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port,
    strictPort,
  },
  preview: {
    host: '0.0.0.0',
    port,
    strictPort,
  },
})
