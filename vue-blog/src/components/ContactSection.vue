<template>
  <section class="section" id="about">
    <h2 class="section-title">联系我</h2>
    <div class="contact-list">
      <a v-for="contact in contacts" :key="contact.label" 
         :href="contact.href"
         class="contact-item">
        <span class="contact-label">{{ contact.label }}</span>
        <span class="contact-value">{{ contact.value }}</span>
      </a>
    </div>
  </section>
</template>

<script setup>
const contacts = [
  { label: 'GitHub', value: 'github.com/linwanwanwa', href: 'https://github.com/linwanwanwa' },
  { label: '邮箱', value: '1793004324@qq.com', href: 'mailto:1793004324@qq.com' }
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

.contact-list {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  overflow: hidden;
}

[data-theme="dark"] .contact-list {
  background: rgba(30, 30, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  text-decoration: none;
  border-bottom: 1px solid var(--border-color);
  transition: opacity 0.2s;
  gap: 16px;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-item:hover {
  opacity: 0.6;
}

.contact-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.contact-value {
  font-size: 0.9rem;
  color: var(--text-primary);
}

@media (max-width: 600px) {
  .contact-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
