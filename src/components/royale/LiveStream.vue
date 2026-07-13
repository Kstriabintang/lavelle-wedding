<script setup>
// FASE B — Live streaming: tombol YouTube/Zoom. Tampil kondisional (hanya
// jika ada tautan). Section deep untuk kontras.
import { computed } from 'vue'
const props = defineProps({ live: { type: Object, default: () => ({}) } })
const show = computed(() => !!(props.live && (props.live.youtube || props.live.zoom)))
</script>

<template>
  <section v-if="show" id="live" class="r-section r-section--deep ls">
    <div class="r-container r-container--narrow">
      <p class="r-kicker r-reveal">Live Streaming</p>
      <h2 class="r-title r-reveal" style="color:#fff">Saksikan Langsung</h2>
      <div class="r-divider r-reveal"><span></span><i class="fa-solid fa-video"></i><span></span></div>
      <p class="r-lead r-reveal">{{ live.note }}</p>

      <div class="ls__btns">
        <a v-if="live.youtube" class="ls__btn ls__btn--yt r-reveal" :href="live.youtube" target="_blank" rel="noopener">
          <i class="fa-brands fa-youtube"></i> Gabung via YouTube
        </a>
        <a v-if="live.zoom" class="ls__btn ls__btn--zoom r-reveal d1" :href="live.zoom" target="_blank" rel="noopener">
          <i class="fa-solid fa-video"></i> Gabung via Zoom
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ls__btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-top: 2.2rem; }
.ls__btn { display: inline-flex; align-items: center; gap: .6em; padding: 1em 2em; border-radius: 50px; font-family: var(--font-sans); font-weight: 600; font-size: .82rem; letter-spacing: .04em; text-decoration: none; transition: transform .3s; }
.ls__btn i { font-size: 1.2rem; }
.ls__btn--yt { background: #ff0033; color: #fff; }
.ls__btn--zoom { background: #2d8cff; color: #fff; }
.ls__btn:hover { transform: translateY(-3px); }
@media (prefers-reduced-motion: reduce) { .ls__btn { transition: none; } }
</style>
