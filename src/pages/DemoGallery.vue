<script setup>
import { ref, computed } from 'vue'
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

const demoCategory = {
  minang: 'adat', jawa: 'adat', sunda: 'adat', bugis: 'adat',
  luxe: 'klasik', klasik: 'klasik',
  modern: 'modern', sinema: 'modern', modern3d: 'modern',
}
const cats = [
  { key: 'all', label: 'Semua', icon: 'fa-border-all' },
  { key: 'adat', label: 'Adat Nusantara', icon: 'fa-landmark' },
  { key: 'klasik', label: 'Klasik & Romantis', icon: 'fa-heart' },
  { key: 'modern', label: 'Modern', icon: 'fa-wand-magic-sparkles' },
]
const active = ref('all')
const filtered = computed(() => active.value === 'all' ? demos : demos.filter((d) => demoCategory[d.key] === active.value))
const countCat = (k) => k === 'all' ? demos.length : demos.filter((d) => demoCategory[d.key] === k).length
</script>

<template>
  <SiteNav />

  <section class="demo-hero demo-hero--slim" style="background-image:url('/img/mentahan/pasangan-outdoor-4.jpeg')">
    <div class="demo-hero__scrim"></div>
    <div class="container demo-hero__inner">
      <p class="eyebrow eyebrow--light"><span></span> Galeri Demo <span></span></p>
      <h1>Semua desain undangan Lavelle</h1>
      <p>Klik <strong>Lihat Demo</strong> untuk membuka undangan langsung. Semua desain dapat disesuaikan tema, warna,
        dan cerita kalian — bahkan nama tamu tampil otomatis.</p>
    </div>
  </section>

  <section class="section demo-gallery">
    <div class="container">
      <div class="demo-tabs">
        <button v-for="c in cats" :key="c.key" class="demo-tab" :class="{ 'is-active': active === c.key }"
          @click="active = c.key">
          <i :class="`fa-solid ${c.icon}`"></i> {{ c.label }} <span>{{ countCat(c.key) }}</span>
        </button>
      </div>

      <div class="grid grid--3 demo-grid">
        <article v-for="d in filtered" :key="d.key" class="demo demo--compact" :class="d.cardClass">
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

      <p class="demo__note" style="margin-top:2.6rem">
        <i class="fa-regular fa-circle-question"></i> Punya referensi desain sendiri, atau ingin suku adat lain?
        <a href="/#kontak" class="link" style="display:inline-flex">Hubungi kami <i class="fa-solid fa-arrow-right-long"></i></a>
      </p>
    </div>
  </section>

  <SiteFooter />
  <WhatsappFloat />
</template>
