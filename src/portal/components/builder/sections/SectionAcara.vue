<script setup>
defineProps({ invite: { type: Object, required: true } })
</script>

<template>
  <div>
    <p class="f-hint">Detail akad & resepsi. Lokasi peta bisa nama gedung atau koordinat (mis. -0.12, 100.54).</p>
    <div v-for="(ev, i) in invite.events" :key="i">
      <p class="f-sub">{{ ev.tag || ('Acara ' + (i + 1)) }}</p>
      <div class="f-field"><label>Nama Acara</label><input class="f-input" v-model="ev.tag"></div>
      <div class="f-row">
        <div class="f-field"><label>Tanggal</label><input class="f-input" v-model="ev.date" placeholder="Sabtu, 19 Des 2026"></div>
        <div class="f-field"><label>Waktu</label><input class="f-input" v-model="ev.time" placeholder="08.00 WIB"></div>
      </div>
      <div class="f-field"><label>Tempat</label><input class="f-input" v-model="ev.place"></div>
    </div>
    <div class="f-field">
      <label>Lokasi Peta (alamat atau koordinat)</label>
      <input class="f-input" v-model="invite.mapsQuery" placeholder="-0.12, 100.54  atau  nama gedung">
    </div>
  </div>
</template>
