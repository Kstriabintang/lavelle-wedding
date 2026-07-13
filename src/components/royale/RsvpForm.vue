<script setup>
// 3.7 — RSVP: nama, jumlah tamu, kehadiran, pesan. Validasi client-side,
// feedback sukses elegan. Meng-emit entri agar tampil di Ucapan (3.9).
import { ref, reactive } from 'vue'

const emit = defineEmits(['submitted'])

const form = reactive({ nama: '', jumlah: 1, hadir: 'Hadir', pesan: '' })
const errors = reactive({ nama: '', jumlah: '' })
const done = ref(false)

function validate() {
  errors.nama = form.nama.trim() ? '' : 'Nama wajib diisi.'
  errors.jumlah = (form.jumlah >= 1 && form.jumlah <= 10) ? '' : 'Jumlah 1–10.'
  return !errors.nama && !errors.jumlah
}
function submit() {
  if (!validate()) return
  emit('submitted', { name: form.nama.trim(), hadir: form.hadir, msg: form.pesan.trim() || '—' })
  done.value = true
}
function reset() {
  form.nama = ''; form.jumlah = 1; form.hadir = 'Hadir'; form.pesan = ''
  done.value = false
}
</script>

<template>
  <section id="rsvp" class="r-section r-section--surface rsvp">
    <div class="r-container r-container--narrow">
      <p class="r-kicker r-reveal">Konfirmasi Kehadiran</p>
      <h2 class="r-title r-reveal">RSVP</h2>
      <div class="r-divider r-reveal"><span></span><i class="fa-regular fa-envelope"></i><span></span></div>

      <transition name="rsvp-swap" mode="out-in">
        <form v-if="!done" key="form" class="rsvp__form r-card r-reveal" novalidate @submit.prevent="submit">
          <label class="rsvp__field">
            <span>Nama Lengkap</span>
            <input v-model="form.nama" type="text" placeholder="Nama Anda" :class="{ 'is-err': errors.nama }">
            <em v-if="errors.nama">{{ errors.nama }}</em>
          </label>

          <div class="rsvp__two">
            <label class="rsvp__field">
              <span>Kehadiran</span>
              <select v-model="form.hadir">
                <option>Hadir</option>
                <option>Tidak Hadir</option>
                <option>Masih Ragu</option>
              </select>
            </label>
            <label class="rsvp__field">
              <span>Jumlah Tamu</span>
              <input v-model.number="form.jumlah" type="number" min="1" max="10" :class="{ 'is-err': errors.jumlah }">
              <em v-if="errors.jumlah">{{ errors.jumlah }}</em>
            </label>
          </div>

          <label class="rsvp__field">
            <span>Ucapan &amp; Doa</span>
            <textarea v-model="form.pesan" rows="3" placeholder="Tulis ucapan & doa untuk mempelai"></textarea>
          </label>

          <button class="r-btn r-btn--solid" type="submit"><i class="fa-solid fa-paper-plane"></i> Kirim Konfirmasi</button>
        </form>

        <div v-else key="done" class="rsvp__done r-card r-reveal">
          <span class="rsvp__check"><i class="fa-solid fa-check"></i></span>
          <h3>Terima kasih!</h3>
          <p>Konfirmasi kehadiran Anda telah kami terima. Sampai jumpa di hari bahagia kami.</p>
          <button class="r-btn r-btn--ghost r-btn--sm" type="button" @click="reset"><i class="fa-solid fa-rotate-left"></i> Kirim Lagi</button>
        </div>
      </transition>
    </div>
  </section>
</template>

<style scoped>
.rsvp__form { padding: clamp(1.6rem, 5vw, 2.4rem); display: flex; flex-direction: column; gap: 1.1rem; }
.rsvp__field { display: flex; flex-direction: column; gap: .4rem; }
.rsvp__field > span { font-family: var(--font-sans); font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); }
.rsvp__field input, .rsvp__field select, .rsvp__field textarea {
  width: 100%; padding: .85em 1em; border: 1px solid var(--line); border-radius: 10px;
  background: var(--bg); color: var(--ink); font-family: var(--font-sans); font-size: .95rem;
}
.rsvp__field input:focus, .rsvp__field select:focus, .rsvp__field textarea:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
.rsvp__field .is-err { border-color: #d16a6a; }
.rsvp__field em { color: #d16a6a; font-size: .74rem; font-style: normal; }
.rsvp__two { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

.rsvp__done { padding: 2.6rem 1.6rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: .6rem; }
.rsvp__check { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; background: var(--accent); color: var(--accent-ink); font-size: 1.5rem; margin-bottom: .4rem; animation: rsvpPop .5s cubic-bezier(.2,1.4,.4,1) both; }
@keyframes rsvpPop { from { transform: scale(0); } to { transform: scale(1); } }
.rsvp__done h3 { font-family: var(--font-display); font-size: 1.5rem; color: var(--ink); }
.rsvp__done p { font-family: var(--font-serif); color: var(--ink-soft); max-width: 380px; line-height: 1.6; }

.rsvp-swap-enter-active, .rsvp-swap-leave-active { transition: opacity .35s, transform .35s; }
.rsvp-swap-enter-from { opacity: 0; transform: translateY(12px); }
.rsvp-swap-leave-to { opacity: 0; transform: translateY(-12px); }

@media (max-width: 520px) { .rsvp__two { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .rsvp__check { animation: none; } }
</style>
