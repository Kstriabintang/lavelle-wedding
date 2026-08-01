<script setup>
import { ref } from 'vue'
defineProps({ text: { type: String, default: '' } })
const on = ref(false)
</script>

<template>
  <span class="hint" @mouseenter="on = true" @mouseleave="on = false">
    <button type="button" class="hint__btn" aria-label="Bantuan"
            @focus="on = true" @blur="on = false" @click.prevent="on = !on">?</button>
    <transition name="hint">
      <span v-if="on" class="hint__pop" role="tooltip"><slot>{{ text }}</slot></span>
    </transition>
  </span>
</template>

<style scoped>
.hint { position: relative; display: inline-flex; vertical-align: middle; margin-left: .35rem; }
.hint__btn { width: 18px; height: 18px; border-radius: 50%; border: 1px solid rgba(201,162,75,.45); background: rgba(201,162,75,.12); color: #d8b25e; font-size: .68rem; line-height: 1; cursor: help; display: grid; place-items: center; padding: 0; }
.hint__btn:focus-visible { outline: 2px solid #e9c97e; outline-offset: 2px; }
.hint__pop { position: absolute; bottom: 140%; left: 50%; transform: translateX(-50%); z-index: 20; width: max-content; max-width: 240px;
  background: #1c150c; color: #f1e7cf; border: 1px solid rgba(201,162,75,.3); border-radius: 9px; padding: .5rem .65rem; font-size: .74rem; line-height: 1.45; box-shadow: 0 14px 30px -14px rgba(0,0,0,.8); font-family: 'Jost', sans-serif; }
.hint-enter-active, .hint-leave-active { transition: opacity .15s; }
.hint-enter-from, .hint-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .hint-enter-active, .hint-leave-active { transition: none; } }
</style>
