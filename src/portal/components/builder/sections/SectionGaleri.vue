<script setup>
import PhotoInput from '../PhotoInput.vue'
const props = defineProps({ invite: { type: Object, required: true } })
function add() { if (props.invite.gallery.length < 12) props.invite.gallery.push({ src: '', cat: 'Prewedding' }) }
function remove(i) { props.invite.gallery.splice(i, 1) }
</script>

<template>
  <div>
    <p class="f-hint">Maksimal 12 foto. Klik kotak untuk unggah, foto otomatis dikompres.</p>
    <div class="f-photos">
      <div v-for="(g, i) in invite.gallery" :key="i" class="gal-item">
        <PhotoInput v-model="g.src" :label="`Foto ${i + 1}`" />
        <button type="button" class="gal-del" @click="remove(i)">Hapus</button>
      </div>
    </div>
    <button v-if="invite.gallery.length < 12" type="button" class="gal-add" @click="add">+ Tambah Foto ({{ invite.gallery.length }}/12)</button>
  </div>
</template>
