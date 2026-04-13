<template>
  <div class="article-view">
    <article class="article-content">
      <h1>我的开发环境配置</h1>
      <div class="article-meta">
        <span>2024年2月15日</span>
        <span>技术</span>
      </div>
      
      <div class="article-body">
        <section>
          <h2>前言</h2>
          <p>作为开发者，一个舒适的开发环境能大幅提升效率。这篇文章记录一下我目前的开发环境配置，供大家参考。</p>
        </section>

        <section>
          <h2>编辑器</h2>
          <h3>VS Code</h3>
          <p>主力编辑器，插件配置：</p>
          <ul>
            <li><strong>Chinese (Simplified)</strong> - 中文语言包</li>
            <li><strong>Prettier</strong> - 代码格式化</li>
            <li><strong>ESLint</strong> - JS 代码检查</li>
            <li><strong>Volar</strong> - Vue3 支持</li>
            <li><strong>GitLens</strong> - Git 可视化</li>
            <li><strong>Material Theme</strong> - 主题</li>
          </ul>
        </section>

        <section>
          <h2>终端</h2>
          <h3>Windows Terminal + PowerShell</h3>
          <p>配合 Oh My Posh 使用，界面美观且功能强大。配置了 Git 提示和命令别名。</p>
        </section>

        <section>
          <h2>版本控制</h2>
          <h3>Git</h3>
          <p>配置了 Git 提交模板，规范提交信息：</p>
          <pre><code>feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试相关
chore: 构建/工具</code></pre>
        </section>

        <section>
          <h2>浏览器</h2>
          <p>Chrome DevTools + Vue DevTools，配合模拟移动设备进行响应式测试。</p>
        </section>

        <section>
          <h2>其他工具</h2>
          <ul>
            <li><strong>Docker</strong> - 容器化开发环境</li>
            <li><strong>Postman</strong> - API 测试</li>
            <li><strong>Notion</strong> - 笔记和知识管理</li>
            <li><strong>Obsidian</strong> - 双链笔记</li>
          </ul>
        </section>

        <section>
          <h2>总结</h2>
          <p>好的工具需要不断打磨，找到最适合自己的配置才是最好的。不必追求完美的开发环境，适合自己的才是最好的。</p>
        </section>
      </div>

      <router-link to="/" class="back-link">
        ← 返回首页
      </router-link>
    </article>
  </div>
</template>

<style scoped>
.article-view {
  padding: 80px 15px 30px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.article-content {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 40px 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.article-content h1 {
  font-size: 1.8rem;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.article-body section {
  margin-bottom: 32px;
}

.article-body h2 {
  font-size: 1.3rem;
  color: #2563eb;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.article-body h3 {
  font-size: 1.1rem;
  color: #333;
  margin: 20px 0 12px;
}

.article-body p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 12px;
}

.article-body ul {
  padding-left: 24px;
  margin-bottom: 16px;
}

.article-body li {
  color: #444;
  line-height: 1.8;
  margin-bottom: 6px;
}

.article-body pre {
  background: #f6f8fa;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
}

.article-body code {
  font-family: "SF Mono", Monaco, Consolas, monospace;
  font-size: 0.9rem;
  color: #333;
}

.article-body strong {
  color: #1a1a1a;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
}

.back-link:hover {
  background: #1d4ed8;
}
</style>
