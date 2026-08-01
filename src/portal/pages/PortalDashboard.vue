<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { session, profile, portalBg, initSession } from '../lib/session.js'
import { signOut } from '../lib/auth.js'
import { listInvites, createInvite, deleteInvite, duplicateInvite, slugTaken } from '../lib/invites.js'
import { slugify, validateSlug } from '../lib/slug.js'
import { defaultInvite } from '../data/schema.js'
import { TEMPLATES, TEMPLATE_IDS, DEFAULT_TEMPLATE } from '../data/templates.js'
import { portalAccentVars } from '../data/portalBackgrounds.js'
import { adat, adatOrder } from '../../data/adat'
import LavelleLogo from '../components/LavelleLogo.vue'
import PortalBackground from '../components/PortalBackground.vue'
import ConfirmModal from '../components/portal/ConfirmModal.vue'
import ToastHost from '../components/portal/ToastHost.vue'
import WelcomeModal from '../components/portal/WelcomeModal.vue'
import { useToast } from '../composables/useToast.js'

const toast = useToast()
const pendingDelete = ref(null)
const showWelcome = ref(false)

const router = useRouter()
const accentVars = computed(() => portalAccentVars(portalBg.value))
const invites = ref([])
const loading = ref(true)
const showNew = ref(false)
const newSlug = ref('')
const newTemplate = ref(DEFAULT_TEMPLATE)
const newSuku = ref('minang')
const SUKU_OPTS = adatOrder.map((s) => ({ id: s, label: adat[s].suku, accent: adat[s].tagline }))
const newErr = ref('')
const creating = ref(false)

const published = computed(() => invites.value.filter((i) => i.status === 'published').length)
const drafts = computed(() => invites.value.filter((i) => i.status !== 'published').length)

// Pencarian + filter status (sisi-klien, instan)
const query = ref('')
const statusFilter = ref('all')   // all | published | draft
const duplicating = ref(null)     // id yang sedang diduplikat
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return invites.value.filter((inv) => {
    if (statusFilter.value === 'published' && inv.status !== 'published') return false
    if (statusFilter.value === 'draft' && inv.status === 'published') return false
    if (!q) return true
    return coupleName(inv).toLowerCase().includes(q) || (inv.slug || '').toLowerCase().includes(q)
  })
})

onMounted(async () => {
  await initSession()
  if (!session.value) { router.replace('/portal/login'); return }
  await refresh()
  // Panduan sekali-tampil untuk karyawan (flag per-user di localStorage)
  try {
    const key = 'lavelle_tour_v1_' + (profile.value && profile.value.id)
    if (typeof localStorage !== 'undefined' && profile.value && !localStorage.getItem(key)) showWelcome.value = true
  } catch { /* localStorage tak tersedia → lewati */ }
})
function closeWelcome() {
  showWelcome.value = false
  try { localStorage.setItem('lavelle_tour_v1_' + profile.value.id, '1') } catch { /* */ }
}

async function refresh() {
  loading.value = true
  try { invites.value = await listInvites(profile.value && profile.value.id, profile.value && profile.value.role === 'admin') } catch { /* diabaikan */ }
  loading.value = false
}
function openNew() { showNew.value = true }
// Alamat (slug) TIDAK diminta di awal — dibuat otomatis sementara, diatur nanti di editor
// sebelum terbit. Jadi karyawan bisa langsung edit foto/kata dulu.
function genSlug() { return `undangan-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}` }
async function create() {
  if (creating.value) return
  creating.value = true; newErr.value = ''
  try {
    let s = genSlug()
    if (await slugTaken(s)) s = genSlug() + Math.random().toString(36).slice(2, 4)
    const init = defaultInvite(); init.template = newTemplate.value
    if (newTemplate.value === 'adat') init.adat = { suku: newSuku.value }
    const inv = await createInvite(s, profile.value.id, init, profile.value && profile.value.themePref)
    router.push(`/portal/edit/${inv.id}`)
  } catch { newErr.value = 'Gagal membuat undangan. Coba lagi.'; creating.value = false }
}
function askDelete(inv) { pendingDelete.value = inv }
async function confirmDelete() {
  const inv = pendingDelete.value; pendingDelete.value = null
  if (!inv) return
  try { await deleteInvite(inv.id); await refresh(); toast.success('Undangan dihapus') }
  catch { toast.error('Gagal menghapus undangan') }
}
async function duplicate(inv) {
  if (duplicating.value) return
  duplicating.value = inv.id
  try { await duplicateInvite(inv.id, profile.value.id); await refresh(); toast.success('Undangan diduplikat ✓') }
  catch { toast.error('Gagal menduplikat undangan') }
  finally { duplicating.value = null }
}
async function logout() { await signOut(); router.replace('/portal/login') }

function coupleName(inv) {
  const h = inv.data && inv.data.hero
  return (h && (h.bride || h.groom)) ? `${h.bride || '—'} & ${h.groom || '—'}` : 'Undangan baru'
}
function heroPhoto(inv) { return inv.data && inv.data.hero && inv.data.hero.photo }
function liveUrl(inv) { return `https://${inv.slug}.lavelle.my.id` }
</script>

<template>
  <div class="db" :style="accentVars">
    <PortalBackground />

    <header class="db__top">
      <div class="db__brand"><LavelleLogo wordmark class="db__logo" /><span class="db__eyebrow">Studio Undangan</span></div>
      <div class="db__user">
        <button class="db__profile" type="button" @click="router.push('/portal/profile/')" title="Pengaturan profil">
          <span class="db__avatar"><img v-if="profile?.avatar" :src="profile.avatar" alt=""><span v-else>{{ (profile?.name || '?').charAt(0).toUpperCase() }}</span></span>
          <span class="db__who">{{ profile?.name || '…' }}<em v-if="profile?.role === 'admin'"> · admin</em></span>
        </button>
        <button class="db__logout" type="button" @click="logout">Keluar</button>
      </div>
    </header>

    <main class="db__main">
      <div class="db__hero">
        <div>
          <p class="db__kicker">Beranda</p>
          <h1 class="db__title">Undangan{{ profile?.role === 'admin' ? ' Studio' : ' Saya' }}</h1>
          <div class="db__stats">
            <span class="db__stat"><b>{{ invites.length }}</b> total</span>
            <span class="db__dot"></span>
            <span class="db__stat db__stat--pub"><b>{{ published }}</b> terbit</span>
            <span class="db__dot"></span>
            <span class="db__stat"><b>{{ drafts }}</b> draft</span>
          </div>
        </div>
        <button class="db__new" type="button" @click="openNew">＋ Buat Undangan Baru</button>
      </div>

      <transition name="db-form">
        <div v-if="showNew" class="db__form">
          <label class="db__form-label">Pilih Template</label>
          <div class="db__templates">
            <button v-for="tid in TEMPLATE_IDS" :key="tid" type="button" class="db__template" :class="{ 'is-on': newTemplate === tid }" @click="newTemplate = tid">
              <span class="db__tpl-thumb">
                <img :src="TEMPLATES[tid].thumb" :alt="`Contoh template ${TEMPLATES[tid].name}`" loading="lazy">
                <span class="db__tpl-tag">{{ TEMPLATES[tid].tag }}</span>
                <span class="db__tpl-check" aria-hidden="true">✓</span>
              </span>
              <span class="db__template-body">
                <span class="db__template-name">{{ TEMPLATES[tid].name }}</span>
                <span class="db__template-desc">{{ TEMPLATES[tid].desc }}</span>
              </span>
            </button>
          </div>

          <transition name="db-form">
            <div v-if="newTemplate === 'adat'" class="db__suku-wrap">
              <label class="db__form-label db__form-label--mt">Pilih Suku / Adat</label>
              <div class="db__suku">
                <button v-for="s in SUKU_OPTS" :key="s.id" type="button" class="db__suku-btn" :class="{ 'is-on': newSuku === s.id }" @click="newSuku = s.id">
                  <span class="db__suku-name">{{ s.label }}</span>
                  <span class="db__suku-accent">{{ s.accent }}</span>
                </button>
              </div>
            </div>
          </transition>

          <div class="db__form-row db__form-row--go">
            <button class="db__create" type="button" :disabled="creating" @click="create">{{ creating ? 'Membuat…' : 'Buat & Mulai Edit →' }}</button>
            <button class="db__cancel" type="button" @click="showNew = false">Batal</button>
          </div>
          <p v-if="newErr" class="db__form-err">{{ newErr }}</p>
          <p v-else class="db__form-hint">Pilih template, lalu edit foto &amp; kata-katanya dulu. Alamat undangan (domain) diatur nanti di editor sebelum diterbitkan.</p>
        </div>
      </transition>

      <div v-if="!loading && invites.length > 0" class="db__toolbar">
        <label class="db__search">
          <span class="db__search-ic" aria-hidden="true">⌕</span>
          <input v-model="query" type="search" autocomplete="off" placeholder="Cari nama mempelai / alamat…" aria-label="Cari undangan">
        </label>
        <div class="db__filters" role="group" aria-label="Filter status">
          <button type="button" class="db__filter" :class="{ 'is-on': statusFilter === 'all' }" @click="statusFilter = 'all'">Semua</button>
          <button type="button" class="db__filter" :class="{ 'is-on': statusFilter === 'published' }" @click="statusFilter = 'published'">Terbit</button>
          <button type="button" class="db__filter" :class="{ 'is-on': statusFilter === 'draft' }" @click="statusFilter = 'draft'">Draft</button>
        </div>
      </div>

      <p v-if="loading" class="db__loading">Memuat…</p>

      <div v-else class="db__grid">
        <button class="db__addcard" type="button" @click="openNew">
          <span class="db__addicon">＋</span>
          <span class="db__addtext">Buat Undangan Baru</span>
        </button>

        <article v-for="inv in filtered" :key="inv.id" class="db__card">
          <button class="db__thumb" type="button" @click="router.push(`/portal/edit/${inv.id}`)">
            <img v-if="heroPhoto(inv)" :src="heroPhoto(inv)" alt="">
            <span v-else class="db__thumb-ph"><LavelleLogo /></span>
            <span class="db__thumb-scrim"></span>
            <span class="db__badge" :class="inv.status">{{ inv.status === 'published' ? 'Terbit' : 'Draft' }}</span>
          </button>
          <div class="db__body">
            <h3 class="db__names">{{ coupleName(inv) }}</h3>
            <p class="db__slug-txt">{{ inv.slug }}.lavelle.my.id</p>
            <div class="db__actions">
              <button class="db__edit" type="button" @click="router.push(`/portal/edit/${inv.id}`)">Edit</button>
              <a v-if="inv.status === 'published'" class="db__live" :href="liveUrl(inv)" target="_blank" rel="noopener">Lihat ↗</a>
              <button class="db__dup" type="button" :disabled="duplicating === inv.id" @click="duplicate(inv)">{{ duplicating === inv.id ? 'Menyalin…' : 'Duplikat' }}</button>
              <button class="db__del" type="button" @click="askDelete(inv)" aria-label="Hapus">Hapus</button>
            </div>
          </div>
        </article>
      </div>

      <p v-if="!loading && filtered.length === 0 && invites.length > 0" class="db__empty">
        Tak ada undangan cocok — coba kata kunci lain.
      </p>
    </main>

    <ConfirmModal :open="!!pendingDelete" title="Hapus undangan?"
      :message="pendingDelete ? `“${pendingDelete.slug}.lavelle.my.id” akan dihapus permanen.` : ''"
      confirm-label="Hapus" danger @confirm="confirmDelete" @cancel="pendingDelete = null" />
    <WelcomeModal :open="showWelcome" :name="profile?.name || ''" @close="closeWelcome" />
    <ToastHost />
  </div>
</template>

<style scoped>
/* palet aksen mengikuti wallpaper via --pa-* (di-set inline pada .db) — fallback emas */
.db { --pa-acc: #d3ad55; --pa-acc2: #e9c97e; --pa-ink: #201907; --pa-txt: #f0e6cf; --pa-mut: #b6ab8a;
  --pa-surf: rgba(28,21,12,.72); --pa-surf2: rgba(0,0,0,.26); --pa-bd: rgba(211,173,85,.22); --pa-bd2: rgba(211,173,85,.5); --pa-glow: rgba(211,173,85,.4);
  position: relative; min-height: 100vh; min-height: 100svh; font-family: 'Jost', system-ui, sans-serif; color: var(--pa-txt); background: #0a0808; overflow-x: hidden; transition: color .5s ease; }

/* ---------- Header ---------- */
.db__top { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 1.8rem; background: rgba(8, 7, 6, .68); backdrop-filter: blur(14px) saturate(1.1); border-bottom: 1px solid var(--pa-bd); transition: border-color .5s ease; }
.db__brand { display: flex; align-items: center; gap: .7rem; }
.db__logo { color: var(--pa-txt); font-size: 1.3rem; }
.db__eyebrow { font-size: .62rem; text-transform: uppercase; letter-spacing: .22em; color: var(--pa-acc); }
.db__user { display: flex; align-items: center; gap: .8rem; }
.db__profile { display: flex; align-items: center; gap: .55rem; background: none; border: none; cursor: pointer; padding: .25rem .4rem; border-radius: 40px; font-family: inherit; transition: background-color .2s; }
.db__profile:hover { background: rgba(255, 255, 255, .06); }
.db__avatar { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; flex: none; background: linear-gradient(135deg, var(--pa-acc), var(--pa-acc2)); display: grid; place-items: center; color: var(--pa-ink); font-family: 'Fraunces', serif; font-size: .92rem; }
.db__avatar img { width: 100%; height: 100%; object-fit: cover; }
.db__who { font-size: .84rem; color: var(--pa-mut); }
.db__who em { color: var(--pa-acc); font-style: normal; }
.db__logout { background: rgba(255, 255, 255, .04); border: 1px solid var(--pa-bd2); border-radius: 8px; padding: .35rem .8rem; font-size: .78rem; color: var(--pa-mut); cursor: pointer; font-family: inherit; transition: border-color .2s, color .2s, background-color .2s; }
.db__logout:hover { border-color: var(--pa-acc); color: var(--pa-txt); background: rgba(255, 255, 255, .09); }

/* ---------- Main ---------- */
.db__main { position: relative; z-index: 1; max-width: 1120px; margin: 0 auto; padding: 2.6rem 1.8rem 4rem; }
.db__hero { display: flex; align-items: flex-end; justify-content: space-between; gap: 1.2rem; margin-bottom: 1.8rem; }
.db__kicker { font-size: .66rem; text-transform: uppercase; letter-spacing: .24em; color: var(--pa-acc); }
.db__title { font-family: 'Fraunces', serif; font-size: clamp(2.1rem, 4vw, 2.8rem); line-height: 1; margin-top: .3rem; color: var(--pa-txt); }
.db__stats { display: flex; align-items: center; gap: .7rem; margin-top: .8rem; color: var(--pa-mut); font-size: .86rem; }
.db__stat b { color: var(--pa-txt); font-family: 'Fraunces', serif; font-weight: 600; }
.db__stat--pub b { color: #74c98c; }
.db__dot { width: 3px; height: 3px; border-radius: 50%; background: var(--pa-mut); opacity: .6; }
.db__new { background: linear-gradient(180deg, var(--pa-acc2), var(--pa-acc)); color: var(--pa-ink); border: none; border-radius: 12px; padding: .8rem 1.3rem; font-family: inherit; font-weight: 600; font-size: .9rem; cursor: pointer; box-shadow: 0 14px 32px -12px var(--pa-glow); transition: transform .15s, box-shadow .2s; white-space: nowrap; }
.db__new:hover { transform: translateY(-1px); box-shadow: 0 18px 40px -12px var(--pa-glow); }

.db__form { background: var(--pa-surf); border: 1px solid var(--pa-bd); border-radius: 14px; padding: 1.2rem 1.3rem; margin-bottom: 1.8rem; backdrop-filter: blur(8px); }
.db__form-label { font-size: .68rem; text-transform: uppercase; letter-spacing: .12em; color: var(--pa-mut); }
.db__form-row { display: flex; gap: .6rem; margin-top: .5rem; flex-wrap: wrap; }
.db__slug { flex: 1; min-width: 200px; display: flex; align-items: center; border: 1px solid var(--pa-bd2); border-radius: 10px; background: var(--pa-surf2); overflow: hidden; }
.db__slug input { flex: 1; min-width: 0; border: none; padding: .65rem .8rem; font-family: inherit; font-size: .92rem; color: var(--pa-txt); background: transparent; }
.db__slug input:focus { outline: none; }
.db__slug input::placeholder { color: var(--pa-mut); opacity: .7; }
.db__slug-suffix { padding: 0 .7rem; color: var(--pa-mut); font-size: .82rem; white-space: nowrap; }
.db__form-row--go { margin-top: 1.1rem; align-items: center; }
.db__create { background: var(--pa-acc); color: var(--pa-ink); border: none; border-radius: 11px; padding: .72rem 1.6rem; font-family: inherit; font-weight: 600; font-size: .92rem; cursor: pointer; box-shadow: 0 12px 26px -12px var(--pa-glow); transition: filter .2s, transform .15s; }
.db__create:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
.db__create:disabled { opacity: .5; }
.db__cancel { background: rgba(255, 255, 255, .03); border: 1px solid var(--pa-bd); border-radius: 10px; padding: .5rem 1rem; color: var(--pa-mut); font-family: inherit; font-size: .85rem; cursor: pointer; }
.db__form-err { margin-top: .5rem; color: #e0776b; font-size: .8rem; }
.db__form-hint { margin-top: .5rem; color: var(--pa-mut); font-size: .8rem; }
.db__templates { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: .7rem; margin-top: .5rem; }
.db__template { position: relative; text-align: left; padding: 0; border: 1.5px solid var(--pa-bd); border-radius: 15px; background: var(--pa-surf); cursor: pointer; font-family: inherit; overflow: hidden; display: flex; flex-direction: column; transition: border-color .2s, box-shadow .2s, transform .2s; }
.db__template:hover { transform: translateY(-3px); box-shadow: 0 16px 34px rgba(0, 0, 0, .5); }
.db__template.is-on { border-color: var(--pa-acc); box-shadow: 0 0 0 2px var(--pa-glow), 0 16px 34px rgba(0, 0, 0, .5); }
.db__tpl-thumb { position: relative; aspect-ratio: 3 / 4; overflow: hidden; background: var(--pa-surf2); }
.db__tpl-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .45s ease; }
.db__template:hover .db__tpl-thumb img { transform: scale(1.05); }
.db__tpl-thumb::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 52%, rgba(10, 7, 4, .55)); pointer-events: none; }
.db__tpl-tag { position: absolute; top: .5rem; left: .5rem; z-index: 2; font-size: .56rem; text-transform: uppercase; letter-spacing: .1em; color: #f3e6c4; background: rgba(20, 14, 6, .7); border: 1px solid var(--pa-bd2); border-radius: 40px; padding: .2rem .55rem; backdrop-filter: blur(3px); }
.db__tpl-check { position: absolute; top: .5rem; right: .5rem; z-index: 2; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: .7rem; color: var(--pa-ink); background: var(--pa-acc); opacity: 0; transform: scale(.6); transition: opacity .2s, transform .2s; }
.db__template.is-on .db__tpl-check { opacity: 1; transform: scale(1); }
.db__template-body { padding: .55rem .7rem .7rem; }
.db__template-name { font-family: 'Fraunces', serif; font-size: .98rem; color: var(--pa-txt); }
.db__template-desc { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-top: .25rem; font-size: .68rem; color: var(--pa-mut); line-height: 1.45; }
.db__form-label--mt { display: block; margin-top: 1.1rem; }
.db__suku { display: grid; grid-template-columns: 1fr 1fr; gap: .55rem; margin-top: .5rem; }
.db__suku-btn { text-align: left; padding: .6rem .75rem; border: 1.5px solid var(--pa-bd); border-radius: 10px; background: var(--pa-surf2); cursor: pointer; font-family: inherit; transition: border-color .2s, box-shadow .2s, transform .2s; }
.db__suku-btn:hover { transform: translateY(-2px); }
.db__suku-btn.is-on { border-color: var(--pa-acc); box-shadow: 0 0 0 2px var(--pa-glow); }
.db__suku-name { display: block; font-family: 'Fraunces', serif; font-size: .95rem; color: var(--pa-txt); }
.db__suku-accent { display: block; margin-top: .15rem; font-size: .66rem; color: var(--pa-mut); letter-spacing: .02em; }
@media (max-width: 560px) { .db__templates { grid-template-columns: 1fr 1fr; } }
.db-form-enter-active, .db-form-leave-active { transition: opacity .3s, transform .3s; }
.db-form-enter-from, .db-form-leave-to { opacity: 0; transform: translateY(-8px); }

.db__loading { text-align: center; color: var(--pa-mut); padding: 3rem 1rem; font-style: italic; }
.db__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(232px, 1fr)); gap: 1.3rem; }

.db__addcard { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .6rem; min-height: 260px; border: 1.5px dashed var(--pa-bd2); border-radius: 16px; background: var(--pa-surf2); cursor: pointer; font-family: inherit; color: var(--pa-mut); transition: border-color .2s, color .2s, background-color .2s, transform .2s; }
.db__addcard:hover { border-color: var(--pa-acc); color: var(--pa-txt); background: var(--pa-surf); transform: translateY(-3px); }
.db__addicon { font-size: 1.9rem; font-weight: 300; }
.db__addtext { font-size: .88rem; }

.db__card { background: var(--pa-surf); border: 1px solid var(--pa-bd); border-radius: 16px; overflow: hidden; backdrop-filter: blur(6px); transition: transform .2s, box-shadow .2s; }
.db__card:hover { transform: translateY(-3px); box-shadow: 0 28px 50px -26px rgba(0, 0, 0, .7); }
.db__thumb { position: relative; display: block; width: 100%; aspect-ratio: 4/5; border: none; padding: 0; cursor: pointer; background: var(--pa-surf2); overflow: hidden; }
.db__thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.db__card:hover .db__thumb img { transform: scale(1.05); }
.db__thumb-ph { position: absolute; inset: 0; display: grid; place-items: center; color: var(--pa-mut); opacity: .6; font-size: 2rem; }
.db__thumb-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(6, 4, 2, .5)); }
.db__badge { position: absolute; top: .7rem; left: .7rem; font-size: .62rem; letter-spacing: .08em; text-transform: uppercase; padding: .22rem .65rem; border-radius: 40px; background: rgba(10, 7, 4, .7); color: #f3e6c4; backdrop-filter: blur(4px); }
.db__badge.published { background: rgba(47, 125, 70, .92); color: #fff; }
.db__body { padding: 1rem 1.1rem 1.15rem; }
.db__names { font-family: 'Fraunces', serif; font-size: 1.16rem; line-height: 1.2; color: var(--pa-txt); }
.db__slug-txt { margin-top: .25rem; font-size: .76rem; color: var(--pa-mut); }
.db__actions { display: flex; align-items: center; gap: .6rem; margin-top: 1rem; }
.db__edit { background: var(--pa-acc); color: var(--pa-ink); border: none; border-radius: 8px; padding: .42rem .95rem; font-family: inherit; font-weight: 600; font-size: .8rem; cursor: pointer; transition: filter .2s; }
.db__edit:hover { filter: brightness(1.1); }
.db__live { font-size: .8rem; color: var(--pa-acc); text-decoration: none; font-weight: 500; }
.db__live:hover { text-decoration: underline; }
.db__dup { background: rgba(255, 255, 255, .05); border: 1px solid var(--pa-bd2); border-radius: 8px; padding: .42rem .8rem; color: var(--pa-txt); font-family: inherit; font-size: .8rem; cursor: pointer; transition: border-color .2s, background-color .2s; }
.db__dup:hover:not(:disabled) { border-color: var(--pa-acc); background: rgba(255, 255, 255, .09); }
.db__dup:disabled { opacity: .5; cursor: default; }
.db__del { margin-left: auto; background: none; border: none; color: #c98a84; font-size: .76rem; cursor: pointer; }
.db__del:hover { color: #e0776b; text-decoration: underline; }

/* Toolbar cari + filter */
.db__toolbar { display: flex; align-items: center; gap: .8rem; margin-bottom: 1.2rem; flex-wrap: wrap; }
.db__search { display: flex; align-items: center; gap: .5rem; flex: 1; min-width: 220px; border: 1px solid var(--pa-bd2); border-radius: 40px; background: var(--pa-surf2); padding: .1rem .9rem; }
.db__search-ic { color: var(--pa-mut); font-size: 1rem; }
.db__search input { flex: 1; min-width: 0; border: none; background: transparent; padding: .55rem 0; color: var(--pa-txt); font-family: inherit; font-size: .88rem; }
.db__search input:focus { outline: none; }
.db__search input::placeholder { color: var(--pa-mut); opacity: .7; }
.db__filters { display: flex; gap: .35rem; }
.db__filter { min-height: 38px; padding: .4rem .9rem; border: 1px solid var(--pa-bd); border-radius: 40px; background: var(--pa-surf2); color: var(--pa-mut); font-family: inherit; font-size: .8rem; cursor: pointer; transition: border-color .2s, color .2s, background-color .2s; }
.db__filter:hover { color: var(--pa-txt); border-color: var(--pa-bd2); }
.db__filter.is-on { border-color: var(--pa-acc); color: var(--pa-ink); background: var(--pa-acc); }
.db__filter:focus-visible { outline: 2px solid var(--pa-acc2); outline-offset: 2px; }
.db__empty { text-align: center; color: var(--pa-mut); padding: 2rem 1rem; }

@media (max-width: 640px) {
  .db__hero { flex-direction: column; align-items: flex-start; }
  .db__new { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .db__aurora, .db__dust { animation: none !important; }
  .db__dust { display: none; }
}
</style>
