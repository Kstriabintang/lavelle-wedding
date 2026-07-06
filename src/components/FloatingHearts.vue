<script setup>
import { onMounted, ref } from 'vue'

const wrap = ref(null)
onMounted(() => {
  const el = wrap.value
  if (!el) return
  for (let i = 0; i < 14; i++) {
    const h = document.createElement('i')
    h.className = 'fa-solid fa-heart'
    const size = 10 + Math.random() * 22
    h.style.left = Math.random() * 100 + 'vw'
    h.style.fontSize = size + 'px'
    h.style.animationDuration = 9 + Math.random() * 12 + 's'
    h.style.animationDelay = -(Math.random() * 14) + 's'
    h.style.color = Math.random() > 0.5 ? '#d8c39a' : '#aeb892'
    el.appendChild(h)
  }
})
</script>

<template>
  <div class="hearts" ref="wrap" aria-hidden="true"></div>
</template>
