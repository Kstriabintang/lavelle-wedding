<script setup>
// 3.6 — Galeri: grid + filter kategori, lightbox (keyboard + swipe), lazy fade-in.
// "Lihat Semua Foto" membuka OVERLAY di halaman yang sama (tanpa pindah route) →
// musik & posisi scroll tetap. Overlay & lightbox di-Teleport ke <body> agar
// position:fixed tak "patah" oleh ancestor ber-transform (GSAP). Prop `allItems` aditif.
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  cats: { type: Array, default: () => ['Semua'] },
  moreTo: { type: String, default: '' },          // (deprecated)
  allItems: { type: Array, default: () => [] },    // galeri lengkap → overlay in-page
})

const activeCat = ref('Semua')
const filtered = computed(() => activeCat.value === 'Semua' ? props.items : props.items.filter((g) => g.cat === activeCat.value))

const showAll = ref(false)
const lb = ref(-1)
const lbList = ref([])          // array foto yang sedang aktif di lightbox
function lockScroll(on) { if (typeof document !== 'undefined') document.body.style.overflow = on ? 'hidden' : '' }
function openLb(list, i) { lbList.value = list; lb.value = i; lockScroll(true) }
function closeLb() { lb.value = -1; if (!showAll.value) lockScroll(false) }
const lbDir = ref(1)   // arah transisi foto lightbox: 1=berikutnya, -1=sebelumnya
const nextLb = () => { if (lbList.value.length) { lbDir.value = 1; lb.value = (lb.value + 1) % lbList.value.length } }
const prevLb = () => { if (lbList.value.length) { lbDir.value = -1; lb.value = (lb.value - 1 + lbList.value.length) % lbList.value.length } }
function openAll() { showAll.value = true; lockScroll(true) }
function closeAll() { showAll.value = false; if (lb.value < 0) lockScroll(false) }

function onKey(e) {
  if (lb.value >= 0) {
    if (e.key === 'Escape') closeLb()
    else if (e.key === 'ArrowRight') nextLb()
    else if (e.key === 'ArrowLeft') prevLb()
  } else if (showAll.value && e.key === 'Escape') closeAll()
}
let tsx = 0
function ts(e) { tsx = e.changedTouches[0].clientX }
function te(e) {
  const dx = e.changedTouches[0].clientX - tsx
  if (Math.abs(dx) > 44) { dx < 0 ? nextLb() : prevLb() }
}
function setCat(c) { activeCat.value = c; if (lb.value >= 0) closeLb() }
function onLoad(e) { e.target.classList.add('is-loaded') }
// Foto: nama-file (cl1-g09 → /img/mentahan/…jpeg) ATAU URL penuh (http/data/blob) → apa adanya.
function imgSrc(s) { return /^(https?:|data:|blob:)/.test(s || '') ? s : `/img/mentahan/${s}.jpeg` }

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => { document.removeEventListener('keydown', onKey); lockScroll(false) })
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
        <button v-for="(g, i) in filtered" :key="g.src + i" class="gl__tile" :class="`b${i % 6}`" @click="openLb(filtered, i)" aria-label="Perbesar foto">
          <img :src="imgSrc(g.src)" :alt="`${g.cat} ${i + 1}`" class="r-photo gl__img" loading="lazy" @load="onLoad">
          <span class="gl__zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
        </button>
      </div>

      <button v-if="allItems.length" class="gl__more r-reveal" type="button" @click="openAll">
        <i class="fa-regular fa-images"></i> <span>Lihat Semua Foto</span> <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>

    <!-- OVERLAY galeri lengkap — Teleport ke body (tak pindah route; musik tetap jalan) -->
    <Teleport to="body">
      <transition name="lb">
        <div v-if="showAll" class="gl__all">
          <div class="gl__all-head">
            <span class="gl__all-title">Semua Momen</span>
            <button class="gl__all-close" type="button" @click="closeAll" aria-label="Tutup galeri"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="gl__all-grid">
            <button v-for="(g, i) in allItems" :key="g.src + i" class="gl__tile" @click="openLb(allItems, i)" aria-label="Perbesar foto">
              <img :src="imgSrc(g.src)" :alt="`Momen ${i + 1}`" class="r-photo gl__img is-loaded" loading="lazy">
              <span class="gl__zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
            </button>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Lightbox — Teleport ke body, di atas overlay -->
    <Teleport to="body">
      <transition name="lb">
        <div v-if="lb >= 0 && lbList[lb]" class="gl__lb" @click.self="closeLb" @touchstart.passive="ts" @touchend.passive="te">
          <transition :name="lbDir === 1 ? 'gl-nx' : 'gl-pv'" mode="out-in">
            <img :key="lb" :src="imgSrc(lbList[lb].src)" :alt="`Momen ${lb + 1}`" class="gl__lbimg">
          </transition>
          <button class="gl__lbbtn gl__close" @click="closeLb" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
          <button class="gl__lbbtn gl__prev" @click.stop="prevLb" aria-label="Sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>
          <button class="gl__lbbtn gl__next" @click.stop="nextLb" aria-label="Berikutnya"><i class="fa-solid fa-chevron-right"></i></button>
          <span class="gl__count">{{ lb + 1 }} / {{ lbList.length }}</span>
        </div>
      </transition>
    </Teleport>
  </section>
</template>

<style scoped>
.gl__filter { display: flex; flex-wrap: wrap; justify-content: center; gap: .5rem; margin-bottom: 1.6rem; }
.gl__filter button { padding: .55em 1.2em; border-radius: 40px; border: 1px solid var(--line); background: transparent; color: var(--ink-soft); font-family: var(--font-sans); font-size: .74rem; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; transition: all .3s; }
.gl__filter button.is-on { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }

.gl__grid { display: grid; gap: .6rem; grid-template-columns: repeat(2, 1fr); }
.gl__tile { position: relative; border: none; padding: 0; margin: 0; overflow: hidden; border-radius: 12px; cursor: zoom-in; aspect-ratio: 1; background: rgba(30, 23, 13, .5); }
.gl__img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.04); transition: opacity .7s ease, transform .7s ease; }
.gl__img.is-loaded { opacity: 1; transform: scale(1); }
.gl__tile:hover .gl__img.is-loaded { transform: scale(1.06); }

/* Transisi foto lightbox — geser+fade berarah (next: masuk dari kanan, prev: dari kiri) */
.gl-nx-enter-active, .gl-nx-leave-active, .gl-pv-enter-active, .gl-pv-leave-active { transition: opacity .3s ease, transform .34s cubic-bezier(.22, 1, .36, 1); }
.gl-nx-enter-from { opacity: 0; transform: translateX(46px) scale(.975); }
.gl-nx-leave-to  { opacity: 0; transform: translateX(-46px) scale(.975); }
.gl-pv-enter-from { opacity: 0; transform: translateX(-46px) scale(.975); }
.gl-pv-leave-to  { opacity: 0; transform: translateX(46px) scale(.975); }
@media (prefers-reduced-motion: reduce) {
  .gl-nx-enter-active, .gl-nx-leave-active, .gl-pv-enter-active, .gl-pv-leave-active { transition: opacity .2s ease; }
  .gl-nx-enter-from, .gl-nx-leave-to, .gl-pv-enter-from, .gl-pv-leave-to { transform: none; }
}
.gl__zoom { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; font-size: 1.1rem; background: rgba(0, 0, 0, .28); opacity: 0; transition: opacity .3s; }
.gl__tile:hover .gl__zoom { opacity: 1; }

/* Tombol "Lihat Semua Foto" */
.gl__more { display: flex; width: fit-content; align-items: center; gap: .6em; margin: 1.9rem auto 0; padding: .9em 1.9em; border-radius: 50px; border: 1px solid var(--accent); background: transparent; color: var(--accent); font-family: var(--font-sans); font-size: .76rem; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; cursor: pointer; transition: background-color .3s, color .3s, transform .3s; }
.gl__more:hover { background: var(--accent); color: var(--accent-ink); transform: translateY(-3px); }
.gl__more i:last-child { transition: transform .3s; }
.gl__more:hover i:last-child { transform: translateX(4px); }
@media (prefers-reduced-motion: reduce) { .gl__more, .gl__more i:last-child { transition: none; } }

/* DESKTOP: bento — beberapa tile membesar */
@media (min-width: 900px) {
  .gl__grid { grid-template-columns: repeat(4, 1fr); grid-auto-flow: dense; }
  .gl__tile { aspect-ratio: 1; }
  .gl__tile.b0 { grid-column: span 2; grid-row: span 2; aspect-ratio: auto; }
  .gl__tile.b3 { grid-row: span 2; aspect-ratio: auto; }
  .gl__tile.b4 { grid-column: span 2; aspect-ratio: auto; }
}

/* Overlay galeri lengkap (Teleport ke body — warna hardcode agar tak bergantung var yg di-inherit) */
.gl__all { position: fixed; inset: 0; z-index: 120; background: #0b0906; color: #f1e7d3; overflow-y: auto; -webkit-overflow-scrolling: touch; padding-bottom: 6vh; }
.gl__all-head { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: max(.9rem, env(safe-area-inset-top)) clamp(1rem, 4vw, 2rem) .9rem; background: linear-gradient(180deg, #0b0906 62%, rgba(11, 9, 6, 0)); }
.gl__all-title { font-family: 'Fraunces', Georgia, serif; font-size: 1.25rem; color: #ecca7f; letter-spacing: .05em; }
.gl__all-close { flex: none; position: static; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(236, 202, 127, .45); background: rgba(255, 255, 255, .1); color: #ecca7f; cursor: pointer; display: grid; place-items: center; font-size: 1.05rem; transition: background .3s; }
.gl__all-close:hover { background: rgba(236, 202, 127, .22); }
.gl__all-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .5rem; padding: .5rem clamp(1rem, 4vw, 2rem) 0; max-width: 1120px; margin: 0 auto; }
@media (min-width: 720px) { .gl__all-grid { grid-template-columns: repeat(4, 1fr); gap: .7rem; } }

/* Lightbox (Teleport ke body) */
.gl__lb { position: fixed; inset: 0; z-index: 130; background: rgba(0, 0, 0, .94); display: grid; place-items: center; padding: 5vh 4vw; -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }
.gl__lbimg { max-width: min(94vw, 900px); max-height: 84vh; border-radius: 10px; box-shadow: 0 30px 80px -20px rgba(0, 0, 0, .8); }
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
