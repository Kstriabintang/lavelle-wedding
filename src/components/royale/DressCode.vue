<script setup>
// FASE B — Dress code: swatch warna yang bisa diklik untuk menyalin hex.
import { useInviteActions } from '../../composables/useInviteActions'
defineProps({ dress: { type: Object, default: () => ({ note: '', colors: [] }) } })
const { copied, copyText } = useInviteActions()
</script>

<template>
  <section id="dresscode" class="r-section dc">
    <div class="r-container r-container--narrow">
      <p class="r-kicker r-reveal">Dress Code</p>
      <h2 class="r-title r-reveal">Nuansa Busana</h2>
      <div class="r-divider r-reveal"><span></span><i class="fa-solid fa-shirt"></i><span></span></div>
      <p class="r-lead r-reveal">{{ dress.note }}</p>

      <div class="dc__row">
        <button v-for="(c, i) in dress.colors" :key="c.hex" type="button" class="dc__swatch r-reveal" :class="`d${i % 3}`"
                @click="copyText(c.hex, c.hex)" :aria-label="`Salin ${c.hex}`">
          <span class="dc__chip" :style="{ background: c.hex }"></span>
          <span class="dc__name">{{ c.name }}</span>
          <span class="dc__hex">{{ copied === c.hex ? 'Tersalin ✓' : c.hex }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dc__row { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(1rem, 4vw, 2rem); margin-top: 2.4rem; }
.dc__swatch { display: flex; flex-direction: column; align-items: center; gap: .6rem; background: none; border: none; cursor: pointer; padding: 0; }
.dc__chip { width: clamp(64px, 18vw, 92px); height: clamp(64px, 18vw, 92px); border-radius: 50%; box-shadow: 0 16px 34px -16px rgba(0, 0, 0, .45); border: 1px solid var(--line); transition: transform .35s cubic-bezier(.16, 1, .3, 1); }
.dc__swatch:hover .dc__chip { transform: translateY(-5px) scale(1.04); }
.dc__name { font-family: var(--font-display); font-size: .95rem; color: var(--ink); }
.dc__hex { font-family: var(--font-sans); font-size: .72rem; letter-spacing: .08em; color: var(--accent); text-transform: uppercase; }
@media (prefers-reduced-motion: reduce) { .dc__chip, .dc__swatch:hover .dc__chip { transition: none; transform: none; } }
</style>
