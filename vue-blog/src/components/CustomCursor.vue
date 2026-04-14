<template>
  <div 
    class="cursor" 
    :class="{ text: isText, clicking: isClicking }"
    :style="{ left: x + 'px', top: y + 'px' }"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)
const isText = ref(false)
const isClicking = ref(false)

let cursorX = 0
let cursorY = 0
let targetX = 0
let targetY = 0

const move = (e) => {
  targetX = e.clientX
  targetY = e.clientY
}

const handleMouseOver = (e) => {
  const target = e.target
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
    isText.value = true
  } else {
    isText.value = false
  }
}

const handleMouseDown = () => {
  isClicking.value = true
}

const handleMouseUp = () => {
  isClicking.value = false
}

const animate = () => {
  const ease = 0.15
  cursorX += (targetX - cursorX) * ease
  cursorY += (targetY - cursorY) * ease
  x.value = cursorX
  y.value = cursorY
  requestAnimationFrame(animate)
}

onMounted(() => {
  document.addEventListener('mousemove', move)
  document.addEventListener('mouseover', handleMouseOver)
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mouseup', handleMouseUp)
  animate()
})

onUnmounted(() => {
  document.removeEventListener('mousemove', move)
  document.removeEventListener('mouseover', handleMouseOver)
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
.cursor {
  position: fixed;
  width: 20px;
  height: 20px;
  border: 1px solid var(--text-primary);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference;
  transition: width 0.2s ease, height 0.2s ease, border-width 0.2s ease;
}

.cursor.text {
  width: 2px;
  height: 24px;
  border-radius: 1px;
  background-color: var(--text-primary);
  border: none;
}

.cursor.clicking {
  width: 12px;
  height: 12px;
}

@media (max-width: 768px) {
  .cursor {
    display: none;
  }
}
</style>
