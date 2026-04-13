<template>
  <div 
    class="cursor" 
    :class="{ text: isText }"
    :style="{ left: x + 'px', top: y + 'px' }"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)
const isText = ref(false)

const move = (e) => {
  x.value = e.clientX
  y.value = e.clientY
}

const handleMouseOver = (e) => {
  const target = e.target
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
    isText.value = true
  } else {
    isText.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousemove', move)
  document.addEventListener('mouseover', handleMouseOver)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', move)
  document.removeEventListener('mouseover', handleMouseOver)
})
</script>

<style scoped>
.cursor {
  position: fixed;
  width: 20px;
  height: 20px;
  border: 2px solid #2563eb;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference;
}

.cursor.text {
  width: 2px;
  height: 24px;
  border-radius: 1px;
  background-color: #2563eb;
  border: none;
}

@media (max-width: 768px) {
  .cursor {
    display: none;
  }
}
</style>
