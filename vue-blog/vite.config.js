import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/blog/',
  build: {
    // 所有页面的 CSS 合成一个文件：慢网下每多一次请求就是几百毫秒到几秒的往返
    cssCodeSplit: false,
    target: 'es2015',
    // 关闭 sourcemap，减少产物体积
    sourcemap: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
