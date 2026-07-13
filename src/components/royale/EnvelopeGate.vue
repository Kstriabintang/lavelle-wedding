<script setup>
// 3.1 — Envelope animation (gerbang). GSAP timeline: segel pecah → flap
// terbuka → surat naik → tirai terangkat. Muncul sekali per sesi.
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  bride: { type: String, default: '' },
  groom: { type: String, default: '' },
  dateText: { type: String, default: '' },
  guest: { type: String, default: 'Tamu Undangan' },
  initials: { type: String, default: '' },
})
const emit = defineEmits(['opened'])

const root = ref(null)
const flap = ref(null)
const letter = ref(null)
const seal = ref(null)
const visible = ref(true)
const busy = ref(false)
const SESSION_KEY = 'royale-gate-done'

function finish() {
  visible.value = false
  emit('opened')
}

function open() {
  if (busy.value) return
  busy.value = true
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* diabaikan */ }

  if (reduce || !root.value) { finish(); return }

  const tl = gsap.timeline({ onComplete: finish })
  tl.to(seal.value, { scale: 0, opacity: 0, rotate: 60, duration: 0.4, ease: 'back.in(2)' })
    .to(flap.value, { rotateX: 180, duration: 0.7, ease: 'power2.inOut' }, '-=0.1')
    .set(flap.value, { zIndex: 1 })
    .to(letter.value, { y: '-64%', duration: 0.75, ease: 'power3.out' }, '-=0.25')
    .to('.env__stage', { y: -24, scale: 0.96, opacity: 0.6, duration: 0.5, ease: 'power2.in' }, '-=0.15')
    .to(root.value, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, '-=0.1')
}

onMounted(() => {
  let done = false
  try {
    done = sessionStorage.getItem(SESSION_KEY) === '1'
    if (new URLSearchParams(location.search).get('preview') === '1') done = true
  } catch { done = false }
  if (done) { visible.value = false; emit('opened'); return }
  gsap.from('.env__stage > *', { y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out', delay: 0.15 })
})
</script>

<template>
  <div v-if="visible" ref="root" class="env">
    <div class="env__stage">
      <p class="env__eyebrow">The Wedding Of</p>
      <h2 class="env__names r-script">{{ bride }} <span>&amp;</span> {{ groom }}</h2>
      <p class="env__date">{{ dateText }}</p>

      <div class="env__wrap">
        <div class="env__pocket">
          <div ref="letter" class="env__letter">
            <span class="env__letter-mono">{{ initials }}</span>
          </div>
          <div class="env__front"></div>
          <div ref="flap" class="env__flap"></div>
          <div ref="seal" class="env__seal">{{ initials }}</div>
        </div>
      </div>

      <p class="env__to"><span>Kepada Yth.</span><strong>{{ guest }}</strong></p>
      <button class="r-btn r-btn--solid env__btn" type="button" :disabled="busy" @click="open">
        <i class="fa-solid fa-envelope-open"></i> Buka Undangan
      </button>
    </div>
  </div>
</template>

<style scoped>
.env {
  position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; text-align: center;
  padding: 6vh 6vw; overflow: hidden; background: radial-gradient(130% 100% at 50% 0%, var(--surface), var(--bg) 55%, var(--deep) 130%);
  color: var(--ink);
}
.env__stage { position: relative; z-index: 1; max-width: 460px; width: 100%; }
.env__eyebrow { text-transform: uppercase; letter-spacing: .32em; font-size: .64rem; color: var(--accent); }
.env__names { font-family: var(--font-script); font-size: clamp(2.8rem, 11vw, 4.4rem); line-height: 1; color: var(--ink); margin: .3rem 0; }
.env__names span { color: var(--accent); font-size: .5em; }
.t-noir .env__names { font-family: var(--font-display); font-weight: 700; text-transform: uppercase; font-size: clamp(2rem, 8vw, 3.2rem); }
.env__date { font-family: var(--font-serif); font-style: italic; color: var(--ink-soft); letter-spacing: .05em; }

/* Amplop */
.env__wrap { perspective: 1100px; margin: 2rem auto; width: min(300px, 74vw); }
.env__pocket { position: relative; width: 100%; aspect-ratio: 3/2; transform-style: preserve-3d; }
.env__letter {
  position: absolute; left: 8%; top: 6%; width: 84%; height: 100%; z-index: 1; border-radius: 6px;
  background: var(--surface); border: 1px solid var(--line); box-shadow: 0 10px 30px -12px rgba(0, 0, 0, .35);
  display: grid; place-items: center;
}
.env__letter-mono { font-family: var(--font-script); font-size: 2.4rem; color: var(--accent); }
.t-noir .env__letter-mono { font-family: var(--font-display); font-weight: 700; }
.env__front {
  position: absolute; inset: 0; z-index: 2; border-radius: 8px; background: var(--accent);
  box-shadow: inset 0 0 0 1px var(--line), 0 22px 50px -20px rgba(0, 0, 0, .5);
  clip-path: polygon(0 32%, 50% 100%, 100% 32%, 100% 100%, 0 100%);
}
.env__flap {
  position: absolute; left: 0; top: 0; width: 100%; height: 62%; z-index: 3; transform-origin: top center;
  background: var(--accent-2); border-radius: 8px 8px 0 0; backface-visibility: hidden;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}
.env__seal {
  position: absolute; left: 50%; top: 40%; z-index: 4; transform: translate(-50%, -50%);
  width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center;
  background: radial-gradient(circle at 35% 30%, var(--accent), var(--deep)); color: var(--accent-ink);
  font-family: var(--font-script); font-size: 1.2rem; box-shadow: 0 6px 16px -4px rgba(0, 0, 0, .5);
}
.t-noir .env__seal { font-family: var(--font-display); font-weight: 700; font-size: .9rem; }

.env__to { margin-top: 1.4rem; display: flex; flex-direction: column; gap: .25rem; font-size: .8rem; color: var(--ink-soft); }
.env__to strong { font-family: var(--font-serif); font-size: 1.3rem; font-weight: 600; color: var(--accent); }
.env__btn { margin-top: 1.4rem; }
.env__btn:disabled { opacity: .6; cursor: default; }

@media (min-width: 1024px) {
  .env__wrap { width: 340px; }
  .env__names { font-size: 5rem; }
}
</style>
