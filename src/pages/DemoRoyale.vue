<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useHead } from '@unhead/vue'
import { useTheme } from '../composables/useTheme'
import { wireReveal } from '../composables/useReveal'
import { royale } from '../data/royale'
import '../assets/royale.css'

import EnvelopeGate from '../components/royale/EnvelopeGate.vue'
import ThemeSwitcher from '../components/royale/ThemeSwitcher.vue'
import MusicPlayer from '../components/royale/MusicPlayer.vue'
import HeroCover from '../components/royale/HeroCover.vue'
import CoupleProfile from '../components/royale/CoupleProfile.vue'
import LoveStory from '../components/royale/LoveStory.vue'
import EventDetails from '../components/royale/EventDetails.vue'
import GallerySection from '../components/royale/GallerySection.vue'
import RsvpForm from '../components/royale/RsvpForm.vue'
import DigitalEnvelope from '../components/royale/DigitalEnvelope.vue'
import WishesFeed from '../components/royale/WishesFeed.vue'
import ClosingSection from '../components/royale/ClosingSection.vue'

const { theme, styleVars, initTheme } = useTheme()
const r = royale

const guest = ref('Tamu Undangan')
const previewMode = ref(false)
const initials = computed(() => `${r.hero.bride[0]} & ${r.hero.groom[0]}`)
const coupleTitle = computed(() => `Pernikahan ${r.hero.bride} & ${r.hero.groom}`)
const namesText = computed(() => `${r.hero.bride} & ${r.hero.groom}`)
const musicSrc = '/demo/klasik/audio/until-i-found-you-violin.mp3'

const musicRef = ref(null)
const wishesRef = ref(null)

function onOpened() {
  if (musicRef.value) musicRef.value.play()
  nextTick(() => wireReveal(document))
}
function onRsvp(entry) {
  if (wishesRef.value) wishesRef.value.addWish(entry, true)
}

useHead({
  title: 'Royale — Undangan Premium Multi-Tema | Lavelle',
  meta: [
    { name: 'robots', content: 'noindex' },
    { name: 'description', content: 'Undangan pernikahan digital premium dengan 6 tema yang bisa diganti seketika — Anindya & Rizky.' },
    { property: 'og:title', content: 'The Wedding of Anindya & Rizky' },
    { property: 'og:description', content: 'Undangan pernikahan digital premium Lavelle — 6 tema, foto, musik, dan RSVP.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: 'https://lavelle.my.id/img/mentahan/pasangan-utama.jpeg' },
  ],
})

onMounted(() => {
  initTheme()
  try {
    const params = new URLSearchParams(location.search)
    const q = params.get('to')
    if (q) guest.value = decodeURIComponent(q.replace(/\+/g, ' '))
    if (params.get('preview') === '1') previewMode.value = true
  } catch { /* diabaikan */ }
  nextTick(() => wireReveal(document))
})
</script>

<template>
  <div class="royale" :class="[`is-${theme.mode}`, `t-${theme.id}`, { 'is-preview': previewMode }]" :style="styleVars">
    <EnvelopeGate :bride="r.hero.bride" :groom="r.hero.groom" :date-text="r.hero.dateText"
                  :guest="guest" :initials="initials" @opened="onOpened" />

    <ThemeSwitcher />
    <MusicPlayer ref="musicRef" :src="musicSrc" />

    <HeroCover v-bind="r.hero" />
    <CoupleProfile :bride="r.bride" :groom="r.groom" />
    <LoveStory :story="r.story" />
    <EventDetails :events="r.events" :maps-query="r.mapsQuery" :date="r.hero.date" :couple-title="coupleTitle" />
    <GallerySection :items="r.gallery" :cats="r.galleryCats" />
    <RsvpForm @submitted="onRsvp" />
    <DigitalEnvelope :gifts="r.gifts" />
    <WishesFeed ref="wishesRef" :seed="r.wishesSeed" />
    <ClosingSection :closing="r.closing" :photo="r.hero.photo" :names="namesText" :date-text="r.hero.dateText" />
  </div>
</template>

<style scoped>
.royale {
  --font-display: 'Fraunces', serif; --font-serif: 'Cormorant Garamond', serif;
  --font-script: 'Pinyon Script', cursive; --font-sans: 'Jost', sans-serif;
  position: relative; min-height: 100vh; background: var(--bg); color: var(--ink);
  font-family: var(--font-sans); overflow-x: hidden;
  transition: background-color .5s ease, color .5s ease;
}
</style>
