import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [react(), tailwindcss()],
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
          input: './index.html',
          output: {
            entryFileNames: 'static/assets/[name]-[hash].js',
            chunkFileNames: 'static/assets/[name]-[hash].js',
            assetFileNames: 'static/assets/[name]-[hash][extname]',
          },
        },
      },
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      build({
        entry: 'src/api/index.ts',
        emptyOutDir: false,
      }),
      devServer({
        adapter,
        entry: 'src/api/index.ts',
        exclude: [
          /^(?!\/api\/).*/,
        ],
      }),
    ],
  }
})
