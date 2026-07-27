<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { session, profile, initSession, refreshProfile, setPortalBg } from '../lib/session.js'
import { updateProfileMeta, changePassword, uploadAvatar } from '../lib/profile.js'
import { THEMES, THEME_IDS } from '../data/themes.js'
import { PORTAL_BGS, PORTAL_BG_IDS, DEFAULT_PORTAL_BG } from '../data/portalBackgrounds.js'
import LavelleLogo from '../components/LavelleLogo.vue'
import PortalBackground from '../components/PortalBackground.vue'

const router = useRouter()
const form = reactive({ name: '', contact: '', avatar: '', theme_pref: 'marun-emas', bg_pref: DEFAULT_PORTAL_BG })
function pickBg(id) { form.bg_pref = id; setPortalBg(id) } // live-preview seketika
const pw = reactive({ a: '', b: '' })
const savingProfile = ref(false)
const savingPw = ref(false)
const uploadingAvatar = ref(false)
const loaded = ref(false)
const msg = ref('')
const pwMsg = ref('')

onMounted(async () => {
  await initSession()
  if (!session.value) { router.replace('/portal/login'); return }
  await refreshProfile()
  const p = profile.value || {}
  form.name = p.name || ''; form.contact = p.contact || ''; form.avatar = p.avatar || ''; form.theme_pref = p.themePref || 'marun-emas'
  form.bg_pref = p.portalBg || DEFAULT_PORTAL_BG
  loaded.value = true
})

async function onAvatar(e) {
  const file = e.target.files && e.target.files[0]; if (!file) return
  uploadingAvatar.value = true
  try { form.avatar = await uploadAvatar(file); await updateProfileMeta({ avatar: form.avatar }); await refreshProfile() }
  catch { /* diabaikan */ } finally { uploadingAvatar.value = false; e.target.value = '' }
}
async function saveProfile() {
  savingProfile.value = true; msg.value = ''
  try {
    await updateProfileMeta({ name: form.name.trim(), contact: form.contact.trim(), avatar: form.avatar, theme_pref: form.theme_pref, bg_pref: form.bg_pref })
    await refreshProfile(); msg.value = 'Tersimpan ✓'
  } catch { msg.value = 'Gagal menyimpan.' } finally { savingProfile.value = false }
}
async function savePw() {
  pwMsg.value = ''
  if (pw.a.length < 6) { pwMsg.value = 'Password minimal 6 karakter.'; return }
  if (pw.a !== pw.b) { pwMsg.value = 'Konfirmasi tidak sama.'; return }
  savingPw.value = true
  try { await changePassword(pw.a); pw.a = ''; pw.b = ''; pwMsg.value = 'Password berhasil diganti ✓' }
  catch { pwMsg.value = 'Gagal mengganti password.' } finally { savingPw.value = false }
}
</script>

<template>
  <div class="pf">
    <PortalBackground />
    <header class="pf__top">
      <div class="pf__brand"><LavelleLogo wordmark /></div>
      <button class="pf__back" type="button" @click="router.push('/portal/')">← Undangan</button>
    </header>

    <main v-if="!loaded" class="pf__loading">Memuat…</main>
    <main v-else class="pf__main">
      <h1 class="pf__h1">Pengaturan</h1>
      <p class="pf__lead">Kelola profil, tema favorit, & keamanan akunmu.</p>

      <div class="pf__grid">
      <div class="pf__col">
      <!-- PROFIL -->
      <section class="pf__card pf__card--profil">
        <h2 class="pf__card-title">Profil</h2>
        <div class="pf__avatarrow">
          <span class="pf__avatar">
            <img v-if="form.avatar" :src="form.avatar" alt="">
            <span v-else class="pf__avatar-ph">{{ (form.name || '?').charAt(0).toUpperCase() }}</span>
          </span>
          <div>
            <label class="pf__upload">
              <input type="file" accept="image/*" @change="onAvatar" hidden>
              <span>{{ uploadingAvatar ? 'Mengunggah…' : (form.avatar ? 'Ganti Foto' : 'Unggah Foto') }}</span>
            </label>
            <p class="pf__hint">JPG/PNG, otomatis dipas.</p>
          </div>
        </div>
        <div class="pf__field"><label>Nama</label><input v-model="form.name" class="pf__input" placeholder="Nama lengkap"></div>
        <div class="pf__field"><label>Kontak (WhatsApp / Email pribadi)</label><input v-model="form.contact" class="pf__input" placeholder="mis. 0812… atau email@gmail.com"></div>
        <div class="pf__field"><label>Email login</label><input :value="profile?.email" class="pf__input" disabled></div>
        <div class="pf__field"><label>Peran</label><input :value="profile?.role === 'admin' ? 'Admin (lihat semua)' : 'Karyawan'" class="pf__input" disabled></div>
      </section>

      <!-- LATAR PORTAL (wallpaper) -->
      <section class="pf__card">
        <h2 class="pf__card-title">Latar Portal</h2>
        <p class="pf__hint pf__hint--blk">Pilih wallpaper latar portalmu — berubah seketika, biar tak bosan.</p>
        <div class="pf__bgs">
          <button v-for="id in PORTAL_BG_IDS" :key="id" type="button" class="pf__bg" :class="{ 'is-on': form.bg_pref === id }" @click="pickBg(id)">
            <span class="pf__bg-prev" :style="{ background: PORTAL_BGS[id].preview }"></span>
            <span class="pf__bg-text">
              <span class="pf__bg-name">{{ PORTAL_BGS[id].label }}</span>
              <span class="pf__bg-desc">{{ PORTAL_BGS[id].desc }}</span>
            </span>
          </button>
        </div>
      </section>
      </div><!-- /pf__col -->

      <div class="pf__side">
      <!-- TEMA DEFAULT -->
      <section class="pf__card">
        <h2 class="pf__card-title">Tema Undangan Favorit</h2>
        <p class="pf__hint">Dipakai otomatis sebagai default saat kamu membuat undangan baru. Bisa diganti kapan saja per-undangan.</p>
        <div class="pf__themes">
          <button v-for="id in THEME_IDS" :key="id" type="button" class="pf__theme" :class="{ 'is-on': form.theme_pref === id }" @click="form.theme_pref = id">
            <span class="pf__sw" :style="{ background: THEMES[id].swatch[0] }"></span>
            <span class="pf__sw" :style="{ background: THEMES[id].swatch[1] }"></span>
            <span class="pf__theme-text">
              <span class="pf__theme-name">{{ THEMES[id].label }}</span>
              <span class="pf__theme-desc">{{ THEMES[id].desc }}</span>
            </span>
          </button>
        </div>
      </section>

      <div class="pf__saverow">
        <button class="pf__save" type="button" :disabled="savingProfile" @click="saveProfile">{{ savingProfile ? 'Menyimpan…' : 'Simpan Profil & Tema' }}</button>
        <span v-if="msg" class="pf__msg">{{ msg }}</span>
      </div>

      <!-- KEAMANAN -->
      <section class="pf__card">
        <h2 class="pf__card-title">Ganti Password</h2>
        <div class="pf__field"><label>Password baru</label><input v-model="pw.a" type="password" class="pf__input" placeholder="minimal 6 karakter"></div>
        <div class="pf__field"><label>Ulangi password baru</label><input v-model="pw.b" type="password" class="pf__input" placeholder="ketik ulang"></div>
        <div class="pf__saverow">
          <button class="pf__save pf__save--alt" type="button" :disabled="savingPw" @click="savePw">{{ savingPw ? 'Mengganti…' : 'Ganti Password' }}</button>
          <span v-if="pwMsg" class="pf__msg">{{ pwMsg }}</span>
        </div>
      </section>
      </div><!-- /pf__side -->
      </div><!-- /pf__grid -->
    </main>
  </div>
</template>

<style scoped>
.pf { position: relative; min-height: 100vh; min-height: 100svh; background: #0d0a06; font-family: 'Jost', system-ui, sans-serif; color: #ede2ca; overflow-x: hidden; }
.pf__top { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.8rem; background: rgba(15, 11, 6, .72); backdrop-filter: blur(14px) saturate(1.1); border-bottom: 1px solid rgba(201, 162, 75, .16); }
.pf__brand { color: #f4ecd9; font-family: 'Fraunces', serif; }
.pf__back { background: rgba(255, 255, 255, .04); border: 1px solid rgba(201, 162, 75, .28); border-radius: 9px; padding: .45rem .9rem; font-size: .82rem; color: #c3b596; cursor: pointer; font-family: inherit; transition: border-color .18s, color .18s, background-color .18s; }
.pf__back:hover { border-color: #d3ad55; color: #f4ecd9; background: rgba(201, 162, 75, .12); }

.pf__loading { position: relative; z-index: 1; display: grid; place-items: center; min-height: 60vh; font-family: 'Fraunces', serif; font-style: italic; color: #b1a688; }
.pf__main { position: relative; z-index: 1; max-width: 1060px; margin: 0 auto; padding: 2.6rem 2rem 4.5rem; }
.pf__h1 { font-family: 'Fraunces', serif; font-size: 2.4rem; line-height: 1; color: #f6edd9; }
.pf__lead { margin-top: .55rem; color: #b1a688; font-size: .96rem; }

.pf__grid { display: grid; grid-template-columns: 1.08fr 1fr; gap: 1.4rem; align-items: start; margin-top: 1.8rem; }
.pf__side, .pf__col { display: flex; flex-direction: column; gap: 1.4rem; }
.pf__card { position: relative; background: rgba(22, 17, 10, .7); border: 1px solid rgba(201, 162, 75, .18); border-radius: 18px; padding: 1.6rem 1.7rem; box-shadow: 0 20px 44px rgba(0, 0, 0, .45); backdrop-filter: blur(8px); }
@media (max-width: 820px) { .pf__grid { grid-template-columns: 1fr; } .pf__main { padding: 2rem 1.3rem 3.5rem; } }
.pf__card-title { font-family: 'Fraunces', serif; font-size: 1.2rem; margin-bottom: 1rem; color: #f4ecd9; }
.pf__avatarrow { display: flex; align-items: center; gap: 1.1rem; margin-bottom: 1.2rem; }
.pf__avatar { width: 74px; height: 74px; border-radius: 50%; overflow: hidden; flex: none; background: #1a150d; display: grid; place-items: center; border: 1px solid rgba(201, 162, 75, .3); }
.pf__avatar img { width: 100%; height: 100%; object-fit: cover; }
.pf__avatar-ph { font-family: 'Fraunces', serif; font-size: 1.8rem; color: #d3ad55; }
.pf__upload { display: inline-block; cursor: pointer; }
.pf__upload span { display: inline-block; padding: .5rem 1rem; border: 1px solid rgba(201, 162, 75, .3); border-radius: 9px; background: rgba(255, 255, 255, .04); color: #ede2ca; font-size: .84rem; transition: border-color .18s, background-color .18s; }
.pf__upload span:hover { border-color: #d3ad55; background: rgba(201, 162, 75, .12); }

.pf__field { display: flex; flex-direction: column; gap: .38rem; margin-bottom: .95rem; }
.pf__field > label { font-size: .68rem; text-transform: uppercase; letter-spacing: .1em; color: #b1a688; font-weight: 500; }
.pf__input { width: 100%; padding: .7rem .85rem; border: 1px solid rgba(201, 162, 75, .28); border-radius: 10px; background: rgba(0, 0, 0, .28); color: #f1e7d3; font-family: inherit; font-size: .94rem; transition: border-color .18s, box-shadow .18s; }
.pf__input::placeholder { color: #8a7f66; }
.pf__input:focus { outline: none; border-color: #d3ad55; box-shadow: 0 0 0 3px rgba(211, 173, 85, .18); }
.pf__input:disabled { background: rgba(0, 0, 0, .18); color: #9d906f; -webkit-text-fill-color: #9d906f; }
.pf__hint { font-size: .78rem; color: #a99d80; line-height: 1.55; margin-top: .3rem; }
.pf__hint--blk { margin-top: 0; margin-bottom: .3rem; }

/* pemilih wallpaper latar portal */
.pf__bgs { display: grid; grid-template-columns: 1fr 1fr; gap: .55rem; margin-top: .5rem; }
.pf__bg { display: flex; align-items: center; gap: .6rem; padding: .5rem .6rem; cursor: pointer; text-align: left; border: 1px solid rgba(201, 162, 75, .22); border-radius: 12px; background: rgba(20, 15, 9, .6); font-family: inherit; transition: border-color .2s, box-shadow .2s, transform .2s; }
.pf__bg:hover { transform: translateY(-1px); border-color: rgba(201, 162, 75, .45); }
.pf__bg.is-on { border-color: #d3ad55; box-shadow: 0 0 0 2px rgba(211, 173, 85, .35); }
.pf__bg-prev { width: 36px; height: 36px; border-radius: 9px; flex: none; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .08); }
.pf__bg-text { display: flex; flex-direction: column; min-width: 0; line-height: 1.2; }
.pf__bg-name { font-size: .8rem; color: #f4ecd9; font-weight: 500; }
.pf__bg-desc { font-size: .64rem; color: #a99d80; margin-top: .1rem; }

.pf__themes { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; margin-top: .8rem; }
.pf__theme { display: flex; align-items: center; gap: .5rem; padding: .6rem .7rem; cursor: pointer; text-align: left; border: 1px solid rgba(201, 162, 75, .22); border-radius: 12px; background: rgba(20, 15, 9, .6); font-family: inherit; transition: border-color .2s, box-shadow .2s, transform .2s; }
.pf__theme:hover { transform: translateY(-1px); }
.pf__theme.is-on { border-color: #d3ad55; box-shadow: 0 0 0 2px rgba(211, 173, 85, .35); }
.pf__sw { width: 16px; height: 16px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .18); flex: none; }
.pf__sw + .pf__sw { margin-left: -8px; }
.pf__theme-text { display: flex; flex-direction: column; line-height: 1.2; margin-left: .35rem; min-width: 0; }
.pf__theme-name { font-size: .84rem; color: #f4ecd9; font-weight: 500; }
.pf__theme-desc { font-size: .68rem; color: #a99d80; margin-top: .12rem; }

.pf__saverow { display: flex; align-items: center; gap: 1rem; margin-top: 1.3rem; flex-wrap: wrap; }
.pf__side > .pf__saverow { margin-top: 0; }
.pf__save { background: linear-gradient(180deg, #dcb75f, #c49a3f); color: #201907; border: none; border-radius: 11px; padding: .75rem 1.3rem; font-family: inherit; font-weight: 500; font-size: .9rem; cursor: pointer; transition: filter .2s, transform .15s; }
.pf__save:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
.pf__save:disabled { opacity: .55; }
.pf__save--alt { background: rgba(255, 255, 255, .05); color: #ede2ca; border: 1px solid rgba(201, 162, 75, .35); }
.pf__save--alt:hover:not(:disabled) { background: rgba(201, 162, 75, .14); filter: none; }
.pf__msg { font-size: .82rem; color: #74c98c; }
</style>
