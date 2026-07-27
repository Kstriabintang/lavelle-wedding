<script setup>
// Kontainer form ber-seksi (accordion). Mengedit objek `invite` reaktif → pratinjau live.
import { ref } from 'vue'
import '../../assets/builder.css'
import SectionMempelai from './sections/SectionMempelai.vue'
import SectionAcara from './sections/SectionAcara.vue'
import SectionGaleri from './sections/SectionGaleri.vue'
import SectionTema from './sections/SectionTema.vue'

defineProps({ invite: { type: Object, required: true }, theme: { type: String, required: true } })
const emit = defineEmits(['update:theme'])

const open = ref('mempelai')
function toggle(k) { open.value = open.value === k ? '' : k }

const SECS = [
  { k: 'mempelai', label: 'Mempelai' },
  { k: 'acara', label: 'Acara' },
  { k: 'galeri', label: 'Galeri' },
  { k: 'tema', label: 'Tema Warna' },
]
</script>

<template>
  <div class="bf">
    <div v-for="s in SECS" :key="s.k" class="bf__sec">
      <button class="bf__head" :class="{ 'is-open': open === s.k }" @click="toggle(s.k)">
        {{ s.label }} <span class="bf__chev">▾</span>
      </button>
      <div v-show="open === s.k" class="bf__body">
        <SectionMempelai v-if="s.k === 'mempelai'" :invite="invite" />
        <SectionAcara v-else-if="s.k === 'acara'" :invite="invite" />
        <SectionGaleri v-else-if="s.k === 'galeri'" :invite="invite" />
        <SectionTema v-else :theme="theme" @update:theme="emit('update:theme', $event)" />
      </div>
    </div>
  </div>
</template>
