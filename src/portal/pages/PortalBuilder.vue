<script setup>
// Halaman builder /portal/ — state `invite` (reaktif) + `theme` diikat ke form,
// dikirim ke iframe pratinjau (/portal/preview/) via postMessage → pratinjau live skala HP.
// Draft disimpan ke localStorage (debounce) & dipulihkan saat muat.
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import { sampleInvite } from '../data/sampleInvite.js'
import { mergeInvite } from '../data/schema.js'
import BuilderShell from '../components/builder/BuilderShell.vue'
import BuilderForm from '../components/builder/BuilderForm.vue'

const DRAFT = 'lavelle-portal-draft'
const invite = reactive(structuredClone(sampleInvite))
const theme = ref('marun-emas')
const previewFrame = ref(null)

function pushPreview() {
  const w = previewFrame.value && previewFrame.value.contentWindow
  if (w) w.postMessage({ type: 'lavelle-preview', invite: JSON.parse(JSON.stringify(invite)), theme: theme.value }, '*')
}
function onReady(e) { if (e.data && e.data.type === 'lavelle-preview-ready') pushPreview() }

function stripPhotos(inv) {
  inv.hero.photo = ''; inv.bride.photo = ''; inv.groom.photo = ''; inv.closing.photo = ''
  ;(inv.story || []).forEach((s) => (s.photo = ''))
  ;(inv.gallery || []).forEach((g) => (g.src = ''))
  ;(inv.galleryFull || []).forEach((g) => (g.src = ''))
}
function saveDraft() {
  try { localStorage.setItem(DRAFT, JSON.stringify({ invite, theme: theme.value })) }
  catch {
    // kuota penuh (foto data URL besar) → simpan teks saja agar tak hilang
    try {
      const lite = JSON.parse(JSON.stringify(invite)); stripPhotos(lite)
      localStorage.setItem(DRAFT, JSON.stringify({ invite: lite, theme: theme.value }))
    } catch { /* menyerah diam-diam */ }
  }
}
function resetSample() {
  Object.assign(invite, mergeInvite(structuredClone(sampleInvite)))
  theme.value = 'marun-emas'
  try { localStorage.removeItem(DRAFT) } catch { /* ok */ }
}

let t = null
watch([invite, theme], () => { pushPreview(); clearTimeout(t); t = setTimeout(saveDraft, 400) }, { deep: true })

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT) || 'null')
    if (saved && saved.invite) { Object.assign(invite, mergeInvite(saved.invite)); if (saved.theme) theme.value = saved.theme }
  } catch { /* ok */ }
  window.addEventListener('message', onReady)
})
onUnmounted(() => window.removeEventListener('message', onReady))
</script>

<template>
  <BuilderShell>
    <template #form>
      <div class="pb">
        <header class="pb__brand">
          <span class="pb__logo">Lavelle</span>
          <span class="pb__sub">Portal Undangan</span>
          <button class="pb__reset" type="button" @click="resetSample" title="Kembalikan ke data contoh">Reset</button>
        </header>
        <BuilderForm :invite="invite" :theme="theme" @update:theme="theme = $event" />
      </div>
    </template>

    <template #preview>
      <iframe ref="previewFrame" class="pb__frame" src="/portal/preview/" title="Pratinjau undangan" @load="pushPreview"></iframe>
    </template>
  </BuilderShell>
</template>

<style scoped>
.pb { min-height: 100%; }
.pb__brand { display: flex; align-items: baseline; gap: .6rem; padding: 1.3rem 1.5rem; border-bottom: 1px solid #ece4d5; }
.pb__logo { font-family: 'Fraunces', serif; font-weight: 600; font-size: 1.3rem; color: #221d16; }
.pb__sub { font-size: .68rem; text-transform: uppercase; letter-spacing: .2em; color: #a08e6f; }
.pb__reset { margin-left: auto; background: none; border: 1px solid #e4dac7; border-radius: 8px; padding: .3rem .7rem; font-size: .72rem; color: #8a7c62; cursor: pointer; font-family: inherit; }
.pb__reset:hover { border-color: #c9a24b; color: #3d3428; }
.pb__frame { width: 100%; height: 100%; border: 0; display: block; background: #0b0906; }
</style>
