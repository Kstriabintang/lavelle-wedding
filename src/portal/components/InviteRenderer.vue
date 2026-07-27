<script setup>
// Pemilih renderer dinamis berdasarkan template undangan (sinema / royale / …).
import { computed } from 'vue'
import InviteSinema from './InviteSinema.vue'
import InviteRoyale from './InviteRoyale.vue'

const props = defineProps({
  template: { type: String, default: 'sinema' },
  data: { type: Object, default: () => ({}) },
  theme: { type: String, default: 'marun-emas' },
  preview: { type: Boolean, default: false },
})

const comp = computed(() => (props.template === 'royale' ? InviteRoyale : InviteSinema))
</script>

<template>
  <component :is="comp" :data="data" :theme="theme" :preview="preview" />
</template>
