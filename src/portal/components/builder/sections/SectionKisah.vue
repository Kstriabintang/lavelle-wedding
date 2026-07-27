<script setup>
// Seksi Kisah Cinta — bab perjalanan (label/judul/cerita/foto). Foto opsional.
import PhotoInput from '../PhotoInput.vue'
const props = defineProps({ invite: { type: Object, required: true } })
function add() {
  const n = props.invite.story.length + 1
  props.invite.story.push({ year: `Bab ${String(n).padStart(2, '0')}`, title: '', desc: '', photo: '' })
}
function remove(i) { props.invite.story.splice(i, 1) }
</script>

<template>
  <div>
    <p class="f-hint">Ceritakan perjalanan cinta kalian per bab. Foto boleh dikosongkan (otomatis pakai foto utama).</p>
    <div v-for="(s, i) in invite.story" :key="i" class="kisah">
      <div class="f-row">
        <div class="f-field"><label>Label / Tahun</label><input class="f-input" v-model="s.year" placeholder="Bab 01 / 2020"></div>
        <div class="f-field"><label>Judul</label><input class="f-input" v-model="s.title" placeholder="Pertama Bertemu"></div>
      </div>
      <div class="f-field"><label>Cerita</label><textarea class="f-textarea" v-model="s.desc" placeholder="Ceritakan momen ini…"></textarea></div>
      <div class="kisah__photo"><PhotoInput v-model="s.photo" :label="`Foto bab ${i + 1} (opsional)`" /></div>
      <button type="button" class="gal-del" @click="remove(i)">Hapus bab ini</button>
    </div>
    <button type="button" class="gal-add" @click="add">+ Tambah Bab</button>
  </div>
</template>

<style scoped>
.kisah { padding-bottom: 1rem; margin-bottom: 1rem; border-bottom: 1px dashed var(--pb-line, rgba(201,162,75,.16)); }
.kisah:last-of-type { border-bottom: none; }
.kisah__photo { max-width: 130px; margin-top: .3rem; }
</style>
