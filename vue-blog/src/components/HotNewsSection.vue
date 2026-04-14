<template>
  <section class="hot-section" id="hot">
    <h2 class="section-title">
      <span class="title-text">快捷入口</span>
      <span class="title-dot"></span>
    </h2>
    <div class="hot-list">
      <a 
        v-for="(item, index) in hotList" 
        :key="item.title" 
        :href="item.url" 
        target="_blank"
        class="hot-item"
        :style="{ animationDelay: `${index * 0.15}s` }"
      >
        <span class="hot-content">
          <span class="hot-icon">
            <svg v-if="index === 0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </span>
          <span class="hot-title">{{ item.title }}</span>
        </span>
        <span class="hot-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      </a>
    </div>
  </section>
</template>

<script setup>
const hotList = [
  { title: '微博热搜', url: 'https://s.weibo.com/top/summary' },
  { title: '百度热搜', url: 'https://top.baidu.com/board?tab=realtime' }
]
</script>

<style scoped>
.hot-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-secondary);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.hot-list {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  overflow: hidden;
}

[data-theme="dark"] .hot-list {
  background: rgba(30, 30, 30, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  text-decoration: none;
  border-bottom: 1px solid var(--border-color);
  opacity: 0;
  animation: slideIn 0.5s ease forwards;
  transition: all 0.3s ease;
}

.hot-item:first-child {
  border-radius: 16px 16px 0 0;
}

.hot-item:last-child {
  border-bottom: none;
  border-radius: 0 0 16px 16px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.hot-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hot-icon {
  color: var(--text-secondary);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.hot-title {
  font-size: 0.95rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.hot-arrow {
  color: var(--text-secondary);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.hot-item:hover {
  background: var(--bg-secondary);
}

.hot-item:hover .hot-icon {
  opacity: 1;
  transform: scale(1.1);
}

.hot-item:hover .hot-title {
  opacity: 0.7;
}

.hot-item:hover .hot-arrow {
  opacity: 1;
  transform: translateX(0);
}
</style>
