<script setup>
// Seksi Amplop Digital — rekening bank/e-wallet + QRIS opsional + WA konfirmasi.
import PhotoInput from '../PhotoInput.vue'
const props = defineProps({ invite: { type: Object, required: true } })
function add() {
  props.invite.gifts.push({ label: '', kind: 'bank', no: '', raw: '', an: '', brand: 'fa-building-columns' })
}
function remove(i) { props.invite.gifts.splice(i, 1) }
function syncRaw(g) { g.raw = (g.no || '').replace(/\s+/g, '') }
</script>

<template>
  <div>
    <p class="f-hint">Rekening/e-wallet untuk tamu yang ingin memberi tanda kasih. Kosongkan bila seksi ini tak dipakai (bisa juga disembunyikan di Kustomisasi).</p>
    <div v-for="(g, i) in invite.gifts" :key="i" class="hadiah">
      <div class="f-row">
        <div class="f-field"><label>Bank / E-wallet</label><input class="f-input" v-model="g.label" placeholder="BCA / Dana / OVO"></div>
        <div class="f-field"><label>Nomor</label><input class="f-input" v-model="g.no" @input="syncRaw(g)" placeholder="1234 5678 90"></div>
      </div>
      <div class="f-field"><label>Atas Nama</label><input class="f-input" v-model="g.an" placeholder="Nama pemilik rekening"></div>
      <button type="button" class="gal-del" @click="remove(i)">Hapus rekening</button>
    </div>
    <button type="button" class="gal-add" @click="add">+ Tambah Rekening</button>

    <div class="f-sub">QRIS (opsional)</div>
    <div class="hadiah__qris"><PhotoInput v-model="invite.qris" label="Unggah QRIS" /></div>

    <div class="f-field" style="margin-top:1rem">
      <label>WhatsApp Konfirmasi Hadiah (opsional)</label>
      <input class="f-input" v-model="invite.giftConfirmWa" inputmode="tel" placeholder="mis. 6281234567890">
    </div>
  </div>
</template>

<style scoped>
.hadiah { padding-bottom: .8rem; margin-bottom: .8rem; border-bottom: 1px dashed var(--pb-line, rgba(201,162,75,.16)); }
.hadiah:last-of-type { border-bottom: none; }
.hadiah__qris { max-width: 140px; }
</style>
