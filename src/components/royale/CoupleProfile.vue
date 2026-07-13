<script setup>
// FASE B — Profil mempelai (premium). Desktop: dua kolom bersanding + "&"
// di tengah. Mobile: tab (bride/groom) — layout beda, bukan sekadar mengecil.
// Sosmed per mempelai. Foto arched, whitespace lega, scroll reveal.
import { ref, computed } from 'vue'

const props = defineProps({
  bride: { type: Object, required: true },
  groom: { type: Object, required: true },
})
const people = computed(() => [props.bride, props.groom])
const active = ref(0)
</script>

<template>
  <section id="mempelai" class="r-section r-section--surface cp">
    <div class="r-container">
      <p class="r-kicker r-reveal">Bismillahirrahmanirrahim</p>
      <h2 class="r-title r-reveal">Kedua Mempelai</h2>
      <div class="r-divider r-reveal"><span></span><i class="fa-solid fa-heart"></i><span></span></div>
      <p class="r-lead r-reveal">Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami.</p>

      <!-- Tab (mobile) -->
      <div class="cp__tabs r-reveal" role="tablist">
        <button v-for="(p, i) in people" :key="p.name" role="tab" :aria-selected="active === i"
                :class="{ 'is-on': active === i }" @click="active = i">{{ p.name.split(' ')[0] }}</button>
      </div>

      <div class="cp__grid">
        <template v-for="(p, i) in people" :key="p.name">
          <div v-if="i === 1" class="cp__amp" aria-hidden="true"><span>&amp;</span></div>
          <figure class="cp__person r-reveal" :class="[{ 'is-hidden': active !== i }, i === 1 ? 'd1' : '']">
            <div class="cp__photo">
              <img :src="`/img/mentahan/${p.photo}.jpeg`" :alt="p.name" class="r-photo" loading="lazy">
            </div>
            <figcaption>
              <p class="cp__role">{{ p.role }}</p>
              <h3 class="cp__name">{{ p.name }}</h3>
              <p class="cp__parents">{{ p.parents }}</p>
              <div v-if="p.socials && p.socials.length" class="cp__socials">
                <a v-for="s in p.socials" :key="s.url" :href="s.url" target="_blank" rel="noopener" :aria-label="s.label">
                  <i :class="`fa-brands ${s.icon}`"></i>
                </a>
              </div>
            </figcaption>
          </figure>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cp__tabs { display: flex; gap: .6rem; justify-content: center; margin: 2rem 0; }
.cp__tabs button { flex: 1; max-width: 160px; padding: .8em 1em; border-radius: 40px; border: 1px solid var(--line); background: transparent; color: var(--ink-soft); font-family: var(--font-sans); font-size: .78rem; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: background-color .35s, color .35s, border-color .35s; }
.cp__tabs button.is-on { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }

.cp__grid { margin-top: 1rem; }
.cp__person { text-align: center; margin: 0; }
.cp__photo { position: relative; width: min(280px, 76vw); aspect-ratio: 3 / 4; margin: 0 auto 1.6rem; border-radius: 999px 999px 14px 14px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 34px 70px -34px rgba(0, 0, 0, .55); }
.cp__photo img { width: 100%; height: 100%; object-fit: cover; }
.cp__role { text-transform: uppercase; letter-spacing: .28em; font-size: .64rem; color: var(--accent); }
.cp__name { font-family: var(--font-display); font-size: clamp(1.6rem, 4vw, 2rem); font-weight: 600; color: var(--ink); margin: .5rem 0 .7rem; line-height: 1.1; }
.cp__parents { font-family: var(--font-serif); font-size: 1.05rem; line-height: 1.6; color: var(--ink-soft); max-width: 330px; margin: 0 auto; }
.cp__socials { display: flex; gap: .7rem; justify-content: center; margin-top: 1.2rem; }
.cp__socials a { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--line); color: var(--accent); font-size: .95rem; text-decoration: none; transition: background-color .35s, color .35s, transform .35s; }
.cp__socials a:hover { background: var(--accent); color: var(--accent-ink); transform: translateY(-3px); }
.cp__amp { display: none; }

/* MOBILE: tab — sembunyikan yang non-aktif */
.cp__person.is-hidden { display: none; }

/* TABLET: dua kolom, tab hilang */
@media (min-width: 640px) {
  .cp__tabs { display: none; }
  .cp__person.is-hidden { display: block; }
  .cp__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.4rem; align-items: start; }
}

/* DESKTOP: ornamen "&" di tengah + napas lebih lega */
@media (min-width: 1024px) {
  .cp__grid { grid-template-columns: 1fr auto 1fr; gap: clamp(2.5rem, 5vw, 4.5rem); align-items: center; }
  .cp__amp { display: block; }
  .cp__amp span { font-family: var(--font-script); font-size: 5rem; color: var(--accent); line-height: 1; }
  .t-noir .cp__amp span { font-family: var(--font-serif); font-style: italic; }
  .cp__photo { width: min(320px, 100%); }
}
</style>
