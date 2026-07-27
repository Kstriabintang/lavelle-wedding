<script setup>
// Musik latar UNIVERSAL untuk semua template — dari link YouTube.
// Auto-play (dengan suara) dimulai saat sentuhan/klik pertama user (mis. "Buka Undangan"),
// sesuai kebijakan browser. Tombol mengambang untuk putar/jeda. TikTok tak didukung auto-audio
// oleh browser → sarankan link YouTube (lagunya biasanya juga ada di YouTube).
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  link: { type: String, default: '' },
  start: { type: Number, default: 0 },
})

function ytId(url) {
  if (!url) return ''
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i)
  if (m) return m[1]
  const only = String(url).trim()
  return /^[\w-]{11}$/.test(only) ? only : ''
}
const id = computed(() => ytId(props.link))
const playing = ref(false)
let player = null
let started = false

function loadYT() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve(window.YT)
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { if (prev) try { prev() } catch { /* */ } ; resolve(window.YT) }
    if (!document.getElementById('pm-yt-api')) {
      const s = document.createElement('script'); s.id = 'pm-yt-api'; s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s)
    }
  })
}

async function setup() {
  const YT = await loadYT()
  if (!YT || !YT.Player) return
  player = new YT.Player('pm-yt-player', {
    videoId: id.value,
    playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: id.value, start: Math.max(0, props.start | 0), playsinline: 1, modestbranding: 1, rel: 0, fs: 0, disablekb: 1 },
    events: {
      onStateChange: (e) => { playing.value = e.data === YT.PlayerState.PLAYING },
    },
  })
}

function play() { if (player && player.playVideo) { try { player.unMute(); player.setVolume(100); player.playVideo() } catch { /* */ } } }
function pause() { if (player && player.pauseVideo) { try { player.pauseVideo() } catch { /* */ } } }
function toggle() { playing.value ? pause() : play() }
function onFirstGesture() {
  if (started) return
  started = true
  play()
  document.removeEventListener('pointerdown', onFirstGesture)
  document.removeEventListener('touchend', onFirstGesture)
}

onMounted(async () => {
  if (typeof window === 'undefined' || !id.value) return
  await setup()
  document.addEventListener('pointerdown', onFirstGesture, { passive: true })
  document.addEventListener('touchend', onFirstGesture, { passive: true })
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onFirstGesture)
  document.removeEventListener('touchend', onFirstGesture)
  if (player && player.destroy) try { player.destroy() } catch { /* */ }
})
</script>

<template>
  <div v-if="id" class="pmusic">
    <div class="pmusic__hide" aria-hidden="true"><div id="pm-yt-player"></div></div>
    <button class="pmusic__btn" :class="{ 'is-on': playing }" type="button" @click="toggle"
            :aria-label="playing ? 'Jeda musik' : 'Putar musik'" title="Musik">
      <span class="pmusic__disc">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
        </svg>
      </span>
      <span class="pmusic__wave"><i></i><i></i><i></i></span>
    </button>
  </div>
</template>

<style scoped>
.pmusic__hide { position: fixed; width: 1px; height: 1px; left: -9999px; top: -9999px; overflow: hidden; opacity: 0; pointer-events: none; }
.pmusic__btn {
  position: fixed; left: 18px; bottom: 18px; z-index: 90;
  display: inline-flex; align-items: center; gap: .38rem;
  width: 46px; height: 46px; padding: 0 0 0 0; justify-content: center;
  border-radius: 50%; border: 1px solid rgba(255, 255, 255, .3);
  background: rgba(20, 16, 10, .58); color: #f3e6c4; cursor: pointer;
  backdrop-filter: blur(6px); box-shadow: 0 8px 22px rgba(0, 0, 0, .35);
  transition: transform .2s, background-color .2s, width .25s;
}
.pmusic__btn:hover { transform: translateY(-2px); background: rgba(20, 16, 10, .78); }
.pmusic__disc { display: inline-flex; }
.pmusic__btn.is-on .pmusic__disc { animation: pmSpin 3.6s linear infinite; }
@keyframes pmSpin { to { transform: rotate(360deg); } }
.pmusic__wave { display: none; align-items: flex-end; gap: 2px; height: 14px; }
.pmusic__btn.is-on { width: 74px; }
.pmusic__btn.is-on .pmusic__wave { display: inline-flex; }
.pmusic__wave i { width: 3px; height: 5px; background: currentColor; border-radius: 2px; animation: pmEq .9s ease-in-out infinite; }
.pmusic__wave i:nth-child(2) { animation-delay: .18s; }
.pmusic__wave i:nth-child(3) { animation-delay: .36s; }
@keyframes pmEq { 0%, 100% { height: 5px; } 50% { height: 14px; } }
@media (prefers-reduced-motion: reduce) { .pmusic__btn.is-on .pmusic__disc, .pmusic__wave i { animation: none; } }
</style>
