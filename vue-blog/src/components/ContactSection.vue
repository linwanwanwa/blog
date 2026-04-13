<template>
  <section class="section" id="about">
    <h2 class="section-title">联系我</h2>
    <div class="contact-grid">
      <div v-for="contact in contacts" :key="contact.label" class="contact-item">
        <div class="contact-icon">
          <i :class="contact.icon"></i>
        </div>
        <p class="contact-label">{{ contact.label }}</p>
        <p class="contact-value">
          <a :href="contact.href" :target="contact.target">{{ contact.value }}</a>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const contacts = [
  {
    icon: 'fa fa-github',
    label: 'GitHub',
    value: 'linwanwanwa',
    href: 'https://github.com/linwanwanwa',
    target: '_blank'
  },
  {
    icon: 'fa fa-envelope-o',
    label: '邮箱',
    value: '1793004324@qq.com',
    href: 'mailto:1793004324@qq.com',
    target: '_self'
  },
  {
    icon: 'fa fa-phone',
    label: '电话',
    value: '15327412390',
    href: 'tel:15327412390',
    target: '_self'
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

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.contact-item {
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  transition: transform 0.2s;
}

.contact-item:hover {
  transform: translateY(-2px);
}

.contact-icon {
  font-size: 1.5rem;
  color: var(--accent);
  margin-bottom: 12px;
}

.contact-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.contact-value {
  font-size: 0.95rem;
  font-weight: 500;
}

.contact-value a {
  color: var(--text-primary);
  text-decoration: none;
}

.contact-value a:hover {
  color: var(--accent);
}
</style>
