<template>
  <section class="section" id="blog">
    <h2 class="section-title">Blog</h2>
    <div class="row-list">
      <router-link
        v-for="(post, index) in blogPosts"
        :key="post.id"
        :to="post.link"
        class="row-item"
        :style="{ animationDelay: `${index * 0.08}s` }"
      >
        <span class="row-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <div class="row-info">
          <h3>{{ post.title }}</h3>
          <p>{{ post.date }}</p>
        </div>
        <span class="row-arrow">→</span>
      </router-link>
    </div>
  </section>
</template>

<script setup>
// 文章列表来自 src/content/posts.js（唯一事实源），不在这里重复维护
import { blogPosts } from '../content/posts'
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

@media (max-width: 600px) {
  .row-item {
    flex-wrap: wrap;
  }
}
</style>
