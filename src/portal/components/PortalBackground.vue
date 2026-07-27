<script setup>
// Latar 3D-motion portal — orb kedalaman (float + parallax mouse) + grain halus.
// Nyaman dilihat: base ivory hangat, orb lembut (bukan blotch), grain tekstur premium.
// Dipakai bersama di login/dashboard/pengaturan agar konsisten. Reduced-motion aman.
import { ref, onMounted, onUnmounted } from 'vue'

const px = ref(0)
const py = ref(0)
let raf = 0
let tx = 0, ty = 0
function onMove(e) {
  tx = (e.clientX / window.innerWidth - 0.5)
  ty = (e.clientY / window.innerHeight - 0.5)
  if (!raf) raf = requestAnimationFrame(apply)
}
function apply() { px.value = tx; py.value = ty; raf = 0 }
onMounted(() => { if (typeof window !== 'undefined') window.addEventListener('mousemove', onMove, { passive: true }) })
onUnmounted(() => { if (typeof window !== 'undefined') window.removeEventListener('mousemove', onMove); if (raf) cancelAnimationFrame(raf) })
</script>

<template>
  <div class="pbg" aria-hidden="true">
    <div class="pbg__base"></div>
    <div class="pbg__layer" :style="{ transform: `translate3d(${px * -26}px, ${py * -26}px, 0)` }">
      <span class="pbg__orb pbg__orb--1"></span>
    </div>
    <div class="pbg__layer" :style="{ transform: `translate3d(${px * 42}px, ${py * 42}px, 0)` }">
      <span class="pbg__orb pbg__orb--2"></span>
    </div>
    <div class="pbg__layer" :style="{ transform: `translate3d(${px * -18}px, ${py * 30}px, 0)` }">
      <span class="pbg__orb pbg__orb--3"></span>
    </div>
    <div class="pbg__grain"></div>
    <div class="pbg__vignette"></div>
  </div>
</template>

<style scoped>
.pbg { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
.pbg__base { position: absolute; inset: 0; background: linear-gradient(165deg, #f4edde 0%, #eee3ce 52%, #e8ddc4 100%); }
.pbg__layer { position: absolute; inset: 0; will-change: transform; transition: transform .6s cubic-bezier(.22, .8, .2, 1); }
.pbg__orb { position: absolute; border-radius: 50%; filter: blur(90px); will-change: transform; }
.pbg__orb--1 { width: 48vw; height: 48vw; left: -12%; top: -16%; opacity: .55; background: radial-gradient(circle, rgba(214, 176, 100, .55), transparent 66%); animation: pbgA 28s ease-in-out infinite; }
.pbg__orb--2 { width: 40vw; height: 40vw; right: -10%; top: 22%; opacity: .42; background: radial-gradient(circle, rgba(196, 156, 96, .5), transparent 66%); animation: pbgB 36s ease-in-out infinite; }
.pbg__orb--3 { width: 36vw; height: 36vw; left: 34%; bottom: -18%; opacity: .4; background: radial-gradient(circle, rgba(238, 214, 156, .55), transparent 66%); animation: pbgA 32s ease-in-out infinite reverse; }
@keyframes pbgA { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(4%, 3%) scale(1.1); } }
@keyframes pbgB { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-4%, -4%) scale(1.08); } }
.pbg__grain { position: absolute; inset: 0; opacity: .05; mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
.pbg__vignette { position: absolute; inset: 0; background: radial-gradient(120% 100% at 50% 0%, transparent 55%, rgba(120, 96, 50, .1)); }
@media (prefers-reduced-motion: reduce) { .pbg__orb { animation: none !important; } .pbg__layer { transition: none !important; } }
</style>
