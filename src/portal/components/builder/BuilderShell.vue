<script setup>
// Shell builder: panel form (kiri) | panggung pratinjau (kanan). Toggle HP/Desktop.
// Slot: #form, #preview, #toolbar (aksi di atas bingkai). Styling di assets/builder.css.
import { ref } from 'vue'
const showPreview = ref(false)
const device = ref('phone')   // phone | desktop
</script>

<template>
  <div class="bshell" :class="{ 'is-preview': showPreview, ['dev-' + device]: true }">
    <aside class="bshell__panel"><slot name="form" /></aside>

    <section class="bshell__stage">
      <div class="bshell__toolbar">
        <span class="bshell__live">Pratinjau langsung</span>
        <div class="bshell__seg" role="group" aria-label="Ukuran pratinjau">
          <button type="button" :class="{ 'is-on': device === 'phone' }" :aria-pressed="device === 'phone'" @click="device = 'phone'">HP</button>
          <button type="button" :class="{ 'is-on': device === 'desktop' }" :aria-pressed="device === 'desktop'" @click="device = 'desktop'">Desktop</button>
        </div>
        <slot name="toolbar" />
      </div>
      <div class="bshell__device">
        <span class="bshell__notch"></span>
        <div class="bshell__screen"><slot name="preview" /></div>
      </div>
    </section>

    <button class="bshell__fab" type="button" @click="showPreview = !showPreview">
      <span v-if="showPreview">✎ Kembali mengedit</span>
      <span v-else>◉ Lihat pratinjau</span>
    </button>
  </div>
</template>
