<template>
  <div class="home-view">
    <HeroSection />
    <div class="container">
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
    </div>
  </div>
</template>

<style scoped>
.home-view {
  position: relative;
  z-index: 1;
}

.home-view .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px 60px;
}
</style>

<script setup>
import HeroSection from '../components/HeroSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import BlogSection from '../components/BlogSection.vue'
import ContactSection from '../components/ContactSection.vue'
</script>
