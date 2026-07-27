<script setup>
// Form ber-seksi bernomor (alur terpandu). Accordion halus (grid-rows). Semua seksi
// mengedit objek `invite` reaktif → pratinjau live.
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
  { k: 'mempelai', num: '01', label: 'Mempelai', desc: 'Nama, tanggal, orang tua & foto' },
  { k: 'acara', num: '02', label: 'Acara', desc: 'Akad & resepsi: waktu, tempat, peta' },
  { k: 'galeri', num: '03', label: 'Galeri', desc: 'Foto prewedding (maksimal 12)' },
  { k: 'tema', num: '04', label: 'Tema Warna', desc: 'Nuansa warna undangan' },
]
</script>

<template>
  <div class="bf">
    <div v-for="s in SECS" :key="s.k" class="bf__sec">
      <button class="bf__head" :class="{ 'is-open': open === s.k }" @click="toggle(s.k)"
              :aria-expanded="open === s.k">
        <span class="bf__num">{{ s.num }}</span>
        <span class="bf__titles">
          <span class="bf__title">{{ s.label }}</span>
          <span class="bf__desc">{{ s.desc }}</span>
        </span>
        <span class="bf__chev">▼</span>
      </button>
      <div class="bf__wrap" :class="{ 'is-open': open === s.k }">
        <div class="bf__inner">
          <div class="bf__body">
            <SectionMempelai v-if="s.k === 'mempelai'" :invite="invite" />
            <SectionAcara v-else-if="s.k === 'acara'" :invite="invite" />
            <SectionGaleri v-else-if="s.k === 'galeri'" :invite="invite" />
            <SectionTema v-else :theme="theme" @update:theme="emit('update:theme', $event)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
