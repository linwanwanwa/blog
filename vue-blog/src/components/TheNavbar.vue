<template>
  <nav class="navbar">
    <router-link to="/" class="nav-brand">
      <span class="brand-text">Linwan</span>
      <span class="brand-dot"></span>
    </router-link>
    <button class="hamburger" @click="toggleMenu" :class="{ active: isMenuOpen }" aria-label="菜单">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="nav-links" :class="{ active: isMenuOpen }">
      <router-link to="/" @click="closeMenu" class="nav-link">
        <span>首页</span>
      </router-link>
      <router-link to="/#hot" @click="closeMenu" class="nav-link">
        <span>热搜</span>
      </router-link>
      <router-link to="/#projects" @click="closeMenu" class="nav-link">
        <span>项目</span>
      </router-link>
      <router-link to="/#blog" @click="closeMenu" class="nav-link">
        <span>博客</span>
      </router-link>
      <router-link to="/profile" @click="closeMenu" class="nav-link">
        <span>关于</span>
      </router-link>
      <button class="theme-toggle" @click="toggleTheme" :class="{ dark: isDark }">
        <span class="toggle-icon">{{ isDark ? '☀️' : '🌙' }}</span>
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

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  animation: slideDown 0.6s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

[data-theme="dark"] .navbar {
  background: rgba(10, 10, 10, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.brand-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-secondary);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.nav-links {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  position: relative;
  padding: 4px 0;
}

.nav-link span {
  position: relative;
}

.nav-link span::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--text-primary);
  transition: width 0.3s ease;
}

.nav-link:hover span::after,
.nav-link.router-link-active span::after {
  width: 100%;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-primary);
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  transform: rotate(30deg) scale(1.1);
  background: var(--border-color);
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  position: relative;
}

.hamburger span {
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  transition: all 0.3s ease;
  display: block;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .navbar {
    padding: 12px 20px;
  }

  .hamburger {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    flex-direction: column;
    padding: 24px;
    border-bottom: 1px solid var(--border-color);
    display: none;
    gap: 16px;
    animation: fadeIn 0.3s ease;
  }

  .nav-links.active {
    display: flex;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
</style>
