<template>
  <div class="bg-container">
    <div class="bg-base"></div>
    <div class="bg-grain"></div>
    <div class="bg-glow"></div>
  </div>
</template>

<style scoped>
.bg-container {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: -1;
  overflow: hidden;
}

.bg-base {
  position: absolute;
  width: 100%; height: 100%;
  background: var(--bg-primary);
  transition: background-color 0.4s ease;
}

.bg-grain {
  position: absolute;
  width: 100%; height: 100%;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
}

.bg-glow {
  position: absolute;
  top: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(240, 136, 62, 0.06), transparent 70%);
  pointer-events: none;
  animation: glowPulse 8s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}
</style>
