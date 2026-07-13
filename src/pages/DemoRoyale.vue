<script setup>
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useTheme } from '../composables/useTheme'
import { royale } from '../data/royale'
import ThemeSwitcher from '../components/royale/ThemeSwitcher.vue'

const { theme, styleVars, isDark, initTheme } = useTheme()
const r = royale

useHead({
  title: 'Royale — Undangan Premium Multi-Tema | Lavelle',
  meta: [{ name: 'robots', content: 'noindex' }],
})

onMounted(() => { initTheme() })
</script>

<template>
  <div class="royale" :class="[`is-${theme.mode}`, `t-${theme.id}`]" :style="styleVars">
    <ThemeSwitcher />

    <!-- HERO -->
    <section class="r-hero">
      <div class="r-hero__photo" :style="{ backgroundImage: `url(/img/mentahan/${r.hero.photo}.jpeg)` }"></div>
      <div class="r-hero__overlay"></div>
      <div class="r-hero__inner">
        <p class="r-eyebrow">{{ r.hero.kicker }}</p>
        <h1 class="r-names">{{ r.hero.bride }} <span>&amp;</span> {{ r.hero.groom }}</h1>
        <div class="r-rule"><span></span><i class="fa-regular fa-gem"></i><span></span></div>
        <p class="r-date">{{ r.hero.dateText }}</p>
      </div>
      <div class="r-hero__scroll"><span></span></div>
      <span class="r-theme-badge">{{ theme.name }}</span>
    </section>

    <!-- QUOTE (demonstrasi surface + tipografi tema) -->
    <section class="r-quote">
      <div class="r-quote__mark">&ldquo;</div>
      <p class="r-quote__text">{{ r.quote.text }}</p>
      <p class="r-quote__ref">{{ r.quote.ref }}</p>
    </section>

    <!-- PLACEHOLDER: section 3.1–3.11 dibangun pada FASE 3 -->
    <section class="r-soon">
      <p class="r-eyebrow">Segera</p>
      <h2 class="r-soon__title">Amplop • Kisah Cinta • Galeri • RSVP • Ucapan • Musik</h2>
      <p class="r-soon__note">Ganti tema lewat tombol <i class="fa-solid fa-palette"></i> di kanan bawah — warna, font, ornamen, dan filter foto berubah seketika.</p>
    </section>
  </div>
</template>

<style scoped>
.royale {
  --font-display: 'Fraunces', serif; --font-serif: 'Cormorant Garamond', serif;
  --font-script: 'Pinyon Script', cursive; --font-sans: 'Jost', sans-serif;
  position: relative; min-height: 100vh; background: var(--bg); color: var(--ink);
  font-family: var(--font-sans); overflow-x: hidden;
  transition: background-color .5s ease, color .5s ease;
}
.r-eyebrow { text-transform: uppercase; letter-spacing: .34em; font-size: .68rem; color: var(--accent); font-family: var(--font-sans); }

/* ---------- HERO ---------- */
.r-hero { position: relative; min-height: 100vh; display: grid; place-items: center; text-align: center; padding: 8vh 6vw; overflow: hidden; }
.r-hero__photo { position: absolute; inset: 0; background-size: cover; background-position: center; filter: var(--photo-filter); transform: scale(1.05); transition: filter .5s ease; }
.r-hero__overlay { position: absolute; inset: 0; background: var(--hero-overlay); transition: background .5s ease; }
.r-hero__inner { position: relative; z-index: 2; color: #fff; }
.r-hero .r-eyebrow { color: rgba(255, 255, 255, .82); }
.r-names { font-family: var(--font-script); font-size: clamp(3.4rem, 12vw, 7rem); line-height: 1; margin: .6rem 0; font-weight: 400; text-shadow: 0 4px 24px rgba(0, 0, 0, .45); }
.r-names span { display: block; font-size: .34em; margin: .1em 0; color: var(--accent-2); font-family: var(--font-serif); font-style: italic; }
.t-noir .r-names { font-family: var(--font-display); font-weight: 700; letter-spacing: -.01em; text-transform: uppercase; font-size: clamp(2.6rem, 9vw, 5.2rem); }
.t-noir .r-names span { font-family: var(--font-display); font-style: normal; font-weight: 300; }
.r-rule { display: flex; align-items: center; justify-content: center; gap: 1rem; margin: 1.2rem 0; color: var(--accent-2); }
.r-rule span { height: 1px; width: 64px; background: currentColor; opacity: .7; }
.r-date { font-family: var(--font-serif); font-style: italic; font-size: 1.2rem; letter-spacing: .06em; color: #fff; text-shadow: 0 2px 12px rgba(0, 0, 0, .5); }
.r-hero__scroll { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); width: 26px; height: 42px; border: 2px solid rgba(255, 255, 255, .6); border-radius: 20px; z-index: 2; }
.r-hero__scroll span { position: absolute; top: 8px; left: 50%; width: 4px; height: 8px; margin-left: -2px; border-radius: 3px; background: #fff; animation: rScroll 1.8s ease-in-out infinite; }
@keyframes rScroll { 0% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(14px); opacity: 0; } 100% { opacity: 0; } }
.r-theme-badge { position: absolute; top: 20px; left: 20px; z-index: 2; font-family: var(--font-sans); font-size: .62rem; letter-spacing: .2em; text-transform: uppercase; color: #fff; border: 1px solid rgba(255, 255, 255, .4); border-radius: 40px; padding: .4em 1em; background: rgba(0, 0, 0, .25); backdrop-filter: blur(4px); }

/* ---------- QUOTE ---------- */
.r-quote { max-width: 720px; margin: 0 auto; text-align: center; padding: clamp(4rem, 12vw, 8rem) 1.6rem; position: relative; }
.r-quote__mark { font-family: var(--font-serif); font-size: 6rem; line-height: .5; color: var(--accent); opacity: .5; height: 2.4rem; }
.r-quote__text { font-family: var(--font-serif); font-style: italic; font-size: clamp(1.4rem, 3.4vw, 2rem); line-height: 1.6; color: var(--ink); }
.r-quote__ref { margin-top: 1.4rem; font-family: var(--font-sans); letter-spacing: .18em; text-transform: uppercase; font-size: .74rem; color: var(--accent); }

/* ---------- SOON ---------- */
.r-soon { background: var(--surface-2); color: var(--ink); text-align: center; padding: clamp(3.6rem, 10vw, 6rem) 1.6rem; transition: background-color .5s ease; }
.r-soon__title { font-family: var(--font-display); font-size: clamp(1.4rem, 4vw, 2.1rem); font-weight: 600; margin: .5rem auto 1rem; max-width: 640px; line-height: 1.3; color: var(--ink); }
.r-soon__note { max-width: 520px; margin: 0 auto; color: var(--ink-soft); font-family: var(--font-serif); font-size: 1.15rem; line-height: 1.6; }
.r-soon__note i { color: var(--accent); margin: 0 .15em; }

@media (prefers-reduced-motion: reduce) { .r-hero__scroll span { animation: none; } }
</style>
