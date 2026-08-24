<script setup>
// FASE B — RSVP: nama (wajib), kehadiran (segmented), jumlah tamu (stepper).
// Konfirmasi LANGSUNG ke Google Sheet (backend Apps Script, tab "RSVP") — tanpa WhatsApp.
// Batas 1 RSVP/orang (token device) + bisa di-Edit. Fallback lokal bila `api` kosong.
import { ref, reactive, onMounted } from 'vue'

const props = defineProps({
  api: { type: String, default: '' },     // URL web-app Apps Script (…/exec)
})

const STORE = 'lavelle-rsvp-own'
const IDKEY = 'lavelle-guest-id'
const OPTS = ['Hadir', 'Masih Ragu', 'Tidak Hadir']

const form = reactive({ nama: '', jumlah: 1, hadir: 'Hadir' })
const errors = reactive({ nama: '' })
const done = ref(false)
const sending = ref(false)

function guestId() {
  try {
    let id = localStorage.getItem(IDKEY)
    if (!id) { id = 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); localStorage.setItem(IDKEY, id) }
    return id
  } catch { return 'g' + Date.now().toString(36) }
}
function validate() { errors.nama = form.nama.trim() ? '' : 'Nama wajib diisi.'; return !errors.nama }
function step(n) { form.jumlah = Math.min(10, Math.max(1, form.jumlah + n)) }

async function submit() {
  if (!validate() || sending.value) return
  const payload = { type: 'rsvp', id: guestId(), name: form.nama.trim(), hadir: form.hadir, jumlah: form.hadir === 'Tidak Hadir' ? 0 : form.jumlah }
  sending.value = true
  try {
    if (props.api) {
      fetch(props.api, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), redirect: 'follow' }).catch(() => {})
    }
    try { localStorage.setItem(STORE, JSON.stringify({ ...form })) } catch { /* ok */ }
    done.value = true
  } finally { sending.value = false }
}
function edit() { done.value = false }

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null')
    if (saved && saved.nama) { Object.assign(form, saved); done.value = true }
  } catch { /* ok */ }
})
</script>

<template>
  <section id="rsvp" class="r-section r-section--surface rsvp">
    <div class="r-container r-container--narrow">
      <p class="r-kicker r-reveal">Konfirmasi Kehadiran</p>
      <h2 class="r-title r-reveal">RSVP</h2>
      <div class="r-divider r-reveal"><span></span><i class="fa-regular fa-envelope"></i><span></span></div>

      <transition name="rsvp-swap" mode="out-in">
        <form v-if="!done" key="form" class="rsvp__form r-card" novalidate @submit.prevent="submit">
          <label class="rsvp__field">
            <span>Nama Lengkap</span>
            <input v-model="form.nama" type="text" placeholder="Nama Anda" :class="{ 'is-err': errors.nama }">
            <em v-if="errors.nama">{{ errors.nama }}</em>
          </label>

          <div class="rsvp__field">
            <span>Kehadiran</span>
            <div class="rsvp__seg" role="radiogroup" aria-label="Kehadiran">
              <button v-for="o in OPTS" :key="o" type="button" role="radio" :aria-checked="form.hadir === o"
                      class="rsvp__seg-btn" :class="{ 'is-on': form.hadir === o }" @click="form.hadir = o">{{ o }}</button>
            </div>
          </div>

          <div class="rsvp__field" v-show="form.hadir !== 'Tidak Hadir'">
            <span>Jumlah Tamu</span>
            <div class="rsvp__step">
              <button type="button" @click="step(-1)" aria-label="Kurangi"><i class="fa-solid fa-minus"></i></button>
              <span class="rsvp__step-val">{{ form.jumlah }}</span>
              <button type="button" @click="step(1)" aria-label="Tambah"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>

          <button class="r-btn r-btn--solid" type="submit" :disabled="sending">
            <i class="fa-solid fa-paper-plane"></i> {{ sending ? 'Mengirim…' : 'Kirim Konfirmasi' }}
          </button>
        </form>

        <div v-else key="done" class="rsvp__done r-card">
          <span class="rsvp__check"><i class="fa-solid fa-check"></i></span>
          <h3>Terima kasih, {{ form.nama.split(' ')[0] }}!</h3>
          <p>Konfirmasi Anda telah kami terima
            <strong>({{ form.hadir }}<template v-if="form.hadir !== 'Tidak Hadir'">, {{ form.jumlah }} tamu</template>)</strong>.
            Sampai jumpa di hari bahagia kami.</p>
          <button class="r-btn r-btn--ghost r-btn--sm" type="button" @click="edit"><i class="fa-solid fa-pen"></i> Ubah Konfirmasi</button>
        </div>
      </transition>
    </div>
  </section>
</template>

<style scoped>
.rsvp__form { padding: clamp(1.6rem, 5vw, 2.6rem); display: flex; flex-direction: column; gap: 1.3rem; }
.rsvp__field { display: flex; flex-direction: column; gap: .5rem; }
.rsvp__field > span { font-family: var(--font-sans); font-size: .7rem; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-soft); }
.rsvp__field input {
  width: 100%; padding: .9em 1em; border: 1px solid var(--line); border-radius: 10px;
  background: var(--bg); color: var(--ink); font-family: var(--font-sans); font-size: .95rem;
}
.rsvp__field input:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
.rsvp__field .is-err { border-color: #d16a6a; }
.rsvp__field em { color: #d16a6a; font-size: .74rem; font-style: normal; }

.rsvp__seg { display: grid; grid-template-columns: repeat(3, 1fr); gap: .4rem; }
.rsvp__seg-btn { padding: .8em .5em; border: 1px solid var(--line); border-radius: 10px; background: var(--bg); color: var(--ink-soft); font-family: var(--font-sans); font-size: .82rem; cursor: pointer; transition: background-color .3s, color .3s, border-color .3s; }
.rsvp__seg-btn.is-on { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }

.rsvp__step { display: inline-flex; align-items: center; gap: 1rem; }
.rsvp__step button { width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--accent); background: transparent; color: var(--accent); cursor: pointer; font-size: .85rem; transition: background-color .3s, color .3s; }
.rsvp__step button:hover { background: var(--accent); color: var(--accent-ink); }
.rsvp__step-val { font-family: var(--font-display); font-size: 1.5rem; color: var(--ink); min-width: 1.6em; text-align: center; }

.rsvp__done { padding: 2.8rem 1.6rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: .7rem; }
.rsvp__check { width: 66px; height: 66px; border-radius: 50%; display: grid; place-items: center; background: var(--accent); color: var(--accent-ink); font-size: 1.5rem; margin-bottom: .4rem; animation: rsvpPop .5s cubic-bezier(.2,1.4,.4,1) both; }
@keyframes rsvpPop { from { transform: scale(0); } to { transform: scale(1); } }
.rsvp__done h3 { font-family: var(--font-display); font-size: 1.6rem; color: var(--ink); }
.rsvp__done p { font-family: var(--font-serif); color: var(--ink-soft); max-width: 400px; line-height: 1.65; }
.rsvp__done strong { color: var(--accent); }

.rsvp-swap-enter-active, .rsvp-swap-leave-active { transition: opacity .35s, transform .35s; }
.rsvp-swap-enter-from { opacity: 0; transform: translateY(12px); }
.rsvp-swap-leave-to { opacity: 0; transform: translateY(-12px); }

@media (prefers-reduced-motion: reduce) { .rsvp__check { animation: none; } .rsvp__seg-btn, .rsvp__step button { transition: none; } }
</style>
