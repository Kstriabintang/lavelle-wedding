<script setup>
// FASE B — Amplop digital: kartu bergaya ATM fisik (chip + nomor emboss),
// QRIS, salin nomor, konfirmasi via WhatsApp. Section deep.
import { computed } from 'vue'
import { useInviteActions } from '../../composables/useInviteActions'

const props = defineProps({
  gifts: { type: Array, default: () => [] },
  qris: { type: Object, default: null },
  waConfirm: { type: String, default: '' },
})
const { copied, copyText } = useInviteActions()
const waUrl = computed(() =>
  props.waConfirm
    ? `https://wa.me/${props.waConfirm}?text=${encodeURIComponent('Halo, saya sudah mengirimkan tanda kasih untuk pernikahan Anindya & Rizky. Berikut bukti transfernya:')}`
    : '')
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
          <div class="de__atm" :class="g.kind === 'ewallet' ? 'is-wallet' : 'is-bank'">
            <div class="de__atm-top">
              <span class="de__bank">{{ g.label }}</span>
              <span class="de__type">{{ g.kind === 'ewallet' ? 'E-Wallet' : 'Bank Transfer' }}</span>
            </div>
            <span class="de__chip" aria-hidden="true"></span>
            <p class="de__number">{{ g.no }}</p>
            <div class="de__atm-foot">
              <div>
                <span class="de__foot-label">Pemilik</span>
                <span class="de__holder">{{ g.an }}</span>
              </div>
              <i class="de__brand" :class="`fa-brands ${g.brand}`" v-if="g.brand && g.brand.startsWith('fa-cc')"></i>
              <i class="de__brand" :class="`fa-solid ${g.brand}`" v-else></i>
            </div>
          </div>
          <button class="de__copy" type="button" @click="copyText(g.raw, g.label + i)">
            <i :class="copied === g.label + i ? 'fa-solid fa-check' : 'fa-regular fa-copy'"></i>
            {{ copied === g.label + i ? 'Nomor Tersalin' : 'Salin Nomor' }}
          </button>
        </article>

        <!-- QRIS -->
        <article v-if="qris" class="de__card de__card--qris r-reveal">
          <div class="de__qris">
            <div class="de__qris-head"><i class="fa-solid fa-qrcode"></i> QRIS</div>
            <div class="de__qr"><img :src="qris.img" alt="QRIS" loading="lazy"></div>
            <p class="de__qris-merchant">{{ qris.merchant }}</p>
            <p class="de__qris-nmid">NMID: {{ qris.nmid }}</p>
          </div>
        </article>
      </div>

      <a v-if="waUrl" class="de__wa r-reveal" :href="waUrl" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp"></i> Konfirmasi Tanda Kasih via WhatsApp
      </a>
    </div>
  </section>
</template>

<style scoped>
.de__grid { display: grid; gap: 1.4rem; grid-template-columns: 1fr; max-width: 400px; margin: 2rem auto 0; }

.de__card { display: flex; flex-direction: column; gap: .9rem; }
/* Kartu ATM fisik */
.de__atm {
  position: relative; aspect-ratio: 1.586 / 1; border-radius: 16px; padding: 1.3rem 1.4rem; overflow: hidden;
  display: flex; flex-direction: column; color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--deep) 88%);
  box-shadow: 0 26px 50px -22px rgba(0, 0, 0, .7), inset 0 1px 0 rgba(255, 255, 255, .14);
}
.de__atm.is-wallet { background: linear-gradient(135deg, var(--accent-2), var(--accent) 70%, var(--deep)); }
.de__atm::after { content: ''; position: absolute; inset: 0; background: linear-gradient(115deg, rgba(255, 255, 255, .18), transparent 40%); pointer-events: none; }
.de__atm-top { display: flex; align-items: baseline; justify-content: space-between; }
.de__bank { font-family: var(--font-display); font-size: 1.2rem; font-weight: 600; letter-spacing: .02em; }
.de__type { font-size: .58rem; letter-spacing: .18em; text-transform: uppercase; opacity: .8; }
.de__chip {
  width: 46px; height: 34px; border-radius: 6px; margin: 1rem 0 .9rem;
  background: linear-gradient(135deg, #f0d79a, #c69a3e); position: relative; overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .1);
}
.de__chip::before {
  content: ''; position: absolute; inset: 0;
  background:
    linear-gradient(to right, transparent 46%, rgba(0, 0, 0, .28) 46%, rgba(0, 0, 0, .28) 54%, transparent 54%),
    linear-gradient(to bottom, transparent 28%, rgba(0, 0, 0, .28) 28%, rgba(0, 0, 0, .28) 36%, transparent 36%, transparent 64%, rgba(0, 0, 0, .28) 64%, rgba(0, 0, 0, .28) 72%, transparent 72%);
}
.de__number { font-family: 'Jost', monospace; font-size: 1.25rem; letter-spacing: .18em; margin-top: auto; text-shadow: 0 1px 1px rgba(0, 0, 0, .45), 0 -1px 0 rgba(255, 255, 255, .12); }
.de__atm-foot { display: flex; align-items: flex-end; justify-content: space-between; margin-top: .7rem; }
.de__foot-label { display: block; font-size: .52rem; letter-spacing: .16em; text-transform: uppercase; opacity: .7; }
.de__holder { display: block; font-size: .86rem; letter-spacing: .06em; text-transform: uppercase; text-shadow: 0 1px 1px rgba(0, 0, 0, .4); }
.de__brand { font-size: 1.8rem; opacity: .95; }

.de__copy { display: inline-flex; align-items: center; justify-content: center; gap: .5em; font-family: var(--font-sans); font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; cursor: pointer; padding: .75em 1.2em; border-radius: 40px; border: 1px solid var(--accent); background: transparent; color: var(--accent-2); transition: background-color .3s, color .3s; }
.de__copy:hover { background: var(--accent); color: var(--accent-ink); }

/* QRIS */
.de__card--qris { }
.de__qris { border: 1px solid rgba(255, 255, 255, .16); border-radius: 16px; padding: 1.3rem; text-align: center; background: rgba(255, 255, 255, .04); }
.de__qris-head { display: inline-flex; align-items: center; gap: .5em; color: var(--accent-2); font-family: var(--font-sans); letter-spacing: .16em; text-transform: uppercase; font-size: .72rem; }
.de__qr { width: min(220px, 70%); margin: 1rem auto .9rem; background: #fff; padding: 12px; border-radius: 12px; }
.de__qr img { display: block; width: 100%; height: auto; }
.de__qris-merchant { color: #fff; font-family: var(--font-display); font-size: 1.05rem; }
.de__qris-nmid { color: rgba(255, 255, 255, .6); font-size: .72rem; letter-spacing: .08em; margin-top: .2rem; }

.de__wa { display: inline-flex; align-items: center; gap: .6em; margin: 2rem auto 0; justify-content: center; width: fit-content; padding: .95em 1.8em; border-radius: 50px; background: #25d366; color: #063d1e; font-family: var(--font-sans); font-weight: 600; font-size: .82rem; letter-spacing: .04em; text-decoration: none; transition: transform .3s; }
.de__wa:hover { transform: translateY(-3px); }
.de__wa i { font-size: 1.15rem; }
.de__grid + .de__wa { display: flex; }

/* TABLET+: dua kolom */
@media (min-width: 720px) {
  .de__grid { grid-template-columns: 1fr 1fr; max-width: 760px; }
}
@media (prefers-reduced-motion: reduce) { .de__copy, .de__wa { transition: none; } }
</style>
