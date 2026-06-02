<template>
  <div class="home-view">
    <HeroSection />
    <div class="container">
      <BlogSection />
      <ProjectsSection />
      <HotNewsSection />
      <ContactSection />
    </div>
  </div>
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue'
import BlogSection from '../components/BlogSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import HotNewsSection from '../components/HotNewsSection.vue'
import ContactSection from '../components/ContactSection.vue'
</script>
