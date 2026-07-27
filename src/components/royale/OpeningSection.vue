<script setup>
// FASE A — Pembuka: tanggal angka besar (editorial), foto pasangan full-bleed,
// dan kutipan/ayat. Whitespace lega, foto grading via --photo-filter, scroll
// reveal. Layout beda desktop (dua kolom) vs mobile (tumpuk terpusat).
import { computed } from 'vue'
import { imgSrc } from './imgSrc.js'

const props = defineProps({
  date: { type: String, default: '' }, // YYYY-MM-DD
  quote: { type: Object, default: () => ({ text: '', ref: '' }) },
  photo: { type: String, default: '' },
})

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const parts = computed(() => {
  const [y, m, d] = (props.date || '2027-01-01').split('-').map(Number)
  const wd = new Date(Date.UTC(y, m - 1, d, 5)).getUTCDay() // 05:00 UTC ≈ siang WIB
  return {
    day: String(d).padStart(2, '0'),
    month: MONTHS[m - 1] || '',
    year: String(y),
    weekday: DAYS[wd] || '',
  }
})
const bg = computed(() => ({ backgroundImage: `url(${imgSrc(props.photo)})` }))
</script>

<template>
  <section id="pembuka" class="op">
    <div class="op__inner">
      <div class="op__text">
        <p class="op__eyebrow r-reveal">Dengan memohon rahmat &amp; ridho Tuhan</p>

        <div class="op__date r-reveal d1">
          <span class="op__day">{{ parts.day }}</span>
          <span class="op__mid">
            <span class="op__month">{{ parts.month }}</span>
            <span class="op__year">{{ parts.year }}</span>
          </span>
        </div>
        <p class="op__weekday r-reveal d2">{{ parts.weekday }}</p>

        <blockquote class="op__quote r-reveal d2">
          <p>&ldquo;{{ quote.text }}&rdquo;</p>
          <cite>{{ quote.ref }}</cite>
        </blockquote>
      </div>

      <figure class="op__figure r-reveal d1">
        <div class="op__photo r-photo" :style="bg"></div>
        <figcaption class="op__cap" aria-hidden="true"><span></span>Save the Date</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.op { position: relative; padding: clamp(5rem, 14vw, 10rem) 0; background: var(--bg); overflow: hidden; }
.op__inner { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 clamp(1.4rem, 6vw, 3rem); display: grid; gap: clamp(2.6rem, 6vw, 4.5rem); }

.op__eyebrow { text-transform: uppercase; letter-spacing: .3em; font-size: .68rem; color: var(--accent); font-family: var(--font-sans); }

/* Tanggal editorial — angka besar */
.op__date { display: inline-flex; align-items: center; gap: clamp(1rem, 3vw, 1.6rem); margin-top: 1.4rem; }
.op__day { font-family: var(--font-display); font-size: clamp(4.5rem, 17vw, 9.5rem); line-height: .82; color: var(--ink); font-weight: 600; }
.op__mid { display: flex; flex-direction: column; gap: .35rem; text-align: left; padding-left: clamp(1rem, 3vw, 1.6rem); border-left: 1px solid var(--line); }
.op__month { font-family: var(--font-sans); text-transform: uppercase; letter-spacing: .26em; font-size: clamp(.85rem, 2.4vw, 1.05rem); color: var(--accent); }
.op__year { font-family: var(--font-display); font-size: clamp(1.6rem, 5vw, 2.4rem); color: var(--ink-soft); line-height: 1; }
.op__weekday { font-family: var(--font-serif); font-style: italic; font-size: 1.15rem; color: var(--ink-soft); margin-top: 1.1rem; letter-spacing: .04em; }

.op__quote { margin-top: clamp(1.8rem, 5vw, 2.6rem); max-width: 460px; }
.op__quote p { font-family: var(--font-serif); font-size: clamp(1.1rem, 2.6vw, 1.3rem); line-height: 1.8; color: var(--ink); font-style: italic; }
.op__quote cite { display: block; margin-top: .9rem; font-family: var(--font-sans); font-style: normal; text-transform: uppercase; letter-spacing: .2em; font-size: .66rem; color: var(--accent); }

/* Foto */
.op__figure { position: relative; margin: 0; }
.op__photo { width: 100%; aspect-ratio: 4 / 5; border-radius: 6px; background-size: cover; background-position: center; box-shadow: 0 30px 70px -34px rgba(0, 0, 0, .5); }
.op__cap { position: absolute; bottom: 1.1rem; left: 1.1rem; display: flex; align-items: center; gap: .7rem; color: #fff; font-family: var(--font-sans); text-transform: uppercase; letter-spacing: .24em; font-size: .62rem; text-shadow: 0 1px 8px rgba(0, 0, 0, .6); }
.op__cap span { width: 30px; height: 1px; background: rgba(255, 255, 255, .8); }

/* ---- MOBILE default: tumpuk terpusat ---- */
.op__inner { text-align: center; }
.op__date { justify-content: center; }
.op__quote { margin-left: auto; margin-right: auto; }
/* width definit + justify-self (BUKAN margin auto — margin auto pada grid item
   membuat item menyusut ke konten sehingga foto width:100% kolaps jadi 0) */
.op__figure { order: -1; width: min(420px, 100%); justify-self: center; }

/* ---- DESKTOP: dua kolom, teks kiri + foto kanan, banyak napas ---- */
@media (min-width: 900px) {
  .op__inner { grid-template-columns: 1.05fr .95fr; align-items: center; text-align: left; }
  .op__date { justify-content: flex-start; }
  .op__quote { margin-left: 0; margin-right: 0; }
  .op__figure { order: 0; width: 100%; justify-self: stretch; }
  .op__photo { aspect-ratio: 3 / 4; }
}
</style>
