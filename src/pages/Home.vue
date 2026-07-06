<script setup>
import { useHead } from '@unhead/vue'
import { wa, waPlan, WA_1, WA_2, IG } from '../data/site'
import { demos } from '../data/site'
import PreLoader from '../components/PreLoader.vue'
import FloatingHearts from '../components/FloatingHearts.vue'
import SiteNav from '../components/SiteNav.vue'
import SiteFooter from '../components/SiteFooter.vue'
import WhatsappFloat from '../components/WhatsappFloat.vue'

const openPlan = (plan) => window.open(waPlan(plan), '_blank')

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
</script>

<template>
  <PreLoader />
  <FloatingHearts />
  <SiteNav />

  <!-- HERO -->
  <section class="hero" id="home" style="background-image:url('/img/mentahan/pasangan-bukit-sunset.jpeg')">
    <div class="hero__scrim"></div>
    <div class="container hero__inner">
      <p class="eyebrow reveal"><span></span> Undangan Pernikahan Digital <span></span></p>
      <h1 class="hero__title reveal">Undangan pernikahan digital<br>yang <em>elegan</em>.</h1>
      <p class="hero__sub reveal">Lavelle membuat undangan pernikahan digital yang mewah, personal, dan berkelas —
        lengkap dengan RSVP, buku ucapan, galeri, hingga amplop digital. Cukup satu link untuk seluruh tamu undanganmu.</p>
      <div class="hero__cta reveal">
        <a href="#paket" class="btn btn--gold">Lihat Paket &amp; Harga</a>
        <a href="#demo" class="btn btn--ghost">Lihat Demo</a>
      </div>
      <div class="hero__meta reveal">
        <div><strong>3</strong><span>Pilihan Paket</span></div>
        <div><strong>&infin;</strong><span>Tamu Undangan</span></div>
        <div><strong>1&ndash;3</strong><span>Hari Pengerjaan</span></div>
      </div>
    </div>
  </section>

  <!-- TRUST STRIP -->
  <div class="strip">
    <div class="strip__track">
      <template v-for="n in 2" :key="n">
        <template v-for="s in strip" :key="s + n"><span>{{ s }}</span><i>&#10022;</i></template>
      </template>
    </div>
  </div>

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
        <div v-for="g in gallery" :key="g" class="shot reveal">
          <img :src="`/img/mentahan/${g}.jpeg`" alt="Inspirasi" loading="lazy">
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
      <div class="grid grid--2">
        <article v-for="d in demos" :key="d.key" class="demo reveal" :class="d.cardClass">
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
          <div class="plan__price"><span>Rp</span>99<small>rb</small></div>
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
          <div class="plan__price"><span>Rp</span>249<small>rb</small></div>
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
          <div class="plan__price"><span>Rp</span>549<small>rb</small></div>
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
</template>
