<script setup>
// Seksi Musik — link YouTube untuk lagu latar (auto-play saat undangan dibuka).
defineProps({ invite: { type: Object, required: true } })
</script>

<template>
  <div>
    <p class="f-hint">Tempel link <b>YouTube</b> lagu favoritmu — otomatis diputar saat undangan dibuka.
      Lagu dari TikTok? Cari judul lagunya di YouTube, lalu tempel link-nya di sini.</p>
    <div class="f-field">
      <label>Link YouTube</label>
      <input class="f-input" v-model="invite.music.link" inputmode="url"
             placeholder="https://youtu.be/xxxxxxxxxxx">
    </div>
    <div class="f-field">
      <label>Mulai dari detik ke- (opsional)</label>
      <input class="f-input" type="number" min="0" v-model.number="invite.music.start" placeholder="0">
    </div>
    <p class="f-hint" v-if="invite.music.link">🎵 Musik akan mulai otomatis begitu tamu menyentuh layar / membuka undangan.</p>
  </div>
</template>
