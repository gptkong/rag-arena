import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // TanStack Router plugin 必须在 React plugin 之前
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // 代理所有 /api 开头的请求到后端服务器
      '/api': {
        target: 'http://192.168.157.104:8901',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
