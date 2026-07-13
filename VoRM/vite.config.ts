import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: 'src/client/routes',
      generatedRouteTree: 'src/client/routeTree.gen.ts'
    }),
    react()
  ],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
      }
    }
  },
  build: {
    outDir: 'build/src/client',
    sourcemap: true
  }
})