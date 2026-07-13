<script setup>
// FASE A — Hero/cover premium: foto full-bleed + Ken Burns (loop) + parallax
// scroll, nama skala dramatis, countdown dengan angka roll/flip. Layout beda
// per breakpoint. Motion transform/opacity saja (60fps), hormati reduced-motion.
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  kicker: { type: String, default: 'The Wedding Of' },
  bride: { type: String, default: '' },
  groom: { type: String, default: '' },
  dateText: { type: String, default: '' },
  date: { type: String, default: '' }, // YYYY-MM-DD
  photo: { type: String, default: '' },
})

const cd = ref({ d: 0, h: 0, m: 0, s: 0 })
const pad = (n) => String(n).padStart(2, '0')
let timer = null
function tick() {
  const target = new Date(`${props.date}T08:00:00+07:00`).getTime()
  let diff = Math.max(0, target - Date.now())
  const d = Math.floor(diff / 86400000); diff -= d * 86400000
  const h = Math.floor(diff / 3600000); diff -= h * 3600000
  const m = Math.floor(diff / 60000); diff -= m * 60000
  cd.value = { d, h, m, s: Math.floor(diff / 1000) }
}

// Parallax: foto bergerak ~16% lebih lambat dari konten. rAF-throttled.
const parallax = ref(null)
let raf = 0, reduce = false
function onScroll() {
  if (raf || reduce) return
  raf = requestAnimationFrame(() => {
    const y = window.scrollY || 0
    if (parallax.value) parallax.value.style.transform = `translate3d(0, ${y * 0.16}px, 0)`
    raf = 0
  })
}

onMounted(() => {
  tick(); timer = setInterval(tick, 1000)
  reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduce) { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() }
})
onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('scroll', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <section class="rh">
    <div ref="parallax" class="rh__parallax">
      <div class="rh__photo r-photo" :style="{ backgroundImage: `url(/img/mentahan/${photo}.jpeg)` }"></div>
    </div>
    <div class="rh__overlay"></div>

    <div class="rh__content">
      <div class="rh__head">
        <p class="rh__eyebrow">{{ kicker }}</p>
        <h1 class="rh__names">
          <span class="rh__n">{{ bride }}</span>
          <span class="rh__amp">&amp;</span>
          <span class="rh__n">{{ groom }}</span>
        </h1>
        <span class="rh__rule" aria-hidden="true"></span>
        <p class="rh__date">{{ dateText }}</p>
      </div>

      <div class="rh__cd" role="timer" aria-label="Hitung mundur menuju hari bahagia">
        <div class="rh__cd-item">
          <div class="rh__cd-num"><Transition name="roll"><strong :key="cd.d">{{ cd.d }}</strong></Transition></div>
          <span>Hari</span>
        </div>
        <div class="rh__cd-item">
          <div class="rh__cd-num"><Transition name="roll"><strong :key="cd.h">{{ pad(cd.h) }}</strong></Transition></div>
          <span>Jam</span>
        </div>
        <div class="rh__cd-item">
          <div class="rh__cd-num"><Transition name="roll"><strong :key="cd.m">{{ pad(cd.m) }}</strong></Transition></div>
          <span>Menit</span>
        </div>
        <div class="rh__cd-item">
          <div class="rh__cd-num"><Transition name="roll"><strong :key="cd.s">{{ pad(cd.s) }}</strong></Transition></div>
          <span>Detik</span>
        </div>
      </div>
    </div>

    <a class="rh__scroll" href="#pembuka" aria-label="Gulir ke bawah"><span></span></a>
  </section>
</template>

<style scoped>
.rh { position: relative; min-height: 100svh; overflow: hidden; display: flex; }
.rh__parallax { position: absolute; inset: -8% 0; will-change: transform; }
.rh__photo { position: absolute; inset: 0; background-size: cover; background-position: center; transform-origin: 52% 42%; animation: rhKen 22s ease-in-out infinite alternate both; }
@keyframes rhKen { from { transform: scale(1.02); } to { transform: scale(1.1); } }
.rh__overlay { position: absolute; inset: 0; background: var(--hero-overlay); }

.rh__content { position: relative; z-index: 2; width: 100%; color: #fff; display: flex; flex-direction: column; }
.rh__eyebrow { text-transform: uppercase; letter-spacing: .34em; font-size: .72rem; color: rgba(255, 255, 255, .84); }
.rh__names { display: flex; flex-direction: column; font-family: var(--font-script); font-size: clamp(3rem, 8vw, 7rem); line-height: 1; margin: .6rem 0; font-weight: 400; text-shadow: 0 6px 30px rgba(0, 0, 0, .45); }
.rh__amp { font-family: var(--font-serif); font-style: italic; font-size: .3em; color: var(--accent-2); margin: .04em 0; }
.t-noir .rh__names { font-family: var(--font-display); font-weight: 600; text-transform: uppercase; letter-spacing: 0; font-size: clamp(2.4rem, 8vw, 5.4rem); }
.t-noir .rh__amp { font-weight: 400; }
.rh__rule { display: block; width: 60px; height: 1px; background: rgba(255, 255, 255, .55); margin: 1.4rem 0; }
.rh__date { font-family: var(--font-serif); font-style: italic; font-size: 1.2rem; letter-spacing: .05em; text-shadow: 0 2px 12px rgba(0, 0, 0, .5); }

.rh__cd { display: grid; gap: .9rem; }
.rh__cd-item { text-align: center; }
.rh__cd-num { position: relative; overflow: hidden; height: 1.15em; font-family: var(--font-display); font-size: 2rem; line-height: 1.15; }
.rh__cd-num strong { display: block; font-weight: 500; }
.rh__cd-item span { display: block; margin-top: .5rem; font-size: .58rem; letter-spacing: .24em; text-transform: uppercase; color: rgba(255, 255, 255, .78); }

/* Angka roll saat berganti */
.roll-enter-active, .roll-leave-active { transition: transform .55s cubic-bezier(.16, 1, .3, 1), opacity .55s cubic-bezier(.16, 1, .3, 1); }
.roll-leave-active { position: absolute; top: 0; left: 0; right: 0; }
.roll-enter-from { transform: translateY(100%); opacity: 0; }
.roll-leave-to { transform: translateY(-100%); opacity: 0; }

.rh__scroll { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); z-index: 3; width: 26px; height: 42px; border: 1.5px solid rgba(255, 255, 255, .55); border-radius: 20px; }
.rh__scroll span { position: absolute; top: 8px; left: 50%; width: 4px; height: 8px; margin-left: -2px; border-radius: 3px; background: #fff; animation: rhScroll 1.9s ease-in-out infinite; }
@keyframes rhScroll { 0% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(15px); opacity: 0; } 100% { opacity: 0; } }

/* ---- MOBILE (default): center stack, countdown 2x2, banyak napas ---- */
.rh__content { justify-content: center; align-items: center; text-align: center; padding: 12vh 8vw 15vh; }
.rh__rule { margin-left: auto; margin-right: auto; }
.rh__cd { grid-template-columns: repeat(2, 82px); margin-top: 2.6rem; }

/* ---- TABLET: countdown satu baris ---- */
@media (min-width: 640px) {
  .rh__cd { grid-template-columns: repeat(4, 88px); }
  .rh__cd-num { font-size: 2.2rem; }
}

/* ---- DESKTOP: komposisi editorial — nama bawah-kiri, countdown bawah-kanan ---- */
@media (min-width: 1024px) {
  .rh__content { flex-direction: row; align-items: flex-end; justify-content: space-between; text-align: left; padding: 0 7vw 9vh; }
  .rh__head { max-width: 58%; }
  .rh__eyebrow { letter-spacing: .42em; }
  .rh__rule { margin-left: 0; }
  .rh__cd { grid-template-columns: repeat(4, 96px); margin: 0 0 .5rem; gap: 1.1rem; }
  .rh__cd-num { font-size: 2.5rem; }
}

@media (prefers-reduced-motion: reduce) {
  .rh__photo { animation: none; transform: scale(1.04); }
  .rh__scroll span { animation: none; }
  .roll-enter-active, .roll-leave-active { transition: none; }
  .roll-leave-active { position: absolute; }
}
</style>
