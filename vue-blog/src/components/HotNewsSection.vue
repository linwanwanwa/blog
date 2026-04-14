<template>
  <section class="hot-section" id="hot">
    <h2 class="section-title">🔥 今日热搜</h2>
    <div class="hot-list">
      <a v-for="(item, index) in hotList" :key="index" 
         :href="item.url" target="_blank"
         class="hot-item">
        <span class="hot-rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
        <span class="hot-title">{{ item.title }}</span>
        <span class="hot-heat" v-if="item.heat">{{ item.heat }}</span>
      </a>
    </div>
    <p class="hot-time">更新时间: {{ updateTime }}</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const hotList = ref([])
const updateTime = ref('')

const fetchHotNews = async () => {
  try {
    const response = await fetch('https://weibo-hot-search-api.com/api/hot-day?date=' + new Date().toISOString().split('T')[0])
    const data = await response.json()
    if (data.data) {
      hotList.value = data.data.slice(0, 10).map(item => ({
        title: item.word || item.topic,
        url: item.url || `https://s.weibo.com/weibo?q=${encodeURIComponent(item.word || item.topic)}`,
        heat: item.hot_value || ''
      }))
    }
  } catch (error) {
    hotList.value = [
      { title: '微博热搜API暂时不可用', url: '#', heat: '' },
      { title: '请刷新页面重试', url: '#', heat: '' }
    ]
  }
  updateTime.value = new Date().toLocaleString('zh-CN')
}

onMounted(() => {
  fetchHotNews()
})
</script>

<style scoped>
.hot-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.hot-list {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  text-decoration: none;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.hot-item:last-child {
  border-bottom: none;
}

.hot-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

[data-theme="dark"] .hot-item:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

.hot-rank {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 24px;
  text-align: center;
}

.hot-rank.top {
  color: #ff6b6b;
}

.hot-title {
  flex: 1;
  font-size: 0.95rem;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-heat {
  font-size: 0.8rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

.hot-time {
  margin-top: 16px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-align: right;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .hot-item {
    padding: 14px 16px;
    gap: 12px;
  }
  
  .hot-title {
    font-size: 0.9rem;
  }
}
</style>
