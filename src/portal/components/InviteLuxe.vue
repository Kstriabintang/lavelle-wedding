<script setup>
// TEMPLATE LUXE — renderer undangan BERBASIS DATA (committable, versi portal).
// Digeneralisasi dari DemoLuxe.vue (editorial romantis, self-contained).
// Base ivory-romantis TETAP (identitas Luxe); aksen (rose/gold) ikut paket tema.
// Data dari skema portal, foto = URL. preview=true → lewati sampul.
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { mergeInvite, fillPhotos } from '../data/schema.js'
import { themeVars, THEME_IDS } from '../data/themes.js'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  theme: { type: String, default: THEME_IDS[0] },
  preview: { type: Boolean, default: false },
  accentOv: { type: Object, default: () => ({}) },
  hide: { type: Object, default: () => ({}) },
})

const r = computed(() => fillPhotos(mergeInvite(props.data)))
const accentVars = computed(() => {
  const tv = themeVars(props.theme)
  // Warna utama Luxe (--rose) ikut --marun tiap tema (navy/burgundy/hijau/rosé) → jelas beda
  // saat ganti tema; --gold tetap dari accent tema.
  return { '--rose': tv['--marun'], '--rose-soft': tv['--accent'], '--gold': tv['--accent-2'], '--gold-deep': tv['--accent'] }
})

const hero = computed(() => r.value.hero)
const bride = computed(() => r.value.bride)
const groom = computed(() => r.value.groom)
const events = computed(() => (r.value.events || []).map((e, i) => ({ icon: i === 0 ? 'fa-solid fa-ring' : 'fa-solid fa-champagne-glasses', title: e.tag, date: e.date, time: e.time, place: e.place })))
const story = computed(() => (r.value.story || []).filter((s) => s.title || s.desc).map((s) => ({ year: s.year, title: s.title, text: s.desc })))
const gallery = computed(() => (r.value.gallery || []).map((g) => g.src).filter(Boolean))
const banks = computed(() => (r.value.gifts || []).map((g) => ({ bank: g.label, number: g.no || g.raw, raw: g.raw || g.no, name: g.an })))
const mapsUrl = computed(() => (r.value.mapsQuery ? `https://maps.google.com/?q=${encodeURIComponent(r.value.mapsQuery)}` : '#'))

const guestName = ref('Tamu Undangan')
const coverOpen = ref(!props.preview)
function openInvitation() {
  coverOpen.value = false
  if (typeof window === 'undefined') return
  requestAnimationFrame(() => { const el = document.getElementById('lx-opening'); if (el) el.scrollIntoView({ behavior: 'smooth' }) })
}

const countdown = reactive({ days: 0, hours: 0, mins: 0, secs: 0 })
let timer = null
function tick() {
  const target = new Date(`${hero.value.date}T08:00:00+07:00`).getTime()
  let diff = Math.max(0, (isNaN(target) ? Date.now() : target) - Date.now())
  const d = Math.floor(diff / 86400000); diff -= d * 86400000
  const h = Math.floor(diff / 3600000); diff -= h * 3600000
  const m = Math.floor(diff / 60000); diff -= m * 60000
  countdown.days = d; countdown.hours = h; countdown.mins = m; countdown.secs = Math.floor(diff / 1000)
}

const copied = ref(-1)
function copyBank(i) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  navigator.clipboard.writeText(banks.value[i].raw || '').then(() => { copied.value = i; setTimeout(() => { if (copied.value === i) copied.value = -1 }, 1800) }).catch(() => {})
}

const openIndex = ref(-1)
function openLightbox(i) { openIndex.value = i }
function closeLightbox() { openIndex.value = -1 }
function prevImg() { if (openIndex.value >= 0) openIndex.value = (openIndex.value - 1 + gallery.value.length) % gallery.value.length }
function nextImg() { if (openIndex.value >= 0) openIndex.value = (openIndex.value + 1) % gallery.value.length }
function onKey(e) { if (openIndex.value < 0) return; if (e.key === 'Escape') closeLightbox(); else if (e.key === 'ArrowLeft') prevImg(); else if (e.key === 'ArrowRight') nextImg() }
const activeImg = computed(() => (openIndex.value >= 0 ? gallery.value[openIndex.value] : ''))

const rsvp = reactive({ nama: '', kehadiran: 'Hadir', jumlah: 1, ucapan: '' })
const rsvpDone = ref(false)
function submitRsvp(e) { e.preventDefault(); rsvpDone.value = true }

const showTop = ref(false)
function scrollTop() { if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }) }
function onScroll() { if (typeof window !== 'undefined') showTop.value = window.scrollY > 480 }

let io = null
onMounted(() => {
  tick(); timer = setInterval(tick, 1000)
  if (typeof window === 'undefined') return
  window.addEventListener('keydown', onKey)
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll()
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => { entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target) } }) }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    requestAnimationFrame(() => document.querySelectorAll('.invite-luxe .reveal').forEach((el) => io.observe(el)))
  } else {
    document.querySelectorAll('.invite-luxe .reveal').forEach((el) => el.classList.add('in'))
  }
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (typeof window !== 'undefined') { window.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll) }
  if (io) io.disconnect()
})
</script>

<template>
  <div class="invite-luxe" :style="[accentVars, accentOv]">
    <transition name="cover-fade">
      <section v-if="coverOpen" class="cover" :style="{ backgroundImage: `url(${hero.photo})` }">
        <div class="cover-scrim"></div>
        <div class="cover-inner">
          <div class="orn"><i class="fa-solid fa-feather"></i></div>
          <p class="eyebrow">The Wedding Of</p>
          <h1 class="cover-names">{{ hero.bride }} &amp; {{ hero.groom }}</h1>
          <div class="rule"><span></span><i class="fa-solid fa-heart"></i><span></span></div>
          <p class="cover-date">{{ hero.dateText }}</p>
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

    <section id="lx-opening" class="section opening reveal">
      <div class="wrap narrow center">
        <div class="orn"><i class="fa-solid fa-leaf"></i></div>
        <p class="bismillah">Bismillahirrahmanirrahim</p>
        <p class="verse">{{ r.quote.text || '“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.”' }}</p>
        <p class="verse-ref">{{ r.quote.ref || '— QS. Ar-Rum : 21' }}</p>
      </div>
    </section>

    <section class="section couple reveal">
      <div class="wrap">
        <div class="heading"><p class="script-sm">Mempelai</p><h2 class="h2">The Couple</h2></div>
        <div class="couple-grid">
          <article class="c-card">
            <div class="c-photo"><img :src="bride.photo" :alt="bride.name" loading="lazy" /></div>
            <h3 class="c-name">{{ bride.name || hero.bride }}</h3>
            <p class="c-role">{{ bride.role }}</p>
            <p class="c-parent">{{ bride.parents }}</p>
          </article>
          <div class="amp"><span class="amp-script">&amp;</span></div>
          <article class="c-card">
            <div class="c-photo"><img :src="groom.photo" :alt="groom.name" loading="lazy" /></div>
            <h3 class="c-name">{{ groom.name || hero.groom }}</h3>
            <p class="c-role">{{ groom.role }}</p>
            <p class="c-parent">{{ groom.parents }}</p>
          </article>
        </div>
      </div>
    </section>

    <section v-if="story.length && !hide.story" class="section story reveal">
      <div class="wrap">
        <div class="heading"><p class="script-sm">Perjalanan Kami</p><h2 class="h2">Love Story</h2></div>
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

    <section class="section savedate reveal">
      <div class="wrap narrow center">
        <div class="orn"><i class="fa-solid fa-calendar-day"></i></div>
        <p class="script-sm">Save the Date</p>
        <h2 class="big-date">{{ hero.dateText }}</h2>
        <p class="sd-sub">Menuju hari bahagia kami</p>
        <div class="cd">
          <div class="cd-box"><span class="cd-num">{{ countdown.days }}</span><span class="cd-lbl">Hari</span></div>
          <div class="cd-box"><span class="cd-num">{{ countdown.hours }}</span><span class="cd-lbl">Jam</span></div>
          <div class="cd-box"><span class="cd-num">{{ countdown.mins }}</span><span class="cd-lbl">Menit</span></div>
          <div class="cd-box"><span class="cd-num">{{ countdown.secs }}</span><span class="cd-lbl">Detik</span></div>
        </div>
      </div>
    </section>

    <section class="section events reveal">
      <div class="wrap">
        <div class="heading"><p class="script-sm">Rangkaian Acara</p><h2 class="h2">Wedding Events</h2></div>
        <div class="ev-grid">
          <article v-for="(ev, i) in events" :key="i" class="ev-card">
            <div class="ev-icon"><i :class="ev.icon"></i></div>
            <h3 class="ev-title">{{ ev.title }}</h3>
            <div class="ev-line"></div>
            <p class="ev-date">{{ ev.date }}</p>
            <p class="ev-time">{{ ev.time }}</p>
            <p class="ev-place"><i class="fa-solid fa-location-dot"></i> {{ ev.place }}</p>
            <a class="btn btn-outline" :href="mapsUrl" target="_blank" rel="noopener"><i class="fa-solid fa-map-location-dot"></i> Lihat Lokasi</a>
          </article>
        </div>
      </div>
    </section>

    <section v-if="gallery.length && !hide.gallery" class="section gallery reveal">
      <div class="wrap">
        <div class="heading"><p class="script-sm">Momen Kami</p><h2 class="h2">Gallery</h2></div>
        <div class="g-grid">
          <button v-for="(img, i) in gallery" :key="i" class="g-item" @click="openLightbox(i)" :aria-label="`Buka foto ${i + 1}`">
            <img :src="img" :alt="`Galeri ${i + 1}`" loading="lazy" />
            <span class="g-hover"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
          </button>
        </div>
      </div>
    </section>

    <section v-if="banks.length && !hide.gifts" class="section gift reveal">
      <div class="wrap narrow center">
        <div class="orn"><i class="fa-solid fa-gift"></i></div>
        <p class="script-sm">Tanda Kasih</p>
        <h2 class="h2">Wedding Gift</h2>
        <p class="gift-note">Doa restu Anda adalah hadiah terindah. Namun bila berkenan memberi tanda kasih, dapat melalui rekening berikut.</p>
        <div class="bank-list">
          <div v-for="(b, i) in banks" :key="i" class="bank-card">
            <div class="bank-top"><span class="bank-name">{{ b.bank }}</span><i class="fa-solid fa-credit-card"></i></div>
            <p class="bank-num">{{ b.number }}</p>
            <p class="bank-holder">a.n. {{ b.name }}</p>
            <button class="btn btn-outline sm" @click="copyBank(i)"><i class="fa-solid" :class="copied === i ? 'fa-check' : 'fa-copy'"></i> {{ copied === i ? 'Tersalin' : 'Salin' }}</button>
          </div>
        </div>
      </div>
    </section>

    <section class="section rsvp reveal">
      <div class="wrap narrow">
        <div class="heading center"><p class="script-sm">Konfirmasi</p><h2 class="h2">RSVP</h2></div>
        <form v-if="!rsvpDone" class="rsvp-form" @submit="submitRsvp">
          <label class="fld"><span>Nama</span><input v-model="rsvp.nama" type="text" placeholder="Nama Anda" required /></label>
          <label class="fld"><span>Kehadiran</span><select v-model="rsvp.kehadiran"><option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option></select></label>
          <label class="fld"><span>Jumlah Tamu</span><input v-model.number="rsvp.jumlah" type="number" min="1" max="10" /></label>
          <label class="fld"><span>Ucapan &amp; Doa</span><textarea v-model="rsvp.ucapan" rows="4" placeholder="Tulis ucapan untuk mempelai..."></textarea></label>
          <button type="submit" class="btn btn-solid full"><i class="fa-solid fa-paper-plane"></i> Kirim Konfirmasi</button>
        </form>
        <div v-else class="rsvp-done">
          <div class="orn"><i class="fa-solid fa-circle-check"></i></div>
          <p class="verse">Terima kasih, {{ rsvp.nama.split(' ')[0] || 'Sahabat' }}! Konfirmasimu telah kami terima.</p>
        </div>
      </div>
    </section>

    <section class="section closing reveal">
      <div class="wrap narrow center">
        <div class="orn light"><i class="fa-solid fa-heart"></i></div>
        <p class="closing-text">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p>
        <h2 class="closing-names">{{ hero.bride }} &amp; {{ hero.groom }}</h2>
        <p class="salam">Wassalamualaikum Warahmatullahi Wabarakatuh</p>
        <div class="rule light"><span></span><i class="fa-solid fa-heart"></i><span></span></div>
      </div>
    </section>

    <transition name="lb-fade">
      <div v-if="openIndex >= 0" class="lightbox" @click.self="closeLightbox">
        <button class="lb-close" @click="closeLightbox" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
        <button class="lb-nav prev" @click.stop="prevImg" aria-label="Sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>
        <img class="lb-img" :src="activeImg" :alt="`Foto ${openIndex + 1}`" />
        <button class="lb-nav next" @click.stop="nextImg" aria-label="Berikutnya"><i class="fa-solid fa-chevron-right"></i></button>
        <span class="lb-count">{{ openIndex + 1 }} / {{ gallery.length }}</span>
      </div>
    </transition>

    <transition name="top-fade">
      <button v-if="showTop" class="to-top" @click="scrollTop" aria-label="Kembali ke atas"><i class="fa-solid fa-arrow-up"></i></button>
    </transition>
  </div>
</template>

<style scoped>
.invite-luxe {
  --ivory: #fbf6f1; --champagne: #f6ece4;
  --rose: #b06b66; --rose-soft: #c98a86; --gold: #caa16a; --gold-deep: #b8860b;
  --charcoal: #4a3f3a; --mauve: #8a6f6b; --line: rgba(202, 161, 106, 0.45);
  position: relative; width: 100%; overflow-x: hidden;
  background: var(--ivory); color: var(--charcoal);
  font-family: var(--inv-body, 'Cormorant Garamond'), serif; font-size: 18px; line-height: 1.7; -webkit-font-smoothing: antialiased;
}
.invite-luxe *, .invite-luxe *::before, .invite-luxe *::after { box-sizing: border-box; }
.wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
.wrap.narrow { max-width: 720px; }
.center { text-align: center; }
.section { padding: 84px 0; position: relative; }
.section.opening { background: var(--champagne); }
.section.savedate { background: linear-gradient(160deg, #f3e2d8, #f6ece4); }
.section.gift { background: var(--champagne); }
.section.closing { background: linear-gradient(160deg, var(--rose), var(--rose-soft)); color: #fff5f0; }
.reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.9s ease, transform 0.9s ease; }
.reveal.in { opacity: 1; transform: none; }
.orn { font-size: 26px; color: var(--gold); margin-bottom: 14px; }
.orn.light { color: #ffe9d9; }
.rule { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 18px auto; max-width: 240px; }
.rule span { flex: 1; height: 1px; background: var(--line); }
.rule i { color: var(--gold); font-size: 12px; }
.rule.light span { background: rgba(255, 255, 255, .6); }
.rule.light i { color: #ffe9d9; }
.heading { text-align: center; margin-bottom: 46px; }
.script-sm { font-family: var(--inv-script, 'Great Vibes'), cursive; font-size: 30px; color: var(--rose); line-height: 1; }
.h2 { font-family: var(--inv-serif, 'Fraunces'), serif; font-weight: 600; font-size: clamp(30px, 5vw, 44px); color: var(--charcoal); margin-top: 4px; letter-spacing: 0.5px; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 9px; font-family: var(--inv-sans, 'Jost'), sans-serif; font-size: 13px; letter-spacing: 1.6px; text-transform: uppercase; padding: 13px 26px; border-radius: 999px; cursor: pointer; border: 1px solid transparent; transition: all 0.3s ease; text-decoration: none; }
.btn.sm { padding: 9px 18px; font-size: 11px; }
.btn.full { width: 100%; }
.btn-solid { background: linear-gradient(135deg, var(--gold), var(--rose-soft)); color: #fff; box-shadow: 0 10px 26px rgba(176, 107, 102, 0.32); }
.btn-solid:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(176, 107, 102, 0.42); }
.btn-outline { background: transparent; border-color: var(--gold); color: var(--rose); }
.btn-outline:hover { background: var(--gold); color: #fff; }
.cover { position: fixed; inset: 0; z-index: 60; min-height: 100vh; width: 100%; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; text-align: center; padding: 40px 24px; }
.cover-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(251, 246, 241, 0.55), rgba(176, 107, 102, 0.55)), radial-gradient(circle at 50% 40%, rgba(251, 246, 241, 0.2), rgba(74, 63, 58, 0.35)); }
.cover-inner { position: relative; z-index: 2; color: #fff; max-width: 560px; }
.eyebrow { font-family: var(--inv-sans, 'Jost'), sans-serif; text-transform: uppercase; letter-spacing: 5px; font-size: 13px; color: #fff; opacity: 0.92; }
.cover-names { font-family: var(--inv-script, 'Great Vibes'), cursive; font-weight: 400; font-size: clamp(58px, 16vw, 104px); line-height: 1; margin: 10px 0; text-shadow: 0 6px 26px rgba(74, 63, 58, 0.4); }
.cover-date { font-family: var(--inv-serif, 'Fraunces'), serif; font-size: 20px; letter-spacing: 2px; }
.cover .orn { color: #ffe9d9; }
.guest { margin: 30px 0 28px; }
.guest-label { font-family: var(--inv-sans, 'Jost'), sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.9; }
.guest-name { font-family: var(--inv-serif, 'Fraunces'), serif; font-size: 26px; margin-top: 4px; }
.open-btn { backdrop-filter: blur(2px); }
.cover-fade-leave-active { transition: opacity 0.7s ease, transform 0.7s ease; }
.cover-fade-leave-to { opacity: 0; transform: scale(1.04); }
.bismillah { font-family: var(--inv-serif, 'Fraunces'), serif; font-size: 24px; color: var(--rose); margin-bottom: 22px; }
.verse { font-size: 21px; font-style: italic; color: var(--charcoal); }
.verse-ref { margin-top: 16px; font-family: var(--inv-sans, 'Jost'), sans-serif; letter-spacing: 2px; font-size: 13px; color: var(--mauve); text-transform: uppercase; }
.couple-grid { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 22px; }
.c-card { text-align: center; }
.c-photo { width: 200px; height: 250px; margin: 0 auto 22px; border-radius: 130px 130px 12px 12px; overflow: hidden; border: 1px solid var(--line); padding: 8px; background: #fff; box-shadow: 0 18px 40px rgba(176, 107, 102, 0.18); }
.c-photo img { width: 100%; height: 100%; object-fit: cover; border-radius: 122px 122px 6px 6px; }
.c-name { font-family: var(--inv-serif, 'Fraunces'), serif; font-size: 27px; color: var(--charcoal); }
.c-role { font-size: 16px; color: var(--mauve); margin-top: 6px; }
.c-parent { font-size: 17px; color: var(--charcoal); }
.amp { align-self: center; }
.amp-script { font-family: var(--inv-script, 'Great Vibes'), cursive; font-size: 60px; color: var(--gold); }
.timeline { position: relative; max-width: 760px; margin: 0 auto; padding-left: 30px; }
.timeline::before { content: ''; position: absolute; left: 9px; top: 6px; bottom: 6px; width: 2px; background: linear-gradient(var(--gold), var(--rose-soft)); }
.tl-item { position: relative; padding: 0 0 34px 34px; }
.tl-item:last-child { padding-bottom: 0; }
.tl-dot { position: absolute; left: -30px; top: 0; width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 2px solid var(--gold); color: var(--rose); display: flex; align-items: center; justify-content: center; font-size: 9px; box-shadow: 0 0 0 5px rgba(202, 161, 106, 0.14); }
.tl-card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 20px 22px; box-shadow: 0 12px 30px rgba(176, 107, 102, 0.1); }
.tl-year { font-family: var(--inv-sans, 'Jost'), sans-serif; font-size: 12px; letter-spacing: 2px; color: var(--gold-deep); background: var(--champagne); padding: 4px 12px; border-radius: 999px; }
.tl-title { font-family: var(--inv-serif, 'Fraunces'), serif; font-size: 22px; margin: 12px 0 6px; color: var(--charcoal); }
.tl-text { font-size: 17px; color: var(--mauve); }
.big-date { font-family: var(--inv-serif, 'Fraunces'), serif; font-size: clamp(34px, 7vw, 56px); color: var(--rose); margin: 6px 0 4px; }
.sd-sub { font-style: italic; color: var(--mauve); margin-bottom: 34px; }
.cd { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }
.cd-box { min-width: 78px; padding: 18px 10px; border-radius: 14px; background: #fff; border: 1px solid var(--line); display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: 0 12px 28px rgba(176, 107, 102, 0.12); }
.cd-num { font-family: var(--inv-serif, 'Fraunces'), serif; font-size: 34px; font-weight: 600; color: var(--charcoal); line-height: 1; }
.cd-lbl { font-family: var(--inv-sans, 'Jost'), sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--mauve); }
.ev-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 26px; }
.ev-card { text-align: center; background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 40px 26px; box-shadow: 0 16px 38px rgba(176, 107, 102, 0.12); }
.ev-icon { width: 64px; height: 64px; margin: 0 auto 16px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), var(--rose-soft)); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.ev-title { font-family: var(--inv-serif, 'Fraunces'), serif; font-size: 26px; color: var(--charcoal); }
.ev-line { width: 46px; height: 1px; background: var(--line); margin: 12px auto; }
.ev-date { font-size: 18px; color: var(--charcoal); }
.ev-time { font-family: var(--inv-serif, 'Fraunces'), serif; font-size: 22px; color: var(--rose); margin: 2px 0 10px; }
.ev-place { font-size: 16px; color: var(--mauve); margin-bottom: 20px; }
.ev-place i { color: var(--gold); }
.g-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.g-item { position: relative; padding: 0; border: none; cursor: pointer; overflow: hidden; border-radius: 12px; aspect-ratio: 1 / 1; background: var(--champagne); }
.g-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
.g-item:hover img { transform: scale(1.08); }
.g-hover { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(74, 63, 58, 0.32); color: #fff; opacity: 0; transition: opacity 0.3s ease; font-size: 20px; }
.g-item:hover .g-hover { opacity: 1; }
.gift-note { color: var(--mauve); margin: 12px 0 28px; }
.bank-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.bank-card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 24px; text-align: left; box-shadow: 0 12px 30px rgba(176, 107, 102, 0.12); }
.bank-top { display: flex; align-items: center; justify-content: space-between; }
.bank-name { font-family: var(--inv-serif, 'Fraunces'), serif; font-size: 22px; color: var(--rose); }
.bank-top i { color: var(--gold); }
.bank-num { font-family: var(--inv-sans, 'Jost'), sans-serif; font-size: 21px; letter-spacing: 3px; color: var(--charcoal); margin: 14px 0 4px; }
.bank-holder { font-size: 16px; color: var(--mauve); margin-bottom: 16px; }
.rsvp-form { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
.rsvp-done { text-align: center; }
.fld { display: flex; flex-direction: column; gap: 6px; }
.fld span { font-family: var(--inv-sans, 'Jost'), sans-serif; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--mauve); }
.fld input, .fld select, .fld textarea { font-family: var(--inv-body, 'Cormorant Garamond'), serif; font-size: 18px; color: var(--charcoal); background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; width: 100%; transition: border-color 0.25s ease; }
.fld input:focus, .fld select:focus, .fld textarea:focus { outline: none; border-color: var(--rose); }
.fld textarea { resize: vertical; }
.closing-text { font-size: 19px; opacity: 0.96; }
.closing-names { font-family: var(--inv-script, 'Great Vibes'), cursive; font-size: clamp(48px, 13vw, 78px); margin: 20px 0 6px; text-shadow: 0 6px 22px rgba(74, 63, 58, 0.25); }
.salam { font-family: var(--inv-serif, 'Fraunces'), serif; font-size: 18px; letter-spacing: 1px; }
.lightbox { position: fixed; inset: 0; z-index: 80; background: rgba(40, 30, 28, 0.94); display: flex; align-items: center; justify-content: center; padding: 40px 16px; }
.lb-img { max-width: 92vw; max-height: 84vh; object-fit: contain; border-radius: 8px; box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5); }
.lb-close, .lb-nav { position: absolute; background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.28); color: #fff; width: 46px; height: 46px; border-radius: 50%; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: background 0.25s ease; }
.lb-close:hover, .lb-nav:hover { background: rgba(255, 255, 255, 0.28); }
.lb-close { top: 22px; right: 22px; }
.lb-nav.prev { left: 16px; top: 50%; transform: translateY(-50%); }
.lb-nav.next { right: 16px; top: 50%; transform: translateY(-50%); }
.lb-count { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); color: #fff; font-family: var(--inv-sans, 'Jost'), sans-serif; font-size: 13px; letter-spacing: 2px; }
.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity 0.3s ease; }
.lb-fade-enter-from, .lb-fade-leave-to { opacity: 0; }
.to-top { position: fixed; right: 20px; bottom: 20px; z-index: 55; width: 48px; height: 48px; border-radius: 50%; border: none; cursor: pointer; background: linear-gradient(135deg, var(--gold), var(--rose-soft)); color: #fff; font-size: 16px; box-shadow: 0 10px 26px rgba(176, 107, 102, 0.4); }
.to-top:hover { transform: translateY(-2px); }
.top-fade-enter-active, .top-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.top-fade-enter-from, .top-fade-leave-to { opacity: 0; transform: translateY(10px); }
@media (max-width: 820px) { .ev-grid, .bank-list { grid-template-columns: 1fr; } }
@media (max-width: 640px) { .invite-luxe { font-size: 17px; } .section { padding: 62px 0; } .couple-grid { grid-template-columns: 1fr; gap: 8px; } .amp { margin: 6px 0; } .amp-script { font-size: 44px; } .g-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; } .cd-box { min-width: 66px; padding: 14px 8px; } .cd-num { font-size: 27px; } .lb-nav.prev { left: 8px; } .lb-nav.next { right: 8px; } }
</style>
