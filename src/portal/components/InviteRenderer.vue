<script setup>
// Pemilih renderer dinamis berdasarkan template undangan (sinema / royale / luxe / …).
import { computed } from 'vue'
import InviteSinema from './InviteSinema.vue'
import InviteRoyale from './InviteRoyale.vue'
import InviteLuxe from './InviteLuxe.vue'
import InviteAdat from './InviteAdat.vue'
import PortalMusic from './PortalMusic.vue'
import { fontVars, accentOverrideVars, zoomVal } from '../data/inviteStyle.js'

const props = defineProps({
  template: { type: String, default: 'sinema' },
  data: { type: Object, default: () => ({}) },
  theme: { type: String, default: 'marun-emas' },
  preview: { type: Boolean, default: false },
})

const REGISTRY = { sinema: InviteSinema, royale: InviteRoyale, luxe: InviteLuxe, adat: InviteAdat }
const comp = computed(() => REGISTRY[props.template] || InviteSinema)
const musicLink = computed(() => (props.data && props.data.music && props.data.music.link) || '')
const musicStart = computed(() => (props.data && props.data.music && props.data.music.start) || 0)

// Kustomisasi bebas: font+zoom di wrapper (mengalir turun), aksen+sembunyi seksi via prop ke template.
const st = computed(() => (props.data && props.data.style) || {})
const wrapStyle = computed(() => ({ ...fontVars(st.value.font), zoom: zoomVal(st.value.size) }))
const accentOv = computed(() => accentOverrideVars(st.value.accent))
const hideMap = computed(() => st.value.hide || {})
</script>

<template>
  <div class="inv-root" :style="wrapStyle">
    <component :is="comp" :data="data" :theme="theme" :preview="preview" :accent-ov="accentOv" :hide="hideMap" />
    <PortalMusic v-if="musicLink" :link="musicLink" :start="musicStart" :preview="preview" />
  </div>
</template>

<style scoped>
.inv-root { overflow-x: hidden; }
</style>
