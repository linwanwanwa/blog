<template>
  <div class="forgive-view" @click="createHeart">
    <div class="apology-card">
      <h1>对不起，我错了 😭</h1>
      <p>
        原谅我这一次好不好？<br>
        我不该惹你生气，不该固执己见，不该忽略你的感受。<br>
        以后我一定好好听你的话，再也不犯同样的错了，求求你原谅我～
      </p>
      <div class="btn-group">
        <button class="btn accept-btn" @click.stop="accept">接受道歉</button>
        <button class="btn refuse-btn" @click.stop="refuse" ref="refuseBtn">不接受</button>
      </div>
    </div>

    <div class="success-tip" v-show="showSuccess">
      太好了！爱你哟 ❤️
    </div>

    <div 
      v-for="heart in hearts" 
      :key="heart.id" 
      class="heart"
      :style="heart.style"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const hearts = ref([])
const showSuccess = ref(false)
const refuseBtn = ref(null)
let heartId = 0

const createHeart = (e) => {
  const heart = {
    id: heartId++,
    style: {
      left: Math.random() * 100 + 'vw',
      animationDuration: (Math.random() * 8 + 8) + 's'
    }
  }
  hearts.value.push(heart)
  setTimeout(() => {
    hearts.value = hearts.value.filter(h => h.id !== heart.id)
  }, 16000)
}

const avoidBtn = () => {
  if (!refuseBtn.value) return
  const card = document.querySelector('.apology-card')
  const cardRect = card.getBoundingClientRect()
  const btn = refuseBtn.value.$el || refuseBtn.value
  
  const randomX = Math.floor(Math.random() * (cardRect.width - 150)) + 10
  const randomY = Math.floor(Math.random() * 100) + 35
  
  btn.style.position = 'absolute'
  btn.style.left = randomX + 'px'
  btn.style.top = randomY + 'px'
}

const accept = () => {
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

const refuse = () => {
  avoidBtn()
}

let heartInterval
onMounted(() => {
  heartInterval = setInterval(() => {
    if (hearts.value.length < 20) {
      createHeart({ clientX: 0, clientY: 0 })
    }
  }, 350)
})

onUnmounted(() => {
  clearInterval(heartInterval)
})
</script>

<style scoped>
.forgive-view {
  width: 100vw;
  min-height: calc(100vh - 160px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, #fddb92, #d1fdff, #fbc2eb);
  background-size: 200% 200%;
  animation: bgMove 10s ease infinite;
  overflow: hidden;
  font-family: "Microsoft YaHei", sans-serif;
  position: relative;
  padding: 100px 15px;
}

@keyframes bgMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.apology-card {
  width: 92%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px 25px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  z-index: 10;
  position: relative;
}

.apology-card h1 {
  color: #e63946;
  font-size: 24px;
  margin-bottom: 18px;
}

.apology-card p {
  color: #333;
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 25px;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 28px;
  border: none;
  border-radius: 30px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.accept-btn {
  background: #2a9d8f;
  color: white;
}

.accept-btn:hover {
  background: #21867a;
  transform: scale(1.05);
}

.refuse-btn {
  background: #9d9d9d;
  color: white;
}

.success-tip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(42, 157, 143, 0.95);
  color: white;
  padding: 40px 60px;
  border-radius: 20px;
  font-size: 20px;
  z-index: 100;
  text-align: center;
}

.heart {
  position: fixed;
  width: 16px;
  height: 16px;
  background: #e63946;
  transform: rotate(45deg);
  opacity: 0.7;
  z-index: 1;
  animation: heartFall linear forwards;
  pointer-events: none;
}

.heart::before, .heart::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  background: #e63946;
  border-radius: 50%;
}

.heart::before {
  top: -8px;
  left: 0;
}

.heart::after {
  top: 0;
  left: -8px;
}

@keyframes heartFall {
  0% {
    top: -10%;
    transform: rotate(45deg) translateX(0);
    opacity: 0.7;
  }
  100% {
    top: 110%;
    transform: rotate(45deg) translateX(50px);
    opacity: 0;
  }
}

@media (max-width: 375px) {
  .btn-group {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
}
</style>
