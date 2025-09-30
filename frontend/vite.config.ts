import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/savestory': 'http://localhost:3000',
      '/getstory': 'http://localhost:3000',
      '/healthcheck': 'http://localhost:3000',
      '/promptstreamingws': {
        target: 'ws://localhost:3000',
        ws: true,
      },
    },
  },
  base: process.env.VITE_BASE_PATH || '/',
})
