<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useHead } from '@unhead/vue'
import { useTheme } from '../composables/useTheme'
import { wireReveal } from '../composables/useReveal'
import { royale } from '../data/royale'
import '../assets/royale.css'

import EnvelopeGate from '../components/royale/EnvelopeGate.vue'
import ScrollProgress from '../components/royale/ScrollProgress.vue'
import ThemeSwitcher from '../components/royale/ThemeSwitcher.vue'
import MusicPlayer from '../components/royale/MusicPlayer.vue'
import HeroCover from '../components/royale/HeroCover.vue'
import OpeningSection from '../components/royale/OpeningSection.vue'
import CoupleProfile from '../components/royale/CoupleProfile.vue'
import LoveStory from '../components/royale/LoveStory.vue'
import EventDetails from '../components/royale/EventDetails.vue'
import DressCode from '../components/royale/DressCode.vue'
import LiveStream from '../components/royale/LiveStream.vue'
import GallerySection from '../components/royale/GallerySection.vue'
import RsvpForm from '../components/royale/RsvpForm.vue'
import DigitalEnvelope from '../components/royale/DigitalEnvelope.vue'
import WishesFeed from '../components/royale/WishesFeed.vue'
import FamilySection from '../components/royale/FamilySection.vue'
import ClosingSection from '../components/royale/ClosingSection.vue'
import QuickNav from '../components/royale/QuickNav.vue'

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

// ---- OG/meta per-undangan (data-driven, siap multi-klien per slug) ----
const SITE = 'https://lavelle.my.id'
const ogTitle = computed(() => `The Wedding of ${r.hero.bride} & ${r.hero.groom}`)
const ogDesc = computed(() => `Undangan pernikahan ${r.hero.bride} & ${r.hero.groom} — ${r.hero.dateText}. Undangan digital premium oleh Lavelle.`)
const ogImage = computed(() => `${SITE}${r.share?.ogImage || `/img/mentahan/${r.hero.photo}.jpeg`}`)
const pageUrl = `${SITE}/demo/royale/`

useHead({
  title: () => `${ogTitle.value} | Lavelle`,
  meta: [
    { name: 'robots', content: 'noindex' },
    { name: 'description', content: () => ogDesc.value },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Lavelle' },
    { property: 'og:title', content: () => ogTitle.value },
    { property: 'og:description', content: () => ogDesc.value },
    { property: 'og:image', content: () => ogImage.value },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: pageUrl },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: () => ogTitle.value },
    { name: 'twitter:description', content: () => ogDesc.value },
    { name: 'twitter:image', content: () => ogImage.value },
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

    <ScrollProgress />
    <ThemeSwitcher />
    <MusicPlayer ref="musicRef" :src="musicSrc" />

    <HeroCover v-bind="r.hero" />
    <OpeningSection :date="r.hero.date" :quote="r.quote" :photo="r.opening.photo" />
    <CoupleProfile :bride="r.bride" :groom="r.groom" />
    <LoveStory :story="r.story" />
    <EventDetails :events="r.events" :maps-query="r.mapsQuery" :date="r.hero.date" :couple-title="coupleTitle" />
    <DressCode :dress="r.dressCode" />
    <LiveStream :live="r.liveStream" />
    <GallerySection :items="r.gallery" :cats="r.galleryCats" />
    <DigitalEnvelope :gifts="r.gifts" :qris="r.qris" :wa-confirm="r.giftConfirmWa" />
    <RsvpForm @submitted="onRsvp" />
    <WishesFeed ref="wishesRef" :seed="r.wishesSeed" />
    <FamilySection :family="r.family" />
    <ClosingSection :closing="r.closing" :photo="r.hero.photo" :names="namesText" :date-text="r.hero.dateText" />

    <QuickNav />
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
