<script setup>
import { onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ScrollProgress from './components/ScrollProgress.vue'

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
  // fallback bila transisi/hook belum sempat memicu
  router.afterEach(() => nextTick(() => setTimeout(wireReveal, 80)))
})
</script>

<template>
  <ScrollProgress />
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in" @after-enter="wireReveal">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
