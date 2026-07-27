<script setup>
// TEMPLATE SINEMA — renderer undangan BERBASIS DATA (committable, versi portal).
// Digeneralisasi dari DemoClient001Opsi5.vue: data via prop `data`, warna via `theme`.
// Foto = URL penuh (object URL / URL storage), bukan nama file. Komponen royale/* dipakai ulang.
// prop preview=true → lewati gerbang, tanpa autoplay & tanpa motion GSAP (aman di panel builder).
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { wireReveal } from '../../composables/useReveal'
import { useSinemaTemplate } from '../composables/useSinemaTemplate'
import { mergeInvite } from '../data/schema'
import { themeVars, THEME_IDS } from '../data/themes'
import '../../assets/royale.css'
import '../assets/sinema-template.css'
import Ornament from './Ornament.vue'

import EnvelopeGate from '../../components/royale/EnvelopeGate.vue'
import ScrollProgress from '../../components/royale/ScrollProgress.vue'
import MusicPlayer from '../../components/royale/MusicPlayer.vue'
import EventDetails from '../../components/royale/EventDetails.vue'
import DressCode from '../../components/royale/DressCode.vue'
import GallerySection from '../../components/royale/GallerySection.vue'
import RsvpForm from '../../components/royale/RsvpForm.vue'
import DigitalEnvelope from '../../components/royale/DigitalEnvelope.vue'
import WishesFeed from '../../components/royale/WishesFeed.vue'
import FamilySection from '../../components/royale/FamilySection.vue'
import QuickNav from '../../components/royale/QuickNav.vue'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  theme: { type: String, default: THEME_IDS[0] },
  preview: { type: Boolean, default: false },
})

const root = ref(null)
const r = computed(() => mergeInvite(props.data))
const style = computed(() => themeVars(props.theme))
const skipGate = computed(() => props.preview)
const initials = computed(() => `${r.value.hero.bride[0] || '?'} & ${r.value.hero.groom[0] || '?'}`)
const coupleTitle = computed(() => `Pernikahan ${r.value.hero.bride} & ${r.value.hero.groom}`)
const coupleNames = computed(() => `${r.value.hero.bride} & ${r.value.hero.groom}`)
const brideChars = computed(() => [...(r.value.hero.bride || '')])
const groomChars = computed(() => [...(r.value.hero.groom || '')])
const musicRef = ref(null)
let stopSinema = () => {}

const cd = ref({ d: 0, h: 0, m: 0, s: 0 })
const pad = (n) => String(n).padStart(2, '0')
let timer = null
function tick() {
  const target = new Date(`${r.value.hero.date}T08:00:00+07:00`).getTime()
  let diff = Math.max(0, (isNaN(target) ? Date.now() : target) - Date.now())
  const d = Math.floor(diff / 86400000); diff -= d * 86400000
  const h = Math.floor(diff / 3600000); diff -= h * 3600000
  const m = Math.floor(diff / 60000); diff -= m * 60000
  cd.value = { d, h, m, s: Math.floor(diff / 1000) }
}

function onOpened() {
  if (musicRef.value) musicRef.value.play()
  nextTick(() => wireReveal(root.value || document))
}

onMounted(() => {
  tick(); timer = setInterval(tick, 1000)
  nextTick(() => {
    wireReveal(root.value || document)
    stopSinema = useSinemaTemplate(root.value)   // motion penuh (di iframe preview pun aman: punya scroll sendiri)
  })
})
onUnmounted(() => { clearInterval(timer); stopSinema() })
</script>

<template>
  <div class="invite-sinema" ref="root" :style="style">
    <EnvelopeGate v-if="!skipGate" :bride="r.hero.bride" :groom="r.hero.groom" :date-text="r.hero.dateText"
                  :guest="'Tamu Undangan'" :initials="initials" @opened="onOpened" />
    <ScrollProgress />
    <MusicPlayer v-if="r.music.src" ref="musicRef" :src="r.music.src" :start="r.music.start" />

    <!-- HERO sinematik -->
    <section class="sn-hero" id="atas">
      <div class="sn-hero__bg" :style="{ backgroundImage: `url(${r.hero.photo})` }" aria-hidden="true"></div>
      <div class="sn-hero__photo" :style="{ backgroundImage: `url(${r.hero.photo})` }"></div>
      <div class="sn-hero__scrim"></div>
      <div class="sn-hero__inner">
        <p class="sn-hero__kicker sn-hero__meta">{{ r.hero.kicker }}</p>
        <h1 class="sn-hero__names">
          <span class="sn-hero__line"><span v-for="(c, i) in brideChars" :key="'b' + i" class="sn-char" :style="{ '--i': i }">{{ c }}</span></span>
          <span class="sn-hero__amp">&amp;</span>
          <span class="sn-hero__line"><span v-for="(c, i) in groomChars" :key="'g' + i" class="sn-char" :style="{ '--i': brideChars.length + 1 + i }">{{ c }}</span></span>
        </h1>
        <p class="sn-hero__date sn-hero__meta">{{ r.hero.dateText }}</p>
        <div class="sn-hero__cd sn-hero__meta">
          <div><b>{{ cd.d }}</b><span>Hari</span></div>
          <div><b>{{ pad(cd.h) }}</b><span>Jam</span></div>
          <div><b>{{ pad(cd.m) }}</b><span>Menit</span></div>
          <div><b>{{ pad(cd.s) }}</b><span>Detik</span></div>
        </div>
      </div>
      <span class="sn-hero__scroll">Gulir</span>
    </section>

    <!-- QUOTE -->
    <section class="sn-quote" id="pembuka">
      <p class="sn-quote__t sn-reveal">{{ r.quote.text }}</p>
      <Ornament kind="divider" class="sn-quote__orn sn-reveal" />
      <span class="sn-quote__r sn-reveal">{{ r.quote.ref }}</span>
    </section>

    <!-- COUPLE -->
    <section class="sn-couple" id="mempelai">
      <div class="sn-couple__grid">
        <div class="sn-person sn-slide-l">
          <div class="sn-person__ph"><img :src="r.bride.photo" :alt="r.bride.name" loading="lazy"></div>
          <h3 class="sn-person__name">{{ r.bride.name }}</h3>
          <p class="sn-person__role">{{ r.bride.role }}</p>
          <p class="sn-person__parents">{{ r.bride.parents }}</p>
        </div>
        <div class="sn-person sn-slide-r">
          <div class="sn-person__ph"><img :src="r.groom.photo" :alt="r.groom.name" loading="lazy"></div>
          <h3 class="sn-person__name">{{ r.groom.name }}</h3>
          <p class="sn-person__role">{{ r.groom.role }}</p>
          <p class="sn-person__parents">{{ r.groom.parents }}</p>
        </div>
      </div>
    </section>

    <!-- STORY horizontal ter-pin -->
    <section class="sn-story" id="cerita">
      <div class="sn-story__head">
        <p class="sn-story__kicker">Perjalanan Kami</p>
        <h2 class="sn-story__title">Kisah Cinta</h2>
        <Ornament kind="divider" class="sn-story__orn" />
      </div>
      <div class="sn-story__track">
        <article v-for="(s, i) in r.story" :key="i" class="sn-story__panel">
          <div class="sn-story__ph"><img :src="s.photo" :alt="s.title" loading="lazy"></div>
          <div class="sn-story__year">{{ s.year }}</div>
          <h3 class="sn-story__name">{{ s.title }}</h3>
          <p class="sn-story__desc">{{ s.desc }}</p>
        </article>
      </div>
      <div class="sn-story__hint">&larr; Gulir untuk menyusuri kisah &rarr;</div>
    </section>

    <!-- Section fungsional (royale) -->
    <EventDetails :events="r.events" :maps-query="r.mapsQuery" :date="r.hero.date" :couple-title="coupleTitle" />
    <DressCode :dress="r.dressCode" />
    <GallerySection :items="r.gallery" :cats="r.galleryCats" :all-items="r.galleryFull" />
    <DigitalEnvelope :gifts="r.gifts" :qris="r.qris" :wa-confirm="r.giftConfirmWa" :couple-names="coupleNames" />
    <RsvpForm :api="''" />
    <WishesFeed :seed="[]" :api="''" />
    <FamilySection :family="r.family" />

    <!-- CLOSING -->
    <section class="sn-closing" id="penutup">
      <div class="sn-closing__photo" :style="{ backgroundImage: `url(${r.closing.photo || r.hero.photo})` }"></div>
      <div class="sn-closing__scrim"></div>
      <div class="sn-closing__inner">
        <p class="sn-closing__q">{{ r.closing.quote }}</p>
        <span class="sn-closing__r">{{ r.closing.ref }}</span>
        <div class="sn-closing__sign">{{ r.closing.signoff || coupleNames }}</div>
        <p class="sn-closing__thanks">Terima kasih atas doa &amp; restu Anda.</p>
      </div>
    </section>

    <QuickNav />
  </div>
</template>
