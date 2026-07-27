<script setup>
// Halaman PRATINJAU (dimuat di dalam iframe oleh builder). Viewport iframe = lebar HP,
// jadi satuan vw/svh pada template terhitung benar → skala persis seperti di HP asli.
// Menerima data & tema dari builder (parent) via postMessage; render InviteSinema.
import { ref, onMounted, onUnmounted } from 'vue'
import { sampleInvite } from '../data/sampleInvite.js'
import { mergeInvite } from '../data/schema.js'
import InviteSinema from '../components/InviteSinema.vue'

const data = ref(structuredClone(sampleInvite))
const theme = ref('marun-emas')

function onMsg(e) {
  const m = e.data
  if (!m || m.type !== 'lavelle-preview') return
  if (m.invite) data.value = mergeInvite(m.invite)
  if (m.theme) theme.value = m.theme
}

onMounted(() => {
  window.addEventListener('message', onMsg)
  // dibuka standalone (tab baru) → tampilkan draft localStorage terbaru
  try {
    const saved = JSON.parse(localStorage.getItem('lavelle-portal-draft') || 'null')
    if (saved && saved.invite) { data.value = mergeInvite(saved.invite); if (saved.theme) theme.value = saved.theme }
  } catch { /* ok */ }
  // di dalam iframe → minta parent kirim state terbaru (menimpa di atas)
  try { if (window.parent && window.parent !== window) window.parent.postMessage({ type: 'lavelle-preview-ready' }, '*') } catch { /* ok */ }
})
onUnmounted(() => window.removeEventListener('message', onMsg))
</script>

<template>
  <InviteSinema :data="data" :theme="theme" preview />
</template>
