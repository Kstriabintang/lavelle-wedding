<script setup>
// Header lengket editor: bar kelengkapan + chip navigasi seksi (klik → lompat).
defineProps({
  progress: { type: Object, required: true },   // { sections, filledCore, coreTotal, pct }
  active: { type: String, default: '' },
})
const emit = defineEmits(['jump'])
</script>

<template>
  <div class="snav">
    <div class="snav__bar">
      <span class="snav__label">Kelengkapan</span>
      <span class="snav__track"><span class="snav__fill" :style="{ width: (progress.pct * 100) + '%' }"></span></span>
      <span class="snav__count">{{ progress.filledCore }}/{{ progress.coreTotal }} seksi inti</span>
    </div>
    <div class="snav__chips">
      <button v-for="s in progress.sections" :key="s.k" type="button" class="snav__chip"
              :class="{ 'is-active': active === s.k, 'is-filled': s.filled, 'is-opt': !s.core }"
              :aria-current="active === s.k ? 'true' : undefined"
              :title="s.label + (s.core ? (s.filled ? ' — terisi' : ' — belum diisi') : ' — opsional')"
              @click="emit('jump', s.k)">
        <span class="snav__mark" aria-hidden="true">{{ s.core ? (s.filled ? '✓' : '○') : '·' }}</span>
        <span class="snav__num">{{ s.num }}</span>
        <span class="snav__name">{{ s.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.snav { position: sticky; top: 0; z-index: 4; background: rgba(20,16,11,.92); backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(201,162,75,.16); padding: .7rem 1.5rem .55rem; }
.snav__bar { display: flex; align-items: center; gap: .6rem; margin-bottom: .55rem; }
.snav__label { font-size: .62rem; text-transform: uppercase; letter-spacing: .12em; color: #a99d80; white-space: nowrap; }
.snav__track { flex: 1; height: 5px; border-radius: 40px; background: rgba(201,162,75,.14); overflow: hidden; }
.snav__fill { display: block; height: 100%; background: linear-gradient(90deg, #d8b25e, #e9c97e); border-radius: 40px; transition: width .35s ease; }
.snav__count { font-size: .68rem; color: #d8b25e; white-space: nowrap; }
.snav__chips { display: flex; gap: .4rem; overflow-x: auto; scrollbar-width: none; padding-bottom: .1rem; }
.snav__chips::-webkit-scrollbar { display: none; }
.snav__chip { display: inline-flex; align-items: center; gap: .3rem; flex: none; min-height: 34px; padding: .3rem .6rem;
  border: 1px solid rgba(201,162,75,.22); border-radius: 40px; background: rgba(0,0,0,.24); color: #a99d80;
  font-family: 'Jost', sans-serif; font-size: .72rem; cursor: pointer; white-space: nowrap; transition: border-color .2s, color .2s, background-color .2s; }
.snav__chip:hover { border-color: rgba(201,162,75,.5); color: #f1e7cf; }
.snav__chip.is-filled { color: #e6dcc4; }
.snav__chip.is-filled .snav__mark { color: #74c98c; }
.snav__chip.is-active { border-color: #d8b25e; background: rgba(201,162,75,.14); color: #f1e7cf; box-shadow: 0 0 0 1px rgba(201,162,75,.3); }
.snav__chip.is-opt { opacity: .8; }
.snav__mark { font-size: .8rem; line-height: 1; }
.snav__num { font-family: 'Fraunces', serif; font-size: .66rem; opacity: .7; }
.snav__chip:focus-visible { outline: 2px solid #e9c97e; outline-offset: 2px; }
@media (max-width: 600px) { .snav__name { display: none; } }
</style>
