<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { session, profile, initSession, refreshProfile } from '../lib/session.js'
import { updateProfileMeta, changePassword, uploadAvatar } from '../lib/profile.js'
import { THEMES, THEME_IDS } from '../data/themes.js'
import LavelleLogo from '../components/LavelleLogo.vue'
import PortalBackground from '../components/PortalBackground.vue'

const router = useRouter()
const form = reactive({ name: '', contact: '', avatar: '', theme_pref: 'marun-emas' })
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
    await updateProfileMeta({ name: form.name.trim(), contact: form.contact.trim(), avatar: form.avatar, theme_pref: form.theme_pref })
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

      <!-- PROFIL -->
      <section class="pf__card">
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
    </main>
  </div>
</template>

<style scoped>
.pf { position: relative; min-height: 100vh; min-height: 100svh; background: #f6f0e6; font-family: 'Jost', system-ui, sans-serif; color: #2a231b; overflow-x: hidden; }
.pf__top { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.8rem; background: rgba(255, 253, 249, .78); backdrop-filter: blur(14px) saturate(1.1); border-bottom: 1px solid rgba(210, 195, 165, .5); }
.pf__brand { color: #2a231b; font-family: 'Fraunces', serif; }
.pf__back { background: rgba(255, 255, 255, .6); border: 1px solid #dcceb1; border-radius: 9px; padding: .45rem .9rem; font-size: .82rem; color: #5f5541; cursor: pointer; font-family: inherit; transition: border-color .18s, color .18s, background-color .18s; }
.pf__back:hover { border-color: #b7893a; color: #2a231b; background: #fff; }

.pf__loading { position: relative; z-index: 1; display: grid; place-items: center; min-height: 60vh; font-family: 'Fraunces', serif; font-style: italic; color: #7a6f5a; }
.pf__main { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; padding: 2.4rem 1.6rem 4rem; }
.pf__h1 { font-family: 'Fraunces', serif; font-size: 2.2rem; line-height: 1; color: #241d14; }
.pf__lead { margin-top: .55rem; color: #6f6450; font-size: .94rem; }

.pf__card { position: relative; background: rgba(255, 253, 249, .92); border: 1px solid rgba(220, 206, 177, .7); border-radius: 18px; padding: 1.5rem 1.6rem; margin-top: 1.4rem; box-shadow: 0 12px 34px rgba(84, 62, 24, .07), 0 2px 6px rgba(84, 62, 24, .04); backdrop-filter: blur(3px); }
.pf__card-title { font-family: 'Fraunces', serif; font-size: 1.2rem; margin-bottom: 1rem; }
.pf__avatarrow { display: flex; align-items: center; gap: 1.1rem; margin-bottom: 1.2rem; }
.pf__avatar { width: 74px; height: 74px; border-radius: 50%; overflow: hidden; flex: none; background: #efe7d6; display: grid; place-items: center; border: 1px solid #e4dac7; }
.pf__avatar img { width: 100%; height: 100%; object-fit: cover; }
.pf__avatar-ph { font-family: 'Fraunces', serif; font-size: 1.8rem; color: #9a7d3f; }
.pf__upload { display: inline-block; cursor: pointer; }
.pf__upload span { display: inline-block; padding: .5rem 1rem; border: 1px solid #dcceb1; border-radius: 9px; background: #fbf7ee; color: #3d3428; font-size: .84rem; transition: border-color .18s, background-color .18s; }
.pf__upload span:hover { border-color: #b7893a; background: #fff; }

.pf__field { display: flex; flex-direction: column; gap: .38rem; margin-bottom: .95rem; }
.pf__field > label { font-size: .68rem; text-transform: uppercase; letter-spacing: .1em; color: #6f6450; font-weight: 500; }
.pf__input { width: 100%; padding: .7rem .85rem; border: 1px solid #d8caac; border-radius: 10px; background: #fff; color: #2a231b; font-family: inherit; font-size: .94rem; transition: border-color .18s, box-shadow .18s; }
.pf__input::placeholder { color: #a99a7d; }
.pf__input:focus { outline: none; border-color: #b7893a; box-shadow: 0 0 0 3px rgba(183, 137, 58, .16); }
.pf__input:disabled { background: #f1ebdd; color: #6f6450; -webkit-text-fill-color: #6f6450; }
.pf__hint { font-size: .78rem; color: #7d7159; line-height: 1.55; margin-top: -.15rem; }

.pf__themes { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; margin-top: .8rem; }
.pf__theme { display: flex; align-items: center; gap: .5rem; padding: .6rem .7rem; cursor: pointer; text-align: left; border: 1px solid #e4dac7; border-radius: 12px; background: #fff; font-family: inherit; transition: border-color .2s, box-shadow .2s, transform .2s; }
.pf__theme:hover { transform: translateY(-1px); }
.pf__theme.is-on { border-color: #b7893a; box-shadow: 0 0 0 2px rgba(183, 137, 58, .28); }
.pf__sw { width: 16px; height: 16px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .1); flex: none; }
.pf__sw + .pf__sw { margin-left: -8px; }
.pf__theme-text { display: flex; flex-direction: column; line-height: 1.2; margin-left: .35rem; min-width: 0; }
.pf__theme-name { font-size: .84rem; color: #2a231b; font-weight: 500; }
.pf__theme-desc { font-size: .68rem; color: #877659; margin-top: .12rem; }

.pf__saverow { display: flex; align-items: center; gap: 1rem; margin-top: 1.3rem; }
.pf__save { background: #2a231b; color: #f4ead6; border: none; border-radius: 11px; padding: .75rem 1.3rem; font-family: inherit; font-size: .9rem; cursor: pointer; transition: background-color .2s, transform .15s; }
.pf__save:hover:not(:disabled) { background: #3d3226; transform: translateY(-1px); }
.pf__save:disabled { opacity: .6; }
.pf__save--alt { background: #b7893a; }
.pf__save--alt:hover:not(:disabled) { background: #a2782f; }
.pf__msg { font-size: .82rem; color: #2f7d46; }
</style>
