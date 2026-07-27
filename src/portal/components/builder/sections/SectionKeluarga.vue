<script setup>
// Seksi Keluarga & Turut Mengundang — daftar nama (satu baris = satu nama).
import { computed } from 'vue'
const props = defineProps({ invite: { type: Object, required: true } })
function listModel(key) {
  return computed({
    get: () => (props.invite.family[key] || []).join('\n'),
    set: (v) => { props.invite.family[key] = v.split('\n').map((s) => s.trim()).filter(Boolean) },
  })
}
const bride = listModel('bride')
const groom = listModel('groom')
const also = listModel('alsoInviting')
</script>

<template>
  <div>
    <p class="f-hint">Tulis satu nama per baris. Kosongkan bila tak dipakai.</p>
    <div class="f-field">
      <label>Catatan Keluarga (opsional)</label>
      <textarea class="f-textarea" v-model="invite.family.note" placeholder="Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir…"></textarea>
    </div>
    <div class="f-field">
      <label>Keluarga Mempelai Wanita</label>
      <textarea class="f-textarea" v-model="bride" placeholder="Bapak … & Ibu …&#10;(satu nama per baris)"></textarea>
    </div>
    <div class="f-field">
      <label>Keluarga Mempelai Pria</label>
      <textarea class="f-textarea" v-model="groom" placeholder="Bapak … & Ibu …"></textarea>
    </div>
    <div class="f-field">
      <label>Turut Mengundang (opsional)</label>
      <textarea class="f-textarea" v-model="also" placeholder="Keluarga Besar …&#10;Sahabat …"></textarea>
    </div>
  </div>
</template>
