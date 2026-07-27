<script setup>
// Pemilih renderer dinamis berdasarkan template undangan (sinema / royale / luxe / …).
import { computed } from 'vue'
import InviteSinema from './InviteSinema.vue'
import InviteRoyale from './InviteRoyale.vue'
import InviteLuxe from './InviteLuxe.vue'
import InviteAdat from './InviteAdat.vue'
import PortalMusic from './PortalMusic.vue'

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
</script>

<template>
  <component :is="comp" :data="data" :theme="theme" :preview="preview" />
  <PortalMusic v-if="musicLink" :link="musicLink" :start="musicStart" :preview="preview" />
</template>
