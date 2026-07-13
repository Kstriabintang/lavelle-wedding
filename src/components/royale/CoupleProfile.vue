<script setup>
// 3.3 — Profil mempelai. Desktop: dua kolom bersanding. Mobile: tab
// (bride/groom) — layout benar-benar beda, bukan sekadar mengecil.
import { ref } from 'vue'

defineProps({
  bride: { type: Object, required: true },
  groom: { type: Object, required: true },
})
const active = ref('bride')
</script>

<template>
  <section id="mempelai" class="r-section r-section--surface cp">
    <div class="r-container">
      <p class="r-kicker r-reveal">Bismillahirrahmanirrahim</p>
      <h2 class="r-title r-reveal">Kedua Mempelai</h2>
      <div class="r-divider r-reveal"><span></span><i class="fa-solid fa-heart"></i><span></span></div>

      <!-- Tab (mobile) -->
      <div class="cp__tabs r-reveal">
        <button :class="{ 'is-on': active === 'bride' }" @click="active = 'bride'">{{ bride.name.split(' ')[0] }}</button>
        <button :class="{ 'is-on': active === 'groom' }" @click="active = 'groom'">{{ groom.name.split(' ')[0] }}</button>
      </div>

      <div class="cp__grid">
        <figure class="cp__person r-reveal" :class="{ 'is-hidden': active !== 'bride' }">
          <div class="cp__photo"><img :src="`/img/mentahan/${bride.photo}.jpeg`" :alt="bride.name" class="r-photo" loading="lazy"></div>
          <figcaption>
            <p class="cp__role">{{ bride.role }}</p>
            <h3 class="cp__name">{{ bride.name }}</h3>
            <p class="cp__parents">{{ bride.parents }}</p>
            <a v-if="bride.ig" class="cp__ig" :href="`https://instagram.com/${bride.ig}`" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> @{{ bride.ig }}</a>
          </figcaption>
        </figure>

        <div class="cp__amp" aria-hidden="true"><span class="r-script">&amp;</span></div>

        <figure class="cp__person r-reveal d1" :class="{ 'is-hidden': active !== 'groom' }">
          <div class="cp__photo"><img :src="`/img/mentahan/${groom.photo}.jpeg`" :alt="groom.name" class="r-photo" loading="lazy"></div>
          <figcaption>
            <p class="cp__role">{{ groom.role }}</p>
            <h3 class="cp__name">{{ groom.name }}</h3>
            <p class="cp__parents">{{ groom.parents }}</p>
            <a v-if="groom.ig" class="cp__ig" :href="`https://instagram.com/${groom.ig}`" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> @{{ groom.ig }}</a>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cp__tabs { display: flex; gap: .5rem; justify-content: center; margin: 1.4rem 0 1.8rem; }
.cp__tabs button { flex: 1; max-width: 160px; padding: .7em 1em; border-radius: 40px; border: 1px solid var(--line); background: transparent; color: var(--ink-soft); font-family: var(--font-sans); font-size: .8rem; letter-spacing: .06em; cursor: pointer; transition: all .3s; }
.cp__tabs button.is-on { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }

.cp__person { text-align: center; margin: 0; }
.cp__photo { position: relative; width: min(260px, 74vw); aspect-ratio: 3/4; margin: 0 auto 1.3rem; border-radius: 160px 160px 16px 16px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 30px 60px -30px rgba(0, 0, 0, .5); }
.cp__photo img { width: 100%; height: 100%; object-fit: cover; }
.cp__role { text-transform: uppercase; letter-spacing: .24em; font-size: .62rem; color: var(--accent); }
.cp__name { font-family: var(--font-display); font-size: 1.5rem; font-weight: 600; color: var(--ink); margin: .3rem 0 .5rem; }
.cp__parents { font-family: var(--font-serif); font-size: 1.02rem; line-height: 1.5; color: var(--ink-soft); max-width: 320px; margin: 0 auto; }
.cp__ig { display: inline-flex; align-items: center; gap: .4em; margin-top: .8rem; font-size: .8rem; color: var(--accent); text-decoration: none; }
.cp__amp { display: none; }

/* MOBILE: tab — sembunyikan yang non-aktif */
.cp__person.is-hidden { display: none; }

/* TABLET: dua kolom muncul, tab hilang */
@media (min-width: 640px) {
  .cp__tabs { display: none; }
  .cp__person.is-hidden { display: block; }
  .cp__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
}

/* DESKTOP: tambah ornamen "&" di tengah + kolom lebih lega */
@media (min-width: 1024px) {
  .cp__grid { grid-template-columns: 1fr auto 1fr; gap: 3rem; align-items: center; }
  .cp__amp { display: block; font-size: 4rem; color: var(--accent); line-height: 1; }
  .cp__photo { width: 300px; }
  .cp__name { font-size: 1.9rem; }
}
</style>
