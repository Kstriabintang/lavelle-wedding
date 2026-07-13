<script setup>
// 3.5 — Detail acara: kartu Akad & Resepsi, Google Maps embed,
// tambah ke kalender (Google + .ics), buka Maps.
// Desktop: kartu + peta berdampingan. Mobile: bertumpuk.
import { computed } from 'vue'
import { useInviteActions } from '../../composables/useInviteActions'

const props = defineProps({
  events: { type: Array, default: () => [] },
  mapsQuery: { type: String, default: '' },
  date: { type: String, default: '' },
  coupleTitle: { type: String, default: 'Pernikahan' },
})
const { gcalUrl, downloadIcs } = useInviteActions()

const mapsEmbed = computed(() => `https://www.google.com/maps?q=${encodeURIComponent(props.mapsQuery)}&output=embed`)
const mapsLink = computed(() => `https://maps.google.com/?q=${encodeURIComponent(props.mapsQuery)}`)
const gcal = computed(() => gcalUrl({ title: props.coupleTitle, date: props.date, details: props.coupleTitle, location: props.events[0]?.place || '' }))
function ics() { downloadIcs({ title: props.coupleTitle, date: props.date, location: props.events[0]?.place || '', filename: 'undangan-royale.ics' }) }
</script>

<template>
  <section id="acara" class="r-section r-section--surface-2 ev">
    <div class="r-container">
      <p class="r-kicker r-reveal">Waktu &amp; Tempat</p>
      <h2 class="r-title r-reveal">Detail Acara</h2>
      <div class="r-divider r-reveal"><span></span><i class="fa-regular fa-calendar"></i><span></span></div>

      <div class="ev__grid">
        <div class="ev__cards">
          <article v-for="(e, i) in events" :key="i" class="ev__card r-card r-reveal" :class="`d${i}`">
            <span class="ev__tag">{{ e.tag }}</span>
            <p class="ev__row"><i class="fa-regular fa-calendar-check"></i> {{ e.date }}</p>
            <p class="ev__row"><i class="fa-regular fa-clock"></i> {{ e.time }}</p>
            <p class="ev__row"><i class="fa-solid fa-location-dot"></i> {{ e.place }}</p>
            <p class="ev__row" v-if="e.dress"><i class="fa-solid fa-shirt"></i> {{ e.dress }}</p>
          </article>

          <div class="ev__actions r-reveal">
            <a class="r-btn r-btn--ghost r-btn--sm" :href="gcal" target="_blank" rel="noopener"><i class="fa-regular fa-calendar-plus"></i> Google Calendar</a>
            <button class="r-btn r-btn--ghost r-btn--sm" type="button" @click="ics"><i class="fa-solid fa-download"></i> Simpan .ics</button>
            <a class="r-btn r-btn--solid r-btn--sm" :href="mapsLink" target="_blank" rel="noopener"><i class="fa-solid fa-map-location-dot"></i> Buka Maps</a>
          </div>
        </div>

        <div class="ev__map r-card r-reveal d1">
          <iframe :src="mapsEmbed" title="Lokasi acara" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ev__cards { display: flex; flex-direction: column; gap: 1.1rem; }
.ev__card { padding: 1.6rem 1.5rem; }
.ev__tag { display: inline-block; font-family: var(--font-display); font-size: 1.3rem; font-weight: 600; color: var(--accent); margin-bottom: .9rem; }
.ev__row { display: flex; align-items: center; gap: .7em; font-size: .96rem; color: var(--ink-soft); margin-bottom: .55rem; font-family: var(--font-serif); }
.ev__row i { color: var(--accent); width: 1.1em; text-align: center; }
.ev__actions { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: .4rem; }
.ev__map { overflow: hidden; min-height: 260px; border-radius: 18px; }
.ev__map iframe { width: 100%; height: 100%; min-height: 260px; border: 0; display: block; filter: var(--photo-filter); }

/* DESKTOP: kartu + peta berdampingan, peta sticky */
@media (min-width: 1024px) {
  .ev__grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 2rem; align-items: start; }
  .ev__map { position: sticky; top: 2rem; height: 100%; min-height: 420px; }
}
</style>
