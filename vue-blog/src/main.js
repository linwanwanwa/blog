import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import { initAuth } from './stores/auth'
import './assets/css/styles.css'

useThemeStore().initTheme()

const app = createApp(App)
app.use(router)
app.mount('#app')

// 会话检查延迟到浏览器空闲：initAuth 会拉起 ~75KB 的云 SDK chunk，
// 挂在首屏关键路径上会和正文渲染抢带宽（lib/cloud.js 注释的"懒加载"意图在此落实）。
// timeout 兜底：部分环境（老 Safari/Firefox）没有 requestIdleCallback，或一直不空闲。
const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 2500))
idle(() => { initAuth() }, { timeout: 4000 })
