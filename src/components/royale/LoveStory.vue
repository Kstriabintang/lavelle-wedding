<script setup>
// 3.4 — Love story timeline dengan foto per milestone.
// Desktop: zig-zag kiri/kanan. Mobile: satu rel di kiri.
import { imgSrc } from './imgSrc.js'
defineProps({ story: { type: Array, default: () => [] } })
</script>

<template>
  <section id="cerita" class="r-section ls">
    <div class="r-container">
      <p class="r-kicker r-reveal">Perjalanan Kami</p>
      <h2 class="r-title r-reveal">Kisah Cinta</h2>
      <div class="r-divider r-reveal"><span></span><i class="fa-solid fa-infinity"></i><span></span></div>

      <ol class="ls__list">
        <li v-for="(s, i) in story" :key="i" class="ls__item r-reveal" :class="i % 2 ? 'is-right' : 'is-left'">
          <div class="ls__photo"><img :src="imgSrc(s.photo)" :alt="s.title" class="r-photo" loading="lazy"></div>
          <span class="ls__node"></span>
          <div class="ls__card">
            <span class="ls__year">{{ s.year }}</span>
            <h3 class="ls__title">{{ s.title }}</h3>
            <p class="ls__desc">{{ s.desc }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.ls__list { list-style: none; margin: 2rem 0 0; padding: 0; position: relative; }
.ls__list::before { content: ""; position: absolute; top: 6px; bottom: 6px; width: 2px; background: linear-gradient(var(--accent), transparent); opacity: .5; }
.ls__item { position: relative; display: grid; gap: 1rem; }
.ls__node { position: absolute; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); border: 3px solid var(--bg); box-shadow: 0 0 0 1px var(--accent); z-index: 2; top: 4px; }
.ls__photo { border-radius: 14px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 20px 44px -26px rgba(0, 0, 0, .5); aspect-ratio: 16/10; }
.ls__photo img { width: 100%; height: 100%; object-fit: cover; }
.ls__card { }
.ls__year { font-family: var(--font-serif); font-style: italic; color: var(--accent); font-size: 1.05rem; }
.ls__title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 600; color: var(--ink); margin: .1rem 0 .4rem; }
.ls__desc { font-family: var(--font-serif); font-size: 1.05rem; line-height: 1.6; color: var(--ink-soft); }

/* MOBILE: rel di kiri, konten di kanan */
.ls__list { padding-left: 2rem; }
.ls__list::before { left: 5px; }
.ls__item { margin-bottom: 2.6rem; }
.ls__node { left: -2rem; margin-left: -2px; }

/* TABLET+ */
@media (min-width: 640px) {
  .ls__photo { aspect-ratio: 16/9; }
}

/* DESKTOP: zig-zag dua sisi */
@media (min-width: 1024px) {
  .ls__list { padding-left: 0; }
  .ls__list::before { left: 50%; transform: translateX(-50%); }
  .ls__item { grid-template-columns: 1fr 1fr; gap: 2.6rem; align-items: center; margin-bottom: 3.5rem; }
  .ls__node { left: 50%; margin-left: -8px; top: 50%; margin-top: -8px; }
  .ls__item.is-left .ls__photo { grid-column: 1; }
  .ls__item.is-left .ls__card { grid-column: 2; text-align: left; padding-left: 1.5rem; }
  .ls__item.is-right .ls__photo { grid-column: 2; }
  .ls__item.is-right .ls__card { grid-column: 1; grid-row: 1; text-align: right; padding-right: 1.5rem; }
}
</style>
