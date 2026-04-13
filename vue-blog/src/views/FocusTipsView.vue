<template>
  <div class="article-view">
    <article class="article-content">
      <h1>程序员保持专注的 10 个技巧</h1>
      <div class="article-meta">
        <span>2024年3月1日</span>
        <span>效率</span>
      </div>
      
      <div class="article-body">
        <section>
          <h2>为什么专注很重要</h2>
          <p>编程是一项需要高度认知的工作。频繁被打断后，平均需要 23 分钟才能回到原来的状态。保持专注，是提升效率的关键。</p>
        </section>

        <section>
          <h2>10 个实用技巧</h2>
          
          <h3>1. 番茄工作法</h3>
          <p>25 分钟专注工作，5 分钟休息。循环往复。我用 Forest App 来保持专注。</p>
          
          <h3>2. 关闭通知</h3>
          <p>手机静音、关闭社交软件通知。紧急的事自然会打电话找你。</p>
          
          <h3>3. 早晨黄金时间</h3>
          <p>起床后 2-3 小时是大脑最清醒的时候，用来处理最难的工作。</p>
          
          <h3>4. 任务分解</h3>
          <p>把大任务拆成 1-2 小时能完成的小任务。完成感会给你正反馈。</p>
          
          <h3>5. 减少上下文切换</h3>
          <p>一次只做一件事。写代码时就不要想着回复消息。</p>
          
          <h3>6. 整洁的工作环境</h3>
          <p>桌面只放必需品。杂物会分散注意力。</p>
          
          <h3>7. 戴上耳机</h3>
          <p>不一定听音乐，戴上耳机就是在告诉别人"我在专注中"。</p>
          
          <h3>8. 记录想法</h3>
          <p>突然想到的事，先记下来，稍后再处理。GTD 方法的核心。</p>
          
          <h3>9. 能量管理</h3>
          <p>困了就休息，不要硬撑。散步、喝水都比低效工作强。</p>
          
          <h3>10. 设置截止时间</h3>
          <p>没有截止时间的工作会无限延长。给自己设个期限。</p>
        </section>

        <section>
          <h2>我的实践</h2>
          <p>我每天上午 9-11 点处理复杂逻辑，下午做会议和沟通，晚上写文档和优化。这样的节奏让我保持高效。</p>
        </section>

        <section>
          <h2>结语</h2>
          <p>专注是一种可以训练的能力。从今天开始，尝试其中一两个技巧，慢慢建立自己的专注系统。</p>
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
  max-width: 720px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 40px 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.article-content h1 {
  font-size: 1.7rem;
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
  margin-bottom: 28px;
}

.article-body h2 {
  font-size: 1.25rem;
  color: #059669;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #d1fae5;
}

.article-body h3 {
  font-size: 1.05rem;
  color: #333;
  margin: 20px 0 10px;
  font-weight: 600;
}

.article-body p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 12px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding: 12px 24px;
  background: #059669;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
}

.back-link:hover {
  background: #047857;
}
</style>
