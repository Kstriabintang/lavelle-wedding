<script setup>
// FASE B — Keluarga Besar (kedua orang tua) + Turut Mengundang.
defineProps({ family: { type: Object, default: () => ({}) } })
</script>

<template>
  <section id="keluarga" class="r-section r-section--surface fm">
    <div class="r-container">
      <p class="r-kicker r-reveal">Keluarga Besar</p>
      <h2 class="r-title r-reveal">Turut Berbahagia</h2>
      <div class="r-divider r-reveal"><span></span><i class="fa-solid fa-people-roof"></i><span></span></div>
      <p class="r-lead r-reveal">{{ family.note }}</p>

      <div class="fm__grid">
        <div class="fm__col r-card r-reveal">
          <h3 class="fm__title">Keluarga Mempelai Wanita</h3>
          <ul class="fm__list">
            <li v-for="n in family.bride" :key="n">{{ n }}</li>
          </ul>
        </div>
        <div class="fm__col r-card r-reveal d1">
          <h3 class="fm__title">Keluarga Mempelai Pria</h3>
          <ul class="fm__list">
            <li v-for="n in family.groom" :key="n">{{ n }}</li>
          </ul>
        </div>
      </div>

      <div v-if="family.alsoInviting && family.alsoInviting.length" class="fm__also r-reveal">
        <p class="fm__also-label">Turut Mengundang</p>
        <ul class="fm__also-list">
          <li v-for="n in family.alsoInviting" :key="n">{{ n }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fm__grid { display: grid; grid-template-columns: 1fr; gap: 1.2rem; max-width: 820px; margin: 2.4rem auto 0; }
.fm__col { padding: 1.8rem 1.6rem; text-align: center; }
.fm__title { font-family: var(--font-display); font-size: 1.05rem; text-transform: uppercase; letter-spacing: .12em; color: var(--accent); margin-bottom: 1rem; }
.fm__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .5rem; }
.fm__list li { font-family: var(--font-serif); font-size: 1.2rem; color: var(--ink); }

.fm__also { text-align: center; margin-top: 2.6rem; }
.fm__also-label { text-transform: uppercase; letter-spacing: .24em; font-size: .66rem; color: var(--accent); margin-bottom: 1rem; }
.fm__also-list { list-style: none; margin: 0 auto; padding: 0; max-width: 640px; display: flex; flex-wrap: wrap; justify-content: center; gap: .6rem 1.4rem; }
.fm__also-list li { font-family: var(--font-serif); font-size: 1rem; color: var(--ink-soft); position: relative; }
.fm__also-list li:not(:last-child)::after { content: '·'; position: absolute; right: -.85rem; color: var(--accent); }

@media (min-width: 720px) {
  .fm__grid { grid-template-columns: 1fr 1fr; }
}
</style>
