<script setup>
// FASE A — Gerbang amplop sinematik. GSAP timeline berbobot (~2.4s):
// segel wax pecah dua → flap 3D membuka → surat naik → tirai terangkat.
// Muncul sekali per sesi. Musik dimulai lewat @opened di parent.
// Motion: hanya transform/opacity (60fps), hormati prefers-reduced-motion.
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
const stage = ref(null)
const flap = ref(null)
const letter = ref(null)
const seal = ref(null)
const visible = ref(true)
const busy = ref(false)
const SESSION_KEY = 'royale-gate-done'

function finish() {
  visible.value = false // 'opened' sudah di-emit saat tombol ditekan (musik mulai lebih awal)
}

function open() {
  if (busy.value) return
  busy.value = true
  const reduce = typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* diabaikan */ }
  emit('opened') // musik & reveal mulai tepat saat tombol ditekan

  if (reduce || !root.value) {
    gsap.to(root.value, { autoAlpha: 0, duration: 0.5, onComplete: finish })
    return
  }

  const el = root.value
  const q = (s) => el.querySelector(s)
  const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: finish })

  // 1) Segel: tekan halus lalu pecah jadi dua bagian yang jatuh
  tl.to(seal.value, { scale: 1.07, duration: 0.22, ease: 'power2.out' })
    .set(q('.env__seal-mono'), { autoAlpha: 0 }, '>-0.02')
    .to(q('.env__half--l'), { xPercent: -34, yPercent: 26, rotate: -26, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, '<')
    .to(q('.env__half--r'), { xPercent: 34, yPercent: 26, rotate: 26, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, '<')
    // 2) Flap amplop membuka 3D
    .to(flap.value, { rotateX: 178, duration: 0.85 }, '-=0.2')
    .set(flap.value, { zIndex: 1 })
    // 3) Surat naik keluar dari saku, konten memudar masuk
    .to(letter.value, { yPercent: -66, duration: 0.9, ease: 'power3.out' }, '-=0.4')
    .to(letter.value.children, { opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power1.out' }, '-=0.6')
    // 4) Panggung meredup, lalu tirai terangkat mengungkap hero
    .to(stage.value, { y: -26, scale: 0.965, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, '-=0.25')
    .to(el, { yPercent: -100, duration: 0.95, ease: 'power4.inOut' }, '-=0.15')
}

onMounted(() => {
  let done = false
  try {
    done = sessionStorage.getItem(SESSION_KEY) === '1'
    if (new URLSearchParams(location.search).get('preview') === '1') done = true
  } catch { done = false }
  if (done) { visible.value = false; emit('opened'); return }
  // Entrance lembut untuk konten panggung
  gsap.from('.env__stage > *', { y: 26, autoAlpha: 0, duration: 0.85, stagger: 0.11, ease: 'power2.out', delay: 0.2 })
})
</script>

<template>
  <div v-if="visible" ref="root" class="env">
    <div class="env__frame" aria-hidden="true"></div>
    <div ref="stage" class="env__stage">
      <p class="env__eyebrow">The Wedding Of</p>
      <h2 class="env__names">{{ bride }} <span>&amp;</span> {{ groom }}</h2>
      <span class="env__rule" aria-hidden="true"></span>
      <p class="env__date">{{ dateText }}</p>

      <div class="env__wrap">
        <div class="env__pocket">
          <div ref="letter" class="env__letter">
            <span class="env__letter-mono">{{ initials }}</span>
            <span class="env__letter-line" aria-hidden="true"></span>
            <span class="env__letter-cap">Undangan Pernikahan</span>
          </div>
          <div class="env__front" aria-hidden="true"></div>
          <div ref="flap" class="env__flap" aria-hidden="true"></div>
          <div ref="seal" class="env__seal" aria-hidden="true">
            <b class="env__half env__half--l"></b>
            <b class="env__half env__half--r"></b>
            <span class="env__seal-mono">{{ initials }}</span>
          </div>
        </div>
      </div>

      <p class="env__to"><span>Kepada Yth.</span><strong>{{ guest }}</strong></p>
      <button class="env__btn" type="button" :disabled="busy" @click="open">
        <i class="fa-solid fa-envelope-open"></i><span>Buka Undangan</span>
      </button>
      <p class="env__note">Mohon maaf apabila terdapat kesalahan penulisan nama/gelar.</p>
    </div>
  </div>
</template>

<style scoped>
.env {
  position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; text-align: center;
  padding: 7vh 7vw; overflow: hidden; color: var(--ink);
  background:
    radial-gradient(120% 90% at 50% -10%, var(--surface), var(--bg) 52%),
    radial-gradient(100% 120% at 50% 120%, var(--deep), transparent 60%);
  will-change: transform;
}
/* Satu hairline frame — restraint */
.env__frame { position: absolute; inset: clamp(14px, 3.5vw, 30px); border: 1px solid var(--line); border-radius: 4px; pointer-events: none; }

.env__stage { position: relative; z-index: 1; max-width: 480px; width: 100%; }
.env__eyebrow { text-transform: uppercase; letter-spacing: .38em; font-size: .72rem; color: var(--accent); font-family: var(--font-sans); }
.env__names { font-family: var(--font-script); font-size: clamp(3rem, 12vw, 4.6rem); line-height: 1.02; color: var(--ink); margin: .5rem 0 0; font-weight: 400; }
.env__names span { color: var(--accent); font-size: .46em; vertical-align: middle; }
.t-noir .env__names { font-family: var(--font-display); font-weight: 600; text-transform: uppercase; letter-spacing: .02em; font-size: clamp(2.1rem, 9vw, 3.4rem); }
.env__rule { display: block; width: 54px; height: 1px; background: var(--accent); opacity: .6; margin: 1.1rem auto; }
.env__date { font-family: var(--font-serif); font-style: italic; font-size: 1.1rem; color: var(--ink-soft); letter-spacing: .04em; }

/* Amplop */
.env__wrap { perspective: 1200px; margin: 2.4rem auto; width: min(300px, 72vw); }
.env__pocket { position: relative; width: 100%; aspect-ratio: 3 / 2; transform-style: preserve-3d; }
.env__letter {
  position: absolute; left: 8%; top: 6%; width: 84%; height: 86%; z-index: 1; border-radius: 5px;
  background: var(--surface); border: 1px solid var(--line);
  box-shadow: 0 16px 40px -18px rgba(0, 0, 0, .4);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .5rem; will-change: transform;
}
/* Konten surat tersembunyi saat amplop tertutup; muncul saat surat naik */
.env__letter-mono, .env__letter-line, .env__letter-cap { opacity: 0; }
.env__letter-mono { font-family: var(--font-script); font-size: 2.2rem; line-height: 1; color: var(--accent); }
.t-noir .env__letter-mono { font-family: var(--font-display); font-weight: 600; }
.env__letter-line { width: 34px; height: 1px; background: var(--line); }
.env__letter-cap { font-family: var(--font-sans); text-transform: uppercase; letter-spacing: .28em; font-size: .54rem; color: var(--ink-soft); }
.env__front {
  position: absolute; inset: 0; z-index: 2; border-radius: 7px; background: var(--accent);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .06), 0 26px 54px -22px rgba(0, 0, 0, .5);
  clip-path: polygon(0 30%, 50% 100%, 100% 30%, 100% 100%, 0 100%);
}
.env__flap {
  position: absolute; left: 0; top: 0; width: 100%; height: 60%; z-index: 3; transform-origin: top center;
  background: linear-gradient(180deg, var(--accent-2), var(--accent)); border-radius: 7px 7px 0 0;
  backface-visibility: hidden; clip-path: polygon(0 0, 100% 0, 50% 100%); will-change: transform;
}
/* Wax seal dua bagian */
.env__seal {
  position: absolute; left: 50%; top: 38%; z-index: 4; transform: translate(-50%, -50%);
  width: 58px; height: 58px; display: grid; place-items: center; will-change: transform;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, .4));
}
.env__half { position: absolute; top: 0; height: 100%; width: 50%; background: radial-gradient(circle at 40% 32%, var(--accent-2), var(--deep)); will-change: transform; }
.env__half--l { left: 0; border-radius: 29px 0 0 29px; transform-origin: right center; }
.env__half--r { right: 0; border-radius: 0 29px 29px 0; transform-origin: left center; }
.env__seal-mono { position: relative; z-index: 1; font-family: var(--font-script); font-size: 1.15rem; color: var(--accent-ink); }
.t-noir .env__seal-mono { font-family: var(--font-display); font-weight: 600; font-size: .82rem; }

.env__to { margin-top: 1.8rem; display: flex; flex-direction: column; gap: .3rem; font-size: .82rem; color: var(--ink-soft); }
.env__to span { text-transform: uppercase; letter-spacing: .24em; font-size: .62rem; }
.env__to strong { font-family: var(--font-serif); font-size: 1.35rem; font-weight: 600; color: var(--accent); }

.env__btn {
  margin-top: 1.6rem; display: inline-flex; align-items: center; gap: .7em; cursor: pointer;
  font-family: var(--font-sans); font-size: .74rem; font-weight: 500; letter-spacing: .18em; text-transform: uppercase;
  padding: 1.05em 2.2em; border-radius: 50px; border: 1px solid var(--accent);
  background: var(--accent); color: var(--accent-ink); transition: transform .4s cubic-bezier(.16,1,.3,1), box-shadow .4s;
  box-shadow: 0 10px 30px -12px var(--accent);
}
.env__btn:hover { transform: translateY(-3px); box-shadow: 0 16px 36px -12px var(--accent); }
.env__btn:disabled { opacity: .55; cursor: default; transform: none; }
.env__note { margin-top: 1.1rem; font-size: .64rem; color: var(--ink-soft); opacity: .8; letter-spacing: .02em; }

@media (min-width: 1024px) {
  .env__wrap { width: 330px; }
  .env__names { font-size: clamp(4rem, 5vw, 5.4rem); }
}
@media (prefers-reduced-motion: reduce) {
  .env__btn { transition: none; }
}
</style>
