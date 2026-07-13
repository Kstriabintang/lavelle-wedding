<script setup>
// Pemilih tema mengambang — ganti tema instan (warna, font, ornamen, filter foto).
import { ref } from 'vue'
import { useTheme } from '../../composables/useTheme'

const { THEMES, active, setTheme } = useTheme()
const open = ref(false)
</script>

<template>
  <div class="ts" :class="{ 'is-open': open }">
    <transition name="ts-fan">
      <div v-if="open" class="ts__panel" role="listbox" aria-label="Pilih tema">
        <p class="ts__title">Ganti Tema</p>
        <ul class="ts__list">
          <li v-for="t in THEMES" :key="t.id">
            <button class="ts__opt" :class="{ 'is-active': t.id === active }" role="option"
                    :aria-selected="t.id === active" @click="setTheme(t.id)">
              <span class="ts__sw" :style="{ background: t.swatch[1] }">
                <i :style="{ background: t.swatch[0] }"></i>
              </span>
              <span class="ts__name">{{ t.name }}</span>
              <i v-if="t.id === active" class="fa-solid fa-check ts__chk"></i>
            </button>
          </li>
        </ul>
      </div>
    </transition>
    <button class="ts__toggle" :aria-expanded="open" aria-label="Ganti tema" @click="open = !open">
      <i :class="open ? 'fa-solid fa-xmark' : 'fa-solid fa-palette'"></i>
    </button>
  </div>
</template>

<style scoped>
.ts { position: fixed; right: 20px; bottom: 20px; z-index: 90; display: flex; flex-direction: column; align-items: flex-end; gap: .8rem; }
/* Mobile: naik di atas quick-nav (bar bawah) agar tak bertabrakan */
@media (max-width: 1023px) { .ts { bottom: 80px; right: 14px; } }
.ts__toggle {
  width: 54px; height: 54px; border-radius: 50%; border: 1px solid var(--line, rgba(0,0,0,.2));
  background: var(--accent, #b8912f); color: var(--accent-ink, #fff); font-size: 1.2rem; cursor: pointer;
  display: grid; place-items: center; box-shadow: 0 14px 34px -12px rgba(0, 0, 0, .55); transition: transform .3s;
}
.ts__toggle:hover { transform: scale(1.06) rotate(8deg); }
.ts__panel {
  background: var(--surface, #fff); border: 1px solid var(--line, rgba(0,0,0,.15)); border-radius: 18px;
  padding: 1rem; width: 232px; box-shadow: 0 24px 60px -20px rgba(0, 0, 0, .55); backdrop-filter: blur(6px);
}
.ts__title { font-family: var(--font-sans, sans-serif); font-size: .64rem; letter-spacing: .22em; text-transform: uppercase; color: var(--ink-soft, #888); margin-bottom: .7rem; }
.ts__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .3rem; }
.ts__opt {
  width: 100%; display: flex; align-items: center; gap: .7rem; padding: .55rem .6rem; border: 1px solid transparent;
  border-radius: 12px; background: transparent; cursor: pointer; transition: background .25s, border-color .25s;
  font-family: var(--font-sans, sans-serif); color: var(--ink, #333); text-align: left;
}
.ts__opt:hover { background: var(--surface-2, rgba(0,0,0,.04)); }
.ts__opt.is-active { border-color: var(--accent, #b8912f); background: var(--surface-2, rgba(0,0,0,.05)); }
.ts__sw { flex: none; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .1); }
.ts__sw i { width: 13px; height: 13px; border-radius: 50%; display: block; }
.ts__name { flex: 1; font-size: .82rem; }
.ts__chk { color: var(--accent, #b8912f); font-size: .8rem; }

.ts-fan-enter-active, .ts-fan-leave-active { transition: opacity .28s ease, transform .28s cubic-bezier(.2, .9, .3, 1); transform-origin: bottom right; }
.ts-fan-enter-from, .ts-fan-leave-to { opacity: 0; transform: translateY(12px) scale(.94); }

@media (prefers-reduced-motion: reduce) { .ts__toggle:hover { transform: none; } .ts-fan-enter-active, .ts-fan-leave-active { transition: opacity .2s; } }
</style>
