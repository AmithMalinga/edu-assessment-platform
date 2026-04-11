import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.ADMIN_PORT || process.env.PORT || 3002)
  const strictPort = Boolean(env.ADMIN_PORT || process.env.PORT)
  const allowedHosts = (env.ADMIN_ALLOWED_HOSTS || '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port,
      strictPort,
      allowedHosts,
    },
    preview: {
      host: '0.0.0.0',
      port,
      strictPort,
    },
  }
})
