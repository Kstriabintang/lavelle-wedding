<script setup>
import { onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reveal saat masuk viewport (dipakai lintas halaman)
function wireReveal() {
  if (typeof IntersectionObserver === 'undefined') return
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }),
    { threshold: 0.12 },
  )
  document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
}

onMounted(() => {
  wireReveal()
  router.afterEach(() => nextTick(wireReveal))
})
</script>

<template>
  <router-view />
</template>
