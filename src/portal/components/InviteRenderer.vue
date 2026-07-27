<script setup>
// Pemilih renderer dinamis berdasarkan template undangan (sinema / royale / luxe / …).
import { computed } from 'vue'
import InviteSinema from './InviteSinema.vue'
import InviteRoyale from './InviteRoyale.vue'
import InviteLuxe from './InviteLuxe.vue'
import InviteAdat from './InviteAdat.vue'

const props = defineProps({
  template: { type: String, default: 'sinema' },
  data: { type: Object, default: () => ({}) },
  theme: { type: String, default: 'marun-emas' },
  preview: { type: Boolean, default: false },
})

const REGISTRY = { sinema: InviteSinema, royale: InviteRoyale, luxe: InviteLuxe, adat: InviteAdat }
const comp = computed(() => REGISTRY[props.template] || InviteSinema)
</script>

<template>
  <component :is="comp" :data="data" :theme="theme" :preview="preview" />
</template>
