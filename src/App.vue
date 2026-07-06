<script setup>
import { onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import PreLoader from './components/PreLoader.vue'
import FloatingHearts from './components/FloatingHearts.vue'
import SiteNav from './components/SiteNav.vue'
import SiteFooter from './components/SiteFooter.vue'
import WhatsappFloat from './components/WhatsappFloat.vue'

const router = useRouter()

// Reveal saat masuk viewport (menggantikan main.js lama, dengan stagger CSS tetap jalan)
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
  <PreLoader />
  <FloatingHearts />
  <SiteNav />
  <router-view />
  <SiteFooter />
  <WhatsappFloat />
</template>
