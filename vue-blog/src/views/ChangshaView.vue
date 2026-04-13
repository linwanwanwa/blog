<template>
  <div class="changsha-view">
    <div class="header">
      <router-link to="/" class="home-btn">← 返回主页</router-link>
      <h1>长沙两日游行程（网红打卡+人文风光）</h1>
      <p>地铁优先 · 步行衔接 · 离线可用 · 宽松不赶场</p>
    </div>

    <div class="menu-bar">
      <div class="menu-list">
        <button 
          v-for="day in ['day1', 'day2']" 
          :key="day"
          :class="['menu-item', { active: activeDay === day }]"
          @click="activeDay = day"
        >
          {{ day === 'day1' ? '第一天行程' : '第二天行程' }}
        </button>
      </div>
    </div>

    <div v-show="activeDay === 'day1'" class="trip-section active">
      <div class="reserve-alert">
        <h3>⚠️ 本行程需预约景点（必看！）</h3>
        <p>1. <span>橘子洲景区</span>：免费不免票，提前3天在【岳麓山橘子洲旅游区】公众号预约</p>
        <p>2. 预约时段：分时段入园，建议选12:00-17:00，凭身份证/预约码入园</p>
        <p>3. 观光小火车：现场购票（往返40元），节假日建议提前排队</p>
      </div>

      <div class="sub-section">
        <div class="overview-card">
          <p>核心主题：商圈逛吃+地标打卡</p>
          <p>总交通费：约50元（地铁+橘子洲观光车）</p>
          <p>用餐：人均80-100元</p>
          <p>住宿：五一广场国金街轻居酒店</p>
        </div>

        <h3>一、 行程明细</h3>
        <div class="table-wrap">
          <table class="trip-table">
            <thead>
              <tr>
                <th>时间段</th>
                <th>行程节点</th>
                <th>交通方式</th>
                <th>耗时</th>
                <th>费用</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>13:44-14:04</td><td>长沙南站 → 五一广场站</td><td>地铁2号线</td><td class="highlight">约20分钟</td><td class="highlight">4元</td></tr>
              <tr><td>14:04-14:09</td><td>五一广场站 → 酒店</td><td>步行</td><td class="highlight">约5分钟</td><td class="highlight">免费</td></tr>
              <tr><td>14:39-14:44</td><td>酒店 → IFS国金中心</td><td>步行</td><td class="highlight">约5分钟</td><td class="highlight">免费</td></tr>
              <tr><td>14:44-15:44</td><td>IFS国金中心打卡</td><td>步行</td><td class="highlight">约1小时</td><td class="highlight">免费</td></tr>
              <tr><td>15:59-16:09</td><td>橘子洲站 → 青年毛泽东雕像</td><td>观光小火车</td><td class="highlight">约10分钟</td><td class="highlight">40元</td></tr>
              <tr><td>16:09-17:09</td><td>橘子洲头游玩</td><td>步行</td><td class="highlight">约1小时</td><td class="highlight">免费</td></tr>
              <tr><td>17:42-19:12</td><td>林小兜有钳用餐</td><td>-</td><td class="highlight">约1.5小时</td><td class="highlight">人均80元</td></tr>
              <tr><td>19:12-20:42</td><td>黄兴南路步行街逛吃</td><td>步行</td><td class="highlight">约1.5小时</td><td class="highlight">人均50元</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h3>二、 核心打卡点</h3>
        <ul>
          <li>IFS国金中心：7楼空中花园（KAWS雕像打卡）</li>
          <li>橘子洲头：青年毛泽东雕像（湘江地标）</li>
          <li>黄兴南路步行街：长沙核心商圈</li>
          <li>林小兜有钳：坡子街附近特色餐厅</li>
        </ul>
      </div>

      <div class="sub-section">
        <h3>三、 当日实用贴士</h3>
        <ul>
          <li>橘子洲观光小火车现场购票即可，节假日建议下午4点后错峰前往</li>
          <li>IFS KAWS雕像打卡需排队，建议提前预留15分钟</li>
          <li>茶颜悦色步行街门店密集，可随时购买</li>
        </ul>
      </div>
    </div>

    <div v-show="activeDay === 'day2'" class="trip-section">
      <div class="reserve-alert">
        <h3>⚠️ 本行程需预约景点（必看！）</h3>
        <p>1. <span>岳麓山景区</span>：免费不免票，提前3天预约</p>
        <p>2. <span>岳麓书院</span>：收费景点（40元/人），需单独预约</p>
        <p>3. 关键提醒：岳麓书院学生半价，老人免费，9点前到避开人流高峰</p>
      </div>

      <div class="sub-section">
        <div class="overview-card">
          <p>核心主题：岳麓山文化风光+老长沙网红打卡</p>
          <p>总交通费：约25元</p>
          <p>用餐：人均80-100元</p>
          <p>游玩时长：约9小时</p>
        </div>

        <h3>一、 行程明细</h3>
        <div class="table-wrap">
          <table class="trip-table">
            <thead>
              <tr>
                <th>时间段</th>
                <th>行程节点</th>
                <th>交通方式</th>
                <th>耗时</th>
                <th>费用</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>09:00-09:25</td><td>太平街 → 溁湾镇站</td><td>地铁2号线</td><td class="highlight">约25分钟</td><td class="highlight">3元</td></tr>
              <tr><td>09:40-10:00</td><td>岳麓山东门 → 岳麓书院</td><td>观光车</td><td class="highlight">约20分钟</td><td class="highlight">20元</td></tr>
              <tr><td>10:00-11:30</td><td>岳麓书院游玩</td><td>步行</td><td class="highlight">约1.5小时</td><td class="highlight">40元</td></tr>
              <tr><td>12:30-14:00</td><td>湖南大学小吃街用餐</td><td>步行</td><td class="highlight">约1.5小时</td><td class="highlight">人均60-80元</td></tr>
              <tr><td>16:50-17:20</td><td>太平街 → 坡子街火宫殿</td><td>步行</td><td class="highlight">约30分钟</td><td class="highlight">人均20-30元</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h3>二、 重点打卡点</h3>
        <ul>
          <li>潮宗街复古电视网红墙：开福区潮宗街湘院子门口</li>
          <li>坡子街火宫殿：天心区坡子街经典打卡点</li>
          <li>坡子街派出所：文明打卡不影响办公</li>
          <li>岳麓书院：中国古代四大书院之一</li>
        </ul>
      </div>

      <div class="sub-section">
        <h3>三、 当日实用贴士</h3>
        <ul>
          <li>岳麓书院需提前1天预约，节假日限流建议9点前到</li>
          <li>网红墙打卡时，文明拍照不影响秩序</li>
          <li>爬山建议穿舒适运动鞋</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const activeDay = ref('day1')
</script>

<style scoped>
.changsha-view {
  padding: 80px 15px 30px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header {
  background: linear-gradient(90deg, #ff8a65, #ff5722);
  color: #fff;
  padding: 25px 15px;
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  border-radius: 8px;
}

.home-btn {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.home-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header h1 {
  font-size: 22px;
  margin-bottom: 8px;
}

.header p {
  font-size: 14px;
  opacity: 0.9;
}

.menu-bar {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  margin-bottom: 20px;
  overflow: hidden;
}

.menu-list {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 15px;
}

.menu-item {
  padding: 12px 24px;
  text-align: center;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.menu-item.active {
  color: #fff;
  background-color: #ff5722;
}

.menu-item:hover:not(.active) {
  background-color: #fef6f0;
  color: #ff5722;
}

.reserve-alert {
  background-color: #fff2f0;
  border: 2px solid #ff4d4f;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.reserve-alert h3 {
  color: #ff4d4f;
  font-size: 16px;
  margin-bottom: 8px;
}

.reserve-alert p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 5px;
}

.reserve-alert span {
  color: #ff4d4f;
  font-weight: 600;
}

.trip-section {
  display: none;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  padding: 20px 15px;
}

.trip-section.active {
  display: block;
}

.sub-section {
  margin-bottom: 25px;
}

.sub-section h2 {
  font-size: 18px;
  color: #ff5722;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.sub-section h3 {
  font-size: 16px;
  color: #333;
  margin: 20px 0 12px;
}

.sub-section p, .sub-section li {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.sub-section ul {
  padding-left: 20px;
}

.overview-card {
  background-color: #fef6f0;
  border-radius: 6px;
  padding: 12px;
  margin: 10px 0;
}

.overview-card p {
  color: #d84315 !important;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

.trip-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 500px;
}

.trip-table th {
  background-color: #f8f9fa;
  color: #333;
  font-weight: 600;
  padding: 10px 8px;
  text-align: left;
  border-bottom: 2px solid #eee;
}

.trip-table td {
  color: #666;
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
}

.trip-table tr:nth-child(even) {
  background-color: #fafafa;
}

.highlight {
  color: #ff5722;
  font-weight: 500;
}
</style>
