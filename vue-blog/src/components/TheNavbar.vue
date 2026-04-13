<template>
  <nav class="navbar">
    <router-link to="/" class="nav-brand">Linwan</router-link>
    <button class="hamburger" @click="toggleMenu" aria-label="菜单">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="nav-links" :class="{ active: isMenuOpen }">
      <router-link to="/" @click="closeMenu">首页</router-link>
      <router-link to="/#projects" @click="closeMenu">项目</router-link>
      <router-link to="/#blog" @click="closeMenu">博客</router-link>
      <router-link to="/profile" @click="closeMenu">关于</router-link>
      <button class="theme-toggle" @click="toggleTheme">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()
const isMenuOpen = ref(false)
const isDark = computed(() => themeStore.state.currentTheme === 'dark')

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const handleClickOutside = (e) => {
  const navbar = document.querySelector('.navbar')
  if (navbar && !navbar.contains(e.target)) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
