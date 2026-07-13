<script setup>
// FASE B — Floating quick-nav (bar bawah). Lompat antar-section, sorot section
// aktif (IntersectionObserver), muncul setelah melewati hero. Theme-aware.
import { ref, onMounted, onUnmounted } from 'vue'

const items = [
  { id: 'pembuka', icon: 'fa-champagne-glasses', label: 'Pembuka' },
  { id: 'mempelai', icon: 'fa-user-group', label: 'Mempelai' },
  { id: 'cerita', icon: 'fa-heart', label: 'Kisah' },
  { id: 'acara', icon: 'fa-calendar-day', label: 'Acara' },
  { id: 'galeri', icon: 'fa-images', label: 'Galeri' },
  { id: 'amplop', icon: 'fa-gift', label: 'Hadiah' },
  { id: 'rsvp', icon: 'fa-envelope-open-text', label: 'RSVP' },
]
const active = ref('')
const shown = ref(false)
let io = null, onScroll = null

function go(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

onMounted(() => {
  onScroll = () => { shown.value = (window.scrollY || 0) > window.innerHeight * 0.7 }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll()

  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) active.value = e.target.id })
  }, { rootMargin: '-45% 0px -45% 0px' })
  items.forEach((it) => { const el = document.getElementById(it.id); if (el) io.observe(el) })
})
onUnmounted(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll)
  if (io) io.disconnect()
})
</script>

<template>
  <nav class="qn" :class="{ 'is-shown': shown }" aria-label="Navigasi cepat">
    <button v-for="it in items" :key="it.id" class="qn__btn" :class="{ 'is-on': active === it.id }"
            type="button" @click="go(it.id)" :aria-label="it.label" :title="it.label">
      <i :class="`fa-solid ${it.icon}`"></i>
    </button>
  </nav>
</template>

<style scoped>
.qn {
  position: fixed; z-index: 90; left: 50%; bottom: 16px; transform: translate(-50%, 140%);
  display: flex; gap: .1rem; padding: .35rem; border-radius: 50px;
  background: color-mix(in srgb, var(--surface) 88%, transparent); backdrop-filter: blur(12px);
  border: 1px solid var(--line); box-shadow: 0 14px 40px -14px rgba(0, 0, 0, .5);
  opacity: 0; transition: transform .5s cubic-bezier(.16, 1, .3, 1), opacity .5s; max-width: calc(100vw - 24px);
}
.qn.is-shown { transform: translate(-50%, 0); opacity: 1; }
.qn__btn { flex: none; width: 38px; height: 38px; border-radius: 50%; border: none; background: transparent; color: var(--ink-soft); cursor: pointer; font-size: .92rem; display: grid; place-items: center; transition: background-color .3s, color .3s; }
.qn__btn:hover { color: var(--accent); }
.qn__btn.is-on { background: var(--accent); color: var(--accent-ink); }

@media (min-width: 1024px) {
  .qn { bottom: 22px; gap: .15rem; padding: .4rem; }
  .qn__btn { width: 44px; height: 44px; font-size: 1rem; }
}
@media (prefers-reduced-motion: reduce) { .qn { transition: opacity .3s; } }
</style>
