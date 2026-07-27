<script setup>
// TEMPLATE ROYALE — renderer undangan BERBASIS DATA (committable, versi portal).
// Digeneralisasi dari DemoRoyale.vue: data via prop `data`, warna via `theme`.
// 100% komponen royale/* (klasik elegan multi-seksi). Foto = URL penuh.
import { ref, computed, onMounted, nextTick } from 'vue'
import { wireReveal } from '../../composables/useReveal'
import { mergeInvite, fillPhotos } from '../data/schema.js'
import { themeVars, THEME_IDS } from '../data/themes.js'
import '../../assets/royale.css'

import EnvelopeGate from '../../components/royale/EnvelopeGate.vue'
import ScrollProgress from '../../components/royale/ScrollProgress.vue'
import MusicPlayer from '../../components/royale/MusicPlayer.vue'
import HeroCover from '../../components/royale/HeroCover.vue'
import OpeningSection from '../../components/royale/OpeningSection.vue'
import CoupleProfile from '../../components/royale/CoupleProfile.vue'
import LoveStory from '../../components/royale/LoveStory.vue'
import EventDetails from '../../components/royale/EventDetails.vue'
import DressCode from '../../components/royale/DressCode.vue'
import GallerySection from '../../components/royale/GallerySection.vue'
import RsvpForm from '../../components/royale/RsvpForm.vue'
import DigitalEnvelope from '../../components/royale/DigitalEnvelope.vue'
import WishesFeed from '../../components/royale/WishesFeed.vue'
import FamilySection from '../../components/royale/FamilySection.vue'
import ClosingSection from '../../components/royale/ClosingSection.vue'
import QuickNav from '../../components/royale/QuickNav.vue'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  theme: { type: String, default: THEME_IDS[0] },
  preview: { type: Boolean, default: false },
  accentOv: { type: Object, default: () => ({}) },
  hide: { type: Object, default: () => ({}) },
})

const root = ref(null)
const r = computed(() => fillPhotos(mergeInvite(props.data)))
const style = computed(() => ({ ...themeVars(props.theme), ...props.accentOv }))
const skipGate = computed(() => props.preview)
const initials = computed(() => `${r.value.hero.bride[0] || '?'} & ${r.value.hero.groom[0] || '?'}`)
const coupleTitle = computed(() => `Pernikahan ${r.value.hero.bride} & ${r.value.hero.groom}`)
const coupleNames = computed(() => `${r.value.hero.bride} & ${r.value.hero.groom}`)
const musicRef = ref(null)

function onOpened() {
  if (musicRef.value) musicRef.value.play()
  nextTick(() => wireReveal(root.value || document))
}
onMounted(() => { nextTick(() => wireReveal(root.value || document)) })
</script>

<template>
  <div class="royale invite-modern" ref="root" :style="style">
    <EnvelopeGate v-if="!skipGate" :bride="r.hero.bride" :groom="r.hero.groom" :date-text="r.hero.dateText"
                  :guest="'Tamu Undangan'" :initials="initials" @opened="onOpened" />
    <ScrollProgress />
    <MusicPlayer v-if="r.music.src && !r.music.link" ref="musicRef" :src="r.music.src" :start="r.music.start" />

    <HeroCover v-bind="r.hero" />
    <OpeningSection :date="r.hero.date" :quote="r.quote" :photo="r.opening.photo" />
    <CoupleProfile :bride="r.bride" :groom="r.groom" />
    <LoveStory v-if="!hide.story" :story="r.story" />
    <EventDetails :events="r.events" :maps-query="r.mapsQuery" :date="r.hero.date" :couple-title="coupleTitle" />
    <DressCode v-if="!hide.dress" :dress="r.dressCode" />
    <GallerySection v-if="!hide.gallery" :items="r.gallery" :cats="r.galleryCats" :all-items="(r.galleryFull && r.galleryFull.length) ? r.galleryFull : r.gallery" />
    <DigitalEnvelope v-if="!hide.gifts" :gifts="r.gifts" :qris="r.qris" :wa-confirm="r.giftConfirmWa" :couple-names="coupleNames" />
    <RsvpForm :api="''" />
    <WishesFeed :seed="[]" :api="''" />
    <FamilySection :family="r.family" />
    <ClosingSection :closing="r.closing" :photo="r.closing.photo || r.hero.photo" :names="coupleNames" :date-text="r.hero.dateText" />

    <QuickNav :auto-hide="true" />
  </div>
</template>

<style scoped>
/* TEMPLATE MODERN — reuse struktur royale, tapi identitas MODERN MINIMALIS:
   tipografi bersih (Tenor Sans display + Poppins body + Lora aksen), huruf lebih lega,
   ornamen emas diredupkan, kartu lebih flat. Tetap hormati kustomisasi font (--inv-*). */
.royale.invite-modern {
  --font-display: var(--inv-serif, 'Tenor Sans'), serif;
  --font-serif: var(--inv-body, 'Lora'), serif;
  --font-script: var(--inv-script, 'Cormorant Upright'), serif;
  --font-sans: var(--inv-sans, 'Poppins'), sans-serif;
  position: relative; min-height: 100vh; background: var(--bg); color: var(--ink);
  font-family: var(--font-sans); overflow-x: hidden;
  letter-spacing: .005em;
}
/* Sentuhan modern: judul seksi lebih lega & tegas, ornamen diredupkan, kartu lebih flat. */
.royale.invite-modern :deep(h1),
.royale.invite-modern :deep(h2),
.royale.invite-modern :deep(h3) { letter-spacing: .015em; font-weight: 500; }
.royale.invite-modern :deep(svg[class*="orn"]),
.royale.invite-modern :deep([class*="__orn"]),
.royale.invite-modern :deep([class*="-orn"]) { opacity: .5; transform: scale(.85); }
.royale.invite-modern :deep([class*="card"]),
.royale.invite-modern :deep([class*="__card"]) { box-shadow: 0 10px 30px -20px rgba(0,0,0,.5) !important; border-radius: 14px !important; }
</style>
