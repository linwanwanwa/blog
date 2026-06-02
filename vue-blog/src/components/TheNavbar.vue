<template>
  <nav class="navbar">
    <router-link to="/" class="nav-brand">LINWAN</router-link>
    <button class="hamburger" @click="toggleMenu" :class="{ active: isMenuOpen }" aria-label="菜单">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="nav-links" :class="{ active: isMenuOpen }">
      <router-link to="/" @click="closeMenu" class="nav-link">
        <span>Home</span>
      </router-link>
      <router-link to="/#blog" @click="closeMenu" class="nav-link">
        <span>Blog</span>
      </router-link>
      <router-link to="/#projects" @click="closeMenu" class="nav-link">
        <span>Projects</span>
      </router-link>
      <router-link to="/#hot" @click="closeMenu" class="nav-link">
        <span>Hot</span>
      </router-link>
      <router-link to="/profile" @click="closeMenu" class="nav-link">
        <span>About</span>
      </router-link>
      <router-link to="/game" @click="closeMenu" class="nav-link">
        <span>Game</span>
      </router-link>
      <button class="theme-toggle" @click="toggleTheme">
        {{ isDark ? '☀' : '☾' }}
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

const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
const closeMenu = () => { isMenuOpen.value = false }
const toggleTheme = () => { themeStore.toggleTheme() }

const handleClickOutside = (e) => {
  const navbar = document.querySelector('.navbar')
  if (navbar && !navbar.contains(e.target)) isMenuOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
