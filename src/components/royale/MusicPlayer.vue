<script setup>
// 3.10 — Musik latar. Toggle mengambang + equalizer saat playing.
// play() dipanggil parent saat envelope dibuka (gesture user → diizinkan).
// Fallback anggun bila autoplay diblokir.
import { ref, computed } from 'vue'

const props = defineProps({
  src: { type: String, default: '' },
  start: { type: Number, default: 0 },   // detik mulai saat PERTAMA diputar (0 = dari awal)
})
const audioEl = ref(null)
const playing = ref(false)
let seeded = false   // sudah diposisikan ke `start`? (loop berikutnya biarkan dari 0)

// Media Fragment (#t=23): mayoritas browser — termasuk iOS Safari — memulai audio TEPAT
// di detik itu tanpa "blip". `seedStart` di bawah = jaring pengaman bila diabaikan.
const playSrc = computed(() => (props.start > 0 && props.src ? `${props.src}#t=${props.start}` : props.src))

// Dipanggil dari BANYAK event (loadedmetadata/canplay/timeupdate) agar tak terlewat.
// timeupdate menyala berulang SAAT MAIN → menjamin iOS ikut meloncat ke `start`.
function seedStart() {
  const a = audioEl.value
  if (seeded || !a || props.start <= 0) return
  if (!isFinite(a.duration) || props.start >= a.duration) return    // metadata belum siap → tunggu event berikutnya
  if (a.currentTime < props.start - 0.5) {
    try { a.currentTime = props.start } catch { return }            // gagal → coba lagi di event berikutnya
  }
  seeded = true                                                     // sudah di/menuju start; loop selanjutnya bebas dari 0
}

async function play() {
  const a = audioEl.value
  if (!a) return
  seedStart()
  try { await a.play(); playing.value = true } catch { playing.value = false }
}
function toggle() {
  const a = audioEl.value
  if (!a) return
  if (a.paused) play()
  else { a.pause(); playing.value = false }
}
defineExpose({ play })
</script>

<template>
  <div class="mp">
    <audio ref="audioEl" :src="playSrc" loop preload="auto"
           @loadedmetadata="seedStart" @canplay="seedStart" @timeupdate="seedStart"
           @play="playing = true" @pause="playing = false"></audio>
    <button class="mp__btn" :class="{ 'is-on': playing }" type="button" @click="toggle"
            :aria-label="playing ? 'Jeda musik' : 'Putar musik'">
      <span class="mp__disc"><i :class="playing ? 'fa-solid fa-music' : 'fa-solid fa-play'"></i></span>
      <span class="mp__eq"><i></i><i></i><i></i><i></i></span>
    </button>
  </div>
</template>

<style scoped>
.mp { position: fixed; left: 20px; bottom: 20px; z-index: 88; }
/* Mobile: naik di atas quick-nav (bar bawah) agar tak bertabrakan */
@media (max-width: 1023px) { .mp { bottom: 80px; left: 14px; } }
.mp__btn { display: flex; align-items: center; gap: .5rem; padding: .35rem .8rem .35rem .35rem; border-radius: 50px; border: 1px solid var(--line); background: var(--surface); cursor: pointer; box-shadow: 0 12px 30px -14px rgba(0, 0, 0, .6); }
.mp__disc { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; color: var(--accent-ink); background: linear-gradient(135deg, var(--accent), var(--accent-2)); font-size: .9rem; }
.mp__btn.is-on .mp__disc { animation: mpSpin 3.6s linear infinite; }
@keyframes mpSpin { to { transform: rotate(360deg); } }
.mp__eq { display: flex; align-items: flex-end; gap: 2px; height: 16px; }
.mp__eq i { width: 3px; height: 6px; border-radius: 2px; background: var(--accent); opacity: .5; }
.mp__btn.is-on .mp__eq i { opacity: 1; animation: mpEq .9s ease-in-out infinite; }
.mp__btn.is-on .mp__eq i:nth-child(2) { animation-delay: .18s; }
.mp__btn.is-on .mp__eq i:nth-child(3) { animation-delay: .36s; }
.mp__btn.is-on .mp__eq i:nth-child(4) { animation-delay: .54s; }
@keyframes mpEq { 0%, 100% { height: 5px; } 50% { height: 16px; } }
@media (prefers-reduced-motion: reduce) { .mp__btn.is-on .mp__disc, .mp__btn.is-on .mp__eq i { animation: none; } }
</style>
