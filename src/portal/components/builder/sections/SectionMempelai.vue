<script setup>
import PhotoInput from '../PhotoInput.vue'
defineProps({ invite: { type: Object, required: true } })
</script>

<template>
  <div>
    <div class="f-row">
      <div class="f-field"><label>Panggilan Wanita</label><input class="f-input" v-model="invite.hero.bride"></div>
      <div class="f-field"><label>Panggilan Pria</label><input class="f-input" v-model="invite.hero.groom"></div>
    </div>
    <div class="f-field"><label>Tanggal Hari-H (untuk hitung mundur)</label><input class="f-input" type="date" v-model="invite.hero.date"></div>
    <div class="f-field"><label>Tanggal (teks tampil)</label><input class="f-input" v-model="invite.hero.dateText" placeholder="Minggu, 20 Desember 2026"></div>

    <p class="f-sub">Mempelai Wanita</p>
    <div class="f-field"><label>Nama Lengkap</label><input class="f-input" v-model="invite.bride.name"></div>
    <div class="f-field"><label>Orang Tua</label><input class="f-input" v-model="invite.bride.parents" placeholder="Putri dari Bapak … & Ibu …"></div>

    <p class="f-sub">Mempelai Pria</p>
    <div class="f-field"><label>Nama Lengkap</label><input class="f-input" v-model="invite.groom.name"></div>
    <div class="f-field"><label>Orang Tua</label><input class="f-input" v-model="invite.groom.parents" placeholder="Putra dari Bapak … & Ibu …"></div>

    <p class="f-sub">Foto</p>
    <div class="f-photos">
      <PhotoInput v-model="invite.hero.photo" label="Foto Hero (utama)" />
      <PhotoInput v-model="invite.closing.photo" label="Foto Penutup" />
      <PhotoInput v-model="invite.bride.photo" label="Foto Wanita" />
      <PhotoInput v-model="invite.groom.photo" label="Foto Pria" />
    </div>
  </div>
</template>
