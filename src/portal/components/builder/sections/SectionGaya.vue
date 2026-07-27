<script setup>
// Seksi Kustomisasi — kebebasan kreatif: pasangan font, ukuran teks, warna aksen bebas,
// & tampil/sembunyikan seksi. Mengedit invite.style (reaktif → pratinjau live).
import { FONT_PAIRS, FONT_KEYS, SIZE_KEYS, SIZE_LABELS, HIDEABLE } from '../../../data/inviteStyle.js'
const props = defineProps({ invite: { type: Object, required: true } })
function toggleHide(k) {
  if (!props.invite.style.hide) props.invite.style.hide = {}
  props.invite.style.hide[k] = !props.invite.style.hide[k]
}
</script>

<template>
  <div class="gaya">
    <p class="f-hint">Bebas berkreasi — semua perubahan langsung terlihat di pratinjau.</p>

    <div class="f-field">
      <label>Pasangan Font</label>
      <div class="f-themes">
        <button v-for="k in FONT_KEYS" :key="k" type="button" class="f-theme" :class="{ 'is-on': invite.style.font === k }" @click="invite.style.font = k">
          <span class="f-theme-text">
            <span class="f-theme-name">{{ FONT_PAIRS[k].label }}</span>
            <span class="f-theme-desc">{{ FONT_PAIRS[k].desc }}</span>
          </span>
        </button>
      </div>
    </div>

    <div class="f-field">
      <label>Ukuran Teks</label>
      <div class="gaya__sizes">
        <button v-for="s in SIZE_KEYS" :key="s" type="button" class="gaya__size" :class="{ 'is-on': invite.style.size === s }" @click="invite.style.size = s">{{ SIZE_LABELS[s] }}</button>
      </div>
    </div>

    <div class="f-field">
      <label>Warna Aksen (bebas)</label>
      <div class="gaya__accent">
        <input type="color" class="gaya__color" :value="invite.style.accent || '#c9a24b'" @input="invite.style.accent = $event.target.value">
        <span class="gaya__accent-val">{{ invite.style.accent ? invite.style.accent.toUpperCase() : 'Ikut tema' }}</span>
        <button v-if="invite.style.accent" type="button" class="gaya__reset" @click="invite.style.accent = ''">Kembali ke tema</button>
      </div>
      <p class="f-hint">Kosongkan untuk memakai warna dari Tema Warna.</p>
    </div>

    <div class="f-field">
      <label>Tampilkan / Sembunyikan Seksi</label>
      <div class="gaya__hides">
        <label v-for="s in HIDEABLE" :key="s.k" class="gaya__check">
          <input type="checkbox" :checked="!(invite.style.hide && invite.style.hide[s.k])" @change="toggleHide(s.k)">
          <span>{{ s.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gaya__sizes { display: flex; gap: .5rem; }
.gaya__size { flex: 1; padding: .58rem; border: 1px solid var(--pb-line-2); border-radius: 10px; background: var(--pb-white); color: var(--pb-ink); font-family: inherit; font-size: .88rem; cursor: pointer; transition: border-color .2s, background-color .2s; }
.gaya__size:hover { border-color: var(--pb-gold-lite); }
.gaya__size.is-on { border-color: var(--pb-gold); background: rgba(201, 162, 75, .16); }
.gaya__accent { display: flex; align-items: center; gap: .7rem; }
.gaya__color { width: 48px; height: 36px; border: 1px solid var(--pb-line-2); border-radius: 8px; background: none; cursor: pointer; padding: 2px; }
.gaya__accent-val { font-size: .82rem; color: var(--pb-muted); font-variant-numeric: tabular-nums; }
.gaya__reset { margin-left: auto; background: none; border: none; color: var(--pb-gold); font-size: .78rem; cursor: pointer; font-family: inherit; }
.gaya__reset:hover { text-decoration: underline; }
.gaya__hides { display: grid; grid-template-columns: 1fr 1fr; gap: .55rem; margin-top: .2rem; }
.gaya__check { display: flex; align-items: center; gap: .5rem; font-size: .86rem; color: var(--pb-ink); cursor: pointer; }
.gaya__check input { accent-color: var(--pb-gold); width: 17px; height: 17px; }
</style>
