<script setup>
// FASE D — Katalog tema dalam phone-mockup. Tiap tema = frame HP yang
// men-scroll tangkapan undangan asli (auto-scroll), + tautan ke demo live.
import { THEMES } from '../composables/useTheme'
const demoUrl = (id) => `/demo/royale/?theme=${id}`
</script>

<template>
  <section class="cat" id="tema">
    <div class="container">
      <div class="cat__head reveal">
        <p class="eyebrow"><span></span> 6 Tema Premium <span></span></p>
        <h2 class="cat__title">Satu undangan, enam suasana</h2>
        <p class="cat__desc">Ganti tema secara instan — warna, tipografi, dan nuansa foto berubah menyeluruh.
          Geser tiap layar HP untuk mengintip undangan aslinya.</p>
      </div>

      <div class="cat__row">
        <article v-for="t in THEMES" :key="t.id" class="cat__card reveal">
          <a class="cat__phone" :href="demoUrl(t.id)" :aria-label="`Buka demo tema ${t.name}`">
            <span class="cat__notch" aria-hidden="true"></span>
            <span class="cat__screen">
              <img class="cat__shot" :src="`/img/catalog/${t.id}.jpg`" :alt="`Undangan tema ${t.name}`" loading="lazy" width="440" height="4600">
            </span>
            <span class="cat__open"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
          </a>
          <div class="cat__meta">
            <span class="cat__sw"><i :style="{ background: t.swatch[0] }"></i><i :style="{ background: t.swatch[1] }"></i></span>
            <div>
              <h3 class="cat__name">{{ t.name }}</h3>
              <a class="cat__link" :href="demoUrl(t.id)">Lihat Demo <i class="fa-solid fa-arrow-right-long"></i></a>
            </div>
          </div>
        </article>
      </div>

      <p class="cat__hint reveal"><i class="fa-solid fa-hand-pointer"></i> Klik layar untuk membuka undangan versi lengkap</p>
    </div>
  </section>
</template>

<style scoped>
.cat { padding: clamp(3.5rem, 9vw, 7rem) 0; background: var(--bg-2, #ece0cb); }
.cat__head { text-align: center; max-width: 640px; margin: 0 auto clamp(2.4rem, 6vw, 4rem); }
.cat__title { font-family: var(--font-display, 'Fraunces', serif); color: var(--ink, #3b352a); font-size: clamp(1.9rem, 5vw, 3rem); line-height: 1.12; margin: .6rem 0 .8rem; }
.cat__desc { color: var(--ink-soft, #6d6151); line-height: 1.75; }

.cat__row {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1.4rem, 3vw, 2.4rem);
}
.cat__card { display: flex; flex-direction: column; align-items: center; }

/* Phone mockup */
.cat__phone {
  position: relative; display: block; width: 100%; max-width: 260px; aspect-ratio: 260 / 540;
  border-radius: 34px; padding: 10px; background: linear-gradient(145deg, #2a2a2e, #0e0e10);
  box-shadow: 0 30px 60px -26px rgba(0, 0, 0, .55), inset 0 0 0 1px rgba(255, 255, 255, .06);
  text-decoration: none;
}
.cat__notch { position: absolute; top: 16px; left: 50%; transform: translateX(-50%); width: 46px; height: 6px; border-radius: 6px; background: rgba(255, 255, 255, .22); z-index: 3; }
.cat__screen { position: absolute; inset: 10px; border-radius: 26px; overflow: hidden; background: #111; display: block; }
.cat__shot { position: absolute; top: 0; left: 0; width: 100%; height: auto; will-change: transform; animation: catScroll 24s ease-in-out infinite; }
@keyframes catScroll {
  0%, 7% { transform: translateY(0); }
  50% { transform: translateY(calc(-100% + 520px)); }
  93%, 100% { transform: translateY(0); }
}
.cat__open { position: absolute; right: 16px; bottom: 14px; z-index: 3; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: rgba(0, 0, 0, .5); color: #fff; font-size: .8rem; opacity: 0; transition: opacity .3s; backdrop-filter: blur(4px); }
.cat__phone:hover .cat__open { opacity: 1; }

.cat__meta { display: flex; align-items: center; gap: .8rem; margin-top: 1.2rem; }
.cat__sw { display: inline-flex; }
.cat__sw i { width: 18px; height: 18px; border-radius: 50%; display: block; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .12); }
.cat__sw i:last-child { margin-left: -7px; }
.cat__name { font-family: var(--font-display, serif); color: var(--ink, #3b352a); font-size: 1.1rem; margin: 0; }
.cat__link { font-size: .82rem; color: var(--gold-deep, #a8772f); text-decoration: none; display: inline-flex; align-items: center; gap: .4em; transition: gap .3s; }
.cat__link:hover { gap: .7em; }
.cat__hint { text-align: center; margin-top: 2.6rem; font-size: .86rem; color: var(--ink-soft, #6d6151); }
.cat__hint i { color: var(--gold, #c2954f); margin-right: .4em; }

/* MOBILE/TABLET: baris geser horizontal (scroll-snap) */
@media (max-width: 860px) {
  .cat__row { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: 74%; overflow-x: auto; scroll-snap-type: x mandatory; gap: 1.2rem; padding: 0 4vw 1rem; margin: 0 -4vw; scrollbar-width: none; }
  .cat__row::-webkit-scrollbar { display: none; }
  .cat__card { scroll-snap-align: center; }
}
@media (max-width: 520px) { .cat__row { grid-auto-columns: 82%; } }

@media (prefers-reduced-motion: reduce) { .cat__shot { animation: none; } }
</style>
