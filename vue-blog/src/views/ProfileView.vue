<template>
  <div class="profile-view">
    <div class="profile-header">
      <img src="/assets/images/头像.png" alt="头像" class="profile-avatar" />
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
        <li><i class="fa fa-github"></i> GitHub: linwanwanwa</li>
        <li><i class="fa fa-envelope-o"></i> 邮箱: 1793004324@qq.com</li>
        <li><i class="fa fa-phone"></i> 电话: 15327412390</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const skills = ['Vue.js', 'React', 'Node.js', 'Python', 'HTML', 'CSS', 'JavaScript']
</script>
