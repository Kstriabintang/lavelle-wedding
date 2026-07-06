<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ThemeToggle from './ThemeToggle.vue'

const scrolled = ref(false)
const open = ref(false)

const onScroll = () => { scrolled.value = window.scrollY > 40 }
const openMenu = () => { open.value = true }
const closeMenu = () => { open.value = false }
const onKey = (e) => { if (e.key === 'Escape') closeMenu() }

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKey)
})

const links = [
  { href: '/#keunggulan', label: 'Keunggulan' },
  { href: '/#galeri', label: 'Galeri' },
  { href: '/#paket', label: 'Paket' },
  { href: '/#demo', label: 'Demo' },
  { href: '/#ulasan', label: 'Ulasan' },
  { href: '/#cara-pesan', label: 'Cara Pesan' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/blog/', label: 'Blog' },
]
</script>

<template>
  <header class="nav" :class="{ scrolled }">
    <div class="container nav__inner">
      <a href="/#home" class="brand">
        <span class="brand__mark"><img src="/img/lavelle-logo.png" alt="Lavelle"></span>
        <span class="brand__name">Lavelle</span>
      </a>
      <nav class="nav__links" :class="{ open }">
        <button class="nav__close" aria-label="Tutup menu" @click="closeMenu"><i class="fa-solid fa-xmark"></i></button>
        <a v-for="l in links" :key="l.href" :href="l.href" @click="closeMenu">{{ l.label }}</a>
        <a href="/#kontak" class="btn btn--gold btn--sm" @click="closeMenu">Pesan Sekarang</a>
      </nav>
      <div class="nav__actions">
        <ThemeToggle />
        <button class="nav__toggle" aria-label="Menu" @click="openMenu"><i class="fa-solid fa-bars"></i></button>
      </div>
    </div>
  </header>
  <div class="nav__overlay" :class="{ open }" aria-hidden="true" @click="closeMenu"></div>
</template>
