import { reactive } from 'vue'

const state = reactive({
  currentTheme: 'light'
})

export const useThemeStore = () => {
  const setTheme = (theme) => {
    state.currentTheme = theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  const toggleTheme = () => {
    const newTheme = state.currentTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      const hour = new Date().getHours()
      const isNight = hour < 6 || hour >= 18
      setTheme(isNight ? 'dark' : 'light')
    }
  }

  return {
    state,
    setTheme,
    toggleTheme,
    initTheme
  }
}
