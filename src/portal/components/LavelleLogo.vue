<script setup>
// Logo Lavelle RESMI (logo web: "L" serif + sprig botani) dalam badge bundar putih —
// tampil bersih di latar terang maupun gelap. Opsi wordmark untuk header.
defineProps({ wordmark: { type: Boolean, default: false } })
</script>

<template>
  <span class="llg">
    <span class="llg__mark">
      <img src="/img/lavelle-logo-badge.png" alt="Lavelle" loading="eager" decoding="async" />
    </span>
    <span v-if="wordmark" class="llg__word">Lavelle</span>
  </span>
</template>

<style scoped>
.llg { display: inline-flex; align-items: center; gap: .7rem; color: inherit; line-height: 1; }
.llg__mark {
  width: 2.2em; height: 2.2em; flex: none; border-radius: 50%; overflow: hidden;
  background: #fff; display: grid; place-items: center;
  box-shadow: 0 0 0 1px rgba(183, 137, 58, .38), 0 3px 10px rgba(60, 45, 20, .12);
}
.llg__mark img { width: 84%; height: 84%; object-fit: contain; display: block; }
.llg__word { font-family: 'Fraunces', Georgia, serif; font-weight: 600; font-size: 1.5rem; letter-spacing: .01em; }
</style>
