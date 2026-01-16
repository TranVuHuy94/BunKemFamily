import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: '../assets/js',
        emptyOutDir: false,
        rollupOptions: {
            input: 'src/main.jsx',
            output: {
                entryFileNames: '3d-background-bundle.js',
                // Ensure no chunks are created if possible, or handle them
                manualChunks: undefined,
            }
        }
    }
})
