<script setup>
// Latar hidup portal — aurora lembut multi-warna (champagne · blush · sage · cream)
// di atas pearl-ivory. Menyebar seimbang (bukan belang), drift lambat + parallax mouse
// halus, grain tipis. Ringan: murni transform/opacity GPU. Reduced-motion aman.
import { ref, onMounted, onUnmounted } from 'vue'

const px = ref(0)
const py = ref(0)
let raf = 0
let tx = 0, ty = 0
function onMove(e) {
  tx = e.clientX / window.innerWidth - 0.5
  ty = e.clientY / window.innerHeight - 0.5
  if (!raf) raf = requestAnimationFrame(apply)
}
function apply() { px.value = tx; py.value = ty; raf = 0 }
onMounted(() => { if (typeof window !== 'undefined') window.addEventListener('mousemove', onMove, { passive: true }) })
onUnmounted(() => { if (typeof window !== 'undefined') window.removeEventListener('mousemove', onMove); if (raf) cancelAnimationFrame(raf) })
</script>

<template>
  <div class="pbg" aria-hidden="true">
    <div class="pbg__base"></div>
    <div class="pbg__layer" :style="{ transform: `translate3d(${px * -20}px, ${py * -20}px, 0)` }">
      <span class="pbg__orb pbg__orb--gold"></span>
      <span class="pbg__orb pbg__orb--cream"></span>
    </div>
    <div class="pbg__layer" :style="{ transform: `translate3d(${px * 30}px, ${py * 26}px, 0)` }">
      <span class="pbg__orb pbg__orb--blush"></span>
      <span class="pbg__orb pbg__orb--sage"></span>
    </div>
    <div class="pbg__sheen"></div>
    <div class="pbg__grain"></div>
    <div class="pbg__vignette"></div>
  </div>
</template>

<style scoped>
.pbg { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
.pbg__base { position: absolute; inset: -2%; background:
    radial-gradient(130% 120% at 15% 8%, #fbf7f0 0%, #f6f0e6 46%, #f1eadb 100%); }
.pbg__layer { position: absolute; inset: -8%; will-change: transform; transition: transform .7s cubic-bezier(.22, .8, .2, 1); }
.pbg__orb { position: absolute; border-radius: 50%; filter: blur(80px); will-change: transform, opacity; }

/* palet pernikahan lembut, opacity rendah → mesh halus, tidak belang */
.pbg__orb--gold  { width: 44vw; height: 44vw; left: -8%;  top: -12%;  background: radial-gradient(circle at 50% 50%, rgba(214, 180, 116, .34), transparent 68%); animation: drift1 30s ease-in-out infinite; }
.pbg__orb--blush { width: 40vw; height: 40vw; right: -10%; top: -6%;   background: radial-gradient(circle at 50% 50%, rgba(214, 166, 158, .28), transparent 68%); animation: drift2 38s ease-in-out infinite; }
.pbg__orb--sage  { width: 46vw; height: 46vw; left: -6%;  bottom: -20%; background: radial-gradient(circle at 50% 50%, rgba(160, 182, 152, .22), transparent 70%); animation: drift1 34s ease-in-out infinite reverse; }
.pbg__orb--cream { width: 42vw; height: 42vw; right: -4%; bottom: -16%; background: radial-gradient(circle at 50% 50%, rgba(240, 222, 184, .40), transparent 68%); animation: drift2 42s ease-in-out infinite reverse; }

@keyframes drift1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(5%, 4%) scale(1.09); } }
@keyframes drift2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-5%, -3%) scale(1.07); } }

/* signature: sapuan cahaya diagonal sangat halus yang melintas perlahan */
.pbg__sheen { position: absolute; top: -60%; left: -60%; width: 220%; height: 220%;
  background: linear-gradient(115deg, transparent 42%, rgba(255, 252, 246, .5) 50%, transparent 58%);
  animation: sheen 22s ease-in-out infinite; opacity: .6; }
@keyframes sheen { 0%, 100% { transform: translate(-8%, -8%); } 50% { transform: translate(8%, 8%); } }

.pbg__grain { position: absolute; inset: 0; opacity: .04; mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
.pbg__vignette { position: absolute; inset: 0; background:
    radial-gradient(120% 90% at 50% -10%, transparent 58%, rgba(120, 98, 56, .08)); }

@media (prefers-reduced-motion: reduce) {
  .pbg__orb, .pbg__sheen { animation: none !important; }
  .pbg__layer { transition: none !important; }
}
</style>
