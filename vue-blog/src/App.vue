<template>
  <div id="app" :data-theme="themeStore.state.currentTheme">
    <NoiseOverlay />
    <CustomCursor />
    <TheNavbar />
    <main class="container">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import NoiseOverlay from './components/NoiseOverlay.vue'
import CustomCursor from './components/CustomCursor.vue'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
