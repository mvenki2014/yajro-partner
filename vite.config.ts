import path from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
// import { viteSingleFile } from 'vite-plugin-singlefile' // disable for native

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// const isNative = process.env.NATIVE_BUILD === '1'

export default defineConfig({
  base: './', // crucial for Capacitor file:// loading
  plugins: [
    react(),
    tailwindcss(),
    // isNative ? undefined : viteSingleFile(), // optional: keep single-file for web only
  ].filter(Boolean),
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    outDir: 'dist',
    target: 'es2018',
    sourcemap: false,
  },
})
