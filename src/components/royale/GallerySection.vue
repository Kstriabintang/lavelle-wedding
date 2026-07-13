<script setup>
// 3.6 — Galeri: bento (desktop) / grid 2 kolom (mobile), filter kategori,
// lightbox (keyboard + swipe), lazy fade-in.
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  cats: { type: Array, default: () => ['Semua'] },
})

const activeCat = ref('Semua')
const filtered = computed(() => activeCat.value === 'Semua' ? props.items : props.items.filter((g) => g.cat === activeCat.value))

const lb = ref(-1)
const openLb = (i) => { lb.value = i }
const closeLb = () => { lb.value = -1 }
const nextLb = () => { lb.value = (lb.value + 1) % filtered.value.length }
const prevLb = () => { lb.value = (lb.value - 1 + filtered.value.length) % filtered.value.length }

function onKey(e) {
  if (lb.value < 0) return
  if (e.key === 'Escape') closeLb()
  else if (e.key === 'ArrowRight') nextLb()
  else if (e.key === 'ArrowLeft') prevLb()
}
let tsx = 0
function ts(e) { tsx = e.changedTouches[0].clientX }
function te(e) {
  const dx = e.changedTouches[0].clientX - tsx
  if (Math.abs(dx) > 44) { dx < 0 ? nextLb() : prevLb() }
}
function setCat(c) { activeCat.value = c; if (lb.value >= 0) closeLb() }
function onLoad(e) { e.target.classList.add('is-loaded') }

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <section id="galeri" class="r-section gl">
    <div class="r-container">
      <p class="r-kicker r-reveal">Momen Kami</p>
      <h2 class="r-title r-reveal">Galeri</h2>
      <div class="r-divider r-reveal"><span></span><i class="fa-regular fa-images"></i><span></span></div>

      <div class="gl__filter r-reveal">
        <button v-for="c in cats" :key="c" :class="{ 'is-on': activeCat === c }" @click="setCat(c)">{{ c }}</button>
      </div>

      <div class="gl__grid r-reveal">
        <button v-for="(g, i) in filtered" :key="g.src + i" class="gl__tile" :class="`b${i % 6}`" @click="openLb(i)" aria-label="Perbesar foto">
          <img :src="`/img/mentahan/${g.src}.jpeg`" :alt="`${g.cat} ${i + 1}`" class="r-photo gl__img" loading="lazy" @load="onLoad">
          <span class="gl__zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
        </button>
      </div>
    </div>

    <transition name="lb">
      <div v-if="lb >= 0" class="gl__lb" @click.self="closeLb" @touchstart.passive="ts" @touchend.passive="te">
        <img :src="`/img/mentahan/${filtered[lb].src}.jpeg`" :alt="`Momen ${lb + 1}`" class="r-photo">
        <button class="gl__lbbtn gl__close" @click="closeLb" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
        <button class="gl__lbbtn gl__prev" @click.stop="prevLb" aria-label="Sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="gl__lbbtn gl__next" @click.stop="nextLb" aria-label="Berikutnya"><i class="fa-solid fa-chevron-right"></i></button>
        <span class="gl__count">{{ lb + 1 }} / {{ filtered.length }}</span>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.gl__filter { display: flex; flex-wrap: wrap; justify-content: center; gap: .5rem; margin-bottom: 1.6rem; }
.gl__filter button { padding: .55em 1.2em; border-radius: 40px; border: 1px solid var(--line); background: transparent; color: var(--ink-soft); font-family: var(--font-sans); font-size: .74rem; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; transition: all .3s; }
.gl__filter button.is-on { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }

.gl__grid { display: grid; gap: .6rem; grid-template-columns: repeat(2, 1fr); }
.gl__tile { position: relative; border: none; padding: 0; margin: 0; overflow: hidden; border-radius: 12px; cursor: zoom-in; aspect-ratio: 1; background: var(--surface-2); }
.gl__img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.04); transition: opacity .7s ease, transform .7s ease; }
.gl__img.is-loaded { opacity: 1; transform: scale(1); }
.gl__tile:hover .gl__img.is-loaded { transform: scale(1.06); }
.gl__zoom { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; font-size: 1.1rem; background: rgba(0, 0, 0, .28); opacity: 0; transition: opacity .3s; }
.gl__tile:hover .gl__zoom { opacity: 1; }

/* DESKTOP: bento — beberapa tile membesar */
@media (min-width: 900px) {
  .gl__grid { grid-template-columns: repeat(4, 1fr); grid-auto-flow: dense; }
  .gl__tile { aspect-ratio: 1; }
  .gl__tile.b0 { grid-column: span 2; grid-row: span 2; aspect-ratio: auto; }
  .gl__tile.b3 { grid-row: span 2; aspect-ratio: auto; }
  .gl__tile.b4 { grid-column: span 2; aspect-ratio: auto; }
}

/* Lightbox */
.gl__lb { position: fixed; inset: 0; z-index: 95; background: rgba(0, 0, 0, .93); display: grid; place-items: center; padding: 5vh 4vw; backdrop-filter: blur(6px); }
.gl__lb img { max-width: min(94vw, 900px); max-height: 84vh; border-radius: 10px; box-shadow: 0 30px 80px -20px rgba(0, 0, 0, .8); }
.gl__lbbtn { position: absolute; width: 48px; height: 48px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, .28); background: rgba(255, 255, 255, .12); color: #fff; cursor: pointer; display: grid; place-items: center; font-size: 1.05rem; transition: background .3s; }
.gl__lbbtn:hover { background: rgba(255, 255, 255, .24); }
.gl__close { top: 4vh; right: 4vw; }
.gl__prev { left: 3vw; top: 50%; transform: translateY(-50%); }
.gl__next { right: 3vw; top: 50%; transform: translateY(-50%); }
.gl__count { position: absolute; bottom: 4vh; left: 50%; transform: translateX(-50%); color: rgba(255, 255, 255, .8); font-size: .8rem; letter-spacing: .1em; }
.lb-enter-active, .lb-leave-active { transition: opacity .3s; }
.lb-enter-from, .lb-leave-to { opacity: 0; }
@media (max-width: 620px) { .gl__prev { left: 1vw; } .gl__next { right: 1vw; } }
</style>
