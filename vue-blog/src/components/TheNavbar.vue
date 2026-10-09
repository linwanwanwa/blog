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
      <router-link to="/guestbook" @click="closeMenu" class="nav-link">
        <span>Guestbook</span>
      </router-link>
      <router-link to="/game" @click="closeMenu" class="nav-link">
        <span>Game</span>
      </router-link>
      <button class="nav-auth" @click="onAuthClick" :title="authTip">
        <svg v-if="!auth.user" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 21v-6a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v6"/><circle cx="12" cy="7" r="4"/>
        </svg>
        <span class="nav-auth-text">{{ auth.user ? shortName : '登录' }}</span>
      </button>
      <button class="theme-toggle" @click="toggleTheme">
        {{ isDark ? '☀' : '☾' }}
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useAuth, openAuth, signOut } from '../stores/auth'

const themeStore = useThemeStore()
const auth = useAuth()
const isMenuOpen = ref(false)
const isDark = computed(() => themeStore.state.currentTheme === 'dark')

const shortName = computed(() => {
  const e = auth.user?.email || ''
  return e.includes('@') ? e.slice(0, 2).toUpperCase() : '已登录'
})
const authTip = computed(() =>
  auth.unavailable
    ? '登录需要发布到应用正式域名'
    : auth.user
      ? `${auth.user.email}（点击退出）`
      : '邮箱登录后可点赞和留言'
)

const onAuthClick = () => {
  closeMenu()
  if (auth.user) {
    if (confirm('退出登录？')) signOut()
  } else {
    openAuth()
  }
}

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
