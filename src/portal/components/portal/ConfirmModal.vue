<script setup>
import { watch, nextTick, ref } from 'vue'
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Lanjutkan' },
  danger: { type: Boolean, default: false },
})
const emit = defineEmits(['confirm', 'cancel'])
const okBtn = ref(null)
function onKey(e) { if (e.key === 'Escape') emit('cancel') }
watch(() => props.open, async (v) => {
  if (v) { await nextTick(); okBtn.value && okBtn.value.focus() }
})
</script>

<template>
  <transition name="cm">
    <div v-if="open" class="cm" @keydown="onKey" @click.self="emit('cancel')">
      <div class="cm__box" role="dialog" aria-modal="true" :aria-label="title">
        <h3 class="cm__title">{{ title }}</h3>
        <p v-if="message" class="cm__msg">{{ message }}</p>
        <div class="cm__row">
          <button type="button" class="cm__cancel" @click="emit('cancel')">Batal</button>
          <button ref="okBtn" type="button" class="cm__ok" :class="{ 'is-danger': danger }" @click="emit('confirm')">{{ confirmLabel }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.cm { position: fixed; inset: 0; z-index: 70; display: grid; place-items: center; padding: 1.2rem; background: rgba(6,4,2,.66); backdrop-filter: blur(4px); }
.cm__box { width: min(92vw, 380px); background: #14100b; border: 1px solid rgba(201,162,75,.28); border-radius: 16px; padding: 1.4rem 1.4rem 1.2rem; box-shadow: 0 30px 60px -24px rgba(0,0,0,.85); }
.cm__title { font-family: 'Fraunces', serif; font-size: 1.2rem; color: #f1e7cf; }
.cm__msg { margin-top: .5rem; color: #b6ab8a; font-size: .88rem; line-height: 1.5; font-family: 'Jost', sans-serif; }
.cm__row { display: flex; justify-content: flex-end; gap: .6rem; margin-top: 1.3rem; }
.cm__cancel { min-height: 40px; padding: .5rem 1.1rem; border: 1px solid rgba(201,162,75,.3); border-radius: 10px; background: rgba(255,255,255,.03); color: #a99d80; font-family: 'Jost', sans-serif; font-size: .85rem; cursor: pointer; }
.cm__ok { min-height: 40px; padding: .5rem 1.3rem; border: none; border-radius: 10px; background: #d3ad55; color: #201907; font-family: 'Jost', sans-serif; font-weight: 600; font-size: .85rem; cursor: pointer; }
.cm__ok.is-danger { background: #c9564e; color: #fff; }
.cm__ok:focus-visible, .cm__cancel:focus-visible { outline: 2px solid #e9c97e; outline-offset: 2px; }
.cm-enter-active, .cm-leave-active { transition: opacity .2s; }
.cm-enter-from, .cm-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .cm-enter-active, .cm-leave-active { transition: none; } }
</style>
