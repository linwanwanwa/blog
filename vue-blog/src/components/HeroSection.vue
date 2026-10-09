<template>
  <section ref="rootEl" class="hero">
    <canvas ref="canvasEl" class="hero-canvas" aria-hidden="true"></canvas>
    <div class="hero-grid" aria-hidden="true"></div>
    <div class="hero-glow" aria-hidden="true"></div>

    <div class="hero-marquee" aria-hidden="true">
      <div class="marquee-track">
        <span v-for="i in 8" :key="i">LINWAN <em>✦</em> FULL-STACK <em>✦</em> iOS <em>✦</em> </span>
      </div>
    </div>

    <div class="hero-content">
      <div class="hero-badge">
        <span class="pulse"></span>
        <span>Available for new opportunities</span>
      </div>

      <h1 class="hero-title">
        <span class="line line-1">
          <span
            v-for="(ch, i) in line1"
            :key="'a' + i"
            class="char"
            :style="{ '--i': i }"
          >{{ ch }}</span>
        </span>
        <span class="line line-2">
          <span
            v-for="(ch, i) in line2"
            :key="'b' + i"
            class="char grad"
            :style="{ '--i': i }"
          >{{ ch }}</span>
        </span>
      </h1>

      <p class="hero-subtitle">
        <span class="rotator">
          <span :key="wordIndex" class="word">{{ words[wordIndex] }}</span>
        </span>
      </p>

      <div class="hero-stats">
        <div
          v-for="(s, i) in stats"
          :key="s.label"
          class="stat"
          :style="{ '--d': 1.05 + i * 0.12 + 's' }"
        >
          <span class="stat-num">{{ pad(display[i]) }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>

      <div class="hero-actions">
        <a
          href="#projects"
          class="hero-btn primary"
          @mousemove="magnet"
          @mouseleave="unmagnet"
        >
          <span>View Projects</span>
          <i class="arrow">→</i>
        </a>
        <router-link
          to="/profile"
          class="hero-btn ghost"
          @mousemove="magnet"
          @mouseleave="unmagnet"
        >
          <span>About Me</span>
        </router-link>
      </div>
    </div>

    <div class="hero-scroll" aria-hidden="true">
      <span class="scroll-label">SCROLL</span>
      <span class="scroll-line"><i></i></span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()

const rootEl = ref(null)
const canvasEl = ref(null)

const line1 = ['H', 'E', 'L', 'L', 'O', ',', ' ', 'I', "'", 'M']
const line2 = ['L', 'I', 'N', 'W', 'A', 'N']

const words = ['全栈开发者 · Vue / Node', 'iOS 开发者 · SwiftUI', '技术探索者 · 终身学习', '设计与工程的交界处']
const wordIndex = ref(0)

const stats = [
  { value: 5, label: 'Articles' },
  { value: 4, label: 'Projects' },
  { value: 2, label: 'Platforms' }
]
const display = ref([0, 0, 0])
const pad = (n) => String(n).padStart(2, '0')

let wordTimer = null

/* ---------- 按钮磁吸 ---------- */
const magnet = (e) => {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = e.clientX - r.left - r.width / 2
  const y = e.clientY - r.top - r.height / 2
  el.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}
const unmagnet = (e) => {
  e.currentTarget.style.transform = ''
}

/* ---------- 3D 能量环 ---------- */
let ctx = null
let raf = 0
let W = 0
let H = 0
let dpr = 1
let palette = { accent: [240, 136, 62], primary: [230, 232, 234] }
let reduceMotion = false
let startTime = 0
let scrollY = 0
let pointer = { x: 0.5, y: 0.4, inside: false }
let tilt = { x: -0.34, y: 0 }
const tiltTarget = { x: -0.34, y: 0 }

const rings = [
  { R: 1.0, r: 0.30, count: 132, speed: 0.0030, baseTilt: -0.30, wave: 0.55, freq: 3 },
  { R: 0.70, r: 0.20, count: 104, speed: -0.0042, baseTilt: 0.46, wave: 0.40, freq: 2 },
  { R: 1.32, r: 0.10, count: 150, speed: 0.0018, baseTilt: -0.62, wave: 0.90, freq: 5 }
]

const buildRing = (cfg) => {
  const pts = []
  for (let i = 0; i < cfg.count; i++) {
    const u = (i / cfg.count) * Math.PI * 2
    const v = cfg.wave * Math.sin(u * cfg.freq)
    pts.push({ u, v })
  }
  return pts
}
rings.forEach((r) => { r.pts = buildRing(r); r.rot = r.baseTilt ? 0 : 0 })

const hexToRgb = (hex) => {
  const h = hex.replace('#', '').trim()
  if (h.length === 3) return h.split('').map((c) => parseInt(c + c, 16))
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

const readColors = () => {
  const cs = getComputedStyle(document.documentElement)
  const accent = hexToRgb(cs.getPropertyValue('--accent') || '#f0883e')
  const primary = hexToRgb(cs.getPropertyValue('--text-primary') || '#e6e8ea')
  palette = { accent, primary }
}

const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

const resize = () => {
  const el = canvasEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  W = rect.width
  H = rect.height
  el.width = Math.round(W * dpr)
  el.height = Math.round(H * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

const project = (x, y, z, cx, cy, baseR) => {
  const d = 3.4
  const s = d / (d + z)
  return { x: cx + x * s * baseR, y: cy + y * s * baseR, s, z }
}

const draw = (now) => {
  raf = requestAnimationFrame(draw)
  if (!ctx || document.hidden) return

  const elapsed = now - startTime
  const enter = reduceMotion ? 1 : Math.min(elapsed / 1900, 1)
  const ease = reduceMotion ? 1 : 1 - Math.pow(1 - enter, 3)
  const fade = Math.max(0, 1 - scrollY / 620)

  tilt.x += (tiltTarget.x - tilt.x) * 0.06
  tilt.y += (tiltTarget.y - tilt.y) * 0.06

  ctx.clearRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2 + scrollY * 0.14
  const baseR = Math.min(W, H) * (W < 700 ? 0.34 : 0.30)

  const sinX = Math.sin(tilt.x)
  const cosX = Math.cos(tilt.x)
  const sinY = Math.sin(tilt.y)
  const cosY = Math.cos(tilt.y)

  const { accent, primary } = palette

  for (let ri = 0; ri < rings.length; ri++) {
    const ring = rings[ri]
    ring.rot += ring.speed * (reduceMotion ? 0 : 1)
    const rot = ring.rot + (1 - ease) * -1.7
    const sinR = Math.sin(rot)
    const cosR = Math.cos(rot)
    const zPush = (1 - ease) * 2.4

    const pts = []
    for (let i = 0; i < ring.pts.length; i++) {
      const { u, v } = ring.pts[i]
      const rad = ring.R + ring.r * Math.cos(v)
      let x = rad * Math.cos(u + rot * 0.2)
      let y = ring.r * Math.sin(v)
      let z = rad * Math.sin(u + rot * 0.2)

      // 绕 X 轴（环自身倾斜）
      let y2 = y * Math.cos(ring.baseTilt) - z * Math.sin(ring.baseTilt)
      let z2 = y * Math.sin(ring.baseTilt) + z * Math.cos(ring.baseTilt)

      // 绕 Y 轴自转
      let x3 = x * cosR + z2 * sinR
      let z3 = -x * sinR + z2 * cosR

      // 全局倾斜（鼠标视差）
      let y4 = y2 * cosX - z3 * sinX
      let z4 = y2 * sinX + z3 * cosX
      let x5 = x3 * cosY + z4 * sinY
      let z5 = -x3 * sinY + z4 * cosY

      z5 += zPush

      const p = project(x5, y4, z5, cx, cy, baseR)
      // 深度：z 越小越近
      const depth = Math.max(0, Math.min(1, (z5 + 1.5) / 3.0))
      p.depth = depth
      p.alpha = (0.16 + (1 - depth) * 0.84) * ease * fade
      pts.push(p)
    }

    // 鼠标斥力
    if (pointer.inside && !reduceMotion) {
      const mx = pointer.x * W
      const my = pointer.y * H
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.hypot(dx, dy)
        if (dist < 140 && dist > 0.001) {
          const push = (1 - dist / 140) * 16
          p.x += (dx / dist) * push
          p.y += (dy / dist) * push
        }
      }
    }

    // 连线（相邻点，闭合）
    ctx.lineWidth = 1
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i]
      const b = pts[(i + 1) % pts.length]
      if (a.alpha < 0.05 || b.alpha < 0.05) continue
      const al = Math.min(a.alpha, b.alpha) * (ri === 2 ? 0.22 : 0.38)
      ctx.strokeStyle = rgba(accent, al)
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }

    // 点
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i]
      if (p.alpha < 0.04) continue
      const size = (0.7 + (1 - p.depth) * 1.5) * p.s
      const isBright = i % 9 === 0
      ctx.fillStyle = rgba(isBright ? primary : accent, p.alpha * (isBright ? 0.9 : 0.75))
      ctx.beginPath()
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    // 能量脉冲：沿环奔跑的高亮点
    if (!reduceMotion) {
      const head = ((now / 1000) * (ri === 1 ? 0.55 : 0.38) * ring.count) % ring.count
      for (let k = 0; k < 7; k++) {
        const idx = Math.floor(head - k)
        const p = pts[((idx % pts.length) + pts.length) % pts.length]
        const t = 1 - k / 7
        ctx.fillStyle = rgba(primary, 0.55 * t * ease * fade * (1 - p.depth * 0.6))
        ctx.beginPath()
        ctx.arc(p.x, p.y, (1.4 + t * 2.6) * p.s, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
}

const onPointerMove = (e) => {
  const rect = rootEl.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  pointer.x = x
  pointer.y = y
  pointer.inside = true
  tiltTarget.x = -0.34 + (y - 0.5) * 0.55
  tiltTarget.y = (x - 0.5) * 0.75
  rootEl.value.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  rootEl.value.style.setProperty('--my', `${e.clientY - rect.top}px`)
}
const onPointerLeave = () => {
  pointer.inside = false
  tiltTarget.x = -0.34
  tiltTarget.y = 0
}
const onScroll = () => {
  scrollY = window.scrollY || 0
}

onMounted(() => {
  ctx = canvasEl.value.getContext('2d')
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  readColors()
  resize()

  wordTimer = setInterval(() => {
    wordIndex.value = (wordIndex.value + 1) % words.length
  }, 2800)

  // 数字滚动
  const dur = 1500
  const t0 = performance.now()
  const tick = (now) => {
    const p = Math.min((now - t0) / dur, 1)
    const e = 1 - Math.pow(1 - p, 4)
    display.value = stats.map((s) => Math.round(s.value * e))
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)

  window.addEventListener('resize', resize)
  window.addEventListener('scroll', onScroll, { passive: true })
  rootEl.value.addEventListener('pointermove', onPointerMove)
  rootEl.value.addEventListener('pointerleave', onPointerLeave)

  startTime = performance.now()
  if (reduceMotion) {
    draw(performance.now())
    cancelAnimationFrame(raf)
    raf = 0
  } else {
    raf = requestAnimationFrame(draw)
  }
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  clearInterval(wordTimer)
  window.removeEventListener('resize', resize)
  window.removeEventListener('scroll', onScroll)
  if (rootEl.value) {
    rootEl.value.removeEventListener('pointermove', onPointerMove)
    rootEl.value.removeEventListener('pointerleave', onPointerLeave)
  }
})

watch(() => themeStore.state.currentTheme, readColors)
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-primary);
  isolation: isolate;
  --mx: 50%;
  --my: 40%;
}

/* ---------- 背景层 ---------- */
.hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 1;
}

.hero-grid {
  position: absolute;
  inset: -10%;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 68px 68px;
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 10%, transparent 75%);
  mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 10%, transparent 75%);
  animation: gridDrift 28s linear infinite;
}

@keyframes gridDrift {
  to { background-position: 68px 68px, 68px 68px; }
}

.hero {
  --grid-line: rgba(255, 255, 255, 0.05);
}
[data-theme="light"] .hero {
  --grid-line: rgba(0, 0, 0, 0.055);
}

.hero-glow {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(520px circle at var(--mx) var(--my), var(--glow), transparent 68%);
  transition: background 0.15s linear;
}
.hero {
  --glow: rgba(240, 136, 62, 0.13);
}
[data-theme="light"] .hero {
  --glow: rgba(224, 112, 32, 0.10);
}

.hero-marquee {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 88px;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}

.marquee-track {
  display: flex;
  gap: 40px;
  white-space: nowrap;
  width: max-content;
  font-size: clamp(46px, 8.5vw, 118px);
  font-weight: 800;
  letter-spacing: 0.01em;
  color: transparent;
  -webkit-text-stroke: 1px var(--stroke);
  animation: marquee 34s linear infinite;
}

.marquee-track em {
  font-style: normal;
  font-size: 0.3em;
  vertical-align: 0.9em;
  -webkit-text-stroke: 1px var(--accent);
  opacity: 0.45;
}

.hero {
  --stroke: rgba(255, 255, 255, 0.10);
}
[data-theme="light"] .hero {
  --stroke: rgba(0, 0, 0, 0.10);
}

@keyframes marquee {
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
  .hero-grid { animation: none; }
}

/* ---------- 内容 ---------- */
.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 96px 24px 120px;
  max-width: 1100px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 7px 16px 7px 12px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-card);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  margin-bottom: 26px;
  opacity: 0;
  animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
}

.pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 rgba(240, 136, 62, 0.6);
  animation: pulse 2.4s ease-out infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(240, 136, 62, 0.55); }
  70% { box-shadow: 0 0 0 10px rgba(240, 136, 62, 0); }
  100% { box-shadow: 0 0 0 0 rgba(240, 136, 62, 0); }
}

.hero-title {
  margin: 0 0 18px;
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.035em;
}

.line {
  display: block;
  overflow: hidden;
  padding-bottom: 0.08em;
}

.line-1 {
  font-size: clamp(24px, 2.4vw + 1.6vh, 54px);
  color: var(--text-secondary);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.06em;
}

.line-2 {
  font-size: clamp(52px, 6vw + 5vh, 150px);
}

.char {
  display: inline-block;
  white-space: pre;
  transform: translateY(112%) rotateX(-55deg);
  opacity: 0;
  animation: charIn 1.05s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(0.28s + var(--i) * 0.045s);
  will-change: transform, opacity;
}

@keyframes charIn {
  0% { transform: translateY(112%) rotateX(-55deg); opacity: 0; }
  60% { opacity: 1; }
  100% { transform: translateY(0) rotateX(0deg); opacity: 1; }
}

/* LINWAN 连续渐变：每个字符取渐变的 1/6 */
.char.grad {
  background-image: linear-gradient(104deg, var(--text-primary) 8%, var(--accent) 46%, var(--text-primary) 82%);
  background-size: 600% 100%;
  background-position: calc(var(--i) * 20%) 0;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;
}

.char.grad:hover {
  transform: translateY(-8px);
}

.hero-subtitle {
  font-size: clamp(15px, 2.1vw, 20px);
  color: var(--text-secondary);
  margin: 0 0 34px;
  min-height: 1.6em;
  opacity: 0;
  animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.95s forwards;
}

.rotator {
  display: inline-block;
  min-width: 12em;
}

.word {
  display: inline-block;
  animation: wordIn 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes wordIn {
  from { opacity: 0; transform: translateY(12px); filter: blur(6px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: clamp(28px, 6vw, 72px);
  margin-bottom: 40px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: 0;
  animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--d) forwards;
}

.stat-num {
  font-size: clamp(24px, 3.4vw, 38px);
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}

.stat-label {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.hero-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.45s forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-btn {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 34px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  will-change: transform;
}

.hero-btn::before {
  content: '';
  position: absolute;
  left: var(--mx, 50%);
  top: var(--my, 50%);
  width: 220px;
  height: 220px;
  transform: translate(-50%, -50%) scale(0);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.28), transparent 65%);
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.hero-btn:hover::before {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.hero-btn.primary {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 10px 40px -12px rgba(240, 136, 62, 0.7);
}

.hero-btn.primary:hover {
  background: var(--accent-hover);
  box-shadow: 0 18px 50px -12px rgba(240, 136, 62, 0.9);
}

.hero-btn .arrow {
  font-style: normal;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-btn:hover .arrow {
  transform: translateX(5px);
}

.hero-btn.ghost {
  background: transparent;
  border: 1px solid var(--border-hover);
  color: var(--text-primary);
}

.hero-btn.ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.hero-btn.ghost::before {
  background: radial-gradient(circle, var(--glow), transparent 65%);
}

/* ---------- 滚动提示 ---------- */
.hero-scroll {
  position: absolute;
  left: 50%;
  bottom: 38px;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0;
  animation: fadeUp 1s ease 1.9s forwards;
}

.scroll-label {
  font-size: 9px;
  letter-spacing: 0.34em;
  color: var(--text-muted);
}

.scroll-line {
  position: relative;
  width: 1px;
  height: 46px;
  background: linear-gradient(to bottom, var(--border-hover), transparent);
  overflow: hidden;
}

.scroll-line i {
  position: absolute;
  left: -1px;
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: var(--accent);
  animation: scrollRun 2.1s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes scrollRun {
  0% { top: -16px; opacity: 0; }
  25% { opacity: 1; }
  75% { opacity: 1; }
  100% { top: 46px; opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .char { animation: none; transform: none; opacity: 1; }
  .hero-badge, .hero-subtitle, .stat, .hero-actions, .hero-scroll {
    animation: none;
    opacity: 1;
  }
  .word { animation: none; }
  .scroll-line i { animation: none; top: 16px; }
  .pulse { animation: none; }
}

@media (max-width: 768px) {
  .hero { min-height: 92vh; }
  .hero-marquee { bottom: 84px; }
  .hero-badge { margin-bottom: 24px; font-size: 11px; }
  .hero-stats { gap: 26px; margin-bottom: 36px; }
  .hero-scroll { bottom: 22px; }
  .scroll-line { height: 34px; }
}

@media (max-height: 780px) {
  .hero-scroll { display: none; }
  .hero-content { padding-bottom: 72px; }
}
</style>
