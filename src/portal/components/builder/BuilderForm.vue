<script setup>
// Form ber-seksi bernomor (alur terpandu) + navigasi lompat & bar progres (SectionNav).
// Accordion halus (grid-rows). Semua seksi mengedit objek `invite` reaktif → pratinjau live.
import { ref, nextTick } from 'vue'
import '../../assets/builder.css'
import SectionNav from './SectionNav.vue'
import { useInviteProgress } from '../../composables/useInviteProgress.js'
import SectionMempelai from './sections/SectionMempelai.vue'
import SectionKisah from './sections/SectionKisah.vue'
import SectionAcara from './sections/SectionAcara.vue'
import SectionGaleri from './sections/SectionGaleri.vue'
import SectionKeluarga from './sections/SectionKeluarga.vue'
import SectionHadiah from './sections/SectionHadiah.vue'
import SectionMusik from './sections/SectionMusik.vue'
import SectionTema from './sections/SectionTema.vue'
import SectionGaya from './sections/SectionGaya.vue'

const props = defineProps({ invite: { type: Object, required: true }, theme: { type: String, required: true } })
const emit = defineEmits(['update:theme'])

const progress = useInviteProgress(() => props.invite)
const open = ref('mempelai')
const secEls = ref({})   // k → elemen .bf__sec (untuk scroll saat lompat)
function setEl(k, el) { if (el) secEls.value[k] = el }
function toggle(k) { open.value = open.value === k ? '' : k }

async function goTo(k) {
  open.value = k
  await nextTick()
  const el = secEls.value[k]
  if (el && el.scrollIntoView) {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
  }
}

const SECS = [
  { k: 'mempelai', num: '01', label: 'Mempelai', desc: 'Nama, tanggal, orang tua & foto' },
  { k: 'kisah', num: '02', label: 'Kisah Cinta', desc: 'Bab perjalanan cinta + foto' },
  { k: 'acara', num: '03', label: 'Acara', desc: 'Akad & resepsi: waktu, tempat, peta' },
  { k: 'galeri', num: '04', label: 'Galeri', desc: 'Foto prewedding (maksimal 12)' },
  { k: 'keluarga', num: '05', label: 'Keluarga', desc: 'Orang tua & turut mengundang' },
  { k: 'hadiah', num: '06', label: 'Amplop Digital', desc: 'Rekening / e-wallet / QRIS' },
  { k: 'musik', num: '07', label: 'Musik', desc: 'Lagu latar dari YouTube (auto-play)' },
  { k: 'tema', num: '08', label: 'Tema Warna', desc: 'Nuansa warna undangan' },
  { k: 'gaya', num: '09', label: 'Kustomisasi', desc: 'Font, ukuran teks, warna aksen, sembunyikan seksi' },
]
</script>

<template>
  <div class="bf">
    <SectionNav :progress="progress" :active="open" @jump="goTo" />
    <div v-for="s in SECS" :key="s.k" class="bf__sec" :ref="(el) => setEl(s.k, el)">
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
            <SectionKisah v-else-if="s.k === 'kisah'" :invite="invite" />
            <SectionAcara v-else-if="s.k === 'acara'" :invite="invite" />
            <SectionGaleri v-else-if="s.k === 'galeri'" :invite="invite" />
            <SectionKeluarga v-else-if="s.k === 'keluarga'" :invite="invite" />
            <SectionHadiah v-else-if="s.k === 'hadiah'" :invite="invite" />
            <SectionMusik v-else-if="s.k === 'musik'" :invite="invite" />
            <SectionGaya v-else-if="s.k === 'gaya'" :invite="invite" />
            <SectionTema v-else :theme="theme" @update:theme="emit('update:theme', $event)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
