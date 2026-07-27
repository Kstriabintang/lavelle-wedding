<script setup>
// Latar DARK cinematic portal — deep charcoal + aurora yang hidup (warna sesuai preset
// wallpaper pilihan karyawan), drift lambat + sheen halus + parallax mouse. Ringan
// (murni transform/opacity GPU). Reduced-motion aman. Preset dari session.portalBg.
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { portalBg } from '../lib/session.js'
import { portalBgVars } from '../data/portalBackgrounds.js'

const bgVars = computed(() => portalBgVars(portalBg.value))

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
  <div class="pbg" aria-hidden="true" :style="bgVars">
    <div class="pbg__base"></div>
    <div class="pbg__layer" :style="{ transform: `translate3d(${px * -22}px, ${py * -22}px, 0)` }">
      <span class="pbg__orb pbg__orb--gold"></span>
      <span class="pbg__orb pbg__orb--amber"></span>
    </div>
    <div class="pbg__layer" :style="{ transform: `translate3d(${px * 32}px, ${py * 28}px, 0)` }">
      <span class="pbg__orb pbg__orb--marun"></span>
      <span class="pbg__orb pbg__orb--champ"></span>
    </div>
    <div class="pbg__shine"></div>
    <div class="pbg__sheen"></div>
    <div class="pbg__grain"></div>
    <div class="pbg__vignette"></div>
  </div>
</template>

<style scoped>
.pbg { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
.pbg__base { position: absolute; inset: -2%; background: var(--pb-base, radial-gradient(130% 120% at 20% 6%, #1a140c 0%, #120d08 46%, #0a0705 100%)); transition: background .6s ease; }
.pbg__layer { position: absolute; inset: -8%; will-change: transform; transition: transform .7s cubic-bezier(.22, .8, .2, 1); }
.pbg__orb { position: absolute; border-radius: 50%; filter: blur(90px); will-change: transform, opacity; transition: background .6s ease; }

/* aurora — warna dari preset wallpaper (var), posisi/ukuran/animasi tetap */
.pbg__orb--gold  { width: 46vw; height: 46vw; left: -8%;  top: -14%;  background: var(--pb-o1); animation: drift1 30s ease-in-out infinite; }
.pbg__orb--amber { width: 40vw; height: 40vw; right: -10%; top: -4%;   background: var(--pb-o2); animation: drift2 38s ease-in-out infinite; }
.pbg__orb--marun { width: 48vw; height: 48vw; left: -6%;  bottom: -22%; background: var(--pb-o3); animation: drift1 34s ease-in-out infinite reverse; }
.pbg__orb--champ { width: 42vw; height: 42vw; right: -6%; bottom: -16%; background: var(--pb-o4); animation: drift2 42s ease-in-out infinite reverse; }

@keyframes drift1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(5%, 4%) scale(1.1); } }
@keyframes drift2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-5%, -3%) scale(1.08); } }

/* sapuan cahaya diagonal sangat halus */
.pbg__sheen { position: absolute; top: -60%; left: -60%; width: 220%; height: 220%;
  background: linear-gradient(115deg, transparent 43%, var(--pb-sheen, rgba(236, 201, 127, .06)) 50%, transparent 57%);
  animation: sheen 24s ease-in-out infinite; }
@keyframes sheen { 0%, 100% { transform: translate(-8%, -8%); } 50% { transform: translate(8%, 8%); } }
/* kilau — highlight lembut yang bernafas & bergeser pelan (berkilau) */
.pbg__shine { position: absolute; width: 70vw; height: 70vw; left: 12%; top: -10%; border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, var(--pb-shine, rgba(212,170,80,.1)), transparent 62%);
  filter: blur(60px); animation: shine 16s ease-in-out infinite; }
@keyframes shine { 0%, 100% { opacity: .35; transform: translate(-4%, 0) scale(1); } 50% { opacity: .9; transform: translate(6%, 5%) scale(1.12); } }

.pbg__grain { position: absolute; inset: 0; opacity: .05; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
.pbg__vignette { position: absolute; inset: 0; background:
    radial-gradient(115% 90% at 50% 42%, transparent 42%, rgba(0, 0, 0, .55) 100%); }

@media (prefers-reduced-motion: reduce) {
  .pbg__orb, .pbg__sheen, .pbg__shine { animation: none !important; }
  .pbg__layer { transition: none !important; }
}
</style>
