<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { session, profile, initSession } from '../lib/session.js'
import { signOut } from '../lib/auth.js'
import { listInvites, createInvite, deleteInvite, slugTaken } from '../lib/invites.js'
import { slugify, validateSlug } from '../lib/slug.js'
import { defaultInvite } from '../data/schema.js'
import LavelleLogo from '../components/LavelleLogo.vue'

const router = useRouter()
const invites = ref([])
const loading = ref(true)
const showNew = ref(false)
const newSlug = ref('')
const newErr = ref('')
const creating = ref(false)

onMounted(async () => {
  await initSession()
  if (!session.value) { router.replace('/portal/login'); return }
  await refresh()
})

async function refresh() {
  loading.value = true
  try { invites.value = await listInvites() } catch { /* diabaikan */ }
  loading.value = false
}
function onSlugInput() { newSlug.value = slugify(newSlug.value); newErr.value = '' }
async function create() {
  if (creating.value) return
  const v = validateSlug(newSlug.value)
  if (!v.ok) { newErr.value = v.error; return }
  creating.value = true
  try {
    if (await slugTaken(newSlug.value)) { newErr.value = 'Slug sudah dipakai, pilih yang lain.'; creating.value = false; return }
    const inv = await createInvite(newSlug.value, profile.value.id, defaultInvite(), profile.value && profile.value.themePref)
    router.push(`/portal/edit/${inv.id}`)
  } catch { newErr.value = 'Gagal membuat undangan. Coba lagi.'; creating.value = false }
}
async function removeInvite(inv) {
  if (!confirm(`Hapus undangan "${inv.slug}"? Tindakan ini tak bisa dibatalkan.`)) return
  try { await deleteInvite(inv.id); await refresh() } catch { alert('Gagal menghapus.') }
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
  <div class="db">
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
      <div class="db__head">
        <div>
          <h1 class="db__title">Undangan</h1>
          <p class="db__count">{{ invites.length }} undangan{{ profile?.role === 'admin' ? ' (semua karyawan)' : '' }}</p>
        </div>
        <button class="db__new" type="button" @click="showNew = !showNew">＋ Buat Undangan Baru</button>
      </div>

      <div v-if="showNew" class="db__form">
        <label class="db__form-label">Alamat undangan (slug)</label>
        <div class="db__form-row">
          <div class="db__slug"><input v-model="newSlug" @input="onSlugInput" placeholder="dina-agus" @keyup.enter="create"><span class="db__slug-suffix">.lavelle.my.id</span></div>
          <button class="db__create" type="button" :disabled="creating" @click="create">{{ creating ? 'Membuat…' : 'Buat' }}</button>
        </div>
        <p v-if="newErr" class="db__form-err">{{ newErr }}</p>
        <p v-else class="db__form-hint">Contoh: <b>dina-agus</b> → undangan akan hidup di <b>dina-agus.lavelle.my.id</b></p>
      </div>

      <p v-if="loading" class="db__loading">Memuat…</p>
      <p v-else-if="!invites.length" class="db__empty">Belum ada undangan. Klik <b>Buat Undangan Baru</b> untuk mulai. 🤍</p>

      <div v-else class="db__grid">
        <article v-for="inv in invites" :key="inv.id" class="db__card">
          <button class="db__thumb" type="button" @click="router.push(`/portal/edit/${inv.id}`)">
            <img v-if="heroPhoto(inv)" :src="heroPhoto(inv)" alt="">
            <span v-else class="db__thumb-ph">Lavelle</span>
            <span class="db__badge" :class="inv.status">{{ inv.status === 'published' ? 'Terbit' : 'Draft' }}</span>
          </button>
          <div class="db__body">
            <h3 class="db__names">{{ coupleName(inv) }}</h3>
            <p class="db__slug-txt">{{ inv.slug }}.lavelle.my.id</p>
            <div class="db__actions">
              <button class="db__edit" type="button" @click="router.push(`/portal/edit/${inv.id}`)">Edit</button>
              <a v-if="inv.status === 'published'" class="db__live" :href="liveUrl(inv)" target="_blank" rel="noopener">Lihat ↗</a>
              <button class="db__del" type="button" @click="removeInvite(inv)" aria-label="Hapus">Hapus</button>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<style scoped>
.db { min-height: 100vh; min-height: 100svh; background: linear-gradient(180deg, #f7f3ea, #f2ebdc); font-family: 'Jost', system-ui, sans-serif; color: #2a231b; }
.db__top { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 1.8rem; background: #fffdf9; border-bottom: 1px solid #ece3d2; position: sticky; top: 0; z-index: 5; }
.db__brand { display: flex; align-items: center; gap: .7rem; }
.db__logo { color: #2a231b; font-size: 1.3rem; }
.db__brand :deep(.llg__mark) { color: #b7893a; }
.db__eyebrow { font-size: .62rem; text-transform: uppercase; letter-spacing: .22em; color: #b7893a; }
.db__user { display: flex; align-items: center; gap: .8rem; }
.db__profile { display: flex; align-items: center; gap: .55rem; background: none; border: none; cursor: pointer; padding: .25rem .4rem; border-radius: 40px; font-family: inherit; transition: background-color .2s; }
.db__profile:hover { background: #f2ebdc; }
.db__avatar { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; flex: none; background: linear-gradient(135deg, #c9a24b, #e6c877); display: grid; place-items: center; color: #2a231b; font-family: 'Fraunces', serif; font-size: .92rem; }
.db__avatar img { width: 100%; height: 100%; object-fit: cover; }
.db__who { font-size: .84rem; color: #6d6152; }
.db__who em { color: #b7893a; font-style: normal; }
.db__logout { background: none; border: 1px solid #e0d5be; border-radius: 8px; padding: .35rem .8rem; font-size: .78rem; color: #8b7e6a; cursor: pointer; font-family: inherit; }
.db__logout:hover { border-color: #b7893a; color: #2a231b; }

.db__main { max-width: 1080px; margin: 0 auto; padding: 2.2rem 1.8rem 4rem; }
.db__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; margin-bottom: 1.6rem; }
.db__title { font-family: 'Fraunces', serif; font-size: 2.1rem; line-height: 1; }
.db__count { margin-top: .4rem; color: #90836d; font-size: .88rem; }
.db__new { background: #2a231b; color: #f4ead6; border: none; border-radius: 11px; padding: .7rem 1.15rem; font-family: inherit; font-size: .88rem; cursor: pointer; transition: background-color .2s, transform .15s; white-space: nowrap; }
.db__new:hover { background: #3d3226; transform: translateY(-1px); }

.db__form { background: #fffdf9; border: 1px solid #ece3d2; border-radius: 14px; padding: 1.2rem 1.3rem; margin-bottom: 1.8rem; }
.db__form-label { font-size: .68rem; text-transform: uppercase; letter-spacing: .12em; color: #90836d; }
.db__form-row { display: flex; gap: .6rem; margin-top: .5rem; }
.db__slug { flex: 1; display: flex; align-items: center; border: 1px solid #e0d5be; border-radius: 10px; background: #fff; overflow: hidden; }
.db__slug input { flex: 1; min-width: 0; border: none; padding: .65rem .8rem; font-family: inherit; font-size: .92rem; color: #2a231b; background: transparent; }
.db__slug input:focus { outline: none; }
.db__slug-suffix { padding: 0 .7rem; color: #a89a80; font-size: .82rem; white-space: nowrap; }
.db__create { background: #b7893a; color: #fff; border: none; border-radius: 10px; padding: 0 1.3rem; font-family: inherit; font-size: .88rem; cursor: pointer; }
.db__create:disabled { opacity: .6; }
.db__form-err { margin-top: .5rem; color: #b0483f; font-size: .8rem; }
.db__form-hint { margin-top: .5rem; color: #a89a80; font-size: .8rem; }

.db__loading, .db__empty { text-align: center; color: #90836d; padding: 3rem 1rem; font-style: italic; }
.db__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 1.2rem; }
.db__card { background: #fffdf9; border: 1px solid #ece3d2; border-radius: 15px; overflow: hidden; transition: transform .2s, box-shadow .2s; }
.db__card:hover { transform: translateY(-3px); box-shadow: 0 24px 44px -26px rgba(80, 60, 20, .35); }
.db__thumb { position: relative; display: block; width: 100%; aspect-ratio: 4/5; border: none; padding: 0; cursor: pointer; background: #efe7d6; overflow: hidden; }
.db__thumb img { width: 100%; height: 100%; object-fit: cover; }
.db__thumb-ph { position: absolute; inset: 0; display: grid; place-items: center; font-family: 'Fraunces', serif; font-style: italic; color: #cbb98f; font-size: 1.4rem; }
.db__badge { position: absolute; top: .6rem; left: .6rem; font-size: .64rem; letter-spacing: .06em; text-transform: uppercase; padding: .2rem .6rem; border-radius: 40px; background: rgba(0, 0, 0, .5); color: #fff; }
.db__badge.published { background: #2f7d46; }
.db__body { padding: .9rem 1rem 1.1rem; }
.db__names { font-family: 'Fraunces', serif; font-size: 1.12rem; line-height: 1.2; }
.db__slug-txt { margin-top: .2rem; font-size: .76rem; color: #a89a80; }
.db__actions { display: flex; align-items: center; gap: .5rem; margin-top: .9rem; }
.db__edit { background: #2a231b; color: #f4ead6; border: none; border-radius: 8px; padding: .4rem .9rem; font-family: inherit; font-size: .8rem; cursor: pointer; }
.db__live { font-size: .8rem; color: #b7893a; text-decoration: none; }
.db__live:hover { text-decoration: underline; }
.db__del { margin-left: auto; background: none; border: none; color: #bb7b7b; font-size: .76rem; cursor: pointer; }
.db__del:hover { color: #a03d3d; text-decoration: underline; }
</style>
