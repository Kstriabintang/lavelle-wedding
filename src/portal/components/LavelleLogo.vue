<script setup>
// Logo Lavelle — monogram cincin "L" + sprig (line-art elegan). Warna = currentColor
// (emas di latar gelap, gelap di latar terang). Opsi wordmark untuk header.
defineProps({ wordmark: { type: Boolean, default: false } })
</script>

<template>
  <span class="llg">
    <svg class="llg__mark" viewBox="0 0 100 100" aria-hidden="true" fill="none">
      <circle cx="50" cy="50" r="47" stroke="currentColor" stroke-width="1.1" />
      <circle cx="50" cy="50" r="42" stroke="currentColor" stroke-width="0.5" opacity="0.55" />
      <text x="50" y="66" text-anchor="middle" font-family="'Fraunces', Georgia, serif" font-weight="600" font-size="46" fill="currentColor">L</text>
      <path d="M37 77 q13 7 26 0" stroke="currentColor" stroke-width="0.9" />
      <circle cx="50" cy="80" r="1.3" fill="currentColor" />
    </svg>
    <span v-if="wordmark" class="llg__word">Lavelle</span>
  </span>
</template>

<style scoped>
.llg { display: inline-flex; align-items: center; gap: .65rem; color: inherit; line-height: 1; }
.llg__mark { width: 1.9em; height: 1.9em; display: block; flex: none; }
.llg__word { font-family: 'Fraunces', Georgia, serif; font-weight: 600; font-size: 1.5rem; letter-spacing: .01em; }
</style>
