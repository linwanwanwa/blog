<template>
  <div class="bg-container">
    <div class="gradient-bg"></div>
    <div class="grain-overlay"></div>
  </div>
</template>

<style scoped>
.bg-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.gradient-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  transition: background-color 0.4s ease;
}

.grain-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
}
</style>
