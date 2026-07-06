<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const pct = ref(0)
let ticking = false

function update() {
  const doc = document.documentElement
  const max = doc.scrollHeight - doc.clientHeight
  pct.value = max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0
  ticking = false
}
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(update)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  update()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div class="scroll-progress" aria-hidden="true">
    <span :style="{ transform: `scaleX(${pct / 100})` }"></span>
  </div>
</template>

<style scoped>
.scroll-progress {
  position: fixed;
  inset: 0 0 auto 0;
  height: 3px;
  z-index: 200;
  pointer-events: none;
  background: transparent;
}
.scroll-progress span {
  display: block;
  height: 100%;
  width: 100%;
  transform: scaleX(0);
  transform-origin: left;
  background: linear-gradient(90deg, var(--sage), var(--gold), var(--gold-deep));
  box-shadow: 0 0 12px -2px var(--gold);
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .scroll-progress span { transition: none; }
}
</style>
