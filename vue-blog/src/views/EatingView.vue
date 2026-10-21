<template>
  <div class="article-view">
    <article class="article-content">
      <h1>《吃了么》：一个水果茶主题的原生微信小程序</h1>
      <div class="article-meta">
        <span>{{ date }}</span>
        <span class="post-views" id="busuanzi_container_page_pv">阅读 <b id="busuanzi_value_page_pv">–</b></span>
      <LikeButton slug="eating" />
        <span>小程序</span>
      </div>

      <div class="article-body">
        <section>
          <h2>项目是什么</h2>
          <p>《吃了么》是一个水果茶点单主题的微信小程序：浏览饮品菜单、加入购物车、下单的完整链路演示。技术上刻意保持「素」——<strong>原生小程序框架，不引 uni-app / Taro 这类跨端层</strong>，后端走微信云开发（CloudBase），前后端一个仓库搞定。</p>
          <div class="gh-box">
            <a class="gh-link" :href="repo" target="_blank" rel="noopener">github.com/linwanwanwa/eating ↗</a>
            <span class="gh-tag">JavaScript · 原生小程序 + 云开发</span>
          </div>
        </section>

        <section>
          <h2>页面与组件</h2>
          <p>五个页面、四个 tabBar 入口，是标准的小程序信息架构：</p>
          <ul>
            <li><strong>首页</strong>（index）— banner 轮播 + 分类入口</li>
            <li><strong>点餐</strong>（menu）— 商品列表，核心页面</li>
            <li><strong>购物车</strong>（cart）— 已选商品与结算</li>
            <li><strong>我的</strong>（mine）— 个人中心</li>
            <li><strong>详情</strong>（detail）— 单品页，从列表跳入</li>
          </ul>
          <p>抽了三个自定义组件复用：</p>
          <ul>
            <li><code>product-card</code> — 商品卡片，列表和详情共用视觉</li>
            <li><code>search-bar</code> — 搜索栏</li>
            <li><code>cloudTipModal</code> — 云能力提示弹窗（云环境未就绪时引导配置）</li>
          </ul>
        </section>

        <section>
          <h2>仓库结构</h2>
          <pre><code>eating/
├── miniprogram/          # 小程序端
│   ├── pages/            # index / menu / cart / mine / detail
│   ├── components/       # product-card / search-bar / cloudTipModal
│   ├── images/           # banner、9 张食物图、分类图标
│   └── app.json          # 路由与 tabBar 配置
└── cloudfunctions/       # 云函数
    ├── init/             # 初始化（建集合灌数据）
    ├── order/            # 下单
    └── quickstartFunctions/  # 云开发快速开始的样例</code></pre>
          <p>数据层用的是 <code>@cloudbase/database</code>，商品和订单都存在云开发文档库里，<code>init</code> 云函数负责把演示数据灌进去——新环境 clone 下来跑一次初始化就能看全貌，不用手动建表。</p>
        </section>

        <section>
          <h2>几个刻意的取舍</h2>
          <p><strong>1. 为什么不用跨端框架？</strong>目标只有一个平台（微信），跨端层的抽象成本换不来收益，原生 WXML/WXSS 反而让我能控制每个像素——比如菜单卡片的圆角、阴影这些细节。</p>
          <p><strong>2. 为什么选云开发而不是自建后端？</strong>这种演示型项目最怕「跑不起来」。云开发免域名备案、免鉴权配置，小程序端调云函数是平台内闭环，部署成本几乎为零。项目定位是静态展示，但留了 <code>order</code> 云函数作为下单链路的雏形，真要做交易也能接上。</p>
          <p><strong>3. 素材为什么全部本地化？</strong>9 张食物图、3 张 banner、分类图标全部打包在 <code>images/</code> 里。首屏不依赖外网图床，弱网体验可控——虽然体积换速度，但对演示项目这笔账划算。</p>
        </section>

        <section>
          <h2>怎么跑起来</h2>
          <ol>
            <li>用微信开发者工具打开仓库根目录，AppID 用自己的（或选测试号）</li>
            <li>开启云开发，创建环境，把环境 ID 填进 <code>miniprogram/envList.js</code></li>
            <li>上传并部署 <code>cloudfunctions/init</code>，运行一次初始化数据</li>
            <li>编译预览，首页 → 点餐 → 购物车的流程就跑通了；<code>order</code> 云函数部署后可以看到下单的雏形</li>
          </ol>
          <p>仓库在这儿：<a :href="repo" target="_blank" rel="noopener">linwanwanwa/eating</a>，README 很简单，主要看代码结构。</p>
        </section>
      </div>

      <router-link to="/" class="back-link">
        ← 返回首页
      </router-link>
    </article>
  </div>
</template>

<script setup>
import LikeButton from '../components/LikeButton.vue'
import { postDateCN } from '../content/posts'
const date = postDateCN('eating')
const repo = 'https://github.com/linwanwanwa/eating'
</script>

<style scoped>
.article-view {
  padding: 80px 15px 30px;
  background-color: #f8f9fa;
}

.article-content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 60px 50px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

h1 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.article-meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

section {
  margin-bottom: 40px;
}

h2 {
  font-size: 22px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 12px;
}

ul, ol {
  color: #444;
  line-height: 1.9;
  margin: 12px 0 12px 24px;
}

li {
  margin-bottom: 6px;
}

pre {
  background: #263238;
  color: #eceff1;
  padding: 18px 20px;
  border-radius: 10px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
  margin: 14px 0;
}

code {
  font-family: "SF Mono", Menlo, Consolas, monospace;
}

p code, li code {
  background: #eef1f4;
  color: #c0392b;
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 13px;
}

.gh-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin: 18px 0;
  padding: 14px 18px;
  border: 1px solid #e1e4e8;
  border-radius: 12px;
  background: #f6f8fa;
}

.gh-link {
  font-weight: 600;
  color: #0969da;
  text-decoration: none;
}

.gh-tag {
  color: #666;
  font-size: 13px;
}

a {
  color: #0969da;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #666;
  text-decoration: none;
}

.back-link:hover {
  color: #f0883e;
}

@media (max-width: 600px) {
  .article-content {
    padding: 40px 25px;
  }
  h1 {
    font-size: 24px;
  }
}
</style>
