<template>
  <article class="blog-post">
    <div class="post-header">
      <span class="post-category">Project</span>
      <h1>SteadyHaven 稳港 — 极简饮食记录 iOS App</h1>
      <time class="post-date">{{ date }}</time>
      <span class="post-views" id="busuanzi_container_page_pv">阅读 <b id="busuanzi_value_page_pv">–</b></span>
      <LikeButton slug="steady-haven" />
    </div>

    <div class="post-body">
      <section>
        <h2>项目简介</h2>
        <p>
          SteadyHaven（稳港）是一款极简风格的饮食记录 iOS 应用。用户可以记录每日饮食，查看详细的营养成分（热量、蛋白质、碳水、脂肪、钠），浏览历史记录，管理可复用的食物模板，并支持通过相机拍照自动识别营养标签。应用完全离线，无需网络。
        </p>
      </section>

      <section>
        <h2>主要功能</h2>
        <p><strong>今日记录</strong> — 展示当日热量总摄入及各项营养数值。支持按食物名搜索、展开卡片查看详情、右滑删除。</p>
        <p><strong>添加食物</strong> — 支持早餐/午餐/晚餐/零食分类，输入每100g营养值与实际份量，实时计算热量。可选择预存模板快速填充，也可拍照扫描营养标签自动识别填充。</p>
        <p><strong>历史记录</strong> — 通过日历选择任意日期查看当日饮食汇总，只读模式。</p>
        <p><strong>模板管理</strong> — 可创建、编辑、删除食物模板，方便快速重用常用食物的营养数据。</p>
        <p><strong>OCR 扫描</strong> — 使用 Apple Vision 框架识别营养标签文字，自动换算单位并填入表单。</p>
        <p><strong>自制菜谱</strong> — 支持输入整道菜的总营养和总重量，自动换算为每100g值。</p>
      </section>

      <section>
        <h2>技术栈</h2>
        <p>
          纯 SwiftUI + SwiftData 构建，使用 Apple Vision 进行 OCR 文字识别，PhotosUI / UIImagePicker 处理拍照选图。零第三方依赖，最低支持 iOS 17.0，数据完全本地存储。
        </p>
      </section>

      <section>
        <h2>设计风格</h2>
        <p>
          蓝色调极简设计，SF Pro 字体，卡片式布局。整体风格克制、清晰，减少视觉噪音，让用户专注于数据记录本身。
        </p>
      </section>
    </div>
  </article>
</template>

<script setup>
import LikeButton from '../components/LikeButton.vue'
import { postDate } from '../content/posts'
const date = postDate('steady-haven')
</script>

<style scoped>
.blog-post {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 0;
}

.post-header {
  margin-bottom: 60px;
}

.post-category {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--accent);
  margin-bottom: 16px;
}

.post-header h1 {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.post-date {
  font-size: 14px;
  color: var(--text-muted);
}

.post-body {
  font-size: 16px;
  line-height: 1.9;
  color: var(--text-secondary);
}

.post-body section {
  margin-bottom: 48px;
}

.post-body h2 {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.post-body p {
  margin-bottom: 16px;
}

.post-body strong {
  color: var(--text-primary);
  font-weight: 600;
}
</style>
