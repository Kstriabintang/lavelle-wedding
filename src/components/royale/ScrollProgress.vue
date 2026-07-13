<script setup>
// FASE 4 — scroll progress bar tipis di atas halaman. Theme-aware.
import { ref, onMounted, onUnmounted } from 'vue'

const pct = ref(0)
let raf = 0
function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    const h = document.documentElement
    const max = h.scrollHeight - h.clientHeight
    pct.value = max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0
    raf = 0
  })
}
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() })
onUnmounted(() => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) })
</script>

<template>
  <div class="sp" aria-hidden="true"><span class="sp__bar" :style="{ width: pct + '%' }"></span></div>
</template>

<style scoped>
.sp { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 92; background: transparent; pointer-events: none; }
.sp__bar { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); box-shadow: 0 0 10px var(--accent); will-change: width; }
</style>
