<script setup>
import { ref, onMounted } from 'vue'

const dark = ref(false)

function apply(v) {
  document.documentElement.dataset.theme = v ? 'dark' : 'light'
}
function toggle() {
  dark.value = !dark.value
  apply(dark.value)
  try { localStorage.setItem('lavelle-theme', dark.value ? 'dark' : 'light') } catch (e) {}
}
onMounted(() => {
  dark.value = document.documentElement.dataset.theme === 'dark'
})
</script>

<template>
  <button class="theme-toggle" type="button" @click="toggle"
    :aria-label="dark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'"
    :title="dark ? 'Mode terang' : 'Mode gelap'">
    <i :class="dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
  </button>
</template>
