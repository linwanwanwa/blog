<template>
  <section class="section" id="projects">
    <h2 class="section-title">我的项目</h2>
    <div class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <div class="project-icon">
          <i :class="project.icon"></i>
        </div>
        <h3 class="project-title">{{ project.title }}</h3>
        <p class="project-description">{{ project.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const projects = [
  {
    id: 1,
    icon: 'fa fa-code',
    title: '个人博客',
    description: '使用 Vue 3 开发的个人博客网站，包含响应式设计和主题切换功能。'
  },
  {
    id: 2,
    icon: 'fa fa-mobile',
    title: '移动应用',
    description: '正在开发中的移动应用项目，使用现代前端框架和后端技术。'
  }
]
</script>

<style scoped>
.section {
  margin-bottom: 80px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 40px;
  color: var(--text-primary);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.project-card {
  border-radius: 16px;
  padding: 28px;
  transition: all 0.2s;
}

.project-card:hover {
  transform: translateY(-2px);
}

.project-card:hover {
  border-color: var(--accent);
}

.project-icon {
  font-size: 2rem;
  margin-bottom: 16px;
  color: var(--accent);
}

.project-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.project-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
