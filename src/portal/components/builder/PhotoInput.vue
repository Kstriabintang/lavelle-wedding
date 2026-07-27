<script setup>
// Input 1 foto: pilih file → kompres di browser → data URL (aman lintas iframe & localStorage).
// v-model = data URL string. (Di Fase backend, diganti unggah ke storage → URL https.)
import { ref, inject } from 'vue'
import { compressImage } from '../../lib/compressImage.js'
import { uploadPhoto } from '../../lib/storage.js'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Foto' },
})
const emit = defineEmits(['update:modelValue'])
const busy = ref(false)
const inputEl = ref(null)

// Bila di dalam editor Supabase (id disediakan) → unggah ke storage (URL https).
// Bila tidak (demo lokal) → data URL.
const inviteId = inject('lavelle-invite-id', null)

function blobToDataURL(blob) {
  return new Promise((res, rej) => {
    const fr = new FileReader()
    fr.onload = () => res(fr.result)
    fr.onerror = () => rej(new Error('baca gagal'))
    fr.readAsDataURL(blob)
  })
}

async function onPick(e) {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  busy.value = true
  try {
    if (inviteId) {
      const key = (props.label || 'foto').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24) || 'foto'
      emit('update:modelValue', await uploadPhoto(inviteId, key, file))
    } else {
      const blob = await compressImage(file, { maxEdge: 1400, quality: 0.8 })
      emit('update:modelValue', await blobToDataURL(blob))
    }
  } catch (err) { /* diabaikan */ }
  finally { busy.value = false; if (inputEl.value) inputEl.value.value = '' }
}
function trigger() { inputEl.value && inputEl.value.click() }
function clear() { emit('update:modelValue', '') }
</script>

<template>
  <div class="pin">
    <button type="button" class="pin__thumb" :class="{ 'is-empty': !modelValue }" @click="trigger" :aria-label="`Unggah ${label}`">
      <img v-if="modelValue" :src="modelValue" alt="">
      <span v-else class="pin__plus">＋</span>
      <span v-if="busy" class="pin__busy">mengompres…</span>
    </button>
    <div class="pin__bar">
      <span class="pin__label">{{ label }}</span>
      <button v-if="modelValue" type="button" class="pin__del" @click="clear">Hapus</button>
    </div>
    <input ref="inputEl" type="file" accept="image/*" class="pin__file" @change="onPick">
  </div>
</template>

<style scoped>
.pin { display: flex; flex-direction: column; gap: .35rem; }
.pin__thumb {
  position: relative; width: 100%; aspect-ratio: 3/4; border-radius: 12px; overflow: hidden;
  border: 1px solid var(--pb-line-2, #e0d5be); background: rgba(0, 0, 0, .28); cursor: pointer; padding: 0;
  display: grid; place-items: center; transition: border-color .2s, box-shadow .2s;
}
.pin__thumb.is-empty { border-style: dashed; }
.pin__thumb:hover { border-color: var(--pb-gold, #b7893a); box-shadow: 0 0 0 3px rgba(216, 178, 94, .2); }
.pin__thumb img { width: 100%; height: 100%; object-fit: cover; }
.pin__plus { font-size: 1.7rem; color: #b79a5e; font-weight: 300; }
.pin__busy { position: absolute; inset: auto 0 0 0; background: rgba(0, 0, 0, .58); color: #fff; font-size: .68rem; padding: .25rem; text-align: center; letter-spacing: .04em; }
.pin__bar { display: flex; align-items: center; justify-content: space-between; gap: .4rem; }
.pin__label { font-size: .68rem; color: var(--pb-muted, #90836d); }
.pin__del { background: none; border: none; color: #b06a6a; font-size: .68rem; cursor: pointer; }
.pin__del:hover { text-decoration: underline; }
.pin__file { display: none; }
</style>
