<template>
  <section class="section" id="hot">
    <h2 class="section-title">Quick Links</h2>
    <div class="row-list">
      <a 
        v-for="(item, index) in hotList" 
        :key="item.title" 
        :href="item.url" 
        target="_blank"
        class="row-item"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <span class="row-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <div class="row-info">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
        <span class="row-arrow">→</span>
      </a>
    </div>
  </section>
</template>

<script setup>
const hotList = [
  { title: '微博热搜', desc: '实时热搜榜', url: 'https://s.weibo.com/top/summary' },
  { title: '百度热搜', desc: '百度实时热点', url: 'https://top.baidu.com/board?tab=realtime' }
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
