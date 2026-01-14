import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 获取 API 模式和代理目标
  const apiMode = env.VITE_API_MODE || 'dev'
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://192.168.157.104:8901'
  
  // 只有在 dev 模式下才启用 proxy
  const shouldEnableProxy = apiMode === 'dev' && proxyTarget
  
  return {
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
      proxy: shouldEnableProxy
        ? {
            // 代理所有 /api 开头的请求到后端服务器
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          }
        : undefined,
    },
  }
})
