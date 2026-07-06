<script setup>
import { reactive, ref, watch, onMounted, computed } from 'vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Panel Template — Lavelle',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const EVENT_ICONS = [
  { v: 'fa-ring', t: 'Akad / Cincin' }, { v: 'fa-champagne-glasses', t: 'Resepsi' },
  { v: 'fa-mosque', t: 'Masjid' }, { v: 'fa-church', t: 'Gereja' },
  { v: 'fa-utensils', t: 'Jamuan' }, { v: 'fa-heart', t: 'Hati' }, { v: 'fa-hands-praying', t: 'Doa' },
]

const SAMPLE = {
  meta: { template: 'klasik', brand: 'Lavelle', title: 'Kayla & Raka — Undangan Pernikahan', description: 'Undangan pernikahan Kayla & Raka. Tema Klasik oleh Lavelle.' },
  couple: {
    display: 'Kayla & Raka',
    bride: { name: 'Kayla', full: 'Kayla Ayu Lestari', initial: 'K', photo: '', parents: 'Putri pertama dari<br>Bapak Suryadi & Ibu Maryani', ig: '' },
    groom: { name: 'Raka', full: 'Raka Pratama', initial: 'R', photo: '', parents: 'Putra kedua dari<br>Bapak Hendra & Ibu Sulastri', ig: '' },
  },
  date: { display: 'Sabtu, 20 Desember 2026', iso: '2026-12-20T08:00:00+07:00', afterIso: '2026-12-23T00:00:00+07:00' },
  quote: { text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.', source: 'QS. Ar-Rum: 21' },
  events: [
    { title: 'Akad Nikah', icon: 'fa-ring', date: 'Sabtu, 20 Desember 2026', time: '08.00 – 10.00 WIB', venue: 'Masjid Agung, Jakarta', map: '' },
    { title: 'Resepsi', icon: 'fa-champagne-glasses', date: 'Sabtu, 20 Desember 2026', time: '11.00 – 14.00 WIB', venue: 'Ballroom Mawar, Jakarta', map: '' },
  ],
  gallery: ['../../img/mentahan/summer-1.jpeg', '../../img/mentahan/summer-2.jpeg', '../../img/mentahan/summer-3.jpeg', '../../img/mentahan/summer-4.jpeg', '../../img/mentahan/pasangan-duduk.jpeg', '../../img/mentahan/pasangan-romantis.jpeg'],
  galleryAfter: ['../../img/mentahan/pasangan-outdoor-1.jpeg', '../../img/mentahan/pasangan-outdoor-4.jpeg', '../../img/mentahan/pasangan-outdoor-5.jpeg', '../../img/mentahan/pasangan-pantai.jpeg', '../../img/mentahan/pasangan-pelukan-1.jpeg', '../../img/mentahan/pasangan-pelukan-3.jpeg'],
  music: { src: './audio/until-i-found-you-violin.mp3', startAt: 31, volume: 0.75 },
  closing: 'Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.',
}

const clone = (o) => JSON.parse(JSON.stringify(o))
const state = reactive(clone(SAMPLE))

const pvMode = ref('before')
const previewSrc = ref('')

function syncMeta() {
  state.meta.title = (state.couple.display || 'Undangan') + ' — Undangan Pernikahan'
  state.meta.description = 'Undangan pernikahan ' + (state.couple.display || '') + ' oleh Lavelle.'
}
function updatePreview() {
  syncMeta()
  try { sessionStorage.setItem('LAVELLE_PREVIEW', JSON.stringify(state)) } catch (e) {}
  previewSrc.value = `/demo/${state.meta.template}/?preview=1&mode=${pvMode.value}&_=${Date.now()}`
}

let pvTimer
watch(state, () => { clearTimeout(pvTimer); pvTimer = setTimeout(updatePreview, 450) }, { deep: true })
watch(pvMode, updatePreview)

// datetime-local <-> ISO WIB
const isoToLocal = (iso) => { const m = String(iso || '').match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/); return m ? `${m[1]}T${m[2]}` : '' }
const localToIso = (v) => (v ? `${v}:00+07:00` : '')
const dIso = computed({ get: () => isoToLocal(state.date.iso), set: (v) => { state.date.iso = localToIso(v) } })
const dAfter = computed({ get: () => isoToLocal(state.date.afterIso), set: (v) => { state.date.afterIso = localToIso(v) } })

// textarea galeri (satu URL per baris)
const linesText = (key) => computed({
  get: () => (state[key] || []).join('\n'),
  set: (v) => { state[key] = v.split('\n').map((s) => s.trim()).filter(Boolean) },
})
const galleryText = linesText('gallery')
const galleryAfterText = linesText('galleryAfter')

// textarea orang tua (enter -> <br>)
const parentsText = (who) => computed({
  get: () => (state.couple[who].parents || '').replace(/<br>/g, '\n'),
  set: (v) => { state.couple[who].parents = v.trim().replace(/\n/g, '<br>') },
})
const brideParents = parentsText('bride')
const groomParents = parentsText('groom')

function autoDisplay() {
  if (!state.date.iso) return
  const d = new Date(state.date.iso)
  state.date.display = `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`
  if (!state.date.afterIso) state.date.afterIso = localToIso(new Date(d.getTime() + 3 * 86400000).toISOString().slice(0, 16))
}
function addEvent() { state.events.push({ title: 'Acara Baru', icon: 'fa-heart', date: '', time: '', venue: '', map: '' }) }
function removeEvent(i) { state.events.splice(i, 1) }

function buildFileText() {
  syncMeta()
  const header = '/* =========================================================\n   Lavelle — Data Undangan (dibuat lewat Panel Template)\n   Ubah lewat panel, lalu ganti file ini di folder klien.\n   ========================================================= */\n'
  const footer = '\n\n/* MODE PREVIEW — jangan diubah */\n(function(){try{var q=new URLSearchParams(location.search);if(q.get("preview")==="1"){var d=sessionStorage.getItem("LAVELLE_PREVIEW");if(d)window.LAVELLE=JSON.parse(d);}}catch(e){}})();\n'
  return header + 'window.LAVELLE = ' + JSON.stringify(state, null, 2) + ';' + footer
}

const modalOpen = ref(false)
const generated = ref('')
function openModal() { generated.value = buildFileText(); modalOpen.value = true }
function copyCode() { navigator.clipboard.writeText(generated.value).then(() => alert('Tersalin! Tempel ke file data.js.')) }
function download() {
  const blob = new Blob([generated.value || buildFileText()], { type: 'text/javascript' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob); a.download = 'data.js'; a.click(); URL.revokeObjectURL(a.href)
}
function openNewTab() {
  try { sessionStorage.setItem('LAVELLE_PREVIEW', JSON.stringify(state)) } catch (e) {}
  window.open(`/demo/${state.meta.template}/?preview=1&mode=${pvMode.value}`, '_blank')
}
function reset() { if (confirm('Kembalikan semua isian ke contoh?')) { Object.assign(state, clone(SAMPLE)) } }

onMounted(updatePreview)

// kelas Tailwind yang dipakai berulang
const field = 'flex flex-col gap-1 text-sm'
const input = 'w-full rounded-lg border border-[var(--line)] bg-[var(--cream)] px-3 py-2 text-[var(--ink)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30'
const label = 'font-medium text-[var(--ink-soft)]'
const section = 'rounded-2xl border border-[var(--line)] bg-[var(--glass)] p-5 shadow-sm'
</script>

<template>
  <div class="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-[var(--bg)] text-[var(--ink)]">
    <!-- ====== FORM ====== -->
    <div class="overflow-y-auto lg:h-screen">
      <header class="sticky top-0 z-10 flex items-center gap-3 border-b border-[var(--line)] bg-[var(--glass)]/95 px-6 py-4 backdrop-blur">
        <img src="/img/lavelle-logo.png" alt="Lavelle" class="h-8 w-8 object-contain" />
        <div>
          <b class="text-lg" style="font-family:var(--serif)">Panel Template</b>
          <span class="ml-2 text-xs text-[var(--ink-mute)]">Vue · Vite · Tailwind</span>
        </div>
        <a href="/" class="ml-auto text-sm text-[var(--gold-deep)] hover:underline">← Situs</a>
      </header>

      <div class="space-y-5 p-6">
        <!-- Tema -->
        <div :class="section">
          <label :class="field">
            <span :class="label">Tema Undangan</span>
            <select v-model="state.meta.template" :class="input">
              <option value="klasik">Klasik — Blush &amp; Sage</option>
              <option value="modern" disabled>Modern — segera</option>
              <option value="sinema" disabled>Sinema — segera</option>
              <option value="modern-3d" disabled>Modern 3D — segera</option>
            </select>
          </label>
        </div>

        <!-- Pasangan -->
        <details class="group" open>
          <summary class="mb-2 cursor-pointer text-base font-semibold" style="font-family:var(--serif)">💍 Pasangan</summary>
          <div :class="section" class="space-y-4">
            <label :class="field"><span :class="label">Nama tampil (mis. Kayla &amp; Raka)</span>
              <input v-model="state.couple.display" :class="input" placeholder="Kayla & Raka" /></label>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-3 rounded-xl bg-[var(--bg-2)] p-3">
                <p class="text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)]">Mempelai Wanita</p>
                <label :class="field"><span :class="label">Nama panggilan</span><input v-model="state.couple.bride.name" :class="input" /></label>
                <label :class="field"><span :class="label">Nama lengkap</span><input v-model="state.couple.bride.full" :class="input" /></label>
                <label :class="field"><span :class="label">Inisial (1 huruf)</span><input v-model="state.couple.bride.initial" maxlength="2" :class="input" /></label>
                <label :class="field"><span :class="label">Orang tua</span><textarea v-model="brideParents" rows="2" :class="input"></textarea></label>
                <label :class="field"><span :class="label">Instagram (opsional)</span><input v-model="state.couple.bride.ig" :class="input" placeholder="https://instagram.com/..." /></label>
                <label :class="field"><span :class="label">Alamat foto (opsional)</span><input v-model="state.couple.bride.photo" :class="input" placeholder="../../img/klien/nama.jpeg" /></label>
              </div>
              <div class="space-y-3 rounded-xl bg-[var(--bg-2)] p-3">
                <p class="text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)]">Mempelai Pria</p>
                <label :class="field"><span :class="label">Nama panggilan</span><input v-model="state.couple.groom.name" :class="input" /></label>
                <label :class="field"><span :class="label">Nama lengkap</span><input v-model="state.couple.groom.full" :class="input" /></label>
                <label :class="field"><span :class="label">Inisial (1 huruf)</span><input v-model="state.couple.groom.initial" maxlength="2" :class="input" /></label>
                <label :class="field"><span :class="label">Orang tua</span><textarea v-model="groomParents" rows="2" :class="input"></textarea></label>
                <label :class="field"><span :class="label">Instagram (opsional)</span><input v-model="state.couple.groom.ig" :class="input" placeholder="https://instagram.com/..." /></label>
                <label :class="field"><span :class="label">Alamat foto (opsional)</span><input v-model="state.couple.groom.photo" :class="input" placeholder="../../img/klien/nama.jpeg" /></label>
              </div>
            </div>
          </div>
        </details>

        <!-- Tanggal -->
        <details>
          <summary class="mb-2 cursor-pointer text-base font-semibold" style="font-family:var(--serif)">📅 Tanggal &amp; Waktu</summary>
          <div :class="section" class="space-y-3">
            <label :class="field"><span :class="label">Tanggal &amp; jam acara</span><input type="datetime-local" v-model="dIso" :class="input" /></label>
            <label :class="field"><span :class="label">Tulisan tanggal yang tampil</span><input v-model="state.date.display" :class="input" placeholder="Sabtu, 20 Desember 2026" /></label>
            <button type="button" @click="autoDisplay" class="w-fit rounded-full border border-[var(--line-2)] px-3 py-1.5 text-xs hover:border-[var(--gold)]">↻ Isi otomatis dari tanggal di atas</button>
            <label :class="field"><span :class="label">Beralih ke mode "Kenangan" pada</span><input type="datetime-local" v-model="dAfter" :class="input" /></label>
          </div>
        </details>

        <!-- Kutipan -->
        <details>
          <summary class="mb-2 cursor-pointer text-base font-semibold" style="font-family:var(--serif)">❝ Kutipan / Ayat</summary>
          <div :class="section" class="space-y-3">
            <label :class="field"><span :class="label">Isi kutipan</span><textarea v-model="state.quote.text" rows="3" :class="input"></textarea></label>
            <label :class="field"><span :class="label">Sumber</span><input v-model="state.quote.source" :class="input" placeholder="QS. Ar-Rum: 21" /></label>
          </div>
        </details>

        <!-- Acara -->
        <details>
          <summary class="mb-2 cursor-pointer text-base font-semibold" style="font-family:var(--serif)">🗓️ Rangkaian Acara</summary>
          <div :class="section" class="space-y-3">
            <div v-for="(ev, i) in state.events" :key="i" class="space-y-2 rounded-xl bg-[var(--bg-2)] p-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-[var(--ink-mute)]">Acara {{ i + 1 }}</span>
                <button type="button" @click="removeEvent(i)" class="text-xs text-[var(--danger,#b4553f)] hover:underline">✕ hapus</button>
              </div>
              <label :class="field"><span :class="label">Nama acara</span><input v-model="ev.title" :class="input" /></label>
              <label :class="field"><span :class="label">Ikon</span>
                <select v-model="ev.icon" :class="input">
                  <option v-for="ic in EVENT_ICONS" :key="ic.v" :value="ic.v">{{ ic.t }}</option>
                </select>
              </label>
              <div class="grid gap-2 sm:grid-cols-2">
                <label :class="field"><span :class="label">Tanggal</span><input v-model="ev.date" :class="input" /></label>
                <label :class="field"><span :class="label">Waktu</span><input v-model="ev.time" :class="input" /></label>
              </div>
              <label :class="field"><span :class="label">Tempat</span><input v-model="ev.venue" :class="input" /></label>
              <label :class="field"><span :class="label">Link Google Maps (opsional)</span><input v-model="ev.map" :class="input" /></label>
            </div>
            <button type="button" @click="addEvent" class="rounded-full border border-[var(--line-2)] px-3 py-1.5 text-xs hover:border-[var(--gold)]">+ Tambah acara</button>
          </div>
        </details>

        <!-- Galeri & Musik -->
        <details>
          <summary class="mb-2 cursor-pointer text-base font-semibold" style="font-family:var(--serif)">🖼️ Galeri, Musik &amp; Penutup</summary>
          <div :class="section" class="space-y-3">
            <label :class="field"><span :class="label">Galeri (satu alamat foto per baris)</span><textarea v-model="galleryText" rows="5" :class="input"></textarea></label>
            <label :class="field"><span :class="label">Foto tambahan mode Kenangan</span><textarea v-model="galleryAfterText" rows="4" :class="input"></textarea></label>
            <label :class="field"><span :class="label">Alamat file musik</span><input v-model="state.music.src" :class="input" placeholder="./audio/lagu.mp3" /></label>
            <div class="grid gap-2 sm:grid-cols-2">
              <label :class="field"><span :class="label">Mulai dari detik ke-</span><input type="number" min="0" v-model.number="state.music.startAt" :class="input" /></label>
              <label :class="field"><span :class="label">Volume (0–1)</span><input type="number" min="0" max="1" step="0.05" v-model.number="state.music.volume" :class="input" /></label>
            </div>
            <label :class="field"><span :class="label">Kalimat penutup</span><textarea v-model="state.closing" rows="3" :class="input"></textarea></label>
          </div>
        </details>

        <!-- Aksi -->
        <div class="flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
          <button type="button" @click="updatePreview" class="rounded-full border border-[var(--line-2)] px-4 py-2 text-sm hover:border-[var(--gold)]">↻ Perbarui Preview</button>
          <button type="button" @click="reset" class="rounded-full border border-[var(--line-2)] px-4 py-2 text-sm hover:border-[var(--gold)]">Reset ke Contoh</button>
          <button type="button" @click="openModal" class="ml-auto rounded-full bg-[var(--green)] px-5 py-2 text-sm font-semibold text-[var(--cream)] shadow transition hover:brightness-110">Generate data.js</button>
        </div>
      </div>
    </div>

    <!-- ====== PREVIEW ====== -->
    <div class="sticky top-0 flex h-[70vh] flex-col bg-[#222] lg:h-screen">
      <div class="flex items-center gap-2 border-b border-black/30 bg-[var(--glass)] px-4 py-2 text-[var(--ink)]">
        <span class="text-sm font-medium">Preview</span>
        <select v-model="pvMode" class="rounded-md border border-[var(--line)] bg-[var(--cream)] px-2 py-1 text-xs text-[var(--ink)]">
          <option value="before">Mode Undangan</option>
          <option value="after">Mode Kenangan</option>
        </select>
        <button type="button" @click="openNewTab" class="ml-auto rounded-md border border-[var(--line-2)] px-2 py-1 text-xs hover:border-[var(--gold)]">Buka tab baru ↗</button>
      </div>
      <iframe :src="previewSrc" title="Preview undangan" class="flex-1 border-0 bg-white"></iframe>
    </div>

    <!-- ====== MODAL data.js ====== -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="modalOpen = false">
      <div class="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-[var(--glass)] text-[var(--ink)] shadow-2xl">
        <div class="flex items-center gap-3 border-b border-[var(--line)] px-5 py-3">
          <b>File data.js siap pakai</b>
          <button type="button" @click="modalOpen = false" class="ml-auto rounded-full border border-[var(--line-2)] px-3 py-1 text-sm hover:border-[var(--gold)]">Tutup</button>
        </div>
        <p class="px-5 py-3 text-sm text-[var(--ink-soft)]">
          <b>1)</b> Salin / download → <b>2)</b> ganti file <code class="rounded bg-[var(--bg-2)] px-1">demo/&lt;tema&gt;/data.js</code> di folder klien → <b>3)</b> upload ke GitHub. Selesai.
        </p>
        <pre class="mx-5 flex-1 overflow-auto rounded-xl bg-[#14160f] p-4 text-xs leading-relaxed text-[#d8ceba]">{{ generated }}</pre>
        <div class="flex gap-2 p-5">
          <button type="button" @click="copyCode" class="rounded-full border border-[var(--line-2)] px-4 py-2 text-sm hover:border-[var(--gold)]">Salin</button>
          <button type="button" @click="download" class="rounded-full bg-[var(--green)] px-5 py-2 text-sm font-semibold text-[var(--cream)] hover:brightness-110">Download data.js</button>
        </div>
      </div>
    </div>
  </div>
</template>
