<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <router-link to="/">首页</router-link>
        <a href="/#projects">项目</a>
        <a href="/#blog">博客</a>
        <router-link to="/profile">关于</router-link>
      </div>
      <p class="footer-copyright">© 2024 Linwan's Blog. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 60px 40px;
  border-top: 1px solid var(--border-color);
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.footer-content {
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 20px;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  position: relative;
  transition: color 0.3s ease;
}

.footer-links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--text-primary);
  transition: width 0.3s ease;
}

.footer-links a:hover {
  color: var(--text-primary);
}

.footer-links a:hover::after {
  width: 100%;
}

.footer-copyright {
  color: var(--text-secondary);
  font-size: 0.85rem;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .footer {
    padding: 40px 20px;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 16px 24px;
  }
}
</style>
