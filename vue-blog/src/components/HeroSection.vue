<template>
  <section class="hero-section">
    <div class="hero-card" :class="{ visible: isVisible }">
      <div class="avatar-wrapper">
        <img src="/assets/images/头像.png" alt="头像" class="hero-avatar" />
        <div class="avatar-ring"></div>
      </div>
      <h1 class="hero-title">Linwan's Blog</h1>
      <p class="hero-subtitle">全栈开发者 & 技术爱好者</p>
      <p class="hero-description">
        热爱编程，喜欢探索新技术。专注于 Web 开发，擅长前端和后端技术。
      </p>
      <div class="cta-buttons">
        <a href="#projects" class="btn">
          <span>浏览项目</span>
          <div class="btn-ripple"></div>
        </a>
        <router-link to="/profile" class="btn btn-outline">关于我</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<style scoped>
.hero-section {
  padding: 80px 20px 40px;
}

.hero-card {
  max-width: 500px;
  margin: 0 auto;
  padding: 60px 40px;
  border-radius: 24px;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-card.visible {
  opacity: 1;
  transform: translateY(0);
}

[data-theme="dark"] .hero-card {
  background: rgba(30, 30, 30, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.avatar-wrapper {
  margin-bottom: 24px;
  position: relative;
  display: inline-block;
}

.hero-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.avatar-wrapper:hover .hero-avatar {
  transform: scale(1.05);
}

.avatar-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border-radius: 50%;
  border: 1px dashed var(--border-color);
  opacity: 0;
  animation: spin 20s linear infinite;
  transition: opacity 0.3s ease;
}

.avatar-wrapper:hover .avatar-ring {
  opacity: 1;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hero-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.hero-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.hero-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-decoration: none;
  font-weight: 500;
  background: var(--text-primary);
  color: var(--bg-primary);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn span {
  position: relative;
  z-index: 1;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.btn:hover .btn-ripple {
  width: 300px;
  height: 300px;
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-outline:hover {
  background: var(--text-primary);
  color: var(--bg-primary);
  border-color: var(--text-primary);
}

@media (max-width: 768px) {
  .hero-card {
    padding: 40px 24px;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
}
</style>
