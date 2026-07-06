<script setup>
import { onMounted, ref } from 'vue'

const done = ref(false)
const gone = ref(false)

onMounted(() => {
  const start = Date.now()
  const hide = () => {
    done.value = true
    setTimeout(() => { gone.value = true }, 800)
  }
  const finish = () => setTimeout(hide, Math.max(0, 800 - (Date.now() - start)))
  if (document.readyState === 'complete') finish()
  else window.addEventListener('load', finish, { once: true })
  setTimeout(hide, 4000) // fallback
})
</script>

<template>
  <div v-if="!gone" class="preloader" :class="{ done }">
    <div class="pl__inner">
      <div class="pl__logo"><img src="/img/lavelle-logo.png" alt="Lavelle"></div>
      <div class="pl__name">Lavelle</div>
      <div class="pl__bar"><span></span></div>
      <p class="pl__tag">Menyiapkan momen istimewa&hellip;</p>
    </div>
  </div>
</template>
