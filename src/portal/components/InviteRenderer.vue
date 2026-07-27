<script setup>
// Pemilih renderer dinamis berdasarkan template undangan (sinema / royale / luxe / …).
import { computed } from 'vue'
import InviteSinema from './InviteSinema.vue'
import InviteRoyale from './InviteRoyale.vue'
import InviteLuxe from './InviteLuxe.vue'
import InviteAdat from './InviteAdat.vue'
import InviteModern from './InviteModern.vue'
import PortalMusic from './PortalMusic.vue'
import { fontVars, accentOverrideVars, zoomVal } from '../data/inviteStyle.js'

const props = defineProps({
  template: { type: String, default: 'sinema' },
  data: { type: Object, default: () => ({}) },
  theme: { type: String, default: 'marun-emas' },
  preview: { type: Boolean, default: false },
})

const REGISTRY = { sinema: InviteSinema, royale: InviteRoyale, luxe: InviteLuxe, adat: InviteAdat, modern: InviteModern }
const comp = computed(() => REGISTRY[props.template] || InviteSinema)
const musicLink = computed(() => (props.data && props.data.music && props.data.music.link) || '')
const musicStart = computed(() => (props.data && props.data.music && props.data.music.start) || 0)

// Kustomisasi bebas: font+zoom di wrapper (mengalir turun), aksen+sembunyi seksi via prop ke template.
const st = computed(() => (props.data && props.data.style) || {})
const wrapStyle = computed(() => ({ ...fontVars(st.value.font), zoom: zoomVal(st.value.size) }))
const accentOv = computed(() => accentOverrideVars(st.value.accent))
const hideMap = computed(() => st.value.hide || {})
const motion = computed(() => st.value.motion || 'lembut')
</script>

<template>
  <div class="inv-root" :style="wrapStyle" :data-motion="motion">
    <component :is="comp" :data="data" :theme="theme" :preview="preview" :accent-ov="accentOv" :hide="hideMap" />
    <PortalMusic v-if="musicLink" :link="musicLink" :start="musicStart" :preview="preview" />
  </div>
</template>

<style scoped>
.inv-root { overflow-x: hidden; }
</style>

<style>
/* Animasi transisi antar-seksi — override arah/skala awal reveal (semua template).
   Reset ke normal saat .in. Global (bukan scoped) agar menjangkau kelas reveal template. */
.inv-root[data-motion="naik"] .r-reveal:not(.in),
.inv-root[data-motion="naik"] .sn-reveal:not(.in),
.inv-root[data-motion="naik"] .reveal:not(.in),
.inv-root[data-motion="naik"] .a-reveal:not(.in) { transform: translateY(64px); }

.inv-root[data-motion="geser"] .r-reveal:not(.in),
.inv-root[data-motion="geser"] .sn-reveal:not(.in),
.inv-root[data-motion="geser"] .reveal:not(.in),
.inv-root[data-motion="geser"] .a-reveal:not(.in) { transform: translateX(-46px); }

.inv-root[data-motion="zoom"] .r-reveal:not(.in),
.inv-root[data-motion="zoom"] .sn-reveal:not(.in),
.inv-root[data-motion="zoom"] .reveal:not(.in),
.inv-root[data-motion="zoom"] .a-reveal:not(.in) { transform: scale(.9); }

.inv-root[data-motion="mati"] .r-reveal,
.inv-root[data-motion="mati"] .sn-reveal,
.inv-root[data-motion="mati"] .reveal,
.inv-root[data-motion="mati"] .a-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
</style>
