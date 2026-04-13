<template>
  <div class="article-view">
    <article class="article-content">
      <h1>武汉周末美食之旅</h1>
      <div class="article-meta">
        <span>2024年1月20日</span>
        <span>旅行</span>
      </div>
      
      <div class="article-body">
        <section>
          <h2>写在前面</h2>
          <p>武汉，一座被早餐叫醒的城市。这次周末专程来吃，分享我的探店清单。</p>
        </section>

        <section>
          <h2>早餐篇</h2>
          
          <h3>🔥 德华楼（吉庆街店）</h3>
          <p>百年老字号，必点糊汤粉配油条。糊汤粉鲜香浓郁，油条蘸着汤吃绝了。</p>
          <p>人均：15元 | 推荐指数：⭐⭐⭐⭐⭐</p>
          
          <h3>🔥 三镇民生甜食馆</h3>
          <p>煎包 1.5 元一个，皮薄底脆。配上蛋酒，完美早餐。</p>
          <p>人均：10元 | 推荐指数：⭐⭐⭐⭐⭐</p>
          
          <h3>🔥 蔡林记</h3>
          <p>热干面鼻祖。芝麻酱香浓，配酸豆角绝了。第一次吃建议点全料。</p>
          <p>人均：18元 | 推荐指数：⭐⭐⭐⭐</p>
        </section>

        <section>
          <h2>正餐篇</h2>
          
          <h3>🔥 靓靓蒸虾</h3>
          <p>武汉小龙虾扛把子。蒸虾原汁原味，油焖大虾麻辣过瘾。虾肉新鲜Q弹。</p>
          <p>人均：150元 | 推荐指数：⭐⭐⭐⭐⭐</p>
          
          <h3>🔥 夏氏砂锅</h3>
          <p>开了二十多年的老店。莲藕排骨汤绝了，粉糯清甜。夏天有空调冬天有暖气。</p>
          <p>人均：80元 | 推荐指数：⭐⭐⭐⭐</p>
          
          <h3>🔥 来菜·铫子煨藕</h3>
          <p>新派湖北菜，环境好。铫子藕汤必点，适合请客。</p>
          <p>人均：100元 | 推荐指数：⭐⭐⭐⭐</p>
        </section>

        <section>
          <h2>宵夜篇</h2>
          
          <h3>🔥 小民大排档</h3>
          <p>武汉宵夜扛把子。凤爪软糯入味，花甲新鲜。凌晨1点还排队。</p>
          <p>人均：60元 | 推荐指数：⭐⭐⭐⭐⭐</p>
          
          <h3>🔥 肥肥虾庄</h3>
          <p>油焖大虾是招牌，虾个头大。配啤酒，完美宵夜。</p>
          <p>人均：140元 | 推荐指数：⭐⭐⭐⭐</p>
        </section>

        <section>
          <h2>小吃篇</h2>
          <ul>
            <li><strong>酥角</strong> - 粮道街随便一家都好吃</li>
            <li><strong>矮子馅饼</strong> - 排队也要买</li>
            <li><strong>九九精武</strong> - 鸭脖鸭锁骨</li>
            <li><strong>汪玉霞</strong> - 传统点心</li>
          </ul>
        </section>

        <section>
          <h2>实用Tips</h2>
          <ul>
            <li>过早建议去粮道街或者吉庆街，本地人多的地方</li>
            <li>小龙虾旺季是5-8月</li>
            <li>小民大排档要提前排队</li>
            <li>带好肠胃药，武汉菜偏辣</li>
          </ul>
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
  margin-bottom: 32px;
}

.article-body h2 {
  font-size: 1.25rem;
  color: #dc2626;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #fee2e2;
}

.article-body h3 {
  font-size: 1.05rem;
  color: #333;
  margin: 20px 0 10px;
}

.article-body p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 8px;
}

.article-body ul {
  padding-left: 24px;
}

.article-body li {
  color: #444;
  line-height: 1.8;
  margin-bottom: 8px;
}

.article-body strong {
  color: #333;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding: 12px 24px;
  background: #dc2626;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
}

.back-link:hover {
  background: #b91c1c;
}
</style>
