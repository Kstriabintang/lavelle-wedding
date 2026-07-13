<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useHead } from '@unhead/vue'
import { wa, waPlan, WA_1, WA_2, IG } from '../data/site'
import { demos } from '../data/site'
import PreLoader from '../components/PreLoader.vue'
import FloatingHearts from '../components/FloatingHearts.vue'
import SiteNav from '../components/SiteNav.vue'
import SiteFooter from '../components/SiteFooter.vue'
import WhatsappFloat from '../components/WhatsappFloat.vue'
import HomeThemeCatalog from '../components/HomeThemeCatalog.vue'

const openPlan = (plan) => window.open(waPlan(plan), '_blank')

// Harga count-up saat masuk viewport (elegan)
const pBasic = ref(99)
const pPrem = ref(249)
const pEks = ref(549)
function countTo(target, refVar, dur = 1300) {
  const start = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - start) / dur)
    const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
    refVar.value = Math.round(target * eased)
    if (t < 1) requestAnimationFrame(step)
    else refVar.value = target
  }
  requestAnimationFrame(step)
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization', '@id': 'https://lavelle.my.id/#organization', name: 'Lavelle',
      url: 'https://lavelle.my.id/', logo: 'https://lavelle.my.id/img/lavelle-logo.png',
      image: 'https://lavelle.my.id/img/mentahan/pasangan-bukit-sunset.jpeg',
      description: 'Jasa pembuatan undangan pernikahan digital yang elegan, personal, dan berkelas.',
      email: 'lavelle.weddingku@gmail.com', areaServed: 'Indonesia', sameAs: ['https://instagram.com/lavelle.ld'],
      contactPoint: { '@type': 'ContactPoint', telephone: '+6285264402640', contactType: 'customer service', areaServed: 'ID', availableLanguage: 'Indonesian' },
    },
    { '@type': 'WebSite', '@id': 'https://lavelle.my.id/#website', url: 'https://lavelle.my.id/', name: 'Lavelle', inLanguage: 'id-ID', publisher: { '@id': 'https://lavelle.my.id/#organization' } },
    {
      '@type': 'Service', name: 'Undangan Pernikahan Digital', serviceType: 'Undangan pernikahan digital',
      provider: { '@id': 'https://lavelle.my.id/#organization' }, areaServed: 'Indonesia', url: 'https://lavelle.my.id/#paket',
      offers: [
        { '@type': 'Offer', name: 'Basic', price: '99000', priceCurrency: 'IDR', url: 'https://lavelle.my.id/#paket' },
        { '@type': 'Offer', name: 'Premium', price: '249000', priceCurrency: 'IDR', url: 'https://lavelle.my.id/#paket' },
        { '@type': 'Offer', name: 'Eksklusif', price: '549000', priceCurrency: 'IDR', url: 'https://lavelle.my.id/#paket' },
      ],
    },
    {
      '@type': 'FAQPage', '@id': 'https://lavelle.my.id/#faq',
      mainEntity: [
        { '@type': 'Question', name: 'Berapa lama proses pembuatan undangan?', acceptedAnswer: { '@type': 'Answer', text: 'Umumnya 1–3 hari kerja setelah data lengkap kami terima. Paket Eksklusif mendapat prioritas pengerjaan.' } },
        { '@type': 'Question', name: 'Apakah link undangan bisa diakses selamanya?', acceptedAnswer: { '@type': 'Answer', text: 'Link aktif minimal 1 tahun. Untuk paket Eksklusif dengan domain pribadi, masa aktif mengikuti domain yang kamu miliki.' } },
        { '@type': 'Question', name: 'Bisakah desainnya disesuaikan dengan tema kami?', acceptedAnswer: { '@type': 'Answer', text: 'Tentu! Warna, font, dan tata letak bisa disesuaikan. Untuk desain custom sepenuhnya, pilih paket Eksklusif.' } },
        { '@type': 'Question', name: 'Bagaimana cara membayarnya?', acceptedAnswer: { '@type': 'Answer', text: 'Pembayaran via transfer bank atau e-wallet. Biasanya DP di awal, pelunasan setelah undangan disetujui.' } },
        { '@type': 'Question', name: 'Apakah ada batas jumlah tamu?', acceptedAnswer: { '@type': 'Answer', text: 'Tidak ada. Satu link undangan bisa dibagikan ke tamu sebanyak yang kamu mau, dan nama tamu bisa dipersonalisasi otomatis.' } },
      ],
    },
  ],
}

useHead({
  title: 'Lavelle — Jasa Undangan Pernikahan Digital Premium',
  link: [{ rel: 'canonical', href: 'https://lavelle.my.id/' }],
  meta: [
    { name: 'description', content: 'Lavelle membuat undangan pernikahan digital yang elegan, mewah, dan personal. Lengkap dengan RSVP, buku ucapan, galeri, dan amplop digital. Pesan undangan website impianmu sekarang.' },
    { name: 'keywords', content: 'undangan pernikahan digital, undangan website, jasa undangan online, undangan nikah, wedding invitation, undangan digital premium' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Lavelle — Jasa Undangan Pernikahan Digital Premium' },
    { property: 'og:description', content: 'Undangan pernikahan digital yang elegan & personal — RSVP, buku ucapan, galeri, hingga amplop digital dalam satu link. Konsultasi gratis.' },
    { property: 'og:url', content: 'https://lavelle.my.id/' },
    { property: 'og:image', content: 'https://lavelle.my.id/img/mentahan/pasangan-bukit-sunset.jpeg' },
    { property: 'og:image:alt', content: 'Undangan pernikahan digital Lavelle' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Lavelle — Jasa Undangan Pernikahan Digital Premium' },
    { name: 'twitter:description', content: 'Undangan pernikahan digital yang elegan & personal dalam satu link. Konsultasi gratis.' },
    { name: 'twitter:image', content: 'https://lavelle.my.id/img/mentahan/pasangan-bukit-sunset.jpeg' },
  ],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }],
})

const features = [
  { icon: 'fa-feather-pointed', title: 'Desain Elegan & Personal', text: 'Setiap undangan dirancang dengan sentuhan mewah dan disesuaikan dengan tema, warna, serta cerita cinta kalian.' },
  { icon: 'fa-clipboard-check', title: 'RSVP Otomatis', text: 'Tamu konfirmasi kehadiran langsung dari undangan. Data terkumpul rapi, kamu mudah mengatur jumlah tamu.' },
  { icon: 'fa-comment-dots', title: 'Buku Ucapan & Doa', text: 'Tamu bisa mengirim ucapan dan doa yang tampil cantik di undangan — kenangan manis yang tersimpan selamanya.' },
  { icon: 'fa-images', title: 'Galeri & Cerita Cinta', text: 'Pamerkan foto prewedding dan perjalanan kisah kalian dalam galeri yang tertata indah.' },
  { icon: 'fa-gift', title: 'Amplop Digital', text: 'Terima tanda kasih lewat transfer bank atau QRIS dengan aman, praktis, dan elegan.' },
  { icon: 'fa-location-dot', title: 'Lokasi, Maps & Countdown', text: 'Lengkap dengan peta lokasi, tombol navigasi, hitung mundur acara, dan musik latar yang romantis.' },
]

const gallery = [
  'pasangan-pose-romantis', 'pasangan-pantai-senja', 'pasangan-tatapan-dekat', 'pasangan-jalan',
  'momen-bahagia', 'pasangan-pelukan-2', 'pasangan-outdoor-3', 'pasangan-candid',
]

const steps = [
  { num: '01', title: 'Konsultasi', text: 'Hubungi kami via WhatsApp, ceritakan konsep dan pilih paket yang sesuai.' },
  { num: '02', title: 'Kirim Data', text: 'Kirim foto, nama mempelai, detail acara, dan referensi desain favoritmu.' },
  { num: '03', title: 'Proses Desain', text: 'Tim kami merangkai undangan. Kamu bisa cek dan minta revisi sesuai paket.' },
  { num: '04', title: 'Undangan Siap', text: 'Link undangan aktif dan siap dibagikan ke seluruh tamu — praktis, tanpa repot mencetak.' },
]

const faqs = [
  { q: 'Berapa lama proses pembuatan undangan?', a: 'Umumnya 1–3 hari kerja setelah data lengkap kami terima. Paket Eksklusif mendapat prioritas pengerjaan.' },
  { q: 'Apakah link undangan bisa diakses selamanya?', a: 'Link aktif minimal 1 tahun. Untuk paket Eksklusif dengan domain pribadi, masa aktif mengikuti domain yang kamu miliki.' },
  { q: 'Bisakah desainnya disesuaikan dengan tema kami?', a: 'Tentu! Warna, font, dan tata letak bisa disesuaikan. Untuk desain custom sepenuhnya, pilih paket Eksklusif.' },
  { q: 'Bagaimana cara membayarnya?', a: 'Pembayaran via transfer bank atau e-wallet. Biasanya DP di awal, pelunasan setelah undangan disetujui.' },
  { q: 'Apakah ada batas jumlah tamu?', a: 'Tidak ada. Satu link undangan bisa dibagikan ke tamu sebanyak yang kamu mau, dan nama tamu bisa dipersonalisasi otomatis.' },
]

const strip = ['Desain Elegan', 'RSVP Otomatis', 'Buku Ucapan', 'Galeri Foto', 'Amplop Digital', 'Lokasi & Maps', 'Musik Latar', 'Hitung Mundur']

// Nilai unggulan — jujur & berbasis fitur (bukan angka karangan)
const valueProps = [
  { icon: 'fa-infinity', value: 'Tanpa Batas', label: 'Tamu undangan' },
  { icon: 'fa-bolt', value: '1–3 Hari', label: 'Proses pengerjaan' },
  { icon: 'fa-palette', value: '100% Custom', label: 'Sesuai tema kalian' },
  { icon: 'fa-headset', value: 'Dibimbing', label: 'Admin siap membantu' },
]

// Perbandingan undangan digital vs cetak
const compare = [
  { aspect: 'Biaya', digital: 'Terjangkau, sekali bayar', cetak: 'Mahal & berulang per lembar' },
  { aspect: 'Waktu', digital: 'Siap 1–3 hari kerja', cetak: 'Berminggu-minggu cetak & kirim' },
  { aspect: 'Jangkauan', digital: '1 link untuk ribuan tamu', cetak: 'Terbatas jumlah cetakan' },
  { aspect: 'Fitur', digital: 'RSVP, maps, galeri, musik, amplop', cetak: 'Statis — hanya teks & gambar' },
  { aspect: 'Ramah Lingkungan', digital: 'Tanpa kertas, hemat & hijau', cetak: 'Boros kertas' },
  { aspect: 'Revisi', digital: 'Mudah diubah kapan saja', cetak: 'Harus cetak ulang' },
]

// GANTI dengan testimoni asli klien Lavelle setelah tersedia.
const testimonials = [
  { name: 'Kayla & Raka', role: 'Menikah Desember 2026', photo: 'pasangan-pose-romantis', stars: 5,
    text: 'Undangannya cantik banget, semua tamu sampai muji! Prosesnya cepat dan adminnya sabar bantuin kami dari nol sampai jadi.' },
  { name: 'Anindya & Bima', role: 'Menikah Februari 2027', photo: 'pasangan-candid', stars: 5,
    text: 'Desainnya persis seperti yang kami mau — elegan dan mewah. Fitur RSVP-nya ngebantu banget ngatur tamu. Sangat direkomendasikan!' },
  { name: 'Kirana & Arsa', role: 'Menikah Juni 2027', photo: 'pasangan-tatapan-dekat', stars: 5,
    text: 'Suka banget hasilnya. Amplop digitalnya praktis, buku ucapannya bikin haru. Terima kasih Lavelle sudah bikin hari kami makin berkesan.' },
]

// Demo: kategori tab + carousel (biar tidak menumpuk)
const demoCats = [
  { key: 'adat', label: 'Adat Nusantara', icon: 'fa-landmark' },
  { key: 'klasik', label: 'Klasik & Romantis', icon: 'fa-heart' },
  { key: 'modern', label: 'Modern', icon: 'fa-wand-magic-sparkles' },
]
const demoCategory = {
  minang: 'adat', jawa: 'adat', sunda: 'adat', bugis: 'adat',
  luxe: 'klasik', klasik: 'klasik',
  modern: 'modern', sinema: 'modern', modern3d: 'modern',
}
const activeCat = ref('adat')
const filteredDemos = computed(() => demos.filter((d) => demoCategory[d.key] === activeCat.value))
const countCat = (k) => demos.filter((d) => demoCategory[d.key] === k).length
const track = ref(null)
const setCat = (k) => { activeCat.value = k; nextTick(() => track.value && track.value.scrollTo({ left: 0 })) }
const scrollDemos = (dir) => {
  const el = track.value
  if (!el) return
  const card = el.querySelector('.demo--slide')
  const w = card ? card.offsetWidth + 20 : 340
  el.scrollBy({ left: dir * w, behavior: 'smooth' })
}

// Lightbox galeri
const lightbox = ref(-1)
const openLightbox = (i) => { lightbox.value = i }
const closeLightbox = () => { lightbox.value = -1 }
const nextShot = () => { lightbox.value = (lightbox.value + 1) % gallery.length }
const prevShot = () => { lightbox.value = (lightbox.value - 1 + gallery.length) % gallery.length }
const onKey = (e) => {
  if (lightbox.value < 0) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowRight') nextShot()
  else if (e.key === 'ArrowLeft') prevShot()
}
onMounted(() => {
  document.addEventListener('keydown', onKey)
  // Count-up harga saat section #paket terlihat
  if (typeof IntersectionObserver !== 'undefined') {
    const el = document.getElementById('paket')
    if (el) {
      pBasic.value = 0; pPrem.value = 0; pEks.value = 0
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            countTo(99, pBasic, 1200)
            countTo(249, pPrem, 1450)
            countTo(549, pEks, 1650)
            io.disconnect()
          }
        })
      }, { threshold: 0.35 })
      io.observe(el)
    }
  }
})
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <PreLoader />
  <FloatingHearts />
  <SiteNav />

  <!-- HERO -->
  <section class="hero" id="home">
    <div class="hero__bg" style="background-image:url('/img/mentahan/pasangan-bukit-sunset.jpeg')"></div>
    <div class="hero__scrim"></div>
    <div class="container hero__inner">
      <p class="eyebrow reveal"><span></span> Undangan Pernikahan Digital <span></span></p>
      <h1 class="hero__title reveal">Rangkai kisah cintamu<br>dalam undangan yang <em>elegan</em>.</h1>
      <p class="hero__sub reveal">Undangan pernikahan digital yang mewah, personal, dan berkelas —
        lengkap dengan RSVP, buku ucapan, galeri, hingga amplop digital. Cukup satu link untuk seluruh tamu undanganmu.</p>
      <div class="hero__cta reveal">
        <a href="#tema" class="btn btn--gold">Lihat Tema</a>
        <a href="#paket" class="btn btn--ghost">Paket &amp; Harga</a>
      </div>
      <div class="hero__meta reveal">
        <div><strong>6</strong><span>Tema Premium</span></div>
        <div class="hero__meta-sep" aria-hidden="true"></div>
        <div><strong>&infin;</strong><span>Tamu Undangan</span></div>
        <div class="hero__meta-sep" aria-hidden="true"></div>
        <div><strong>1&ndash;3</strong><span>Hari Pengerjaan</span></div>
      </div>
    </div>
    <a class="hero__scroll" href="#tema" aria-label="Gulir ke bawah"><span></span></a>
  </section>

  <!-- TRUST STRIP -->
  <div class="strip">
    <div class="strip__track">
      <template v-for="n in 2" :key="n">
        <template v-for="s in strip" :key="s + n"><span>{{ s }}</span><i>&#10022;</i></template>
      </template>
    </div>
  </div>

  <!-- VALUE PROPS -->
  <div class="vprops">
    <div class="container">
      <div class="vprops__grid reveal">
        <div v-for="v in valueProps" :key="v.label" class="vprop">
          <i :class="`fa-solid ${v.icon} vprop__icon`"></i>
          <div class="vprop__value">{{ v.value }}</div>
          <div class="vprop__label">{{ v.label }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- KATALOG TEMA — phone mockup -->
  <HomeThemeCatalog />

  <!-- KEUNGGULAN -->
  <section class="section" id="keunggulan">
    <div class="container">
      <div class="section__head reveal">
        <p class="eyebrow"><span></span> Kenapa Lavelle</p>
        <h2 class="section__title">Semua yang kamu butuhkan untuk<br>hari istimewamu</h2>
      </div>
      <div class="grid grid--3">
        <article v-for="f in features" :key="f.title" class="card reveal">
          <i :class="`fa-solid ${f.icon} card__icon`"></i>
          <h3>{{ f.title }}</h3>
          <p>{{ f.text }}</p>
        </article>
      </div>
    </div>
  </section>

  <!-- PERBANDINGAN DIGITAL vs CETAK -->
  <section class="section section--alt" id="perbandingan">
    <div class="container container--narrow">
      <div class="section__head reveal">
        <p class="eyebrow"><span></span> Kenapa Digital</p>
        <h2 class="section__title">Undangan digital vs cetak</h2>
        <p class="section__desc">Lebih hemat, lebih cepat, dan jauh lebih kaya fitur — tanpa mengurangi kesan elegan.</p>
      </div>
      <div class="compare-wrap reveal">
        <table class="compare">
          <thead>
            <tr>
              <th class="aspect-h">Aspek</th>
              <th class="col-digital"><span>Digital <em class="tag">Lavelle</em></span></th>
              <th class="col-cetak">Cetak Konvensional</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in compare" :key="c.aspect">
              <td class="aspect">{{ c.aspect }}</td>
              <td class="col-digital"><i class="fa-solid fa-circle-check"></i>{{ c.digital }}</td>
              <td class="col-cetak"><i class="fa-solid fa-circle-xmark"></i>{{ c.cetak }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- GALERI -->
  <section class="section section--alt" id="galeri">
    <div class="container">
      <div class="section__head reveal">
        <p class="eyebrow"><span></span> Galeri Inspirasi <span></span></p>
        <h2 class="section__title">Momen yang ingin kamu kenang</h2>
        <p class="section__desc">Setiap undangan Lavelle dirancang untuk membingkai keindahan hari bahagiamu — hangat,
          natural, dan penuh rasa.</p>
      </div>
      <div class="moodboard">
        <div v-for="(g, i) in gallery" :key="g" class="shot reveal" role="button" tabindex="0"
          aria-label="Perbesar foto" @click="openLightbox(i)" @keydown.enter="openLightbox(i)">
          <img :src="`/img/mentahan/${g}.jpeg`" alt="Inspirasi undangan pernikahan Lavelle" loading="lazy">
          <span class="shot__zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
        </div>
      </div>
    </div>
  </section>

  <!-- DEMO -->
  <section class="section section--alt" id="demo">
    <div class="container">
      <div class="section__head reveal">
        <p class="eyebrow"><span></span> Lihat Demo</p>
        <h2 class="section__title">Contoh undangan yang bisa kamu pilih</h2>
        <p class="section__desc">Klik untuk melihat tampilan undangan secara langsung. Setiap desain dapat
          dikustomisasi sesuai keinginanmu.</p>
      </div>
      <div class="demo-tabs reveal">
        <button v-for="c in demoCats" :key="c.key" class="demo-tab" :class="{ 'is-active': activeCat === c.key }"
          @click="setCat(c.key)">
          <i :class="`fa-solid ${c.icon}`"></i> {{ c.label }} <span>{{ countCat(c.key) }}</span>
        </button>
      </div>
      <div class="demo-carousel reveal">
        <button class="demo-arrow demo-arrow--prev" aria-label="Sebelumnya" @click="scrollDemos(-1)">
          <i class="fa-solid fa-chevron-left"></i></button>
        <div class="demo-track" ref="track">
          <article v-for="d in filteredDemos" :key="d.key" class="demo demo--slide" :class="d.cardClass">
            <div class="demo__thumb" :class="d.thumb">
              <div class="mk" :class="d.frame">
                <span class="mk__kicker">The Wedding Of</span>
                <h4 class="mk__names">{{ d.names }}</h4>
                <span class="mk__date">{{ d.date }}</span>
                <span class="mk__btn">{{ d.btn }}</span>
              </div>
              <span class="demo__tag">{{ d.tag }}</span>
            </div>
            <div class="demo__body">
              <h3>{{ d.title }}<em v-if="d.flag" class="demo__flag">{{ d.flag }}</em></h3>
              <p>{{ d.desc }}</p>
              <a :href="d.href" class="link">Lihat Demo <i class="fa-solid fa-arrow-right-long"></i></a>
            </div>
          </article>
        </div>
        <button class="demo-arrow demo-arrow--next" aria-label="Berikutnya" @click="scrollDemos(1)">
          <i class="fa-solid fa-chevron-right"></i></button>
      </div>
      <p class="demo-hint reveal"><i class="fa-solid fa-arrows-left-right"></i> Geser untuk melihat lebih banyak</p>
      <p class="demo__note reveal"><i class="fa-regular fa-circle-question"></i> Punya referensi desain sendiri?
        Kirim ke kami, tim Lavelle siap mewujudkannya.</p>
      <div style="text-align:center; margin-top:1.8rem;" class="reveal">
        <a href="/demo/" class="btn btn--gold">Lihat Semua Demo</a>
      </div>
    </div>
  </section>

  <!-- PAKET -->
  <section class="section" id="paket">
    <div class="container">
      <div class="section__head reveal">
        <p class="eyebrow"><span></span> Paket &amp; Harga</p>
        <h2 class="section__title">Pilih paket yang paling pas</h2>
        <p class="section__desc">Harga jujur, tanpa biaya tersembunyi. Semua paket sudah termasuk link undangan aktif
          &amp; bimbingan pengisian data.</p>
      </div>
      <div class="grid grid--3 pricing">
        <article class="plan reveal">
          <h3 class="plan__name">Basic</h3>
          <p class="plan__for">Sederhana &amp; tetap manis</p>
          <div class="plan__price"><span>Rp</span>{{ pBasic }}<small>rb</small></div>
          <ul class="plan__list">
            <li><i class="fa-solid fa-check"></i> 1 link undangan digital</li>
            <li><i class="fa-solid fa-check"></i> Foto &amp; data mempelai</li>
            <li><i class="fa-solid fa-check"></i> Detail acara &amp; countdown</li>
            <li><i class="fa-solid fa-check"></i> Lokasi + Google Maps</li>
            <li><i class="fa-solid fa-check"></i> Musik latar</li>
            <li class="muted"><i class="fa-solid fa-xmark"></i> RSVP &amp; buku ucapan</li>
            <li class="muted"><i class="fa-solid fa-xmark"></i> Amplop digital</li>
          </ul>
          <a href="#kontak" class="btn btn--outline btn--block" @click.prevent="openPlan('Basic')">Pilih Basic</a>
        </article>

        <article class="plan plan--featured reveal">
          <span class="plan__badge">Paling Diminati</span>
          <h3 class="plan__name">Premium</h3>
          <p class="plan__for">Lengkap untuk hari spesial</p>
          <div class="plan__price"><span>Rp</span>{{ pPrem }}<small>rb</small></div>
          <ul class="plan__list">
            <li><i class="fa-solid fa-check"></i> Semua fitur paket Basic</li>
            <li><i class="fa-solid fa-check"></i> RSVP kehadiran otomatis</li>
            <li><i class="fa-solid fa-check"></i> Buku ucapan &amp; doa</li>
            <li><i class="fa-solid fa-check"></i> Galeri foto &amp; cerita cinta</li>
            <li><i class="fa-solid fa-check"></i> Amplop digital (transfer/QRIS)</li>
            <li><i class="fa-solid fa-check"></i> 2x revisi desain</li>
          </ul>
          <a href="#kontak" class="btn btn--gold btn--block" @click.prevent="openPlan('Premium')">Pilih Premium</a>
        </article>

        <article class="plan plan--dark reveal">
          <h3 class="plan__name">Eksklusif</h3>
          <p class="plan__for">Desain custom, tanpa batas</p>
          <div class="plan__price"><span>Rp</span>{{ pEks }}<small>rb</small></div>
          <ul class="plan__list">
            <li><i class="fa-solid fa-check"></i> Semua fitur paket Premium</li>
            <li><i class="fa-solid fa-check"></i> Desain custom sesuai tema</li>
            <li><i class="fa-solid fa-check"></i> Domain pribadi .my.id (aktif 1 tahun)</li>
            <li><i class="fa-solid fa-check"></i> Revisi tanpa batas</li>
            <li><i class="fa-solid fa-check"></i> Link live streaming akad</li>
            <li><i class="fa-solid fa-check"></i> Prioritas pengerjaan &amp; support</li>
          </ul>
          <a href="#kontak" class="btn btn--gold btn--block" @click.prevent="openPlan('Eksklusif')">Pilih Eksklusif</a>
        </article>
      </div>
      <p class="pricing__note reveal">* Harga dapat disesuaikan dengan kebutuhan. Hubungi kami untuk konsultasi gratis.</p>
    </div>
  </section>

  <!-- ULASAN / TESTIMONI -->
  <section class="section section--alt" id="ulasan">
    <div class="container">
      <div class="section__head reveal">
        <p class="eyebrow"><span></span> Ulasan Klien <span></span></p>
        <h2 class="section__title">Cerita bahagia dari mereka</h2>
        <p class="section__desc">Kepercayaan pasangan yang telah mempercayakan hari istimewanya kepada Lavelle.</p>
      </div>
      <div class="tgrid">
        <figure v-for="t in testimonials" :key="t.name" class="tcard reveal">
          <span class="tcard__quote">&ldquo;</span>
          <div class="tcard__stars" :aria-label="`${t.stars} dari 5 bintang`">
            <i v-for="s in t.stars" :key="s" class="fa-solid fa-star"></i>
          </div>
          <blockquote class="tcard__text">{{ t.text }}</blockquote>
          <figcaption class="tcard__author">
            <img :src="`/img/mentahan/${t.photo}.jpeg`" :alt="t.name" loading="lazy">
            <div>
              <div class="tcard__name">{{ t.name }}</div>
              <div class="tcard__role">{{ t.role }}</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>

  <!-- CARA PESAN -->
  <section class="section section--alt" id="cara-pesan">
    <div class="container">
      <div class="section__head reveal">
        <p class="eyebrow"><span></span> Mudah &amp; Cepat</p>
        <h2 class="section__title">4 langkah menuju undanganmu</h2>
      </div>
      <div class="steps">
        <div v-for="s in steps" :key="s.num" class="step reveal">
          <span class="step__num">{{ s.num }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ABOUT -->
  <section class="section about" id="tentang">
    <div class="container about__inner">
      <div class="about__text reveal">
        <p class="eyebrow"><span></span> Tentang Lavelle</p>
        <h2 class="section__title">Nama yang lahir dari keindahan</h2>
        <p>Nama <strong>Lavelle</strong> berakar dari bahasa Prancis — terdengar lembut, anggun, dan berkelas. Kami
          memilihnya karena setiap pernikahan adalah karya seni: penuh keindahan, cinta, dan momen yang layak dikenang
          selamanya.</p>
        <p>Lavelle hadir untuk merangkai kisah cintamu menjadi undangan digital yang elegan — bukan sekadar link, tapi
          kesan pertama yang istimewa untuk setiap tamu undanganmu.</p>
        <a href="#kontak" class="btn btn--gold">Mulai Konsultasi</a>
      </div>
      <div class="about__deco reveal">
        <img class="about__photo" src="/img/mentahan/potret-estetik.jpeg" alt="Momen pernikahan" loading="lazy">
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="section section--alt" id="faq">
    <div class="container container--narrow">
      <div class="section__head reveal">
        <p class="eyebrow"><span></span> Pertanyaan Umum</p>
        <h2 class="section__title">Hal yang sering ditanyakan</h2>
      </div>
      <div class="faq">
        <details v-for="f in faqs" :key="f.q" class="faq__item reveal">
          <summary>{{ f.q }}</summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta" id="kontak" style="background-image:url('/img/mentahan/pasangan-outdoor-2.jpeg')">
    <div class="container cta__inner reveal">
      <p class="eyebrow eyebrow--light"><span></span> Mulai Bersama Lavelle <span></span></p>
      <h2>Mari wujudkan undangan impianmu.</h2>
      <p class="cta__sub">Konsultasi gratis, tanpa kewajiban. Ceritakan rencana pernikahanmu, dan biarkan kami merangkai
        sisanya.</p>
      <div class="cta__btns">
        <a :href="wa(WA_1)" class="btn btn--gold btn--lg" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp"></i> Chat Admin 1</a>
        <a :href="wa(WA_2)" class="btn btn--gold btn--lg" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp"></i> Chat Admin 2</a>
        <a :href="IG" class="btn btn--ghost btn--lg" target="_blank" rel="noopener">
          <i class="fa-brands fa-instagram"></i> Lavelle</a>
      </div>
    </div>
  </section>

  <SiteFooter />
  <WhatsappFloat />

  <!-- LIGHTBOX GALERI -->
  <transition name="lb">
    <div v-if="lightbox >= 0" class="lightbox" @click.self="closeLightbox">
      <img class="lightbox__img" :src="`/img/mentahan/${gallery[lightbox]}.jpeg`"
        :alt="`Inspirasi undangan ${lightbox + 1}`">
      <button class="lightbox__btn lightbox__close" aria-label="Tutup" @click="closeLightbox">
        <i class="fa-solid fa-xmark"></i></button>
      <button class="lightbox__btn lightbox__prev" aria-label="Foto sebelumnya" @click.stop="prevShot">
        <i class="fa-solid fa-chevron-left"></i></button>
      <button class="lightbox__btn lightbox__next" aria-label="Foto berikutnya" @click.stop="nextShot">
        <i class="fa-solid fa-chevron-right"></i></button>
      <span class="lightbox__count">{{ lightbox + 1 }} / {{ gallery.length }}</span>
    </div>
  </transition>
</template>
