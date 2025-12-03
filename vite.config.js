import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Явно указываем корневой путь для абсолютных путей
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Увеличиваем лимит предупреждений для больших чанков
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Именование файлов для лучшего кеширования
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  // Настройки для preview сервера (для тестирования)
  preview: {
    port: 4173,
    strictPort: true,
    host: true
  }
})
