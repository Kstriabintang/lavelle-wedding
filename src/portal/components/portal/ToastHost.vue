<script setup>
import { useToast } from '../../composables/useToast.js'
const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="toasts" aria-live="polite" aria-atomic="false">
    <transition-group name="toast">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="'toast--' + t.type" role="status">
        <span class="toast__msg">{{ t.msg }}</span>
        <button v-if="t.retry" type="button" class="toast__act" @click="t.retry(); dismiss(t.id)">Coba lagi</button>
        <button type="button" class="toast__x" aria-label="Tutup" @click="dismiss(t.id)">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toasts { position: fixed; right: 1.1rem; bottom: 1.1rem; z-index: 60; display: flex; flex-direction: column; gap: .55rem; max-width: min(92vw, 360px); }
.toast { display: flex; align-items: center; gap: .7rem; padding: .7rem .9rem; border-radius: 12px; background: rgba(20,16,11,.96);
  border: 1px solid rgba(201,162,75,.3); color: #f1e7cf; font-family: 'Jost', sans-serif; font-size: .84rem; box-shadow: 0 18px 40px -18px rgba(0,0,0,.8); }
.toast--success { border-color: rgba(47,125,70,.6); }
.toast--error { border-color: rgba(224,119,107,.6); }
.toast__msg { flex: 1; }
.toast__act { background: rgba(201,162,75,.16); border: 1px solid rgba(201,162,75,.4); border-radius: 8px; color: #e9c97e; font-family: inherit; font-size: .78rem; padding: .3rem .7rem; cursor: pointer; white-space: nowrap; }
.toast__x { background: none; border: none; color: #a99d80; cursor: pointer; font-size: .8rem; line-height: 1; padding: .2rem; }
.toast__x:hover { color: #f1e7cf; }
.toast-enter-active, .toast-leave-active { transition: opacity .25s, transform .25s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
@media (prefers-reduced-motion: reduce) { .toast-enter-active, .toast-leave-active { transition: none; } }
</style>
