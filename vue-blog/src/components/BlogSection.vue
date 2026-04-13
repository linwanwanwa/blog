<template>
  <section class="section" id="blog">
    <h2 class="section-title">我的博客</h2>
    <ul class="blog-list">
      <li v-for="post in blogPosts" :key="post.id" class="blog-item">
        <h3 class="blog-title">
          <router-link :to="post.link">{{ post.title }}</router-link>
        </h3>
        <p class="blog-meta">{{ post.date }} · {{ post.category }}</p>
        <p class="blog-excerpt">{{ post.excerpt }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup>
const blogPosts = [
  {
    id: 1,
    title: '程序员保持专注的 10 个技巧',
    date: '2024年3月1日',
    category: '效率',
    excerpt: '番茄工作法、关闭通知、任务分解...分享我保持高效专注的实战经验。',
    link: '/blog/focus-tips'
  },
  {
    id: 2,
    title: '武汉周末美食之旅',
    date: '2024年1月20日',
    category: '旅行',
    excerpt: '过早、宵夜、正餐...分享我在武汉的觅食清单。',
    link: '/blog/wuhan-food'
  },
  {
    id: 3,
    title: '我的开发环境配置',
    date: '2024年2月15日',
    category: '技术',
    excerpt: 'VS Code、终端、Git 配置记录，以及我常用的开发工具推荐。',
    link: '/blog/dev-setup'
  },
  {
    id: 4,
    title: '长沙两天行程规划（最终版）',
    date: '2024年1月1日',
    category: '旅行',
    excerpt: '详细的长沙两天一夜行程规划，包含景点推荐、美食攻略和交通建议。',
    link: '/blog/changsha'
  },
  {
    id: 5,
    title: '原谅我',
    date: '2023年12月15日',
    category: '随笔',
    excerpt: '个人随笔，记录生活中的感悟和思考。',
    link: '/blog/forgive'
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

.blog-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.blog-item {
  padding: 20px 24px;
  border-radius: 14px;
  transition: transform 0.2s;
}

.blog-item:hover {
  transform: translateX(4px);
}

.blog-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.blog-title a {
  color: var(--text-primary);
  text-decoration: none;
}

.blog-title a:hover {
  color: var(--accent);
}

.blog-meta {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.blog-excerpt {
  font-size: 0.95rem;
  color: var(--text-secondary);
}
</style>
