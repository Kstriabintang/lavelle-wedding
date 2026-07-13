<script setup>
// 3.2 — Hero/cover: nama besar, countdown realtime, foto full-screen,
// scroll indicator. Layout beda per breakpoint (lihat <style>).
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
let timer = null
function tick() {
  const target = new Date(`${props.date}T08:00:00+07:00`).getTime()
  let diff = Math.max(0, target - Date.now())
  const d = Math.floor(diff / 86400000); diff -= d * 86400000
  const h = Math.floor(diff / 3600000); diff -= h * 3600000
  const m = Math.floor(diff / 60000); diff -= m * 60000
  cd.value = { d, h, m, s: Math.floor(diff / 1000) }
}
onMounted(() => { tick(); timer = setInterval(tick, 1000) })
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <section class="rh">
    <div class="rh__photo r-photo" :style="{ backgroundImage: `url(/img/mentahan/${photo}.jpeg)` }"></div>
    <div class="rh__overlay"></div>

    <div class="rh__content">
      <div class="rh__head">
        <p class="rh__eyebrow">{{ kicker }}</p>
        <h1 class="rh__names r-script">{{ bride }} <span>&amp;</span> {{ groom }}</h1>
        <p class="rh__date">{{ dateText }}</p>
      </div>

      <div class="rh__cd">
        <div class="rh__cd-item"><strong>{{ cd.d }}</strong><span>Hari</span></div>
        <div class="rh__cd-item"><strong>{{ cd.h }}</strong><span>Jam</span></div>
        <div class="rh__cd-item"><strong>{{ cd.m }}</strong><span>Menit</span></div>
        <div class="rh__cd-item"><strong>{{ cd.s }}</strong><span>Detik</span></div>
      </div>
    </div>

    <a class="rh__scroll" href="#mempelai" aria-label="Gulir ke bawah"><span></span></a>
  </section>
</template>

<style scoped>
.rh { position: relative; min-height: 100svh; overflow: hidden; display: flex; }
.rh__photo { position: absolute; inset: 0; background-size: cover; background-position: center; transform: scale(1.06); animation: rhZoom 16s ease-out both; }
@keyframes rhZoom { from { transform: scale(1.16); } to { transform: scale(1.06); } }
.rh__overlay { position: absolute; inset: 0; background: var(--hero-overlay); }
.rh__content { position: relative; z-index: 2; width: 100%; color: #fff; display: flex; flex-direction: column; }
.rh__eyebrow { text-transform: uppercase; letter-spacing: .34em; font-size: .66rem; color: rgba(255, 255, 255, .82); }
.rh__names { font-family: var(--font-script); font-size: clamp(3.4rem, 15vw, 6rem); line-height: 1; margin: .5rem 0; text-shadow: 0 4px 26px rgba(0, 0, 0, .5); }
.rh__names span { display: block; font-size: .32em; font-family: var(--font-serif); font-style: italic; color: var(--accent-2); }
.t-noir .rh__names { font-family: var(--font-display); font-weight: 700; text-transform: uppercase; letter-spacing: -.01em; font-size: clamp(2.6rem, 11vw, 4.6rem); }
.rh__date { font-family: var(--font-serif); font-style: italic; font-size: 1.15rem; letter-spacing: .06em; text-shadow: 0 2px 12px rgba(0, 0, 0, .5); }

.rh__cd { display: grid; gap: .7rem; }
.rh__cd-item { border: 1px solid rgba(255, 255, 255, .28); background: rgba(0, 0, 0, .22); backdrop-filter: blur(4px); border-radius: 12px; padding: .9rem .4rem; text-align: center; }
.rh__cd-item strong { display: block; font-family: var(--font-display); font-size: 1.9rem; line-height: 1; }
.rh__cd-item span { display: block; margin-top: .35rem; font-size: .6rem; letter-spacing: .2em; text-transform: uppercase; color: rgba(255, 255, 255, .8); }

.rh__scroll { position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); z-index: 3; width: 26px; height: 42px; border: 2px solid rgba(255, 255, 255, .6); border-radius: 20px; }
.rh__scroll span { position: absolute; top: 8px; left: 50%; width: 4px; height: 8px; margin-left: -2px; border-radius: 3px; background: #fff; animation: rhScroll 1.8s ease-in-out infinite; }
@keyframes rhScroll { 0% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(14px); opacity: 0; } 100% { opacity: 0; } }

/* ---- MOBILE (default): center stack, countdown 2x2 ---- */
.rh__content { justify-content: center; align-items: center; text-align: center; padding: 10vh 7vw 14vh; }
.rh__cd { grid-template-columns: repeat(2, 78px); margin-top: 2rem; }

/* ---- TABLET: countdown jadi satu baris 4 ---- */
@media (min-width: 640px) {
  .rh__cd { grid-template-columns: repeat(4, 84px); }
}

/* ---- DESKTOP: komposisi beda — konten turun ke bawah, nama kiri, countdown kanan ---- */
@media (min-width: 1024px) {
  .rh__content { flex-direction: row; align-items: flex-end; justify-content: space-between; text-align: left; padding: 0 6vw 8vh; }
  .rh__head { max-width: 60%; }
  .rh__names { font-size: clamp(5rem, 7vw, 7.5rem); }
  .rh__eyebrow { letter-spacing: .4em; }
  .rh__cd { grid-template-columns: repeat(4, 92px); margin: 0 0 .6rem; }
  .rh__cd-item { padding: 1.1rem .5rem; }
  .rh__cd-item strong { font-size: 2.3rem; }
  .rh__scroll { left: auto; right: 6vw; transform: none; }
}

@media (prefers-reduced-motion: reduce) { .rh__photo { animation: none; } .rh__scroll span { animation: none; } }
</style>
