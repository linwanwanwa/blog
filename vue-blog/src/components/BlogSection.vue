<template>
  <section class="section" id="blog">
    <h2 class="section-title">我的博客</h2>
    <ul class="blog-list">
      <li 
        v-for="(post, index) in blogPosts" 
        :key="post.id" 
        class="blog-item"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <router-link :to="post.link" class="blog-link">
          <span class="blog-content">
            <span class="blog-title">{{ post.title }}</span>
            <span class="blog-arrow">→</span>
          </span>
          <span class="blog-date">{{ post.date }}</span>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup>
const blogPosts = [
  { id: 1, title: '程序员保持专注的 10 个技巧', date: '2024-03-01', link: '/blog/focus-tips' },
  { id: 2, title: '武汉周末美食之旅', date: '2024-01-20', link: '/blog/wuhan-food' },
  { id: 3, title: '我的开发环境配置', date: '2024-02-15', link: '/blog/dev-setup' },
  { id: 4, title: '长沙两天行程规划', date: '2024-01-01', link: '/blog/changsha' },
  { id: 5, title: '原谅我', date: '2023-12-15', link: '/blog/forgive' }
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

.blog-list {
  list-style: none;
}

.blog-item {
  border-bottom: 1px solid var(--border-color);
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
}

.blog-item:first-child {
  border-top: 1px solid var(--border-color);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.blog-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  text-decoration: none;
  gap: 16px;
  transition: all 0.3s ease;
}

.blog-link:hover {
  padding-left: 12px;
}

.blog-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.blog-title {
  font-size: 0.95rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.blog-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  color: var(--text-secondary);
}

.blog-link:hover .blog-arrow {
  opacity: 1;
  transform: translateX(0);
}

.blog-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.blog-link:hover .blog-title {
  opacity: 0.7;
}

@media (max-width: 600px) {
  .blog-link {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
