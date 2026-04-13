<template>
  <div class="bg-container">
    <div class="gradient-bg"></div>
    <div class="blur-layer"></div>
    <div class="noise-overlay"></div>
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
}

.gradient-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse 80% 60% at 20% 30%, rgba(120, 160, 255, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 80% 70%, rgba(180, 140, 255, 0.35) 0%, transparent 50%),
    radial-gradient(ellipse 70% 40% at 50% 50%, rgba(255, 180, 220, 0.25) 0%, transparent 60%);
  filter: blur(60px);
}

[data-theme="dark"] .gradient-bg {
  background:
    radial-gradient(ellipse 80% 60% at 20% 30%, rgba(60, 80, 180, 0.5) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 80% 70%, rgba(100, 60, 180, 0.45) 0%, transparent 50%),
    radial-gradient(ellipse 70% 40% at 50% 50%, rgba(80, 50, 100, 0.3) 0%, transparent 60%);
}

.blur-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  backdrop-filter: saturate(180%) blur(20px);
}

.noise-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.015;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style>
