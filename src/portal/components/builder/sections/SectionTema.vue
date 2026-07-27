<script setup>
import { THEMES, THEME_IDS } from '../../../data/themes.js'
defineProps({ theme: { type: String, required: true } })
defineEmits(['update:theme'])
</script>

<template>
  <div>
    <p class="f-hint">Satu klik mengganti seluruh nuansa warna undangan.</p>
    <div class="f-themes">
      <button v-for="id in THEME_IDS" :key="id" type="button" class="f-theme"
              :class="{ 'is-on': theme === id }" @click="$emit('update:theme', id)">
        <span class="f-sw" :style="{ background: THEMES[id].swatch[0] }"></span>
        <span class="f-sw" :style="{ background: THEMES[id].swatch[1] }"></span>
        <span class="f-theme-label">{{ THEMES[id].label }}</span>
      </button>
    </div>
  </div>
</template>
