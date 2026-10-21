<template>
  <section class="section" id="projects">
    <h2 class="section-title">Projects</h2>
    <div class="row-list">
      <template v-for="(project, index) in projects" :key="project.id">
        <!-- 有 link 的走站内路由（博客详情页），只有 href 的直出 GitHub 仓库 -->
        <router-link
          v-if="project.link"
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
        <a
          v-else
          :href="project.href"
          target="_blank"
          rel="noopener"
          class="row-item"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <span class="row-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="row-info">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
          </div>
          <span class="row-arrow">↗</span>
        </a>
      </template>
    </div>
  </section>
</template>

<script setup>
// 清单来自 src/content/projects.js（唯一事实源），不在这里重复维护
import { projects } from '../content/projects'
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
