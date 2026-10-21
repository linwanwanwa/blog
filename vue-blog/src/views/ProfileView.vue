<template>
  <div class="profile-view">
    <div class="profile-header">
      <img src="/assets/images/头像.jpg" alt="头像" class="profile-avatar" width="100" height="100" />
      <h1 class="profile-name">Linwan</h1>
      <p class="profile-tagline">全栈开发者 & 技术爱好者</p>
    </div>
    
    <div class="profile-section">
      <h2>关于我</h2>
      <p>
        热爱编程，喜欢探索新技术。专注于 Web 开发，擅长前端和后端技术。
      </p>
    </div>

    <div class="profile-section">
      <h2>技能</h2>
      <div class="skills">
        <span v-for="skill in skills" :key="skill" class="skill-tag">{{ skill }}</span>
      </div>
    </div>

    <div class="profile-section">
      <h2>联系方式</h2>
      <ul class="contact-list">
        <li>
          <svg class="icon" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          GitHub: <a href="https://github.com/linwanwanwa" target="_blank" rel="noopener" class="contact-link">linwanwanwa ↗</a>
        </li>
        <li>
          <svg class="icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
          邮箱: 1793004324@qq.com
        </li>
        <li>
          <svg class="icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          电话: 15327412390
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const skills = ['Vue.js', 'React', 'Node.js', 'Python', 'HTML', 'CSS', 'JavaScript']
</script>

<style scoped>
.contact-list li .icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.45;
}

.contact-link {
  color: #f0883e;
  text-decoration: none;
  font-weight: 600;
}

.contact-link:hover {
  text-decoration: underline;
}
</style>
