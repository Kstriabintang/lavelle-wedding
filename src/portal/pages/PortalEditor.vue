<script setup>
// Editor undangan tersambung Supabase (/portal/edit/:id). Muat by id, simpan (debounce),
// upload foto ke storage (via provide inviteId), tombol Terbitkan.
import { reactive, ref, watch, onMounted, onUnmounted, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { session, initSession } from '../lib/session.js'
import { getInvite, saveInvite, slugTaken } from '../lib/invites.js'
import { slugify, validateSlug } from '../lib/slug.js'
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
const slugInput = ref('')
const slugErr = ref('')
const slugSaving = ref(false)
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
    status.value = inv.status; slug.value = inv.slug; slugInput.value = inv.slug
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
  catch { saveState.value = 'error' }
}
watch([invite, theme], () => {
  if (!loaded.value) return
  pushPreview(); saveState.value = 'saving'; clearTimeout(t); t = setTimeout(doSave, 900)
}, { deep: true })

// Simpan alamat (slug/domain) — diatur di editor, bukan saat buat.
async function saveSlug() {
  slugErr.value = ''
  const s = slugify(slugInput.value || '')
  slugInput.value = s
  if (s === slug.value) return true
  const v = validateSlug(s)
  if (!v.ok) { slugErr.value = v.error; return false }
  slugSaving.value = true
  try {
    if (await slugTaken(s, id)) { slugErr.value = 'Alamat sudah dipakai, pilih yang lain.'; return false }
    await saveInvite(id, { slug: s }); slug.value = s; return true
  } catch { slugErr.value = 'Gagal menyimpan alamat.'; return false }
  finally { slugSaving.value = false }
}

async function publish() {
  if (publishing.value) return
  if (!(await saveSlug())) return   // alamat belum valid → jangan terbit
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
        <span class="pe__save" :class="saveState">{{ saveState === 'saving' ? 'Menyimpan…' : saveState === 'error' ? 'Gagal simpan ✕' : 'Tersimpan ✓' }}</span>
      </header>

      <div class="bshell__scroll">
        <div class="pe__intro">
          <p class="pe__names">Undangan <b>{{ invite.hero.bride || '—' }} &amp; {{ invite.hero.groom || '—' }}</b>
            <span class="pe__badge" :class="status">{{ status === 'published' ? 'Terbit' : 'Draft' }}</span>
          </p>
          <label class="pe__slug-label">Alamat undangan (domain)</label>
          <div v-if="status !== 'published'" class="pe__slug-row">
            <div class="pe__slug-box">
              <input class="pe__slug-input" v-model="slugInput" @blur="saveSlug" @keyup.enter="saveSlug" placeholder="mis. dina-agus">
              <span class="pe__slug-suffix">.lavelle.my.id</span>
            </div>
            <span v-if="slugSaving" class="pe__slug-msg">menyimpan…</span>
          </div>
          <p v-else class="pe__slug"><a :href="liveUrl" target="_blank" rel="noopener">{{ slug }}.lavelle.my.id ↗</a></p>
          <p v-if="slugErr" class="pe__slug-err">{{ slugErr }}</p>
          <p v-else-if="status !== 'published'" class="pe__slug-hint">Boleh diubah kapan saja sebelum diterbitkan — ini jadi link undangannya.</p>
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
.pe__top { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid rgba(201, 162, 75, .16); background: #14100b; }
.pe__back { background: none; border: none; color: #a99d80; font-family: 'Jost', sans-serif; font-size: .84rem; cursor: pointer; padding: 0; }
.pe__back:hover { color: #f1e7cf; }
.pe__save { font-size: .74rem; color: #a99d80; font-family: 'Jost', sans-serif; }
.pe__save.saving { color: #d8b25e; }
.pe__save.error { color: #e0776b; }
.pe__intro { padding: 1.3rem 1.5rem .3rem; }
.pe__names { font-family: 'Fraunces', serif; font-size: 1.35rem; color: #f1e7cf; display: flex; align-items: center; gap: .6rem; }
.pe__names b { font-style: italic; font-weight: 600; }
.pe__badge { font-size: .6rem; letter-spacing: .06em; text-transform: uppercase; padding: .1rem .5rem; border-radius: 40px; background: rgba(201, 162, 75, .18); color: #d8b25e; }
.pe__badge.published { background: rgba(47, 125, 70, .25); color: #74c98c; }
.pe__slug-label { display: block; margin-top: .9rem; font-size: .64rem; text-transform: uppercase; letter-spacing: .1em; color: #a99d80; }
.pe__slug-row { display: flex; align-items: center; gap: .6rem; margin-top: .35rem; }
.pe__slug-box { flex: 1; display: flex; align-items: center; border: 1px solid rgba(201, 162, 75, .3); border-radius: 9px; background: rgba(0, 0, 0, .28); overflow: hidden; }
.pe__slug-box:focus-within { border-color: #d8b25e; }
.pe__slug-input { flex: 1; min-width: 0; border: none; background: transparent; padding: .5rem .7rem; font-family: 'Jost', sans-serif; font-size: .88rem; color: #f1e7cf; }
.pe__slug-input::placeholder { color: #8a7f66; }
.pe__slug-input:focus { outline: none; }
.pe__slug-suffix { padding: 0 .65rem; color: #a99d80; font-size: .8rem; white-space: nowrap; }
.pe__slug-msg { font-size: .74rem; color: #d8b25e; white-space: nowrap; }
.pe__slug-err { margin-top: .35rem; font-size: .76rem; color: #e0776b; }
.pe__slug-hint { margin-top: .35rem; font-size: .74rem; color: #a99d80; }
.pe__slug { margin-top: .35rem; font-size: .84rem; }
.pe__slug a { color: #74c98c; text-decoration: none; font-weight: 500; }
.pe__slug a:hover { text-decoration: underline; }
.pe__foot { padding: 1rem 1.5rem 1.3rem; border-top: 1px solid rgba(201, 162, 75, .16); background: #14100b; display: flex; align-items: center; gap: 1rem; }
.pe__pub { flex: 1; background: linear-gradient(180deg, #34925230, #2f7d46); background: #2f8a4d; color: #fff; border: none; border-radius: 11px; padding: .8rem 1rem; font-family: 'Jost', sans-serif; font-weight: 500; font-size: .92rem; cursor: pointer; transition: background-color .2s; }
.pe__pub:hover:not(:disabled) { background: #37a05a; }
.pe__pub:disabled { opacity: .6; }
.pe__live { color: #74c98c; font-family: 'Jost', sans-serif; font-size: .9rem; text-decoration: none; font-weight: 500; }
.pe__live:hover { text-decoration: underline; }
.pe__pubmsg { font-size: .76rem; color: #74c98c; }
.pe__unpub { margin-left: auto; background: rgba(255, 255, 255, .04); border: 1px solid rgba(201, 162, 75, .3); border-radius: 9px; padding: .45rem .9rem; color: #a99d80; font-family: 'Jost', sans-serif; font-size: .8rem; cursor: pointer; }
.pe__frame { width: 100%; height: 100%; border: 0; display: block; background: #0b0906; }
.pe__loading { min-height: 100vh; display: grid; place-items: center; font-family: 'Fraunces', serif; font-style: italic; color: #a99d80; background: #0e0b07; }
</style>
