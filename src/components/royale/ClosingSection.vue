<script setup>
// 3.11 — Penutup: kutipan/ayat, foto latar, tanda tangan, share WhatsApp.
import { computed } from 'vue'
import { useInviteActions } from '../../composables/useInviteActions'
import { imgSrc } from './imgSrc.js'

const props = defineProps({
  closing: { type: Object, required: true },
  photo: { type: String, default: '' },
  names: { type: String, default: '' },
  dateText: { type: String, default: '' },
})
const { copied, copyText, shareWa, shareNative } = useInviteActions()
const shareUrl = computed(() => (typeof window !== 'undefined' ? window.location.href : 'https://lavelle.my.id/demo/royale/'))
function doWa() { shareWa(`Undangan Pernikahan ${props.names} — ${props.dateText}. Buka undangan: ${shareUrl.value}`) }
</script>

<template>
  <section class="cl">
    <div class="cl__photo r-photo" :style="{ backgroundImage: `url(${imgSrc(photo)})` }"></div>
    <div class="cl__overlay"></div>
    <div class="cl__inner r-container r-container--narrow">
      <i class="fa-solid fa-dove cl__icon r-reveal"></i>
      <p class="cl__quote r-reveal">&ldquo;{{ closing.quote }}&rdquo;</p>
      <p class="cl__ref r-reveal">{{ closing.ref }}</p>
      <div class="cl__rule r-reveal"><span></span><i class="fa-solid fa-heart"></i><span></span></div>
      <p class="cl__sign r-script r-reveal">{{ closing.signoff }}</p>

      <div class="cl__share r-reveal">
        <span>Bagikan undangan</span>
        <div class="cl__btns">
          <button type="button" @click="doWa" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></button>
          <button type="button" @click="shareNative({ title: names, url: shareUrl })" aria-label="Bagikan"><i class="fa-solid fa-share-nodes"></i></button>
          <button type="button" @click="copyText(shareUrl, 'link')" aria-label="Salin tautan"><i :class="copied === 'link' ? 'fa-solid fa-check' : 'fa-solid fa-link'"></i></button>
        </div>
      </div>

      <a class="cl__credit" href="/">Undangan digital oleh <strong>Lavelle</strong></a>
    </div>
  </section>
</template>

<style scoped>
.cl { position: relative; min-height: 100svh; display: grid; place-items: center; text-align: center; overflow: hidden; padding: 12vh 6vw; }
.cl__photo { position: absolute; inset: 0; background-size: cover; background-position: center; transform: scale(1.05); }
.cl__overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.5), rgba(0,0,0,.7)), var(--hero-overlay); }
.cl__inner { position: relative; z-index: 2; color: #fff; }
.cl__icon { font-size: 1.8rem; color: var(--accent-2); margin-bottom: 1.2rem; }
.cl__quote { font-family: var(--font-serif); font-style: italic; font-size: clamp(1.3rem, 3.6vw, 1.9rem); line-height: 1.6; max-width: 640px; margin: 0 auto; text-shadow: 0 2px 14px rgba(0, 0, 0, .5); }
.cl__ref { margin-top: 1rem; letter-spacing: .18em; text-transform: uppercase; font-size: .74rem; color: var(--accent-2); }
.cl__rule { display: flex; align-items: center; justify-content: center; gap: 1rem; margin: 2rem 0; color: var(--accent-2); }
.cl__rule span { height: 1px; width: 60px; background: currentColor; opacity: .6; }
.cl__sign { font-family: var(--font-script); font-size: clamp(3rem, 10vw, 5rem); line-height: 1; color: #fff; text-shadow: 0 3px 18px rgba(0, 0, 0, .5); }
.t-noir .cl__sign { font-family: var(--font-display); font-weight: 700; text-transform: uppercase; font-size: clamp(2.2rem, 8vw, 3.6rem); }

.cl__share { margin-top: 2.4rem; }
.cl__share > span { display: block; font-size: .66rem; letter-spacing: .24em; text-transform: uppercase; color: rgba(255, 255, 255, .8); margin-bottom: .7rem; }
.cl__btns { display: flex; justify-content: center; gap: .8rem; }
.cl__btns button { width: 48px; height: 48px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, .35); background: rgba(255, 255, 255, .08); color: #fff; cursor: pointer; font-size: 1.05rem; display: grid; place-items: center; transition: transform .3s, background .3s; }
.cl__btns button:hover { transform: translateY(-3px); background: rgba(255, 255, 255, .2); }
.cl__credit { display: inline-block; margin-top: 2.4rem; font-size: .82rem; letter-spacing: .08em; color: rgba(255, 255, 255, .7); text-decoration: none; }
.cl__credit strong { color: var(--accent-2); font-family: var(--font-serif); }
</style>
