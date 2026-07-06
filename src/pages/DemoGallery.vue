<script setup>
import { useHead } from '@unhead/vue'
import { demos } from '../data/site'
import SiteNav from '../components/SiteNav.vue'
import SiteFooter from '../components/SiteFooter.vue'
import WhatsappFloat from '../components/WhatsappFloat.vue'

useHead({
  title: 'Galeri Demo Undangan Digital — Lavelle',
  link: [{ rel: 'canonical', href: 'https://lavelle.my.id/demo/' }],
  meta: [
    { name: 'description', content: 'Lihat semua contoh desain undangan pernikahan digital Lavelle — tema adat Nusantara (Minang, Jawa, Sunda, Bugis), klasik romantis, hingga modern interaktif.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Galeri Demo Undangan Digital — Lavelle' },
    { property: 'og:description', content: 'Semua contoh desain undangan pernikahan digital Lavelle — adat, klasik, hingga modern.' },
    { property: 'og:url', content: 'https://lavelle.my.id/demo/' },
    { property: 'og:image', content: 'https://lavelle.my.id/img/mentahan/pasangan-outdoor-4.jpeg' },
  ],
})

const groups = [
  { key: 'adat', label: 'Adat Nusantara', heading: 'Undangan Adat Nusantara', desc: 'Bernuansa adat dengan ornamen khas tiap suku dan slot karikatur pasangan — dibangun interaktif berbasis Vue.', keys: ['minang', 'jawa', 'sunda', 'bugis'] },
  { key: 'klasik', label: 'Klasik & Romantis', heading: 'Klasik & Romantis', desc: 'Hangat, elegan, dan timeless — cocok untuk pernikahan adat maupun modern.', keys: ['luxe', 'klasik'] },
  { key: 'modern', label: 'Modern', heading: 'Modern & Sinematik', desc: 'Mewah, minimalis, hingga pengalaman 3D interaktif berbasis WebGL.', keys: ['modern', 'sinema', 'modern3d'] },
]
const byKey = Object.fromEntries(demos.map((d) => [d.key, d]))
const grouped = groups.map((g) => ({ ...g, items: g.keys.map((k) => byKey[k]).filter(Boolean) }))
</script>

<template>
  <SiteNav />

  <section class="demo-hero" style="background-image:url('/img/mentahan/pasangan-outdoor-4.jpeg')">
    <div class="demo-hero__scrim"></div>
    <div class="container demo-hero__inner">
      <p class="eyebrow eyebrow--light"><span></span> Galeri Demo <span></span></p>
      <h1>Semua desain undangan Lavelle</h1>
      <p>Klik <strong>Lihat Demo</strong> untuk membuka undangan secara langsung. Setiap desain dapat disesuaikan
        tema, warna, dan cerita kalian — bahkan nama tamu tampil otomatis.</p>
      <a href="/#kontak" class="btn btn--gold" style="margin-top:1.6rem">Konsultasi Gratis</a>
    </div>
  </section>

  <section v-for="(g, i) in grouped" :key="g.key" class="section" :class="{ 'section--alt': i % 2 === 1 }" :id="g.key">
    <div class="container">
      <div class="section__head reveal">
        <p class="eyebrow"><span></span> {{ g.label }}</p>
        <h2 class="section__title">{{ g.heading }}</h2>
        <p class="section__desc">{{ g.desc }}</p>
      </div>
      <div class="grid grid--3">
        <article v-for="d in g.items" :key="d.key" class="demo reveal" :class="d.cardClass">
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
    </div>
  </section>

  <section class="cta" id="kontak" style="background-image:url('/img/mentahan/pasangan-outdoor-2.jpeg')">
    <div class="container cta__inner reveal">
      <p class="eyebrow eyebrow--light"><span></span> Punya Referensi Sendiri? <span></span></p>
      <h2>Wujudkan undangan impianmu.</h2>
      <p class="cta__sub">Kirim referensi desain atau ceritakan konsepmu — tim Lavelle siap merangkainya jadi undangan digital yang istimewa.</p>
      <div class="cta__btns">
        <a href="/#paket" class="btn btn--gold btn--lg">Lihat Paket &amp; Harga</a>
        <a href="/" class="btn btn--ghost btn--lg">Kembali ke Beranda</a>
      </div>
    </div>
  </section>

  <SiteFooter />
  <WhatsappFloat />
</template>
