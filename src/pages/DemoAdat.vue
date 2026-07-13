<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { adat, adatGallery } from '../data/adat'
import { WA_1 } from '../data/site'
import { useGamelan } from '../composables/useGamelan'

const route = useRoute()
const cfg = computed(() => adat[route.params.suku] || adat.minang)
const p = computed(() => cfg.value.palette)
const gallery = adatGallery
const initials = computed(() => `${cfg.value.bride[0]} & ${cfg.value.groom[0]}`)

const paletteVars = computed(() => ({
  '--deep': p.value.deep, '--primary': p.value.primary, '--primary2': p.value.primary2,
  '--gold': p.value.gold, '--gold-soft': p.value.goldSoft, '--gold2': p.value.gold2,
  '--cream': p.value.cream, '--paper': p.value.paper, '--ink': p.value.ink, '--ink-soft': p.value.inkSoft,
}))

const pageTitle = computed(() => `Undangan Adat ${cfg.value.suku} — ${cfg.value.bride} & ${cfg.value.groom} | Lavelle`)
useHead({ title: pageTitle, meta: [{ name: 'robots', content: 'noindex' }] })

// Nama tamu dari ?to=
const guest = ref('Tamu Undangan')
// Cover
const opened = ref(false)
function openInvite() {
  opened.value = true
  // Undangan "hidup": putar musik latar saat dibuka (gesture user).
  startMusic()
  nextTick(() => { if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' }) })
}

// Countdown (client-side)
const cd = ref({ d: 0, h: 0, m: 0, s: 0 })
let timer = null
function tick() {
  const target = new Date(`${cfg.value.date}T08:00:00+07:00`).getTime()
  let diff = Math.max(0, target - Date.now())
  const d = Math.floor(diff / 86400000); diff -= d * 86400000
  const h = Math.floor(diff / 3600000); diff -= h * 3600000
  const m = Math.floor(diff / 60000); diff -= m * 60000
  cd.value = { d, h, m, s: Math.floor(diff / 1000) }
}

// Lightbox galeri
const lb = ref(-1)
const openLb = (i) => { lb.value = i }
const closeLb = () => { lb.value = -1 }
const nextLb = () => { lb.value = (lb.value + 1) % gallery.length }
const prevLb = () => { lb.value = (lb.value - 1 + gallery.length) % gallery.length }

// RSVP → WhatsApp
const form = ref({ nama: '', hadir: 'Hadir, Insya Allah', jumlah: 1, ucapan: '' })
function sendRsvp() {
  const c = cfg.value
  const msg = `Assalamualaikum. Konfirmasi kehadiran undangan pernikahan adat ${c.suku} — ${c.bride} & ${c.groom}:%0A%0ANama: ${form.value.nama}%0AKehadiran: ${form.value.hadir}%0AJumlah tamu: ${form.value.jumlah}%0AUcapan & doa: ${form.value.ucapan}`
  if (typeof window !== 'undefined') window.open(`https://wa.me/${WA_1}?text=${encodeURIComponent(decodeURIComponent(msg))}`, '_blank')
}
const mapsUrl = computed(() => `https://maps.google.com/?q=${encodeURIComponent(cfg.value.mapsQuery)}`)

// ---- Busana adat per suku (untuk karikatur SVG orisinal) ----
const HEADDRESS = {
  minang: { bride: 'suntiang', groom: 'saluak', label: 'Suntiang & Saluak' },
  jawa: { bride: 'paes', groom: 'blangkon', label: 'Paes Ageng & Blangkon' },
  sunda: { bride: 'siger', groom: 'bendo', label: 'Siger & Bendo' },
  bugis: { bride: 'bugis', groom: 'songkok', label: 'Bunga Simpolong & Songkok' },
}
const dress = computed(() => HEADDRESS[cfg.value.slug] || HEADDRESS.minang)

// ---- Musik latar (opsional, per suku; letakkan file di /public/audio) ----
const MUSIC = {
  minang: '/audio/adat-minang.mp3', jawa: '/audio/adat-jawa.mp3',
  sunda: '/audio/adat-sunda.mp3', bugis: '/audio/adat-bugis.mp3',
}
const musicSrc = computed(() => MUSIC[cfg.value.slug] || '/audio/adat.mp3')
const audioEl = ref(null)
const musicOn = ref(false)
const musicReady = ref(false)

// Ambience gamelan orisinal (Web Audio) sebagai fallback bila file mp3 tak ada.
const gamelan = useGamelan(() => cfg.value.slug)

async function startMusic() {
  const a = audioEl.value
  // Coba file mp3 dulu (bila vendor mengganti dengan track sendiri).
  if (a) {
    try {
      await a.play()
      musicOn.value = true
      return
    } catch { /* file tak ada / diblokir → pakai gamelan */ }
  }
  const ok = await gamelan.start()
  musicOn.value = ok
}
function stopMusic() {
  const a = audioEl.value
  if (a && !a.paused) a.pause()
  gamelan.stop()
  musicOn.value = false
}
function toggleMusic() {
  if (musicOn.value) stopMusic()
  else startMusic()
}

// ---- Kelopak bunga berjatuhan (deterministik, tanpa Math.random) ----
const petals = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 6.3 + (i % 4) * 4) % 100,
  delay: -((i % 8) * 1.4),
  dur: 11 + (i % 5) * 2.6,
  size: 9 + (i % 4) * 5,
  sway: (i % 2 ? 1 : -1) * (18 + (i % 3) * 12),
  op: 0.35 + (i % 4) * 0.12,
}))

// Back to top
const showTop = ref(false)
function onScroll() { if (typeof window !== 'undefined') showTop.value = window.scrollY > 700 }
function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

// Reveal lokal (mandiri, tak bergantung App.vue)
function wireReveal() {
  if (typeof IntersectionObserver === 'undefined') return
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
  }), { threshold: 0.14 })
  document.querySelectorAll('.a-reveal:not(.in)').forEach((el) => io.observe(el))
}

function onKey(e) {
  if (lb.value < 0) return
  if (e.key === 'Escape') closeLb()
  else if (e.key === 'ArrowRight') nextLb()
  else if (e.key === 'ArrowLeft') prevLb()
}

onMounted(() => {
  const params = new URLSearchParams(location.search)
  const q = params.get('to')
  if (q) guest.value = decodeURIComponent(q.replace(/\+/g, ' '))
  // Tautan pratinjau langsung-isi (mis. untuk showcase). Musik tetap butuh gesture.
  if (params.get('preview') === '1') opened.value = true
  tick(); timer = setInterval(tick, 1000)
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll()
  document.addEventListener('keydown', onKey)
  nextTick(() => setTimeout(wireReveal, 100))
})
onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKey)
  gamelan.dispose()
})
</script>

<template>
  <div class="adat" :style="paletteVars" :data-motif="cfg.motif">
    <!-- ==== DEFS: motif pattern + ornamen (sekali, direferensikan <use>) ==== -->
    <svg class="a-defs" aria-hidden="true" width="0" height="0">
      <defs>
        <pattern v-if="cfg.motif === 'songket'" id="adatMotif" width="54" height="54" patternUnits="userSpaceOnUse">
          <path d="M27 3 L51 27 L27 51 L3 27 Z" fill="none" stroke="var(--gold)" stroke-width="1" opacity=".55" />
          <path d="M27 15 L39 27 L27 39 L15 27 Z" fill="var(--gold)" opacity=".16" />
          <circle cx="27" cy="27" r="1.8" fill="var(--gold)" opacity=".7" />
          <path d="M0 27 L4 22 L4 32 Z M54 27 L50 22 L50 32 Z M27 0 L22 4 L32 4 Z M27 54 L22 50 L32 50 Z" fill="var(--gold)" opacity=".35" />
        </pattern>
        <pattern v-else-if="cfg.motif === 'parang'" id="adatMotif" width="42" height="42" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M9 -2 C 22 8, 22 13, 9 23 C -4 33, -4 38, 9 44" fill="none" stroke="var(--gold)" stroke-width="3.4" opacity=".2" stroke-linecap="round" />
          <path d="M30 -2 C 43 8, 43 13, 30 23 C 17 33, 17 38, 30 44" fill="none" stroke="var(--gold)" stroke-width="3.4" opacity=".2" stroke-linecap="round" />
          <circle cx="19" cy="21" r="1.6" fill="var(--gold)" opacity=".4" />
        </pattern>
        <pattern v-else-if="cfg.motif === 'megamendung'" id="adatMotif" width="80" height="44" patternUnits="userSpaceOnUse">
          <path d="M2 40 q 8 -16 18 -6 q 6 -14 18 -4 q 8 -14 18 -2 q 8 -12 20 -2" fill="none" stroke="var(--gold)" stroke-width="1.3" opacity=".45" />
          <path d="M-20 22 q 8 -16 18 -6 q 6 -14 18 -4 q 8 -14 18 -2 q 8 -12 20 -2" fill="none" stroke="var(--gold)" stroke-width="1.3" opacity=".3" />
        </pattern>
        <pattern v-else-if="cfg.motif === 'lipasabbe'" id="adatMotif" width="60" height="60" patternUnits="userSpaceOnUse">
          <!-- Bugis lipa sabbe: tenun sutra kotak (balo renni) + wajik di persilangan -->
          <path d="M0 20 H60 M0 40 H60 M20 0 V60 M40 0 V60" stroke="var(--gold)" stroke-width="1" opacity=".3" />
          <path d="M0 0 H60 M0 60 H60 M0 0 V60 M60 0 V60" stroke="var(--gold-soft)" stroke-width="2" opacity=".22" />
          <path d="M30 12 L48 30 L30 48 L12 30 Z" fill="none" stroke="var(--gold)" stroke-width="1.2" opacity=".5" />
          <path d="M30 22 L38 30 L30 38 L22 30 Z" fill="var(--gold)" opacity=".18" />
          <circle cx="30" cy="30" r="1.7" fill="var(--gold)" opacity=".7" />
          <circle cx="0" cy="0" r="1.5" fill="var(--gold-soft)" opacity=".5" />
          <circle cx="60" cy="0" r="1.5" fill="var(--gold-soft)" opacity=".5" />
          <circle cx="0" cy="60" r="1.5" fill="var(--gold-soft)" opacity=".5" />
          <circle cx="60" cy="60" r="1.5" fill="var(--gold-soft)" opacity=".5" />
        </pattern>
        <pattern v-else id="adatMotif" width="46" height="46" patternUnits="userSpaceOnUse">
          <path d="M11 0 V46 M35 0 V46 M0 11 H46 M0 35 H46" stroke="var(--gold)" stroke-width="1" opacity=".28" />
          <path d="M23 0 V46 M0 23 H46" stroke="var(--gold-soft)" stroke-width="2.2" opacity=".22" />
          <circle cx="23" cy="23" r="1.6" fill="var(--gold)" opacity=".5" />
        </pattern>

        <symbol id="ornDivider" viewBox="0 0 260 28" fill="none" stroke="currentColor" stroke-width="1.4">
          <path d="M130 6 l9 8 l-9 8 l-9 -8 z" fill="currentColor" fill-opacity=".18" />
          <path d="M121 14 H42" /><path d="M139 14 H218" />
          <path d="M42 14 q -11 -7 -22 0 q 11 7 22 0 z" fill="currentColor" fill-opacity=".6" stroke="none" />
          <path d="M218 14 q 11 -7 22 0 q -11 7 -22 0 z" fill="currentColor" fill-opacity=".6" stroke="none" />
          <circle cx="12" cy="14" r="2.4" fill="currentColor" stroke="none" />
          <circle cx="248" cy="14" r="2.4" fill="currentColor" stroke="none" />
          <path d="M130 1 v5 M130 22 v5" />
        </symbol>
        <symbol id="ornCorner" viewBox="0 0 92 92" fill="none" stroke="currentColor" stroke-width="1.4">
          <path d="M4 30 V10 a6 6 0 0 1 6 -6 H30" />
          <path d="M4 46 V16 M16 4 H46" stroke-opacity=".45" />
          <path d="M22 22 q 30 0 30 30" />
          <circle cx="22" cy="22" r="2.6" fill="currentColor" stroke="none" />
          <path d="M22 22 q 16 -2 18 -16" stroke-opacity=".55" />
        </symbol>
      </defs>
    </svg>

    <!-- watermark motif tetap di latar -->
    <svg class="a-motif-fixed" aria-hidden="true"><rect width="100%" height="100%" fill="url(#adatMotif)" /></svg>

    <!-- Musik latar + kelopak bunga (undangan "hidup") -->
    <audio ref="audioEl" :src="musicSrc" loop preload="none"
           @canplay="musicReady = true" @play="musicOn = true" @pause="musicOn = false"></audio>
    <transition name="fade">
      <button v-if="opened" class="a-music" :class="{ 'is-on': musicOn }" @click="toggleMusic"
              :aria-label="musicOn ? 'Jeda musik' : 'Putar musik'">
        <span class="a-music__disc"><i :class="musicOn ? 'fa-solid fa-music' : 'fa-solid fa-volume-xmark'"></i></span>
        <span class="a-music__wave"><i></i><i></i><i></i><i></i></span>
      </button>
    </transition>
    <div v-if="opened" class="a-petals" aria-hidden="true">
      <span v-for="(pt, i) in petals" :key="i" class="a-petal"
            :style="{ left: pt.left + '%', width: pt.size + 'px', height: pt.size + 'px',
                      animationDelay: pt.delay + 's', animationDuration: pt.dur + 's',
                      '--sway': pt.sway + 'px', '--op': pt.op }"></span>
    </div>

    <!-- ================= COVER ================= -->
    <transition name="cover">
      <section v-if="!opened" class="a-cover">
        <svg class="a-motif" aria-hidden="true"><rect width="100%" height="100%" fill="url(#adatMotif)" /></svg>
        <div class="a-cover__frame">
          <svg class="orn-c orn-c--tl"><use href="#ornCorner" /></svg>
          <svg class="orn-c orn-c--tr"><use href="#ornCorner" /></svg>
          <svg class="orn-c orn-c--bl"><use href="#ornCorner" /></svg>
          <svg class="orn-c orn-c--br"><use href="#ornCorner" /></svg>

          <p class="a-eyebrow">Undangan Pernikahan Adat</p>
          <p class="a-suku">{{ cfg.suku }}</p>
          <div class="a-crest">
            <span class="a-crest__ring"></span>
            <span class="a-crest__mono">{{ initials }}</span>
          </div>
          <svg class="a-div" viewBox="0 0 260 28"><use href="#ornDivider" /></svg>
          <h1 class="a-names">{{ cfg.bride }} <span>&amp;</span> {{ cfg.groom }}</h1>
          <p class="a-date">{{ cfg.dateText }}</p>
          <div class="a-guest">
            <span>Kepada Yth. Bapak/Ibu/Saudara/i</span>
            <strong>{{ guest }}</strong>
          </div>
          <button class="a-btn a-btn--gold" @click="openInvite">
            <i class="fa-solid fa-envelope-open"></i> Buka Undangan
          </button>
          <p class="a-accent">{{ cfg.accent }}</p>
        </div>
      </section>
    </transition>

    <!-- ================= ISI ================= -->
    <main class="a-main">
      <!-- Pembuka -->
      <section class="a-sec a-sec--deep">
        <svg class="a-motif" aria-hidden="true"><rect width="100%" height="100%" fill="url(#adatMotif)" /></svg>
        <div class="a-wrap a-center">
          <p class="a-salam a-reveal">{{ cfg.salam }}</p>
          <svg class="a-div a-div--light a-reveal" viewBox="0 0 260 28"><use href="#ornDivider" /></svg>
          <p class="a-quote a-reveal">&ldquo;{{ cfg.quote }}&rdquo;</p>
          <p class="a-quote-ref a-reveal">— {{ cfg.quoteRef }}</p>
        </div>
      </section>

      <!-- Mempelai (slot karikatur) -->
      <section class="a-sec">
        <div class="a-wrap a-center">
          <p class="a-kicker a-reveal">Bismillahirrahmanirrahim</p>
          <h2 class="a-title a-reveal">Kedua Mempelai</h2>
          <svg class="a-div a-reveal" viewBox="0 0 260 28"><use href="#ornDivider" /></svg>
          <div class="a-couple">
            <figure class="a-person a-reveal">
              <div class="a-portrait">
                <svg class="orn-c orn-c--tl sm"><use href="#ornCorner" /></svg>
                <svg class="orn-c orn-c--br sm"><use href="#ornCorner" /></svg>
                <img v-if="cfg.caricatureBride" :src="cfg.caricatureBride" :alt="cfg.bride">
                <div v-else class="a-slot">
                  <svg class="a-carico" viewBox="0 0 200 262" role="img" :aria-label="`Karikatur ${cfg.suku} — mempelai wanita`">
                    <g fill="none" stroke="var(--gold)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M50 258 q6 -62 50 -62 q44 0 50 62" />
                      <path d="M84 176 q16 14 32 0" />
                      <circle cx="100" cy="140" r="30" fill="var(--gold-soft)" fill-opacity=".07" />
                      <path d="M70 136 q-6 34 12 54 M130 136 q6 34 -12 54" />
                      <!-- Wajah mempelai wanita (senyum) -->
                      <path d="M85 133 q6 -5 12 0 M103 133 q6 -5 12 0" stroke-width="1.7" />
                      <path d="M87 140 q3 3.4 6 0 M107 140 q3 3.4 6 0" stroke-width="1.8" />
                      <path d="M92 151 q8 7 16 0" stroke-width="1.9" />
                      <circle cx="83" cy="147" r="3.4" fill="var(--gold)" stroke="none" fill-opacity=".22" />
                      <circle cx="117" cy="147" r="3.4" fill="var(--gold)" stroke="none" fill-opacity=".22" />
                      <!-- Suntiang (Minangkabau) -->
                      <g v-if="dress.bride === 'suntiang'">
                        <path d="M64 104 q36 -28 72 0" /><path d="M60 90 q40 -32 80 0" /><path d="M56 76 q44 -36 88 0" />
                        <path d="M72 104 V62 M86 100 V54 M100 98 V48 M114 100 V54 M128 104 V62" />
                      </g>
                      <!-- Paes Ageng (Jawa) -->
                      <g v-else-if="dress.bride === 'paes'">
                        <path d="M76 116 q24 -30 48 0" /><path d="M100 116 V94" />
                        <path d="M88 116 v-10 M112 116 v-10" /><circle cx="100" cy="88" r="4" />
                        <circle cx="86" cy="96" r="3" /><circle cx="114" cy="96" r="3" />
                      </g>
                      <!-- Siger (Sunda) -->
                      <g v-else-if="dress.bride === 'siger'">
                        <path d="M58 108 H142 l-10 -40 -14 24 -18 -38 -18 38 -14 -24 z" />
                        <circle cx="100" cy="74" r="3" /><circle cx="78" cy="92" r="2.6" /><circle cx="122" cy="92" r="2.6" />
                      </g>
                      <!-- Bunga Simpolong (Bugis) -->
                      <g v-else>
                        <circle cx="100" cy="96" r="13" fill="var(--gold-soft)" fill-opacity=".12" />
                        <path d="M100 83 v-16 M88 88 l-8 -13 M112 88 l8 -13" />
                        <circle cx="100" cy="63" r="3" /><circle cx="79" cy="73" r="2.6" /><circle cx="121" cy="73" r="2.6" />
                      </g>
                    </g>
                  </svg>
                  <span>{{ dress.label.split(' & ')[0] }}</span>
                </div>
              </div>
              <h3>{{ cfg.brideFull }}</h3>
              <p>{{ cfg.brideParents }}</p>
            </figure>
            <div class="a-amp a-reveal"><span>&amp;</span></div>
            <figure class="a-person a-reveal">
              <div class="a-portrait">
                <svg class="orn-c orn-c--tl sm"><use href="#ornCorner" /></svg>
                <svg class="orn-c orn-c--br sm"><use href="#ornCorner" /></svg>
                <img v-if="cfg.caricatureGroom" :src="cfg.caricatureGroom" :alt="cfg.groom">
                <div v-else class="a-slot">
                  <svg class="a-carico" viewBox="0 0 200 262" role="img" :aria-label="`Karikatur ${cfg.suku} — mempelai pria`">
                    <g fill="none" stroke="var(--gold)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M48 258 q4 -60 52 -60 q48 0 52 60" />
                      <path d="M100 198 l-14 20 M100 198 l14 20" />
                      <circle cx="100" cy="146" r="30" fill="var(--gold-soft)" fill-opacity=".07" />
                      <!-- Wajah mempelai pria (senyum + kumis) -->
                      <path d="M85 139 q6 -4 12 0 M103 139 q6 -4 12 0" stroke-width="1.7" />
                      <path d="M87 146 q3 3.4 6 0 M107 146 q3 3.4 6 0" stroke-width="1.8" />
                      <path d="M90 158 q10 5 20 0" stroke-width="1.9" />
                      <path d="M94 154 q6 3 12 0" stroke-width="1.6" opacity=".7" />
                      <!-- Saluak (Minangkabau) -->
                      <g v-if="dress.groom === 'saluak'">
                        <path d="M70 124 q30 -24 60 0 q-4 -18 -30 -18 q-26 0 -30 18 z" fill="var(--gold-soft)" fill-opacity=".1" />
                        <path d="M78 118 q22 -8 44 0 M82 110 q18 -6 36 0" />
                      </g>
                      <!-- Blangkon (Jawa) -->
                      <g v-else-if="dress.groom === 'blangkon'">
                        <path d="M70 122 q30 -28 60 0 z" fill="var(--gold-soft)" fill-opacity=".1" />
                        <path d="M126 112 q16 3 11 20" /><path d="M84 116 q16 -10 32 0" />
                      </g>
                      <!-- Bendo (Sunda) -->
                      <g v-else-if="dress.groom === 'bendo'">
                        <path d="M70 124 q30 -22 60 0 l-10 -16 -20 8 -20 -8 z" fill="var(--gold-soft)" fill-opacity=".1" />
                        <path d="M84 118 q16 -8 32 0" />
                      </g>
                      <!-- Songkok recca (Bugis) -->
                      <g v-else>
                        <path d="M74 120 h52 v-30 q-26 -8 -52 0 z" fill="var(--gold-soft)" fill-opacity=".1" />
                        <path d="M74 104 h52" stroke-width="3" />
                      </g>
                    </g>
                  </svg>
                  <span>{{ dress.label.split(' & ')[1] }}</span>
                </div>
              </div>
              <h3>{{ cfg.groomFull }}</h3>
              <p>{{ cfg.groomParents }}</p>
            </figure>
          </div>
        </div>
      </section>

      <!-- Prosesi Adat -->
      <section class="a-sec a-sec--deep">
        <svg class="a-motif" aria-hidden="true"><rect width="100%" height="100%" fill="url(#adatMotif)" /></svg>
        <div class="a-wrap a-center">
          <p class="a-kicker a-kicker--light a-reveal">Rangkaian Adat</p>
          <h2 class="a-title a-title--light a-reveal">Prosesi {{ cfg.suku }}</h2>
          <svg class="a-div a-div--light a-reveal" viewBox="0 0 260 28"><use href="#ornDivider" /></svg>
          <div class="a-prosesi">
            <article v-for="s in cfg.prosesi" :key="s.title" class="a-pcard a-reveal">
              <span class="a-pcard__icon"><i :class="`fa-solid ${s.icon}`"></i></span>
              <h3>{{ s.title }}</h3>
              <p>{{ s.desc }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- Save the Date + Countdown -->
      <section class="a-sec">
        <div class="a-wrap a-center">
          <p class="a-kicker a-reveal">Menuju Hari Bahagia</p>
          <h2 class="a-title a-reveal">{{ cfg.dateText }}</h2>
          <svg class="a-div a-reveal" viewBox="0 0 260 28"><use href="#ornDivider" /></svg>
          <div class="a-countdown a-reveal">
            <div class="a-cd"><strong>{{ cd.d }}</strong><span>Hari</span></div>
            <div class="a-cd"><strong>{{ cd.h }}</strong><span>Jam</span></div>
            <div class="a-cd"><strong>{{ cd.m }}</strong><span>Menit</span></div>
            <div class="a-cd"><strong>{{ cd.s }}</strong><span>Detik</span></div>
          </div>
        </div>
      </section>

      <!-- Acara -->
      <section class="a-sec a-sec--paper">
        <div class="a-wrap a-center">
          <p class="a-kicker a-reveal">Waktu &amp; Tempat</p>
          <h2 class="a-title a-reveal">Rangkaian Acara</h2>
          <svg class="a-div a-reveal" viewBox="0 0 260 28"><use href="#ornDivider" /></svg>
          <div class="a-events">
            <article class="a-event a-reveal">
              <span class="a-event__tag">Akad Nikah</span>
              <p class="a-event__time"><i class="fa-regular fa-clock"></i> {{ cfg.akadTime }}</p>
              <p class="a-event__place"><i class="fa-solid fa-location-dot"></i> {{ cfg.venue }}</p>
              <a class="a-btn a-btn--outline" :href="mapsUrl" target="_blank" rel="noopener"><i class="fa-solid fa-map-location-dot"></i> Lihat Lokasi</a>
            </article>
            <article class="a-event a-reveal">
              <span class="a-event__tag">Resepsi</span>
              <p class="a-event__time"><i class="fa-regular fa-clock"></i> {{ cfg.resepsiTime }}</p>
              <p class="a-event__place"><i class="fa-solid fa-location-dot"></i> {{ cfg.venue }}</p>
              <a class="a-btn a-btn--outline" :href="mapsUrl" target="_blank" rel="noopener"><i class="fa-solid fa-map-location-dot"></i> Lihat Lokasi</a>
            </article>
          </div>
        </div>
      </section>

      <!-- Galeri -->
      <section class="a-sec">
        <div class="a-wrap a-center">
          <p class="a-kicker a-reveal">Momen Kami</p>
          <h2 class="a-title a-reveal">Galeri</h2>
          <svg class="a-div a-reveal" viewBox="0 0 260 28"><use href="#ornDivider" /></svg>
          <div class="a-gallery a-reveal">
            <button v-for="(g, i) in gallery" :key="g" class="a-shot" @click="openLb(i)" aria-label="Perbesar foto">
              <img :src="`/img/mentahan/${g}.jpeg`" :alt="`Momen ${i + 1}`" loading="lazy">
              <span class="a-shot__zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
            </button>
          </div>
        </div>
      </section>

      <!-- Amplop -->
      <section class="a-sec a-sec--deep">
        <svg class="a-motif" aria-hidden="true"><rect width="100%" height="100%" fill="url(#adatMotif)" /></svg>
        <div class="a-wrap a-center">
          <p class="a-kicker a-kicker--light a-reveal">Tanda Kasih</p>
          <h2 class="a-title a-title--light a-reveal">Amplop Digital</h2>
          <svg class="a-div a-div--light a-reveal" viewBox="0 0 260 28"><use href="#ornDivider" /></svg>
          <p class="a-note a-reveal">Doa restu Anda adalah hadiah terindah. Namun bila berkenan memberi tanda kasih, dapat melalui:</p>
          <div class="a-gift a-reveal">
            <div class="a-bank"><span class="a-bank__label">BCA</span><span class="a-bank__no">1234 5678 90</span><span class="a-bank__an">a.n. {{ cfg.bride }}</span></div>
            <div class="a-bank"><span class="a-bank__label">Mandiri</span><span class="a-bank__no">0987 6543 21</span><span class="a-bank__an">a.n. {{ cfg.groom }}</span></div>
          </div>
        </div>
      </section>

      <!-- RSVP -->
      <section class="a-sec a-sec--paper">
        <div class="a-wrap a-center">
          <p class="a-kicker a-reveal">Konfirmasi Kehadiran</p>
          <h2 class="a-title a-reveal">RSVP</h2>
          <svg class="a-div a-reveal" viewBox="0 0 260 28"><use href="#ornDivider" /></svg>
          <form class="a-form a-reveal" @submit.prevent="sendRsvp">
            <input v-model="form.nama" type="text" placeholder="Nama Anda" required>
            <select v-model="form.hadir">
              <option>Hadir, Insya Allah</option>
              <option>Maaf, Berhalangan</option>
              <option>Masih Ragu</option>
            </select>
            <input v-model="form.jumlah" type="number" min="1" max="10" placeholder="Jumlah tamu">
            <textarea v-model="form.ucapan" rows="3" placeholder="Ucapan &amp; doa untuk mempelai"></textarea>
            <button class="a-btn a-btn--gold" type="submit"><i class="fa-brands fa-whatsapp"></i> Kirim via WhatsApp</button>
            <small>Demo — konfirmasi diteruskan ke WhatsApp admin.</small>
          </form>
        </div>
      </section>

      <!-- Penutup -->
      <section class="a-sec a-sec--deep a-closing">
        <svg class="a-motif" aria-hidden="true"><rect width="100%" height="100%" fill="url(#adatMotif)" /></svg>
        <div class="a-wrap a-center">
          <p class="a-note a-reveal">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p>
          <h2 class="a-names a-names--closing a-reveal">{{ cfg.bride }} <span>&amp;</span> {{ cfg.groom }}</h2>
          <p class="a-salam a-salam--closing a-reveal">Wassalamu’alaikum Warahmatullahi Wabarakatuh</p>
          <a class="a-credit" href="/">Undangan digital oleh <strong>Lavelle</strong></a>
        </div>
      </section>
    </main>

    <!-- Lightbox -->
    <transition name="lb">
      <div v-if="lb >= 0" class="a-lightbox" @click.self="closeLb">
        <img :src="`/img/mentahan/${gallery[lb]}.jpeg`" :alt="`Momen ${lb + 1}`">
        <button class="a-lb-btn a-lb-close" @click="closeLb" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
        <button class="a-lb-btn a-lb-prev" @click.stop="prevLb" aria-label="Sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="a-lb-btn a-lb-next" @click.stop="nextLb" aria-label="Berikutnya"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
    </transition>

    <transition name="fade">
      <button v-if="showTop && opened" class="a-top" @click="scrollTop" aria-label="Ke atas"><i class="fa-solid fa-chevron-up"></i></button>
    </transition>
  </div>
</template>

<style scoped>
.adat {
  --serif: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  --serif2: 'Cormorant Garamond', Georgia, serif;
  --script: 'Pinyon Script', cursive;
  --sans: 'Jost', system-ui, sans-serif;
  position: relative; min-height: 100vh; font-family: var(--sans);
  color: var(--ink); background: var(--paper); overflow-x: hidden;
}
.a-defs { position: absolute; }
.a-motif-fixed { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; opacity: .05; pointer-events: none; color: var(--gold); }
.a-motif { position: absolute; inset: 0; width: 100%; height: 100%; opacity: .09; pointer-events: none; }
.a-sec--deep .a-motif { opacity: .13; }

/* ---------- Ornamen ---------- */
.a-div { display: block; width: 210px; height: 24px; margin: 1.2rem auto 1.6rem; color: var(--gold2); }
.a-div--light { color: var(--gold-soft); }
.orn-c { position: absolute; width: 62px; height: 62px; color: var(--gold); }
.orn-c--tl { top: 0; left: 0; }
.orn-c--tr { top: 0; right: 0; transform: scaleX(-1); }
.orn-c--bl { bottom: 0; left: 0; transform: scaleY(-1); }
.orn-c--br { bottom: 0; right: 0; transform: scale(-1, -1); }
.orn-c.sm { width: 40px; height: 40px; }

/* ---------- Buttons ---------- */
.a-btn { display: inline-flex; align-items: center; justify-content: center; gap: .6em; font-family: var(--sans);
  font-size: .82rem; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; cursor: pointer;
  padding: .95em 2.1em; border-radius: 50px; border: 1px solid transparent; transition: all .35s ease; }
.a-btn--gold { background: linear-gradient(135deg, var(--gold-soft), var(--gold2)); color: var(--deep); box-shadow: 0 12px 30px -12px rgba(0, 0, 0, .5); }
.a-btn--gold:hover { transform: translateY(-3px); filter: brightness(1.06); }
.a-btn--outline { background: transparent; border-color: var(--gold2); color: var(--gold2); }
.a-btn--outline:hover { background: var(--gold2); color: var(--paper); }

/* ---------- COVER ---------- */
.a-cover { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; padding: 6vh 5vw;
  background: radial-gradient(120% 90% at 50% 0%, var(--primary2), var(--primary) 45%, var(--deep) 100%); color: var(--cream); overflow: hidden; }
.a-cover__frame { position: relative; z-index: 2; max-width: 560px; width: 100%; text-align: center; padding: clamp(2.4rem, 6vw, 3.6rem) clamp(1.4rem, 5vw, 2.6rem);
  border: 1px solid rgba(255, 255, 255, .12); border-radius: 6px; background: rgba(0, 0, 0, .10); backdrop-filter: blur(2px); }
.a-eyebrow { text-transform: uppercase; letter-spacing: .34em; font-size: .66rem; color: var(--gold-soft); }
.a-suku { font-family: var(--serif); font-style: italic; font-size: 1.05rem; color: var(--gold-soft); margin-top: .3rem; letter-spacing: .05em; }
.a-crest { position: relative; width: 128px; height: 128px; margin: 1.6rem auto 1rem; display: grid; place-items: center; }
.a-crest__ring { position: absolute; inset: 0; border-radius: 50%; border: 1px solid var(--gold-soft); box-shadow: inset 0 0 0 5px rgba(255, 255, 255, .06); }
.a-crest__ring::after { content: ""; position: absolute; inset: 8px; border-radius: 50%; border: 1px dashed rgba(230, 197, 101, .5); }
.a-crest__mono { font-family: var(--script); font-size: 2.6rem; color: var(--gold-soft); line-height: 1; }
.a-names { font-family: var(--script); font-size: clamp(3rem, 9vw, 4.6rem); line-height: 1.05; color: #fff; margin: .2rem 0 .4rem; font-weight: 400; }
.a-names span { color: var(--gold-soft); font-size: .7em; }
.a-date { font-family: var(--serif); font-style: italic; letter-spacing: .1em; color: rgba(255, 255, 255, .9); }
.a-guest { margin: 1.8rem auto 1.6rem; font-size: .78rem; letter-spacing: .06em; color: rgba(255, 255, 255, .78); display: flex; flex-direction: column; gap: .35rem; }
.a-guest strong { font-family: var(--serif); font-size: 1.35rem; font-weight: 600; color: var(--gold-soft); letter-spacing: .02em; }
.a-accent { margin-top: 1.6rem; font-size: .64rem; letter-spacing: .28em; text-transform: uppercase; color: rgba(230, 197, 101, .8); }

/* ---------- Sections ---------- */
.a-main { position: relative; z-index: 1; }
.a-sec { position: relative; padding: clamp(3.6rem, 9vw, 6rem) 1.4rem; overflow: hidden; }
.a-sec--paper { background: var(--cream); }
.a-sec--deep { background: linear-gradient(160deg, var(--primary), var(--deep)); color: var(--cream); }
.a-wrap { max-width: 720px; margin: 0 auto; position: relative; z-index: 1; }
.a-center { text-align: center; }
.a-kicker { text-transform: uppercase; letter-spacing: .3em; font-size: .68rem; color: var(--gold2); margin-bottom: .5rem; }
.a-kicker--light { color: var(--gold-soft); }
.a-title { font-family: var(--serif); font-weight: 600; font-size: clamp(1.9rem, 5vw, 2.8rem); line-height: 1.15; color: var(--ink); letter-spacing: -.01em; }
.a-title--light { color: #fff; }
.a-salam { font-family: var(--serif); font-style: italic; font-size: 1.2rem; color: var(--gold-soft); }
.a-salam--closing { color: var(--gold-soft); margin-top: 1rem; }
.a-quote { font-family: var(--serif2); font-size: 1.24rem; line-height: 1.7; color: rgba(255, 255, 255, .9); max-width: 620px; margin: 0 auto; font-style: italic; }
.a-quote-ref { margin-top: 1rem; letter-spacing: .16em; font-size: .74rem; text-transform: uppercase; color: var(--gold-soft); }
.a-note { color: inherit; opacity: .9; max-width: 560px; margin: 0 auto 1.6rem; font-family: var(--serif2); font-size: 1.14rem; line-height: 1.6; }

/* ---------- Mempelai ---------- */
.a-couple { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem; margin-top: 1.4rem; }
.a-person h3 { font-family: var(--serif); font-size: 1.4rem; font-weight: 600; margin: 1rem 0 .3rem; }
.a-person p { font-size: .92rem; color: var(--ink-soft); line-height: 1.5; }
.a-portrait { position: relative; width: min(220px, 62vw); aspect-ratio: 3/4; margin: 0 auto; border: 1px solid var(--gold2);
  border-radius: 130px 130px 10px 10px; overflow: hidden; background: linear-gradient(160deg, var(--paper), var(--cream)); box-shadow: 0 20px 44px -24px rgba(0, 0, 0, .45); }
.a-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.a-portrait .orn-c { z-index: 2; }
.a-slot { position: absolute; inset: 0; display: grid; place-content: center; gap: .4rem; text-align: center; color: var(--gold2); padding: .8rem; }
.a-slot i { font-size: 2.6rem; opacity: .5; }
.a-slot span { font-size: .62rem; letter-spacing: .18em; text-transform: uppercase; opacity: .75; line-height: 1.5; }
.a-carico { width: 74%; max-width: 150px; height: auto; filter: drop-shadow(0 6px 14px rgba(0, 0, 0, .18)); }
.a-carico circle, .a-carico path { animation: caricoDraw 1.4s ease both; }
@keyframes caricoDraw { from { opacity: 0; } to { opacity: 1; } }
.a-amp { font-family: var(--script); font-size: 3rem; color: var(--gold2); }

/* ---------- Prosesi ---------- */
.a-prosesi { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; margin-top: 1.4rem; }
.a-pcard { background: rgba(255, 255, 255, .06); border: 1px solid rgba(230, 197, 101, .28); border-radius: 12px; padding: 1.8rem 1.2rem; transition: transform .4s, border-color .4s; }
.a-pcard:hover { transform: translateY(-5px); border-color: var(--gold-soft); }
.a-pcard__icon { width: 56px; height: 56px; margin: 0 auto 1rem; display: grid; place-items: center; border-radius: 50%;
  background: linear-gradient(135deg, var(--gold-soft), var(--gold2)); color: var(--deep); font-size: 1.3rem; box-shadow: 0 10px 24px -12px rgba(0, 0, 0, .6); }
.a-pcard h3 { font-family: var(--serif); font-size: 1.2rem; font-weight: 600; color: #fff; margin-bottom: .4rem; }
.a-pcard p { font-size: .9rem; color: rgba(255, 255, 255, .78); line-height: 1.55; }

/* ---------- Countdown ---------- */
.a-countdown { display: flex; justify-content: center; gap: .8rem; flex-wrap: wrap; margin-top: 1.4rem; }
.a-cd { min-width: 78px; padding: 1.1rem .6rem; border: 1px solid var(--gold2); border-radius: 12px; background: linear-gradient(160deg, var(--paper), var(--cream)); box-shadow: 0 14px 30px -22px rgba(0, 0, 0, .5); }
.a-cd strong { display: block; font-family: var(--serif); font-size: 2.1rem; font-weight: 600; color: var(--primary); line-height: 1; }
.a-cd span { font-size: .66rem; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-soft); margin-top: .4rem; display: block; }

/* ---------- Acara ---------- */
.a-events { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2rem; margin-top: 1.4rem; }
.a-event { border: 1px solid var(--gold2); border-radius: 14px; padding: 2rem 1.6rem; background: var(--paper); box-shadow: 0 16px 36px -26px rgba(0, 0, 0, .4); }
.a-event__tag { display: inline-block; font-family: var(--serif); font-size: 1.4rem; font-weight: 600; color: var(--primary); margin-bottom: 1rem; }
.a-event__time, .a-event__place { color: var(--ink-soft); font-size: .96rem; margin-bottom: .5rem; }
.a-event__time i, .a-event__place i { color: var(--gold2); margin-right: .5em; }
.a-event .a-btn { margin-top: 1rem; }

/* ---------- Galeri ---------- */
.a-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: .7rem; margin-top: 1rem; }
.a-shot { position: relative; aspect-ratio: 1; border: none; padding: 0; border-radius: 10px; overflow: hidden; cursor: zoom-in; box-shadow: 0 14px 30px -24px rgba(0, 0, 0, .5); }
.a-shot img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.a-shot:hover img { transform: scale(1.08); }
.a-shot__zoom { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0; transition: opacity .3s; color: #fff; font-size: 1.1rem; background: rgba(0, 0, 0, .25); }
.a-shot:hover .a-shot__zoom { opacity: 1; }

/* ---------- Amplop ---------- */
.a-gift { display: flex; justify-content: center; gap: 1.2rem; flex-wrap: wrap; }
.a-bank { min-width: 220px; border: 1px solid rgba(230, 197, 101, .3); border-radius: 12px; padding: 1.4rem 1.6rem; background: rgba(255, 255, 255, .05); text-align: left; }
.a-bank__label { display: block; font-family: var(--serif); font-size: 1.2rem; font-weight: 600; color: var(--gold-soft); }
.a-bank__no { display: block; font-size: 1.15rem; letter-spacing: .12em; color: #fff; margin: .3rem 0; }
.a-bank__an { display: block; font-size: .82rem; color: rgba(255, 255, 255, .7); }

/* ---------- RSVP ---------- */
.a-form { max-width: 460px; margin: 1.4rem auto 0; display: flex; flex-direction: column; gap: .9rem; text-align: left; }
.a-form input, .a-form select, .a-form textarea { width: 100%; padding: .9em 1.1em; border: 1px solid var(--gold2); border-radius: 10px; background: var(--paper); color: var(--ink); font-family: var(--sans); font-size: .95rem; }
.a-form input:focus, .a-form select:focus, .a-form textarea:focus { outline: 2px solid var(--gold-soft); outline-offset: 1px; }
.a-form .a-btn { margin-top: .3rem; }
.a-form small { text-align: center; color: var(--ink-soft); font-size: .78rem; }

/* ---------- Closing ---------- */
.a-closing { text-align: center; }
.a-names--closing { font-size: clamp(2.6rem, 8vw, 4rem); margin: 1rem 0; }
.a-credit { display: inline-block; margin-top: 2rem; font-size: .82rem; letter-spacing: .1em; color: rgba(255, 255, 255, .65); }
.a-credit strong { color: var(--gold-soft); font-family: var(--serif); }

/* ---------- Lightbox ---------- */
.a-lightbox { position: fixed; inset: 0; z-index: 80; background: rgba(0, 0, 0, .92); display: grid; place-items: center; padding: 5vh 4vw; backdrop-filter: blur(6px); }
.a-lightbox img { max-width: min(92vw, 860px); max-height: 84vh; border-radius: 10px; box-shadow: 0 30px 80px -20px rgba(0, 0, 0, .8); }
.a-lb-btn { position: absolute; width: 50px; height: 50px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, .28); background: rgba(255, 255, 255, .1); color: #fff; cursor: pointer; display: grid; place-items: center; font-size: 1.1rem; transition: background .3s, transform .3s; }
.a-lb-btn:hover { background: rgba(255, 255, 255, .22); }
.a-lb-close { top: 4vh; right: 4vw; }
.a-lb-prev { left: 3vw; top: 50%; transform: translateY(-50%); }
.a-lb-next { right: 3vw; top: 50%; transform: translateY(-50%); }

/* ---------- Musik latar ---------- */
.a-music { position: fixed; bottom: 24px; left: 24px; z-index: 70; display: flex; align-items: center; gap: .5rem;
  padding: .4rem .8rem .4rem .4rem; border-radius: 50px; border: 1px solid var(--gold2);
  background: rgba(0, 0, 0, .35); backdrop-filter: blur(6px); cursor: pointer; box-shadow: 0 12px 30px -14px rgba(0, 0, 0, .7); }
.a-music__disc { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; color: var(--deep);
  background: linear-gradient(135deg, var(--gold-soft), var(--gold2)); font-size: .95rem; box-shadow: 0 0 0 3px rgba(255, 255, 255, .08); }
.a-music.is-on .a-music__disc { animation: discSpin 3.6s linear infinite; }
@keyframes discSpin { to { transform: rotate(360deg); } }
.a-music__wave { display: flex; align-items: flex-end; gap: 2px; height: 16px; }
.a-music__wave i { width: 3px; height: 6px; border-radius: 2px; background: var(--gold-soft); opacity: .5; }
.a-music.is-on .a-music__wave i { animation: eq .9s ease-in-out infinite; opacity: 1; }
.a-music.is-on .a-music__wave i:nth-child(2) { animation-delay: .18s; }
.a-music.is-on .a-music__wave i:nth-child(3) { animation-delay: .36s; }
.a-music.is-on .a-music__wave i:nth-child(4) { animation-delay: .54s; }
@keyframes eq { 0%, 100% { height: 5px; } 50% { height: 16px; } }

/* ---------- Kelopak bunga berjatuhan ---------- */
.a-petals { position: fixed; inset: 0; z-index: 40; pointer-events: none; overflow: hidden; }
.a-petal { position: absolute; top: -6%; border-radius: 78% 22% 70% 30% / 60% 42% 58% 40%;
  background: radial-gradient(120% 120% at 30% 20%, var(--gold-soft), var(--gold2));
  opacity: var(--op, .5); animation-name: petalFall; animation-timing-function: linear; animation-iteration-count: infinite; }
@keyframes petalFall {
  0% { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 0; }
  10% { opacity: var(--op, .5); }
  90% { opacity: var(--op, .5); }
  100% { transform: translate3d(var(--sway, 20px), 108vh, 0) rotate(320deg); opacity: 0; }
}

/* ---------- Kilau emas ---------- */
.a-names span, .a-crest__mono, .a-title--light { background-size: 200% auto; }

/* ---------- Back to top ---------- */
.a-top { position: fixed; bottom: 24px; right: 24px; z-index: 70; width: 48px; height: 48px; border-radius: 50%; border: 1px solid var(--gold2); background: var(--primary); color: var(--gold-soft); cursor: pointer; display: grid; place-items: center; box-shadow: 0 12px 30px -12px rgba(0, 0, 0, .6); }

/* ---------- Reveal & transitions ---------- */
.a-reveal { opacity: 0; transform: translateY(28px); transition: opacity .8s cubic-bezier(.16, 1, .3, 1), transform .8s cubic-bezier(.16, 1, .3, 1); }
.a-reveal.in { opacity: 1; transform: none; }
.a-prosesi .a-reveal.in:nth-child(2) { transition-delay: .12s; }
.a-prosesi .a-reveal.in:nth-child(3) { transition-delay: .24s; }
.cover-leave-active { transition: opacity .7s ease, transform .7s ease; }
.cover-leave-to { opacity: 0; transform: scale(1.04); }
.lb-enter-active, .lb-leave-active, .fade-enter-active, .fade-leave-active { transition: opacity .3s ease; }
.lb-enter-from, .lb-leave-to, .fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 640px) {
  .a-couple { grid-template-columns: 1fr; gap: 1.6rem; }
  .a-amp { display: none; }
  .a-prosesi { grid-template-columns: 1fr; }
  .a-events { grid-template-columns: 1fr; }
  .a-gallery { grid-template-columns: repeat(2, 1fr); }
  .a-lb-prev { left: 1vw; } .a-lb-next { right: 1vw; }
}
@media (prefers-reduced-motion: reduce) {
  .a-reveal { opacity: 1; transform: none; transition: none; }
  .a-petals { display: none; }
  .a-music.is-on .a-music__disc, .a-music.is-on .a-music__wave i { animation: none; }
  .a-carico circle, .a-carico path { animation: none; }
}
</style>
