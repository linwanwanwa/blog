<template>
  <section class="section" id="projects">
    <h2 class="section-title">我的项目</h2>
    <div class="projects-list">
      <div 
        v-for="(project, index) in projects" 
        :key="project.id" 
        class="project-item"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="project-info">
          <span class="project-title">{{ project.title }}</span>
          <span class="project-desc">{{ project.description }}</span>
        </div>
        <span class="project-arrow">→</span>
      </div>
    </div>
  </section>
</template>

<script setup>
const projects = [
  { id: 1, title: '个人博客', description: 'Vue 3 博客网站' },
  { id: 2, title: '移动应用', description: '开发中' }
]
</script>

<style scoped>
.section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.projects-list {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  overflow: hidden;
}

[data-theme="dark"] .projects-list {
  background: rgba(30, 30, 30, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  gap: 16px;
  opacity: 0;
  animation: slideIn 0.5s ease forwards;
  transition: all 0.3s ease;
  cursor: pointer;
}

.project-item:first-child {
  border-radius: 16px 16px 0 0;
}

.project-item:last-child {
  border-bottom: none;
  border-radius: 0 0 16px 16px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.project-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  transition: opacity 0.3s ease;
}

.project-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.project-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  color: var(--text-secondary);
}

.project-item:hover {
  background: var(--bg-secondary);
}

.project-item:hover .project-title {
  opacity: 0.7;
}

.project-item:hover .project-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 600px) {
  .project-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
