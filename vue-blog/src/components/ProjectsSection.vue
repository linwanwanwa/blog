<template>
  <section class="section" id="projects">
    <h2 class="section-title">Projects</h2>
    <div class="row-list">
      <router-link 
        v-for="(project, index) in projects" 
        :key="project.id" 
        :to="project.link"
        class="row-item"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <span class="row-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <div class="row-info">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
        </div>
        <span class="row-arrow">→</span>
      </router-link>
    </div>
  </section>
</template>

<script setup>
const projects = [
  { id: 1, title: 'SteadyHaven 稳港', description: '极简饮食记录 iOS App · SwiftUI', link: '/steady-haven' },
  { id: 2, title: '个人博客', description: 'Vue 3 博客网站，MiMo 风格设计', link: '/' },
  { id: 3, title: '移动应用', description: '开发中', link: '/' }
]
</script>

<style scoped>
.section {
  margin-bottom: 80px;
}

.row-item {
  opacity: 0;
  animation: slideIn 0.5s ease forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
