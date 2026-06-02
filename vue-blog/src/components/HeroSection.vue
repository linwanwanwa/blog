<template>
  <section class="hero">
    <div class="hero-bg-pattern">
      <div class="pattern-row" v-for="i in 8" :key="i">
        <span v-for="j in 16" :key="j" class="pattern-char">L I N W A N</span>
      </div>
    </div>
    <div class="hero-content">
      <h1 class="hero-title">HELLO, I'M LINWAN</h1>
      <p class="hero-subtitle">
        全栈开发者 · 技术探索者 · 终身学习者
      </p>
      <div class="hero-actions">
        <a href="#projects" class="hero-btn">View Projects</a>
        <router-link to="/profile" class="hero-btn secondary">About Me</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-primary);
}

.hero-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
  overflow: hidden;
}

.pattern-row {
  white-space: nowrap;
  opacity: 0.04;
  font-size: clamp(20px, 4vw, 32px);
  font-weight: 800;
  letter-spacing: 8px;
  color: var(--text-primary);
}

[data-theme="light"] .pattern-row {
  opacity: 0.03;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px;
  animation: fadeUp 1s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-title {
  font-size: clamp(36px, 8vw, 80px);
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1.1;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--text-primary) 30%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(16px, 2.5vw, 20px);
  color: var(--text-secondary);
  font-weight: 400;
  margin-bottom: 48px;
  letter-spacing: 1px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  padding: 14px 36px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  background: var(--accent);
  color: #fff;
  border: none;
}

.hero-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(240, 136, 62, 0.3);
}

.hero-btn.secondary {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.hero-btn.secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: none;
}

@media (max-width: 768px) {
  .hero {
    min-height: 80vh;
  }
}
</style>
