<script setup>
// Halaman builder /portal/ — state `invite` (reaktif) + `theme` diikat ke form,
// dikirim ke iframe pratinjau (/portal/preview/) via postMessage → pratinjau live skala HP.
// Draft disimpan ke localStorage (debounce) & dipulihkan saat muat.
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import { sampleInvite } from '../data/sampleInvite.js'
import { mergeInvite } from '../data/schema.js'
import '../assets/builder.css'
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
function openFull() { if (typeof window !== 'undefined') window.open('/portal/preview/', '_blank') }

function stripPhotos(inv) {
  inv.hero.photo = ''; inv.bride.photo = ''; inv.groom.photo = ''; inv.closing.photo = ''
  ;(inv.story || []).forEach((s) => (s.photo = ''))
  ;(inv.gallery || []).forEach((g) => (g.src = ''))
  ;(inv.galleryFull || []).forEach((g) => (g.src = ''))
}
function saveDraft() {
  try { localStorage.setItem(DRAFT, JSON.stringify({ invite, theme: theme.value })) }
  catch {
    try { const lite = JSON.parse(JSON.stringify(invite)); stripPhotos(lite); localStorage.setItem(DRAFT, JSON.stringify({ invite: lite, theme: theme.value })) }
    catch { /* menyerah diam-diam */ }
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
      <header class="pb__brand">
        <span class="pb__wordmark">Lavelle</span>
        <span class="pb__eyebrow">Studio Undangan</span>
        <button class="pb__reset" type="button" @click="resetSample" title="Kembalikan ke data contoh">Reset</button>
      </header>

      <div class="bshell__scroll">
        <div class="pb__intro">
          <p class="pb__intro-title">Undangan <b>{{ invite.hero.bride || '—' }} &amp; {{ invite.hero.groom || '—' }}</b></p>
          <p class="pb__intro-sub">Isi tiap bagian di bawah — pratinjau di sebelah kanan berubah seketika.</p>
        </div>
        <BuilderForm :invite="invite" :theme="theme" @update:theme="theme = $event" />
      </div>

      <footer class="pb__foot">
        <p class="pb__foot-note">Tersimpan otomatis di perangkat ini. <b>Terbitkan ke subdomain</b> aktif setelah masuk akun (segera).</p>
      </footer>
    </template>

    <template #toolbar>
      <button class="bshell__tool-link" type="button" @click="openFull">Buka di tab baru ↗</button>
    </template>

    <template #preview>
      <iframe ref="previewFrame" class="pb__frame" src="/portal/preview/" title="Pratinjau undangan" @load="pushPreview"></iframe>
    </template>
  </BuilderShell>
</template>

<style scoped>
.pb__frame { width: 100%; height: 100%; border: 0; display: block; background: #0b0906; }
</style>
