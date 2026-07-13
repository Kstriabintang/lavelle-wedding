<script setup>
// 3.8 — Amplop digital: bank + e-wallet, salin nomor ke clipboard.
import { useInviteActions } from '../../composables/useInviteActions'
defineProps({ gifts: { type: Array, default: () => [] } })
const { copied, copyText } = useInviteActions()
</script>

<template>
  <section id="amplop" class="r-section r-section--deep de">
    <div class="r-container">
      <p class="r-kicker r-reveal">Tanda Kasih</p>
      <h2 class="r-title r-reveal" style="color:#fff">Amplop Digital</h2>
      <div class="r-divider r-reveal"><span></span><i class="fa-solid fa-gift"></i><span></span></div>
      <p class="r-lead r-reveal">Doa restu Anda adalah hadiah terindah. Bila berkenan memberi tanda kasih, dapat melalui kanal berikut.</p>

      <div class="de__grid">
        <article v-for="(g, i) in gifts" :key="g.label + i" class="de__card r-reveal" :class="`d${i % 3}`">
          <div class="de__top">
            <span class="de__ico"><i :class="`fa-solid ${g.icon}`"></i></span>
            <div>
              <span class="de__kind">{{ g.kind === 'ewallet' ? 'E-Wallet' : 'Transfer Bank' }}</span>
              <span class="de__label">{{ g.label }}</span>
            </div>
          </div>
          <p class="de__no">{{ g.no }}</p>
          <p class="de__an">a.n. {{ g.an }}</p>
          <button class="de__copy" type="button" @click="copyText(g.raw, g.label + i)">
            <i :class="copied === g.label + i ? 'fa-solid fa-check' : 'fa-regular fa-copy'"></i>
            {{ copied === g.label + i ? 'Tersalin' : 'Salin Nomor' }}
          </button>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.de__grid { display: grid; gap: 1rem; grid-template-columns: 1fr; max-width: 520px; margin: 1.6rem auto 0; }
.de__card { border: 1px solid var(--line); border-radius: 16px; padding: 1.4rem 1.5rem; background: rgba(255, 255, 255, .05); }
.de__top { display: flex; align-items: center; gap: .9rem; margin-bottom: 1rem; }
.de__ico { flex: none; width: 46px; height: 46px; border-radius: 12px; display: grid; place-items: center; background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: var(--accent-ink); font-size: 1.1rem; }
.de__kind { display: block; font-size: .62rem; letter-spacing: .16em; text-transform: uppercase; color: var(--accent-2); }
.de__label { display: block; font-family: var(--font-display); font-size: 1.2rem; font-weight: 600; color: #fff; }
.de__no { font-family: var(--font-sans); font-size: 1.3rem; letter-spacing: .1em; color: #fff; }
.de__an { font-size: .84rem; color: rgba(255, 255, 255, .7); margin-top: .2rem; }
.de__copy { margin-top: 1rem; display: inline-flex; align-items: center; gap: .5em; font-family: var(--font-sans); font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; padding: .6em 1.2em; border-radius: 40px; border: 1px solid var(--accent); background: transparent; color: var(--accent-2); transition: background .3s, color .3s; }
.de__copy:hover { background: var(--accent); color: var(--accent-ink); }

/* TABLET+: dua kolom */
@media (min-width: 720px) {
  .de__grid { grid-template-columns: 1fr 1fr; max-width: 720px; }
}
</style>
