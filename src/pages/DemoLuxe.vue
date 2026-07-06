<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Undangan Pernikahan — Rania & Fajar | Lavelle',
  meta: [{ name: 'robots', content: 'noindex' }],
})

/* ---------- Sample data ---------- */
const couple = reactive({
  bride: {
    full: 'Rania Alsyahputri',
    short: 'Rania',
    role: 'Putri',
    father: 'Bpk. Hendra',
    mother: 'Ibu Sri',
    photo: '/img/mentahan/pasangan-tatapan.jpeg',
    ig: 'rania.alsyahputri',
  },
  groom: {
    full: 'Fajar Ramadhan',
    short: 'Fajar',
    role: 'Putra',
    father: 'Bpk. Ade',
    mother: 'Ibu Wati',
    photo: '/img/mentahan/pasangan-duduk.jpeg',
    ig: 'fajar.ramadhan',
  },
})

const wedding = reactive({
  dateLabel: '15 Mei 2027',
  dayLabel: 'Sabtu',
  heroPhoto: '/img/mentahan/pasangan-pelukan-2.jpeg',
  venue: 'Gedung Balai Kartini, Jakarta',
  mapsUrl: 'https://maps.google.com/?q=Balai+Kartini+Jakarta',
  targetISO: '2027-05-15T08:00:00+07:00',
})

const events = [
  {
    icon: 'fa-solid fa-ring',
    title: 'Akad Nikah',
    date: 'Sabtu, 15 Mei 2027',
    time: '08.00 WIB',
    place: 'Gedung Balai Kartini, Jakarta',
  },
  {
    icon: 'fa-solid fa-champagne-glasses',
    title: 'Resepsi',
    date: 'Sabtu, 15 Mei 2027',
    time: '11.00 – 14.00 WIB',
    place: 'Gedung Balai Kartini, Jakarta',
  },
]

const story = [
  {
    year: '2023',
    title: 'Pertama Bertemu',
    text: 'Takdir mempertemukan kami di sebuah acara sederhana. Sebuah sapa hangat menjadi awal dari segalanya.',
  },
  {
    year: '2024',
    title: 'Menjalin Kasih',
    text: 'Kedekatan tumbuh menjadi rasa. Kami memutuskan untuk saling melengkapi dan berjalan berdampingan.',
  },
  {
    year: '2026',
    title: 'Lamaran',
    text: 'Dengan restu kedua keluarga, sebuah janji suci diikrarkan. Langkah menuju pelaminan pun dimulai.',
  },
  {
    year: '2027',
    title: 'Menuju Halal',
    text: 'Dengan penuh syukur, kami siap menyatukan dua hati dalam ikatan yang diridhoi-Nya.',
  },
]

const gallery = [
  '/img/mentahan/pasangan-utama.jpeg',
  '/img/mentahan/pasangan-pose-romantis.jpeg',
  '/img/mentahan/pasangan-pelukan-1.jpeg',
  '/img/mentahan/pasangan-outdoor-3.jpeg',
  '/img/mentahan/pasangan-tatapan-dekat.jpeg',
  '/img/mentahan/pasangan-candid.jpeg',
  '/img/mentahan/pasangan-pantai-senja.jpeg',
  '/img/mentahan/pasangan-jalan.jpeg',
  '/img/mentahan/momen-bahagia.jpeg',
]

const banks = [
  { bank: 'BCA', number: '1234567890', name: 'Rania Alsyahputri' },
  { bank: 'Mandiri', number: '0987654321', name: 'Fajar Ramadhan' },
]

/* ---------- Guest name from ?to= ---------- */
const guestName = ref('Tamu Undangan')

/* ---------- Cover open ---------- */
const coverOpen = ref(true)
function openInvitation() {
  coverOpen.value = false
  if (typeof window === 'undefined') return
  // wait a tick so cover unhides before scroll
  requestAnimationFrame(() => {
    const el = document.getElementById('opening')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  })
}

/* ---------- Countdown ---------- */
const countdown = reactive({ days: 0, hours: 0, mins: 0, secs: 0 })
let timer = null
function tick() {
  const target = new Date(wedding.targetISO).getTime()
  const now = Date.now()
  let diff = Math.max(0, target - now)
  const d = Math.floor(diff / 86400000); diff -= d * 86400000
  const h = Math.floor(diff / 3600000); diff -= h * 3600000
  const m = Math.floor(diff / 60000); diff -= m * 60000
  const s = Math.floor(diff / 1000)
  countdown.days = d
  countdown.hours = h
  countdown.mins = m
  countdown.secs = s
}

/* ---------- Copy bank ---------- */
const copied = ref(-1)
function copyBank(i) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  navigator.clipboard.writeText(banks[i].number).then(() => {
    copied.value = i
    setTimeout(() => { if (copied.value === i) copied.value = -1 }, 1800)
  }).catch(() => {})
}

/* ---------- Lightbox ---------- */
const openIndex = ref(-1)
function openLightbox(i) { openIndex.value = i }
function closeLightbox() { openIndex.value = -1 }
function prevImg() {
  if (openIndex.value < 0) return
  openIndex.value = (openIndex.value - 1 + gallery.length) % gallery.length
}
function nextImg() {
  if (openIndex.value < 0) return
  openIndex.value = (openIndex.value + 1) % gallery.length
}
function onKey(e) {
  if (openIndex.value < 0) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowLeft') prevImg()
  else if (e.key === 'ArrowRight') nextImg()
}

/* ---------- RSVP ---------- */
const rsvp = reactive({ nama: '', kehadiran: 'Hadir', jumlah: 1, ucapan: '' })
function submitRsvp(e) {
  e.preventDefault()
  const lines = [
    'Halo, saya ingin konfirmasi kehadiran (RSVP) untuk pernikahan Rania & Fajar.',
    '',
    `Nama: ${rsvp.nama || '-'}`,
    `Kehadiran: ${rsvp.kehadiran}`,
    `Jumlah Tamu: ${rsvp.jumlah}`,
    `Ucapan: ${rsvp.ucapan || '-'}`,
  ]
  const url = 'https://wa.me/6285264402640?text=' + encodeURIComponent(lines.join('\n'))
  if (typeof window !== 'undefined') window.open(url, '_blank')
}

/* ---------- Back to top ---------- */
const showTop = ref(false)
function scrollTop() {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}
function onScroll() {
  if (typeof window === 'undefined') return
  showTop.value = window.scrollY > 480
}

/* ---------- Reveal on scroll ---------- */
let io = null

onMounted(() => {
  // guest name
  const params = new URLSearchParams(window.location.search)
  const to = params.get('to')
  if (to) {
    try { guestName.value = decodeURIComponent(to.replace(/\+/g, ' ')) }
    catch { guestName.value = to.replace(/\+/g, ' ') }
  }

  // countdown
  tick()
  timer = setInterval(tick, 1000)

  // keyboard + scroll
  window.addEventListener('keydown', onKey)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // intersection reveal
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in')
          io.unobserve(en.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('.luxe .reveal').forEach((el) => io.observe(el))
  } else {
    document.querySelectorAll('.luxe .reveal').forEach((el) => el.classList.add('in'))
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('scroll', onScroll)
  }
  if (io) io.disconnect()
})

const activeImg = computed(() => (openIndex.value >= 0 ? gallery[openIndex.value] : ''))
</script>

<template>
  <div class="luxe">
    <!-- ============ COVER ============ -->
    <transition name="cover-fade">
      <section
        v-if="coverOpen"
        class="cover"
        :style="{ backgroundImage: `url(${wedding.heroPhoto})` }"
      >
        <div class="cover-scrim"></div>
        <div class="cover-inner">
          <div class="orn"><i class="fa-solid fa-feather"></i></div>
          <p class="eyebrow">The Wedding Of</p>
          <h1 class="cover-names">{{ couple.bride.short }} &amp; {{ couple.groom.short }}</h1>
          <div class="rule"><span></span><i class="fa-solid fa-heart"></i><span></span></div>
          <p class="cover-date">{{ wedding.dayLabel }}, {{ wedding.dateLabel }}</p>

          <div class="guest">
            <p class="guest-label">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p class="guest-name">{{ guestName }}</p>
          </div>

          <button class="btn btn-solid open-btn" @click="openInvitation">
            <i class="fa-solid fa-envelope-open"></i> Buka Undangan
          </button>
        </div>
      </section>
    </transition>

    <!-- ============ OPENING QUOTE ============ -->
    <section id="opening" class="section opening reveal">
      <div class="wrap narrow center">
        <div class="orn"><i class="fa-solid fa-leaf"></i></div>
        <p class="bismillah">Bismillahirrahmanirrahim</p>
        <p class="verse">
          “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
          pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa
          tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”
        </p>
        <p class="verse-ref">— QS. Ar-Rum : 21</p>
      </div>
    </section>

    <!-- ============ THE COUPLE ============ -->
    <section class="section couple reveal">
      <div class="wrap">
        <div class="heading">
          <p class="script-sm">Mempelai</p>
          <h2 class="h2">The Couple</h2>
        </div>

        <div class="couple-grid">
          <article class="c-card">
            <div class="c-photo"><img :src="couple.bride.photo" alt="Rania" loading="lazy" /></div>
            <h3 class="c-name">{{ couple.bride.full }}</h3>
            <p class="c-role">{{ couple.bride.role }} dari</p>
            <p class="c-parent">{{ couple.bride.father }} &amp; {{ couple.bride.mother }}</p>
            <a class="ig" :href="`https://instagram.com/${couple.bride.ig}`" target="_blank" rel="noopener">
              <i class="fa-brands fa-instagram"></i> @{{ couple.bride.ig }}
            </a>
          </article>

          <div class="amp"><span class="amp-script">&amp;</span></div>

          <article class="c-card">
            <div class="c-photo"><img :src="couple.groom.photo" alt="Fajar" loading="lazy" /></div>
            <h3 class="c-name">{{ couple.groom.full }}</h3>
            <p class="c-role">{{ couple.groom.role }} dari</p>
            <p class="c-parent">{{ couple.groom.father }} &amp; {{ couple.groom.mother }}</p>
            <a class="ig" :href="`https://instagram.com/${couple.groom.ig}`" target="_blank" rel="noopener">
              <i class="fa-brands fa-instagram"></i> @{{ couple.groom.ig }}
            </a>
          </article>
        </div>
      </div>
    </section>

    <!-- ============ LOVE STORY ============ -->
    <section class="section story reveal">
      <div class="wrap">
        <div class="heading">
          <p class="script-sm">Perjalanan Kami</p>
          <h2 class="h2">Love Story</h2>
        </div>

        <div class="timeline">
          <div v-for="(s, i) in story" :key="i" class="tl-item" :class="{ right: i % 2 === 1 }">
            <div class="tl-dot"><i class="fa-solid fa-heart"></i></div>
            <div class="tl-card">
              <span class="tl-year">{{ s.year }}</span>
              <h3 class="tl-title">{{ s.title }}</h3>
              <p class="tl-text">{{ s.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ SAVE THE DATE + COUNTDOWN ============ -->
    <section class="section savedate reveal">
      <div class="wrap narrow center">
        <div class="orn"><i class="fa-solid fa-calendar-day"></i></div>
        <p class="script-sm">Save the Date</p>
        <h2 class="big-date">{{ wedding.dateLabel }}</h2>
        <p class="sd-sub">Menuju hari bahagia kami</p>

        <div class="cd">
          <div class="cd-box"><span class="cd-num">{{ countdown.days }}</span><span class="cd-lbl">Hari</span></div>
          <div class="cd-box"><span class="cd-num">{{ countdown.hours }}</span><span class="cd-lbl">Jam</span></div>
          <div class="cd-box"><span class="cd-num">{{ countdown.mins }}</span><span class="cd-lbl">Menit</span></div>
          <div class="cd-box"><span class="cd-num">{{ countdown.secs }}</span><span class="cd-lbl">Detik</span></div>
        </div>
      </div>
    </section>

    <!-- ============ EVENT DETAILS ============ -->
    <section class="section events reveal">
      <div class="wrap">
        <div class="heading">
          <p class="script-sm">Rangkaian Acara</p>
          <h2 class="h2">Wedding Events</h2>
        </div>

        <div class="ev-grid">
          <article v-for="(ev, i) in events" :key="i" class="ev-card">
            <div class="ev-icon"><i :class="ev.icon"></i></div>
            <h3 class="ev-title">{{ ev.title }}</h3>
            <div class="ev-line"></div>
            <p class="ev-date">{{ ev.date }}</p>
            <p class="ev-time">{{ ev.time }}</p>
            <p class="ev-place"><i class="fa-solid fa-location-dot"></i> {{ ev.place }}</p>
            <a class="btn btn-outline" :href="wedding.mapsUrl" target="_blank" rel="noopener">
              <i class="fa-solid fa-map-location-dot"></i> Lihat Lokasi
            </a>
          </article>
        </div>
      </div>
    </section>

    <!-- ============ GALLERY ============ -->
    <section class="section gallery reveal">
      <div class="wrap">
        <div class="heading">
          <p class="script-sm">Momen Kami</p>
          <h2 class="h2">Gallery</h2>
        </div>

        <div class="g-grid">
          <button
            v-for="(img, i) in gallery"
            :key="i"
            class="g-item"
            @click="openLightbox(i)"
            :aria-label="`Buka foto ${i + 1}`"
          >
            <img :src="img" :alt="`Galeri ${i + 1}`" loading="lazy" />
            <span class="g-hover"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
          </button>
        </div>
      </div>
    </section>

    <!-- ============ GIFT / AMPLOP ============ -->
    <section class="section gift reveal">
      <div class="wrap narrow center">
        <div class="orn"><i class="fa-solid fa-gift"></i></div>
        <p class="script-sm">Tanda Kasih</p>
        <h2 class="h2">Wedding Gift</h2>
        <p class="gift-note">
          Doa restu Anda adalah hadiah terindah. Namun bila berkenan memberi tanda kasih,
          dapat melalui rekening berikut.
        </p>

        <div class="bank-list">
          <div v-for="(b, i) in banks" :key="i" class="bank-card">
            <div class="bank-top">
              <span class="bank-name">{{ b.bank }}</span>
              <i class="fa-solid fa-credit-card"></i>
            </div>
            <p class="bank-num">{{ b.number }}</p>
            <p class="bank-holder">a.n. {{ b.name }}</p>
            <button class="btn btn-outline sm" @click="copyBank(i)">
              <i class="fa-solid" :class="copied === i ? 'fa-check' : 'fa-copy'"></i>
              {{ copied === i ? 'Tersalin' : 'Salin' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ RSVP ============ -->
    <section class="section rsvp reveal">
      <div class="wrap narrow">
        <div class="heading center">
          <p class="script-sm">Konfirmasi</p>
          <h2 class="h2">RSVP</h2>
        </div>

        <form class="rsvp-form" @submit="submitRsvp">
          <label class="fld">
            <span>Nama</span>
            <input v-model="rsvp.nama" type="text" placeholder="Nama Anda" required />
          </label>

          <label class="fld">
            <span>Kehadiran</span>
            <select v-model="rsvp.kehadiran">
              <option>Hadir</option>
              <option>Tidak Hadir</option>
              <option>Masih Ragu</option>
            </select>
          </label>

          <label class="fld">
            <span>Jumlah Tamu</span>
            <input v-model.number="rsvp.jumlah" type="number" min="1" max="10" />
          </label>

          <label class="fld">
            <span>Ucapan &amp; Doa</span>
            <textarea v-model="rsvp.ucapan" rows="4" placeholder="Tulis ucapan untuk mempelai..."></textarea>
          </label>

          <button type="submit" class="btn btn-solid full">
            <i class="fa-brands fa-whatsapp"></i> Kirim via WhatsApp
          </button>
          <p class="demo-note"><i class="fa-solid fa-circle-info"></i> Ini adalah halaman demo — pesan dikirim ke WhatsApp Lavelle.</p>
        </form>
      </div>
    </section>

    <!-- ============ CLOSING ============ -->
    <section class="section closing reveal">
      <div class="wrap narrow center">
        <div class="orn light"><i class="fa-solid fa-heart"></i></div>
        <p class="closing-text">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
          Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
        </p>
        <h2 class="closing-names">{{ couple.bride.short }} &amp; {{ couple.groom.short }}</h2>
        <p class="salam">Wassalamualaikum Warahmatullahi Wabarakatuh</p>
        <div class="rule light"><span></span><i class="fa-solid fa-heart"></i><span></span></div>
        <a class="credit" href="/">Undangan digital oleh <strong>Lavelle</strong></a>
      </div>
    </section>

    <!-- ============ LIGHTBOX ============ -->
    <transition name="lb-fade">
      <div v-if="openIndex >= 0" class="lightbox" @click.self="closeLightbox">
        <button class="lb-close" @click="closeLightbox" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
        <button class="lb-nav prev" @click.stop="prevImg" aria-label="Sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>
        <img class="lb-img" :src="activeImg" :alt="`Foto ${openIndex + 1}`" />
        <button class="lb-nav next" @click.stop="nextImg" aria-label="Berikutnya"><i class="fa-solid fa-chevron-right"></i></button>
        <span class="lb-count">{{ openIndex + 1 }} / {{ gallery.length }}</span>
      </div>
    </transition>

    <!-- ============ BACK TO TOP ============ -->
    <transition name="top-fade">
      <button v-if="showTop" class="to-top" @click="scrollTop" aria-label="Kembali ke atas">
        <i class="fa-solid fa-arrow-up"></i>
      </button>
    </transition>
  </div>
</template>

<style scoped>
/* ============ TOKENS ============ */
.luxe {
  --ivory: #fbf6f1;
  --champagne: #f6ece4;
  --rose: #b06b66;
  --rose-soft: #c98a86;
  --gold: #caa16a;
  --gold-deep: #b8860b;
  --charcoal: #4a3f3a;
  --mauve: #8a6f6b;
  --line: rgba(202, 161, 106, 0.45);

  position: relative;
  width: 100%;
  overflow-x: hidden;
  background: var(--ivory);
  color: var(--charcoal);
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
.luxe *, .luxe *::before, .luxe *::after { box-sizing: border-box; }

.wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
.wrap.narrow { max-width: 720px; }
.center { text-align: center; }

.section { padding: 84px 0; position: relative; }
.section.opening { background: var(--champagne); }
.section.savedate {
  background: linear-gradient(160deg, #f3e2d8, #f6ece4);
}
.section.gift { background: var(--champagne); }
.section.closing {
  background: linear-gradient(160deg, var(--rose), var(--rose-soft));
  color: #fff5f0;
}

/* reveal */
.reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.9s ease, transform 0.9s ease; }
.reveal.in { opacity: 1; transform: none; }

/* ornaments */
.orn {
  font-size: 26px; color: var(--gold); margin-bottom: 14px;
}
.orn.light { color: #ffe9d9; }
.rule { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 18px auto; max-width: 240px; }
.rule span { flex: 1; height: 1px; background: var(--line); }
.rule i { color: var(--gold); font-size: 12px; }
.rule.light span { background: rgba(255,255,255,.6); }
.rule.light i { color: #ffe9d9; }

.heading { text-align: center; margin-bottom: 46px; }
.script-sm { font-family: 'Great Vibes', cursive; font-size: 30px; color: var(--rose); line-height: 1; }
.h2 {
  font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(30px, 5vw, 44px);
  color: var(--charcoal); margin-top: 4px; letter-spacing: 0.5px;
}

/* buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 9px;
  font-family: 'Jost', sans-serif; font-size: 13px; letter-spacing: 1.6px; text-transform: uppercase;
  padding: 13px 26px; border-radius: 999px; cursor: pointer; border: 1px solid transparent;
  transition: all 0.3s ease; text-decoration: none;
}
.btn.sm { padding: 9px 18px; font-size: 11px; }
.btn.full { width: 100%; }
.btn-solid {
  background: linear-gradient(135deg, var(--gold), var(--rose-soft));
  color: #fff; box-shadow: 0 10px 26px rgba(176, 107, 102, 0.32);
}
.btn-solid:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(176, 107, 102, 0.42); }
.btn-outline { background: transparent; border-color: var(--gold); color: var(--rose); }
.btn-outline:hover { background: var(--gold); color: #fff; }

/* ============ COVER ============ */
.cover {
  position: fixed; inset: 0; z-index: 60;
  min-height: 100vh; width: 100%;
  background-size: cover; background-position: center;
  display: flex; align-items: center; justify-content: center;
  text-align: center; padding: 40px 24px;
}
.cover-scrim {
  position: absolute; inset: 0;
  background:
    linear-gradient(180deg, rgba(251,246,241,0.55), rgba(176,107,102,0.55)),
    radial-gradient(circle at 50% 40%, rgba(251,246,241,0.2), rgba(74,63,58,0.35));
}
.cover-inner { position: relative; z-index: 2; color: #fff; max-width: 560px; }
.eyebrow {
  font-family: 'Jost', sans-serif; text-transform: uppercase; letter-spacing: 5px;
  font-size: 13px; color: #fff; opacity: 0.92;
}
.cover-names {
  font-family: 'Great Vibes', cursive; font-weight: 400;
  font-size: clamp(58px, 16vw, 104px); line-height: 1; margin: 10px 0;
  text-shadow: 0 6px 26px rgba(74,63,58,0.4);
}
.cover-date { font-family: 'Fraunces', serif; font-size: 20px; letter-spacing: 2px; }
.cover .orn { color: #ffe9d9; }
.guest { margin: 30px 0 28px; }
.guest-label { font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.9; }
.guest-name { font-family: 'Fraunces', serif; font-size: 26px; margin-top: 4px; }
.open-btn { backdrop-filter: blur(2px); }

.cover-fade-leave-active { transition: opacity 0.7s ease, transform 0.7s ease; }
.cover-fade-leave-to { opacity: 0; transform: scale(1.04); }

/* ============ OPENING ============ */
.bismillah { font-family: 'Fraunces', serif; font-size: 24px; color: var(--rose); margin-bottom: 22px; }
.verse { font-size: 21px; font-style: italic; color: var(--charcoal); }
.verse-ref { margin-top: 16px; font-family: 'Jost', sans-serif; letter-spacing: 2px; font-size: 13px; color: var(--mauve); text-transform: uppercase; }

/* ============ COUPLE ============ */
.couple-grid { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 22px; }
.c-card { text-align: center; }
.c-photo {
  width: 200px; height: 250px; margin: 0 auto 22px;
  border-radius: 130px 130px 12px 12px; overflow: hidden;
  border: 1px solid var(--line); padding: 8px; background: #fff;
  box-shadow: 0 18px 40px rgba(176,107,102,0.18);
}
.c-photo img { width: 100%; height: 100%; object-fit: cover; border-radius: 122px 122px 6px 6px; }
.c-name { font-family: 'Fraunces', serif; font-size: 27px; color: var(--charcoal); }
.c-role { font-size: 16px; color: var(--mauve); margin-top: 6px; }
.c-parent { font-size: 17px; color: var(--charcoal); }
.ig { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: 1px; color: var(--rose); text-decoration: none; }
.ig:hover { color: var(--gold-deep); }
.amp { align-self: center; }
.amp-script { font-family: 'Great Vibes', cursive; font-size: 60px; color: var(--gold); }

/* ============ TIMELINE ============ */
.timeline { position: relative; max-width: 760px; margin: 0 auto; padding-left: 30px; }
.timeline::before {
  content: ''; position: absolute; left: 9px; top: 6px; bottom: 6px; width: 2px;
  background: linear-gradient(var(--gold), var(--rose-soft));
}
.tl-item { position: relative; padding: 0 0 34px 34px; }
.tl-item:last-child { padding-bottom: 0; }
.tl-dot {
  position: absolute; left: -30px; top: 0; width: 22px; height: 22px; border-radius: 50%;
  background: #fff; border: 2px solid var(--gold); color: var(--rose);
  display: flex; align-items: center; justify-content: center; font-size: 9px;
  box-shadow: 0 0 0 5px rgba(202,161,106,0.14);
}
.tl-card {
  background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 20px 22px;
  box-shadow: 0 12px 30px rgba(176,107,102,0.1);
}
.tl-year { font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: 2px; color: var(--gold-deep); background: var(--champagne); padding: 4px 12px; border-radius: 999px; }
.tl-title { font-family: 'Fraunces', serif; font-size: 22px; margin: 12px 0 6px; color: var(--charcoal); }
.tl-text { font-size: 17px; color: var(--mauve); }

/* ============ SAVE THE DATE ============ */
.big-date { font-family: 'Fraunces', serif; font-size: clamp(34px, 7vw, 56px); color: var(--rose); margin: 6px 0 4px; }
.sd-sub { font-style: italic; color: var(--mauve); margin-bottom: 34px; }
.cd { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }
.cd-box {
  min-width: 78px; padding: 18px 10px; border-radius: 14px;
  background: #fff; border: 1px solid var(--line);
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  box-shadow: 0 12px 28px rgba(176,107,102,0.12);
}
.cd-num { font-family: 'Fraunces', serif; font-size: 34px; font-weight: 600; color: var(--charcoal); line-height: 1; }
.cd-lbl { font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--mauve); }

/* ============ EVENTS ============ */
.ev-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 26px; }
.ev-card {
  text-align: center; background: #fff; border: 1px solid var(--line); border-radius: 18px;
  padding: 40px 26px; box-shadow: 0 16px 38px rgba(176,107,102,0.12);
}
.ev-icon {
  width: 64px; height: 64px; margin: 0 auto 16px; border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), var(--rose-soft)); color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 24px;
}
.ev-title { font-family: 'Fraunces', serif; font-size: 26px; color: var(--charcoal); }
.ev-line { width: 46px; height: 1px; background: var(--line); margin: 12px auto; }
.ev-date { font-size: 18px; color: var(--charcoal); }
.ev-time { font-family: 'Fraunces', serif; font-size: 22px; color: var(--rose); margin: 2px 0 10px; }
.ev-place { font-size: 16px; color: var(--mauve); margin-bottom: 20px; }
.ev-place i { color: var(--gold); }

/* ============ GALLERY ============ */
.g-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.g-item {
  position: relative; padding: 0; border: none; cursor: pointer; overflow: hidden;
  border-radius: 12px; aspect-ratio: 1 / 1; background: var(--champagne);
}
.g-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
.g-item:hover img { transform: scale(1.08); }
.g-hover {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(74,63,58,0.32); color: #fff; opacity: 0; transition: opacity 0.3s ease; font-size: 20px;
}
.g-item:hover .g-hover { opacity: 1; }

/* ============ GIFT ============ */
.gift-note { color: var(--mauve); margin: 12px 0 28px; }
.bank-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.bank-card {
  background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 24px;
  text-align: left; box-shadow: 0 12px 30px rgba(176,107,102,0.12);
}
.bank-top { display: flex; align-items: center; justify-content: space-between; }
.bank-name { font-family: 'Fraunces', serif; font-size: 22px; color: var(--rose); }
.bank-top i { color: var(--gold); }
.bank-num { font-family: 'Jost', sans-serif; font-size: 21px; letter-spacing: 3px; color: var(--charcoal); margin: 14px 0 4px; }
.bank-holder { font-size: 16px; color: var(--mauve); margin-bottom: 16px; }

/* ============ RSVP ============ */
.rsvp-form { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
.fld { display: flex; flex-direction: column; gap: 6px; }
.fld span { font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--mauve); }
.fld input, .fld select, .fld textarea {
  font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--charcoal);
  background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px;
  width: 100%; transition: border-color 0.25s ease;
}
.fld input:focus, .fld select:focus, .fld textarea:focus { outline: none; border-color: var(--rose); }
.fld textarea { resize: vertical; }
.demo-note { text-align: center; font-size: 14px; color: var(--mauve); margin-top: 4px; }
.demo-note i { color: var(--gold); }

/* ============ CLOSING ============ */
.closing-text { font-size: 19px; opacity: 0.96; }
.closing-names { font-family: 'Great Vibes', cursive; font-size: clamp(48px, 13vw, 78px); margin: 20px 0 6px; text-shadow: 0 6px 22px rgba(74,63,58,0.25); }
.salam { font-family: 'Fraunces', serif; font-size: 18px; letter-spacing: 1px; }
.credit { display: inline-block; margin-top: 10px; font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: 1.5px; color: #fff5f0; text-decoration: none; opacity: 0.9; }
.credit strong { color: #fff; }
.credit:hover { opacity: 1; }

/* ============ LIGHTBOX ============ */
.lightbox {
  position: fixed; inset: 0; z-index: 80; background: rgba(40,30,28,0.94);
  display: flex; align-items: center; justify-content: center; padding: 40px 16px;
}
.lb-img { max-width: 92vw; max-height: 84vh; object-fit: contain; border-radius: 8px; box-shadow: 0 30px 70px rgba(0,0,0,0.5); }
.lb-close, .lb-nav {
  position: absolute; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.28);
  color: #fff; width: 46px; height: 46px; border-radius: 50%; cursor: pointer; font-size: 18px;
  display: flex; align-items: center; justify-content: center; transition: background 0.25s ease;
}
.lb-close:hover, .lb-nav:hover { background: rgba(255,255,255,0.28); }
.lb-close { top: 22px; right: 22px; }
.lb-nav.prev { left: 16px; top: 50%; transform: translateY(-50%); }
.lb-nav.next { right: 16px; top: 50%; transform: translateY(-50%); }
.lb-count { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); color: #fff; font-family: 'Jost', sans-serif; font-size: 13px; letter-spacing: 2px; }

.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity 0.3s ease; }
.lb-fade-enter-from, .lb-fade-leave-to { opacity: 0; }

/* ============ BACK TO TOP ============ */
.to-top {
  position: fixed; right: 20px; bottom: 20px; z-index: 55;
  width: 48px; height: 48px; border-radius: 50%; border: none; cursor: pointer;
  background: linear-gradient(135deg, var(--gold), var(--rose-soft)); color: #fff; font-size: 16px;
  box-shadow: 0 10px 26px rgba(176,107,102,0.4);
}
.to-top:hover { transform: translateY(-2px); }
.top-fade-enter-active, .top-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.top-fade-enter-from, .top-fade-leave-to { opacity: 0; transform: translateY(10px); }

/* ============ RESPONSIVE ============ */
@media (max-width: 820px) {
  .ev-grid, .bank-list { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .luxe { font-size: 17px; }
  .section { padding: 62px 0; }
  .couple-grid { grid-template-columns: 1fr; gap: 8px; }
  .amp { margin: 6px 0; }
  .amp-script { font-size: 44px; }
  .g-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .cd-box { min-width: 66px; padding: 14px 8px; }
  .cd-num { font-size: 27px; }
  .lb-nav.prev { left: 8px; }
  .lb-nav.next { right: 8px; }
}
</style>
