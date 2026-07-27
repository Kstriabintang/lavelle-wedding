<script setup>
// Renderer undangan ASLI untuk subdomain klien (/u/:slug ← nama-klien.lavelle.my.id).
// Ambil undangan published dari Supabase → render InviteSinema penuh (gate, musik, motion).
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getInviteBySlug } from '../lib/invites.js'
import { mergeInvite } from '../data/schema.js'
import InviteRenderer from '../components/InviteRenderer.vue'

const route = useRoute()
const slug = route.params.slug
const state = ref('loading')   // loading | ok | notfound
const data = ref(mergeInvite({}))
const theme = ref('marun-emas')
const names = ref('')

useHead({
  title: () => (names.value ? `The Wedding of ${names.value} | Lavelle` : 'Undangan | Lavelle'),
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
  ],
})

function preventZoom(e) { e.preventDefault() }

onMounted(async () => {
  try {
    const inv = await getInviteBySlug(slug)
    if (!inv) { state.value = 'notfound'; return }
    data.value = mergeInvite(inv.data || {})
    theme.value = inv.theme || 'marun-emas'
    const h = data.value.hero
    names.value = `${h.bride || ''} & ${h.groom || ''}`.trim()
    state.value = 'ok'
    if (typeof document !== 'undefined') {
      document.documentElement.style.touchAction = 'pan-y'
      document.addEventListener('gesturestart', preventZoom, { passive: false })
      document.addEventListener('gesturechange', preventZoom, { passive: false })
    }
  } catch { state.value = 'notfound' }
})
onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.touchAction = ''
    document.removeEventListener('gesturestart', preventZoom)
    document.removeEventListener('gesturechange', preventZoom)
  }
})
</script>

<template>
  <InviteRenderer v-if="state === 'ok'" :template="data.template" :data="data" :theme="theme" />
  <div v-else class="ir">
    <div class="ir__box">
      <span class="ir__logo">Lavelle</span>
      <template v-if="state === 'notfound'">
        <h1 class="ir__h">Undangan tidak ditemukan</h1>
        <p class="ir__p">Tautan mungkin salah, atau undangan belum diterbitkan. Silakan cek kembali dengan pengirim.</p>
      </template>
      <template v-else>
        <p class="ir__p ir__p--load">Memuat undangan…</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.ir { min-height: 100vh; min-height: 100svh; display: grid; place-items: center; padding: 2rem; background: linear-gradient(180deg, #14110b, #0b0a08); font-family: 'Jost', system-ui, sans-serif; }
.ir__box { text-align: center; max-width: 380px; }
.ir__logo { font-family: 'Fraunces', serif; font-weight: 600; font-size: 1.6rem; color: #c9a24b; letter-spacing: .02em; }
.ir__h { margin-top: 1.4rem; font-family: 'Fraunces', serif; font-size: 1.6rem; color: #f1e7d3; }
.ir__p { margin-top: .7rem; color: #b0a789; line-height: 1.6; font-size: .95rem; }
.ir__p--load { margin-top: 1.4rem; font-style: italic; }
</style>
