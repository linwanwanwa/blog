<template>
  <section class="hero-section">
    <div class="hero-card glass-card">
      <img src="/assets/images/头像.png" alt="头像" class="hero-avatar" />
      <h1 class="hero-title">欢迎来到 Linwan's Blog</h1>
      <p class="hero-subtitle">全栈开发者 & 技术爱好者</p>
      <p class="hero-description">
        热爱编程，喜欢探索新技术。专注于 Web 开发，擅长前端和后端技术。
      </p>
      <div class="cta-buttons">
        <a href="#projects" class="btn btn-primary">浏览项目</a>
        <router-link to="/profile" class="btn">了解更多</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  padding: 60px 20px 40px;
}

.hero-card {
  max-width: 500px;
  margin: 0 auto;
  padding: 48px 32px;
  border-radius: 20px;
  text-align: center;
}

.hero-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 24px;
  border: 3px solid var(--border-color);
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.8;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn {
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-primary {
  background: var(--accent);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:not(.btn-primary) {
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.btn:not(.btn-primary):hover {
  border-color: var(--text-secondary);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  .cta-buttons {
    flex-direction: column;
  }
  .btn {
    text-align: center;
  }
}
</style>
