import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import './assets/css/styles.css'

useThemeStore().initTheme()

const app = createApp(App)
app.use(router)
app.mount('#app')
