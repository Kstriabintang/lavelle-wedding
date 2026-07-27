<script setup>
// Editor undangan tersambung Supabase (/portal/edit/:id). Muat by id, simpan (debounce),
// upload foto ke storage (via provide inviteId), tombol Terbitkan.
import { reactive, ref, watch, onMounted, onUnmounted, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { session, initSession } from '../lib/session.js'
import { getInvite, saveInvite } from '../lib/invites.js'
import { activateDomain } from '../lib/publishDomain.js'
import { mergeInvite } from '../data/schema.js'
import BuilderShell from '../components/builder/BuilderShell.vue'
import BuilderForm from '../components/builder/BuilderForm.vue'

const route = useRoute(); const router = useRouter()
const id = route.params.id
provide('lavelle-invite-id', id)   // → PhotoInput unggah ke storage

const invite = reactive(mergeInvite({}))
const theme = ref('marun-emas')
const status = ref('draft')
const slug = ref('')
const loaded = ref(false)
const saveState = ref('saved')     // saved|saving
const publishing = ref(false)
const pubMsg = ref('')
const previewFrame = ref(null)

onMounted(async () => {
  await initSession()
  if (!session.value) { router.replace('/portal/login'); return }
  try {
    const inv = await getInvite(id)
    Object.assign(invite, mergeInvite(inv.data || {}))
    theme.value = inv.theme || 'marun-emas'
    status.value = inv.status; slug.value = inv.slug
    loaded.value = true
  } catch { router.replace('/portal/'); return }
  window.addEventListener('message', onReady)
})
onUnmounted(() => window.removeEventListener('message', onReady))

function pushPreview() {
  const w = previewFrame.value && previewFrame.value.contentWindow
  if (w) w.postMessage({ type: 'lavelle-preview', invite: JSON.parse(JSON.stringify(invite)), theme: theme.value }, '*')
}
function onReady(e) { if (e.data && e.data.type === 'lavelle-preview-ready') pushPreview() }

let t = null
async function doSave() {
  saveState.value = 'saving'
  try { await saveInvite(id, { data: JSON.parse(JSON.stringify(invite)), theme: theme.value }); saveState.value = 'saved' }
  catch { saveState.value = 'saving' }
}
watch([invite, theme], () => {
  if (!loaded.value) return
  pushPreview(); saveState.value = 'saving'; clearTimeout(t); t = setTimeout(doSave, 900)
}, { deep: true })

async function publish() {
  if (publishing.value) return
  publishing.value = true; pubMsg.value = 'Menyimpan…'
  await doSave()
  try {
    await saveInvite(id, { status: 'published' }); status.value = 'published'
    pubMsg.value = 'Mengaktifkan subdomain…'
    const res = await activateDomain(slug.value)
    pubMsg.value = res && res.ok ? '✓ Subdomain aktif (SSL ±1 menit)' : 'Terbit ✓ (subdomain menyusul)'
  } catch { pubMsg.value = 'Terbit ✓' }
  publishing.value = false
}
async function unpublish() {
  try { await saveInvite(id, { status: 'draft' }); status.value = 'draft' } catch { /* */ }
}
function openFull() { if (typeof window !== 'undefined') window.open(`/portal/preview/?id=${id}`, '_blank') }
const liveUrl = computed(() => `https://${slug.value}.lavelle.my.id`)
</script>

<template>
  <BuilderShell v-if="loaded">
    <template #form>
      <header class="pe__top">
        <button class="pe__back" type="button" @click="router.push('/portal/')">← Semua undangan</button>
        <span class="pe__save" :class="saveState">{{ saveState === 'saving' ? 'Menyimpan…' : 'Tersimpan ✓' }}</span>
      </header>

      <div class="bshell__scroll">
        <div class="pe__intro">
          <p class="pe__slug">{{ slug }}.lavelle.my.id
            <span class="pe__badge" :class="status">{{ status === 'published' ? 'Terbit' : 'Draft' }}</span>
          </p>
          <p class="pe__names">Undangan <b>{{ invite.hero.bride || '—' }} &amp; {{ invite.hero.groom || '—' }}</b></p>
        </div>
        <BuilderForm :invite="invite" :theme="theme" @update:theme="theme = $event" />
      </div>

      <footer class="pe__foot">
        <template v-if="status === 'published'">
          <a class="pe__live" :href="liveUrl" target="_blank" rel="noopener">Lihat Live ↗</a>
          <span v-if="pubMsg" class="pe__pubmsg">{{ pubMsg }}</span>
          <button class="pe__unpub" type="button" @click="unpublish">Jadikan Draft</button>
        </template>
        <button v-else class="pe__pub" type="button" :disabled="publishing" @click="publish">
          {{ publishing ? (pubMsg || 'Menerbitkan…') : '🌐 Terbitkan Undangan' }}
        </button>
      </footer>
    </template>

    <template #toolbar>
      <button class="bshell__tool-link" type="button" @click="openFull">Buka di tab baru ↗</button>
    </template>

    <template #preview>
      <iframe ref="previewFrame" class="pe__frame" src="/portal/preview/" title="Pratinjau undangan" @load="pushPreview"></iframe>
    </template>
  </BuilderShell>
  <div v-else class="pe__loading">Memuat undangan…</div>
</template>

<style scoped>
.pe__top { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid #ece3d2; background: #fcf9f2; }
.pe__back { background: none; border: none; color: #6d6152; font-family: 'Jost', sans-serif; font-size: .84rem; cursor: pointer; padding: 0; }
.pe__back:hover { color: #2a231b; }
.pe__save { font-size: .74rem; color: #9a8b6f; font-family: 'Jost', sans-serif; }
.pe__save.saving { color: #b7893a; }
.pe__intro { padding: 1.3rem 1.5rem .3rem; }
.pe__slug { font-size: .78rem; color: #a89a80; display: flex; align-items: center; gap: .5rem; }
.pe__badge { font-size: .6rem; letter-spacing: .06em; text-transform: uppercase; padding: .1rem .5rem; border-radius: 40px; background: #e7dcc3; color: #8a7c5f; }
.pe__badge.published { background: #d8ecdd; color: #2f7d46; }
.pe__names { margin-top: .35rem; font-family: 'Fraunces', serif; font-size: 1.35rem; color: #2a231b; }
.pe__names b { font-style: italic; font-weight: 600; }
.pe__foot { padding: 1rem 1.5rem 1.3rem; border-top: 1px solid #ece3d2; background: #fcf9f2; display: flex; align-items: center; gap: 1rem; }
.pe__pub { flex: 1; background: #2f7d46; color: #fff; border: none; border-radius: 11px; padding: .8rem 1rem; font-family: 'Jost', sans-serif; font-size: .92rem; cursor: pointer; transition: background-color .2s; }
.pe__pub:hover:not(:disabled) { background: #276b3b; }
.pe__pub:disabled { opacity: .6; }
.pe__live { color: #2f7d46; font-family: 'Jost', sans-serif; font-size: .9rem; text-decoration: none; font-weight: 500; }
.pe__live:hover { text-decoration: underline; }
.pe__pubmsg { font-size: .76rem; color: #2f7d46; }
.pe__unpub { margin-left: auto; background: none; border: 1px solid #e0d5be; border-radius: 9px; padding: .45rem .9rem; color: #8b7e6a; font-family: 'Jost', sans-serif; font-size: .8rem; cursor: pointer; }
.pe__frame { width: 100%; height: 100%; border: 0; display: block; background: #0b0906; }
.pe__loading { min-height: 100vh; display: grid; place-items: center; font-family: 'Fraunces', serif; font-style: italic; color: #90836d; background: #f7f3ea; }
</style>
