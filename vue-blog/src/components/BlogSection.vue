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
const blogPosts = [
  { id: 1, title: 'SteadyHaven 稳港 — 极简饮食记录 iOS App', date: '2024-04-15', link: '/steady-haven' },
  { id: 2, title: '程序员保持专注的 10 个技巧', date: '2024-03-01', link: '/focus-tips' },
  { id: 3, title: '我的开发环境配置', date: '2024-02-15', link: '/dev-setup' },
  { id: 4, title: '武汉周末美食之旅', date: '2024-01-20', link: '/wuhan-food' },
  { id: 5, title: '长沙两天行程规划', date: '2024-01-01', link: '/changsha' }
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

@media (max-width: 600px) {
  .row-item {
    flex-wrap: wrap;
  }
}
</style>
