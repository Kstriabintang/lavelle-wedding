# Portal Comfort Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mempoles Portal Undangan agar karyawan lebih nyaman — navigasi+progres editor, duplikat & cari/filter, pratinjau HP/desktop + modal + toast, dan panduan onboarding.

**Architecture:** Poles berlapis di atas struktur yang ada (editor accordion `BuilderForm`, shell `BuilderShell`, dashboard, `lib/invites.js`). Logika murni (progres, antrean toast) diekstrak ke fungsi yang bisa di-unit-test; UI Vue diverifikasi via QA manual + build.

**Tech Stack:** Vue 3.5 (`<script setup>`), Vite 6, Vitest 4, Supabase JS, CSS scoped + variabel `--pa-*` / `builder.css`.

## Global Constraints

- Bahasa UI & komentar: **Bahasa Indonesia**.
- Jangan ubah kontrak data `invite` (`src/portal/data/schema.js`) maupun tampilan undangan publik.
- Jangan sentuh backend/RLS Supabase.
- Warna dari variabel yang ada (`--pa-*` di dashboard, token `builder.css` di editor) — tak ada palet baru di luar sistem.
- Aksesibilitas: kontras ≥ 4.5:1, target sentuh ≥ 44×44, fokus keyboard terlihat, semua animasi hormati `prefers-reduced-motion`, ikon = SVG/glyph (bukan emoji sebagai ikon fungsional).
- Animasi 150–300ms.
- Tes murni: Vitest, file `*.test.js` berdampingan, `describe/it/expect`, deskripsi Bahasa Indonesia. Jalankan `npx vitest run <path>`.
- Commit sebagai identitas user; JANGAN tambah Co-authored-by/Claude.

---

## FASE 1 — Navigasi editor & progres

### Task 1.1: Logika progres (`computeProgress`) + composable

**Files:**
- Create: `src/portal/composables/useInviteProgress.js`
- Test: `src/portal/composables/useInviteProgress.test.js`

**Interfaces:**
- Produces:
  - `computeProgress(inviteData) → { sections: Array<{k,num,label,core,filled}>, filledCore:number, coreTotal:number, pct:number }`
  - `useInviteProgress(inviteRef) → ComputedRef<ReturnType<computeProgress>>`

- [ ] **Step 1: Tulis tes yang gagal**

```js
// src/portal/composables/useInviteProgress.test.js
import { describe, it, expect } from 'vitest'
import { computeProgress } from './useInviteProgress.js'
import { defaultInvite } from '../data/schema.js'

describe('computeProgress', () => {
  it('undangan kosong → 0 dari 7 seksi inti', () => {
    const p = computeProgress(defaultInvite())
    expect(p.coreTotal).toBe(7)
    expect(p.filledCore).toBe(0)
    expect(p.pct).toBe(0)
  })
  it('mempelai terisi bila nama pasangan + tanggal ada', () => {
    const d = defaultInvite(); d.hero.bride = 'Dina'; d.hero.groom = 'Agus'; d.hero.date = '2027-05-15'
    const s = computeProgress(d).sections.find((x) => x.k === 'mempelai')
    expect(s.filled).toBe(true)
  })
  it('mempelai belum terisi bila salah satu nama kosong', () => {
    const d = defaultInvite(); d.hero.bride = 'Dina'; d.hero.date = '2027-05-15'
    expect(computeProgress(d).sections.find((x) => x.k === 'mempelai').filled).toBe(false)
  })
  it('galeri terisi bila ada minimal 1 foto', () => {
    const d = defaultInvite(); d.gallery = [{ src: 'x.jpg' }]
    expect(computeProgress(d).sections.find((x) => x.k === 'galeri').filled).toBe(true)
  })
  it('musik terisi via link YouTube', () => {
    const d = defaultInvite(); d.music.link = 'https://youtu.be/abc'
    expect(computeProgress(d).sections.find((x) => x.k === 'musik').filled).toBe(true)
  })
  it('tema & gaya bukan seksi inti', () => {
    const secs = computeProgress(defaultInvite()).sections
    expect(secs.find((x) => x.k === 'tema').core).toBe(false)
    expect(secs.find((x) => x.k === 'gaya').core).toBe(false)
  })
  it('7 inti terisi → pct 1', () => {
    const d = defaultInvite()
    d.hero.bride = 'Dina'; d.hero.groom = 'Agus'; d.hero.date = '2027-05-15'
    d.story[0].title = 'Bertemu'
    d.events[0].place = 'Gedung A'
    d.gallery = [{ src: 'x.jpg' }]
    d.family.note = 'Turut mengundang'
    d.gifts = [{ bank: 'BCA', number: '123', name: 'Dina' }]
    d.music.link = 'https://youtu.be/abc'
    const p = computeProgress(d)
    expect(p.filledCore).toBe(7)
    expect(p.pct).toBe(1)
  })
})
```

- [ ] **Step 2: Jalankan tes — pastikan GAGAL**

Run: `npx vitest run src/portal/composables/useInviteProgress.test.js`
Expected: FAIL ("computeProgress is not a function" / module not found).

- [ ] **Step 3: Implementasi minimal**

```js
// src/portal/composables/useInviteProgress.js
// Menghitung kelengkapan pengisian undangan per-seksi (untuk bar progres & chip navigasi).
// computeProgress = fungsi murni (bisa diuji tanpa Vue). useInviteProgress = pembungkus reaktif.
import { computed } from 'vue'

function nonEmpty(v) { return typeof v === 'string' && v.trim().length > 0 }
function anyItem(arr) { return Array.isArray(arr) && arr.length > 0 }

// Definisi seksi + apakah "inti" + predikat terisi (berdasar schema.js)
const DEFS = [
  { k: 'mempelai', num: '01', label: 'Mempelai', core: true,
    test: (d) => nonEmpty(d.hero?.bride) && nonEmpty(d.hero?.groom) && (nonEmpty(d.hero?.date) || nonEmpty(d.hero?.dateText)) },
  { k: 'kisah', num: '02', label: 'Kisah', core: true,
    test: (d) => (d.story || []).some((s) => nonEmpty(s.title) || nonEmpty(s.desc)) },
  { k: 'acara', num: '03', label: 'Acara', core: true,
    test: (d) => (d.events || []).some((e) => nonEmpty(e.place)) },
  { k: 'galeri', num: '04', label: 'Galeri', core: true,
    test: (d) => anyItem(d.gallery) || anyItem(d.galleryFull) },
  { k: 'keluarga', num: '05', label: 'Keluarga', core: true,
    test: (d) => nonEmpty(d.family?.note) || anyItem(d.family?.bride) || anyItem(d.family?.groom) || anyItem(d.family?.alsoInviting) },
  { k: 'hadiah', num: '06', label: 'Amplop', core: true,
    test: (d) => anyItem(d.gifts) || !!d.qris },
  { k: 'musik', num: '07', label: 'Musik', core: true,
    test: (d) => nonEmpty(d.music?.link) || nonEmpty(d.music?.src) },
  { k: 'tema', num: '08', label: 'Tema', core: false, test: () => true },
  { k: 'gaya', num: '09', label: 'Gaya', core: false, test: () => true },
]

export function computeProgress(inviteData) {
  const d = inviteData || {}
  const sections = DEFS.map((def) => ({
    k: def.k, num: def.num, label: def.label, core: def.core,
    filled: !!def.test(d),
  }))
  const coreSecs = sections.filter((s) => s.core)
  const coreTotal = coreSecs.length
  const filledCore = coreSecs.filter((s) => s.filled).length
  return { sections, filledCore, coreTotal, pct: coreTotal ? filledCore / coreTotal : 0 }
}

export function useInviteProgress(inviteRef) {
  return computed(() => computeProgress(inviteRef.value))
}
```

- [ ] **Step 4: Jalankan tes — pastikan LULUS**

Run: `npx vitest run src/portal/composables/useInviteProgress.test.js`
Expected: PASS (semua kasus).

- [ ] **Step 5: Commit**

```bash
git add src/portal/composables/useInviteProgress.js src/portal/composables/useInviteProgress.test.js
git commit -m "feat(portal): logika kelengkapan pengisian undangan (progres editor)"
```

---

### Task 1.2: Komponen `SectionNav.vue`

**Files:**
- Create: `src/portal/components/builder/SectionNav.vue`

**Interfaces:**
- Consumes: hasil `computeProgress` via prop.
- Produces: props `{ progress:Object, active:String }`; emit `jump(k:String)`.

- [ ] **Step 1: Buat komponen**

```vue
<script setup>
// Header lengket editor: bar kelengkapan + chip navigasi seksi (klik → lompat).
defineProps({
  progress: { type: Object, required: true },   // { sections, filledCore, coreTotal, pct }
  active: { type: String, default: '' },
})
const emit = defineEmits(['jump'])
</script>

<template>
  <div class="snav">
    <div class="snav__bar">
      <span class="snav__label">Kelengkapan</span>
      <span class="snav__track"><span class="snav__fill" :style="{ width: (progress.pct * 100) + '%' }"></span></span>
      <span class="snav__count">{{ progress.filledCore }}/{{ progress.coreTotal }} seksi inti</span>
    </div>
    <div class="snav__chips">
      <button v-for="s in progress.sections" :key="s.k" type="button" class="snav__chip"
              :class="{ 'is-active': active === s.k, 'is-filled': s.filled, 'is-opt': !s.core }"
              :aria-current="active === s.k ? 'true' : undefined"
              :title="s.label + (s.core ? (s.filled ? ' — terisi' : ' — belum diisi') : ' — opsional')"
              @click="emit('jump', s.k)">
        <span class="snav__mark" aria-hidden="true">{{ s.core ? (s.filled ? '✓' : '○') : '·' }}</span>
        <span class="snav__num">{{ s.num }}</span>
        <span class="snav__name">{{ s.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.snav { position: sticky; top: 0; z-index: 4; background: rgba(20,16,11,.92); backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(201,162,75,.16); padding: .7rem 1.5rem .55rem; }
.snav__bar { display: flex; align-items: center; gap: .6rem; margin-bottom: .55rem; }
.snav__label { font-size: .62rem; text-transform: uppercase; letter-spacing: .12em; color: #a99d80; white-space: nowrap; }
.snav__track { flex: 1; height: 5px; border-radius: 40px; background: rgba(201,162,75,.14); overflow: hidden; }
.snav__fill { display: block; height: 100%; background: linear-gradient(90deg, #d8b25e, #e9c97e); border-radius: 40px; transition: width .35s ease; }
.snav__count { font-size: .68rem; color: #d8b25e; white-space: nowrap; }
.snav__chips { display: flex; gap: .4rem; overflow-x: auto; scrollbar-width: none; padding-bottom: .1rem; }
.snav__chips::-webkit-scrollbar { display: none; }
.snav__chip { display: inline-flex; align-items: center; gap: .3rem; flex: none; min-height: 34px; padding: .3rem .6rem;
  border: 1px solid rgba(201,162,75,.22); border-radius: 40px; background: rgba(0,0,0,.24); color: #a99d80;
  font-family: 'Jost', sans-serif; font-size: .72rem; cursor: pointer; white-space: nowrap; transition: border-color .2s, color .2s, background-color .2s; }
.snav__chip:hover { border-color: rgba(201,162,75,.5); color: #f1e7cf; }
.snav__chip.is-filled { color: #e6dcc4; }
.snav__chip.is-filled .snav__mark { color: #74c98c; }
.snav__chip.is-active { border-color: #d8b25e; background: rgba(201,162,75,.14); color: #f1e7cf; box-shadow: 0 0 0 1px rgba(201,162,75,.3); }
.snav__chip.is-opt { opacity: .8; }
.snav__mark { font-size: .8rem; line-height: 1; }
.snav__num { font-family: 'Fraunces', serif; font-size: .66rem; opacity: .7; }
.snav__chip:focus-visible { outline: 2px solid #e9c97e; outline-offset: 2px; }
@media (max-width: 600px) { .snav__name { display: none; } }
</style>
```

- [ ] **Step 2: Verifikasi build (belum terpasang, cek sintaks komponen)**

Run: `npm run build`
Expected: build sukses tanpa error terkait `SectionNav.vue`.

- [ ] **Step 3: Commit**

```bash
git add src/portal/components/builder/SectionNav.vue
git commit -m "feat(portal): komponen SectionNav (bar progres + chip navigasi seksi)"
```

---

### Task 1.3: Pasang SectionNav ke `BuilderForm.vue` + aksi lompat/scroll

**Files:**
- Modify: `src/portal/components/builder/BuilderForm.vue`

**Interfaces:**
- Consumes: `useInviteProgress` (Task 1.1), `SectionNav` (Task 1.2).

- [ ] **Step 1: Sunting script setup**

Ganti blok `<script setup>` menjadi:

```vue
<script setup>
// Form ber-seksi bernomor + navigasi lompat & bar progres (SectionNav).
import { ref, nextTick } from 'vue'
import '../../assets/builder.css'
import SectionNav from './SectionNav.vue'
import { useInviteProgress } from '../../composables/useInviteProgress.js'
import SectionMempelai from './sections/SectionMempelai.vue'
import SectionKisah from './sections/SectionKisah.vue'
import SectionAcara from './sections/SectionAcara.vue'
import SectionGaleri from './sections/SectionGaleri.vue'
import SectionKeluarga from './sections/SectionKeluarga.vue'
import SectionHadiah from './sections/SectionHadiah.vue'
import SectionMusik from './sections/SectionMusik.vue'
import SectionTema from './sections/SectionTema.vue'
import SectionGaya from './sections/SectionGaya.vue'

const props = defineProps({ invite: { type: Object, required: true }, theme: { type: String, required: true } })
const emit = defineEmits(['update:theme'])

const progress = useInviteProgress(() => props.invite)
const open = ref('mempelai')
const secEls = ref({})   // k → elemen .bf__sec (untuk scroll)
function setEl(k, el) { if (el) secEls.value[k] = el }
function toggle(k) { open.value = open.value === k ? '' : k }

async function goTo(k) {
  open.value = k
  await nextTick()
  const el = secEls.value[k]
  if (el && el.scrollIntoView) {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
  }
}

const SECS = [
  { k: 'mempelai', num: '01', label: 'Mempelai', desc: 'Nama, tanggal, orang tua & foto' },
  { k: 'kisah', num: '02', label: 'Kisah Cinta', desc: 'Bab perjalanan cinta + foto' },
  { k: 'acara', num: '03', label: 'Acara', desc: 'Akad & resepsi: waktu, tempat, peta' },
  { k: 'galeri', num: '04', label: 'Galeri', desc: 'Foto prewedding (maksimal 12)' },
  { k: 'keluarga', num: '05', label: 'Keluarga', desc: 'Orang tua & turut mengundang' },
  { k: 'hadiah', num: '06', label: 'Amplop Digital', desc: 'Rekening / e-wallet / QRIS' },
  { k: 'musik', num: '07', label: 'Musik', desc: 'Lagu latar dari YouTube (auto-play)' },
  { k: 'tema', num: '08', label: 'Tema Warna', desc: 'Nuansa warna undangan' },
  { k: 'gaya', num: '09', label: 'Kustomisasi', desc: 'Font, ukuran teks, warna aksen, sembunyikan seksi' },
]
</script>
```

- [ ] **Step 2: Sunting template — tambahkan `<SectionNav>` & `:ref` per seksi**

Ganti isi `<template>` menjadi:

```vue
<template>
  <div class="bf">
    <SectionNav :progress="progress" :active="open" @jump="goTo" />
    <div v-for="s in SECS" :key="s.k" class="bf__sec" :ref="(el) => setEl(s.k, el)">
      <button class="bf__head" :class="{ 'is-open': open === s.k }" @click="toggle(s.k)"
              :aria-expanded="open === s.k">
        <span class="bf__num">{{ s.num }}</span>
        <span class="bf__titles">
          <span class="bf__title">{{ s.label }}</span>
          <span class="bf__desc">{{ s.desc }}</span>
        </span>
        <span class="bf__chev">▼</span>
      </button>
      <div class="bf__wrap" :class="{ 'is-open': open === s.k }">
        <div class="bf__inner">
          <div class="bf__body">
            <SectionMempelai v-if="s.k === 'mempelai'" :invite="invite" />
            <SectionKisah v-else-if="s.k === 'kisah'" :invite="invite" />
            <SectionAcara v-else-if="s.k === 'acara'" :invite="invite" />
            <SectionGaleri v-else-if="s.k === 'galeri'" :invite="invite" />
            <SectionKeluarga v-else-if="s.k === 'keluarga'" :invite="invite" />
            <SectionHadiah v-else-if="s.k === 'hadiah'" :invite="invite" />
            <SectionMusik v-else-if="s.k === 'musik'" :invite="invite" />
            <SectionGaya v-else-if="s.k === 'gaya'" :invite="invite" />
            <SectionTema v-else :theme="theme" @update:theme="emit('update:theme', $event)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

Catatan: `useInviteProgress(() => props.invite)` menerima getter; sesuaikan composable agar
menerima ref ATAU getter — perbarui Task 1.1 `useInviteProgress` bila perlu:
`return computed(() => computeProgress(typeof inviteRef === 'function' ? inviteRef() : inviteRef.value))`.

- [ ] **Step 3: Perbarui `useInviteProgress` agar menerima getter**

Di `src/portal/composables/useInviteProgress.js`, ganti fungsi `useInviteProgress`:

```js
export function useInviteProgress(src) {
  return computed(() => computeProgress(typeof src === 'function' ? src() : src.value))
}
```

- [ ] **Step 4: Verifikasi build + tes ulang**

Run: `npm run build && npx vitest run src/portal/composables/useInviteProgress.test.js`
Expected: build sukses; tes tetap PASS.

- [ ] **Step 5: QA manual**

Jalankan `npm run dev`, buka `/portal/edit/<id>`. Verifikasi:
- Bar progres & chip tampil lengket di atas form.
- Klik chip → seksi terbuka & ter-scroll ke atas; chip aktif ter-highlight.
- Mengisi field (mis. nama mempelai + tanggal) → penanda chip berubah `○`→`✓` dan bar naik.

- [ ] **Step 6: Commit**

```bash
git add src/portal/components/builder/BuilderForm.vue src/portal/composables/useInviteProgress.js
git commit -m "feat(portal): navigasi lompat antar-seksi + bar progres di editor"
```

---

## FASE 2 — Efisiensi bikin massal

### Task 2.1: `duplicateInvite` di `lib/invites.js`

**Files:**
- Modify: `src/portal/lib/invites.js`

**Interfaces:**
- Consumes: `getInvite`, `createInvite`, `slugTaken` (sudah ada).
- Produces: `duplicateInvite(sourceId:String, ownerId:String) → Promise<Row>` (status draft).

- [ ] **Step 1: Tambah fungsi**

Tambahkan di akhir `src/portal/lib/invites.js`:

```js
// Duplikat undangan: salin data + tema ke undangan BARU (slug otomatis, status draft).
// Foto memakai URL storage yang sama (aman; hapus asal tak merusak duplikat).
function genDupSlug() {
  return `undangan-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
}
export async function duplicateInvite(sourceId, ownerId) {
  const src = await getInvite(sourceId)
  let slug = genDupSlug()
  if (await slugTaken(slug)) slug = genDupSlug() + Math.random().toString(36).slice(2, 4)
  const data = typeof structuredClone === 'function'
    ? structuredClone(src.data || {})
    : JSON.parse(JSON.stringify(src.data || {}))
  return createInvite(slug, ownerId, data, src.theme)   // createInvite default status draft
}
```

- [ ] **Step 2: QA manual**

Panggil dari konsol/dashboard (Task 2.2) → muncul undangan baru berstatus draft dengan data sama, slug berbeda. Undangan asal tak berubah.

- [ ] **Step 3: Commit**

```bash
git add src/portal/lib/invites.js
git commit -m "feat(portal): fungsi duplicateInvite (salin undangan jadi draft baru)"
```

---

### Task 2.2: Dashboard — tombol Duplikat + pencarian + filter status

**Files:**
- Modify: `src/portal/pages/PortalDashboard.vue`

**Interfaces:**
- Consumes: `duplicateInvite` (Task 2.1), `useToast` (Task 3.1 — bila belum ada, sementara pakai `alert` lalu diganti di Fase 3). Untuk urutan aman, Fase 2 pakai fallback tanpa toast; toast disambungkan di Task 3.4.

- [ ] **Step 1: Tambah state & computed filter (script)**

Di `<script setup>` `PortalDashboard.vue`:
- Import: `import { listInvites, createInvite, deleteInvite, duplicateInvite, slugTaken } from '../lib/invites.js'`
- Tambah state:

```js
const query = ref('')
const statusFilter = ref('all')   // all | published | draft
const duplicating = ref(null)     // id yang sedang diduplikat

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return invites.value.filter((inv) => {
    if (statusFilter.value === 'published' && inv.status !== 'published') return false
    if (statusFilter.value === 'draft' && inv.status === 'published') return false
    if (!q) return true
    return coupleName(inv).toLowerCase().includes(q) || (inv.slug || '').toLowerCase().includes(q)
  })
})

async function duplicate(inv) {
  if (duplicating.value) return
  duplicating.value = inv.id
  try { await duplicateInvite(inv.id, profile.value.id); await refresh() }
  catch { alert('Gagal menduplikat undangan.') }   // diganti toast di Task 3.4
  finally { duplicating.value = null }
}
```

- [ ] **Step 2: Tambah UI cari + filter (template, sebelum `.db__grid`)**

```vue
<div class="db__toolbar">
  <label class="db__search">
    <span class="db__search-ic" aria-hidden="true">⌕</span>
    <input v-model="query" type="search" autocomplete="off" placeholder="Cari nama mempelai / alamat…" aria-label="Cari undangan">
  </label>
  <div class="db__filters" role="tablist" aria-label="Filter status">
    <button type="button" class="db__filter" :class="{ 'is-on': statusFilter === 'all' }" @click="statusFilter = 'all'">Semua</button>
    <button type="button" class="db__filter" :class="{ 'is-on': statusFilter === 'published' }" @click="statusFilter = 'published'">Terbit</button>
    <button type="button" class="db__filter" :class="{ 'is-on': statusFilter === 'draft' }" @click="statusFilter = 'draft'">Draft</button>
  </div>
</div>
```

- [ ] **Step 3: Pakai `filtered` di grid + empty state + tombol Duplikat**

- Ganti `v-for="inv in invites"` menjadi `v-for="inv in filtered"`.
- Tambah tombol Duplikat di `.db__actions` (setelah Edit / sebelum Hapus):

```vue
<button class="db__dup" type="button" :disabled="duplicating === inv.id" @click="duplicate(inv)">
  {{ duplicating === inv.id ? 'Menyalin…' : 'Duplikat' }}
</button>
```

- Setelah `.db__grid`, tambah empty state hasil pencarian:

```vue
<p v-if="!loading && filtered.length === 0 && invites.length > 0" class="db__empty">
  Tak ada undangan cocok — coba kata kunci lain.
</p>
```

- [ ] **Step 4: Tambah style (scoped)**

```css
.db__toolbar { display: flex; align-items: center; gap: .8rem; margin-bottom: 1.2rem; flex-wrap: wrap; }
.db__search { display: flex; align-items: center; gap: .5rem; flex: 1; min-width: 220px; border: 1px solid var(--pa-bd2); border-radius: 40px; background: var(--pa-surf2); padding: .1rem .9rem; }
.db__search-ic { color: var(--pa-mut); font-size: 1rem; }
.db__search input { flex: 1; min-width: 0; border: none; background: transparent; padding: .55rem 0; color: var(--pa-txt); font-family: inherit; font-size: .88rem; }
.db__search input:focus { outline: none; }
.db__filters { display: flex; gap: .35rem; }
.db__filter { min-height: 38px; padding: .4rem .9rem; border: 1px solid var(--pa-bd); border-radius: 40px; background: var(--pa-surf2); color: var(--pa-mut); font-family: inherit; font-size: .8rem; cursor: pointer; transition: border-color .2s, color .2s, background-color .2s; }
.db__filter:hover { color: var(--pa-txt); border-color: var(--pa-bd2); }
.db__filter.is-on { border-color: var(--pa-acc); color: var(--pa-ink); background: var(--pa-acc); }
.db__dup { background: rgba(255,255,255,.05); border: 1px solid var(--pa-bd2); border-radius: 8px; padding: .42rem .8rem; color: var(--pa-txt); font-family: inherit; font-size: .8rem; cursor: pointer; transition: border-color .2s, background-color .2s; }
.db__dup:hover:not(:disabled) { border-color: var(--pa-acc); }
.db__dup:disabled { opacity: .5; }
.db__empty { text-align: center; color: var(--pa-mut); padding: 2rem 1rem; }
```

- [ ] **Step 5: Verifikasi build + QA manual**

Run: `npm run build`
Lalu `npm run dev` → dashboard: ketik di kotak cari (hasil menyaring), klik tab Terbit/Draft (grid ikut), klik Duplikat (muncul kartu draft baru).

- [ ] **Step 6: Commit**

```bash
git add src/portal/pages/PortalDashboard.vue
git commit -m "feat(portal): duplikat undangan + pencarian & filter status di dashboard"
```

---

## FASE 3 — Pratinjau & polish rasa

### Task 3.1: Toast store (`useToast`) + `ToastHost`

**Files:**
- Create: `src/portal/composables/useToast.js`
- Create: `src/portal/composables/useToast.test.js`
- Create: `src/portal/components/portal/ToastHost.vue`

**Interfaces:**
- Produces:
  - `useToast() → { toasts:Ref<Array>, success(msg), error(msg,{retry}), info(msg), dismiss(id) }`
  - `pushToast(type, msg, opts) → id` (dipakai internal + tes)

- [ ] **Step 1: Tulis tes yang gagal**

```js
// src/portal/composables/useToast.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { useToast, _reset } from './useToast.js'

describe('useToast', () => {
  beforeEach(() => _reset())
  it('success menambah 1 toast bertipe success', () => {
    const t = useToast(); t.success('Tersimpan')
    expect(t.toasts.value.length).toBe(1)
    expect(t.toasts.value[0].type).toBe('success')
    expect(t.toasts.value[0].msg).toBe('Tersimpan')
  })
  it('dismiss menghapus toast by id', () => {
    const t = useToast(); const id = t.error('Gagal')
    expect(t.toasts.value.length).toBe(1)
    t.dismiss(id)
    expect(t.toasts.value.length).toBe(0)
  })
  it('error menyimpan callback retry', () => {
    const t = useToast(); let ran = false
    t.error('Gagal', { retry: () => { ran = true } })
    t.toasts.value[0].retry()
    expect(ran).toBe(true)
  })
})
```

- [ ] **Step 2: Jalankan tes — pastikan GAGAL**

Run: `npx vitest run src/portal/composables/useToast.test.js`
Expected: FAIL (module not found).

- [ ] **Step 3: Implementasi**

```js
// src/portal/composables/useToast.js
// Antrean toast global (module-singleton) → konsisten lintas halaman portal.
import { ref } from 'vue'

const toasts = ref([])
let seq = 0

export function pushToast(type, msg, opts = {}) {
  const id = ++seq
  toasts.value.push({ id, type, msg, retry: opts.retry || null })
  const ttl = opts.ttl != null ? opts.ttl : (type === 'error' ? 6000 : 3500)
  if (ttl > 0 && typeof setTimeout === 'function') setTimeout(() => dismiss(id), ttl)
  return id
}
export function dismiss(id) { toasts.value = toasts.value.filter((t) => t.id !== id) }
export function _reset() { toasts.value = []; seq = 0 }   // hanya untuk tes

export function useToast() {
  return {
    toasts,
    success: (msg, o) => pushToast('success', msg, o),
    error: (msg, o) => pushToast('error', msg, o),
    info: (msg, o) => pushToast('info', msg, o),
    dismiss,
  }
}
```

- [ ] **Step 4: Jalankan tes — pastikan LULUS**

Run: `npx vitest run src/portal/composables/useToast.test.js`
Expected: PASS.

- [ ] **Step 5: Buat `ToastHost.vue`**

```vue
<script setup>
import { useToast } from '../../composables/useToast.js'
const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="toasts" aria-live="polite" aria-atomic="false">
    <transition-group name="toast">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="'toast--' + t.type" role="status">
        <span class="toast__msg">{{ t.msg }}</span>
        <button v-if="t.retry" type="button" class="toast__act" @click="t.retry(); dismiss(t.id)">Coba lagi</button>
        <button type="button" class="toast__x" aria-label="Tutup" @click="dismiss(t.id)">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toasts { position: fixed; right: 1.1rem; bottom: 1.1rem; z-index: 60; display: flex; flex-direction: column; gap: .55rem; max-width: min(92vw, 360px); }
.toast { display: flex; align-items: center; gap: .7rem; padding: .7rem .9rem; border-radius: 12px; background: rgba(20,16,11,.96);
  border: 1px solid rgba(201,162,75,.3); color: #f1e7cf; font-family: 'Jost', sans-serif; font-size: .84rem; box-shadow: 0 18px 40px -18px rgba(0,0,0,.8); }
.toast--success { border-color: rgba(47,125,70,.6); }
.toast--error { border-color: rgba(224,119,107,.6); }
.toast__msg { flex: 1; }
.toast__act { background: rgba(201,162,75,.16); border: 1px solid rgba(201,162,75,.4); border-radius: 8px; color: #e9c97e; font-family: inherit; font-size: .78rem; padding: .3rem .7rem; cursor: pointer; }
.toast__x { background: none; border: none; color: #a99d80; cursor: pointer; font-size: .8rem; line-height: 1; padding: .2rem; }
.toast__x:hover { color: #f1e7cf; }
.toast-enter-active, .toast-leave-active { transition: opacity .25s, transform .25s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
@media (prefers-reduced-motion: reduce) { .toast-enter-active, .toast-leave-active { transition: none; } }
</style>
```

- [ ] **Step 6: Commit**

```bash
git add src/portal/composables/useToast.js src/portal/composables/useToast.test.js src/portal/components/portal/ToastHost.vue
git commit -m "feat(portal): sistem toast (umpan balik halus + retry)"
```

---

### Task 3.2: `ConfirmModal.vue`

**Files:**
- Create: `src/portal/components/portal/ConfirmModal.vue`

**Interfaces:**
- Produces: props `{ open:Boolean, title:String, message:String, confirmLabel:String, danger:Boolean }`; emit `confirm`, `cancel`.

- [ ] **Step 1: Buat komponen**

```vue
<script setup>
import { watch, nextTick, ref } from 'vue'
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Lanjutkan' },
  danger: { type: Boolean, default: false },
})
const emit = defineEmits(['confirm', 'cancel'])
const okBtn = ref(null)
function onKey(e) { if (e.key === 'Escape') emit('cancel') }
watch(() => props.open, async (v) => {
  if (v) { await nextTick(); okBtn.value && okBtn.value.focus() }
})
</script>

<template>
  <transition name="cm">
    <div v-if="open" class="cm" @keydown="onKey" @click.self="emit('cancel')">
      <div class="cm__box" role="dialog" aria-modal="true" :aria-label="title">
        <h3 class="cm__title">{{ title }}</h3>
        <p v-if="message" class="cm__msg">{{ message }}</p>
        <div class="cm__row">
          <button type="button" class="cm__cancel" @click="emit('cancel')">Batal</button>
          <button ref="okBtn" type="button" class="cm__ok" :class="{ 'is-danger': danger }" @click="emit('confirm')">{{ confirmLabel }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.cm { position: fixed; inset: 0; z-index: 70; display: grid; place-items: center; padding: 1.2rem; background: rgba(6,4,2,.66); backdrop-filter: blur(4px); }
.cm__box { width: min(92vw, 380px); background: #14100b; border: 1px solid rgba(201,162,75,.28); border-radius: 16px; padding: 1.4rem 1.4rem 1.2rem; box-shadow: 0 30px 60px -24px rgba(0,0,0,.85); }
.cm__title { font-family: 'Fraunces', serif; font-size: 1.2rem; color: #f1e7cf; }
.cm__msg { margin-top: .5rem; color: #b6ab8a; font-size: .88rem; line-height: 1.5; font-family: 'Jost', sans-serif; }
.cm__row { display: flex; justify-content: flex-end; gap: .6rem; margin-top: 1.3rem; }
.cm__cancel { min-height: 40px; padding: .5rem 1.1rem; border: 1px solid rgba(201,162,75,.3); border-radius: 10px; background: rgba(255,255,255,.03); color: #a99d80; font-family: 'Jost', sans-serif; font-size: .85rem; cursor: pointer; }
.cm__ok { min-height: 40px; padding: .5rem 1.3rem; border: none; border-radius: 10px; background: #d3ad55; color: #201907; font-family: 'Jost', sans-serif; font-weight: 600; font-size: .85rem; cursor: pointer; }
.cm__ok.is-danger { background: #c9564e; color: #fff; }
.cm__ok:focus-visible, .cm__cancel:focus-visible { outline: 2px solid #e9c97e; outline-offset: 2px; }
.cm-enter-active, .cm-leave-active { transition: opacity .2s; }
.cm-enter-from, .cm-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .cm-enter-active, .cm-leave-active { transition: none; } }
</style>
```

- [ ] **Step 2: Verifikasi build**

Run: `npm run build`
Expected: sukses.

- [ ] **Step 3: Commit**

```bash
git add src/portal/components/portal/ConfirmModal.vue
git commit -m "feat(portal): ConfirmModal dark-luxury (pengganti confirm bawaan)"
```

---

### Task 3.3: Toggle pratinjau HP / Desktop di `BuilderShell.vue`

**Files:**
- Modify: `src/portal/components/builder/BuilderShell.vue`

- [ ] **Step 1: Sunting script + template**

```vue
<script setup>
// Shell builder: panel form (kiri) | panggung pratinjau (kanan). Toggle HP/Desktop.
import { ref } from 'vue'
const showPreview = ref(false)
const device = ref('phone')   // phone | desktop
</script>

<template>
  <div class="bshell" :class="{ 'is-preview': showPreview, ['dev-' + device]: true }">
    <aside class="bshell__panel"><slot name="form" /></aside>

    <section class="bshell__stage">
      <div class="bshell__toolbar">
        <span class="bshell__live">Pratinjau langsung</span>
        <div class="bshell__seg" role="group" aria-label="Ukuran pratinjau">
          <button type="button" :class="{ 'is-on': device === 'phone' }" :aria-pressed="device === 'phone'" @click="device = 'phone'">HP</button>
          <button type="button" :class="{ 'is-on': device === 'desktop' }" :aria-pressed="device === 'desktop'" @click="device = 'desktop'">Desktop</button>
        </div>
        <slot name="toolbar" />
      </div>
      <div class="bshell__device">
        <span class="bshell__notch"></span>
        <div class="bshell__screen"><slot name="preview" /></div>
      </div>
    </section>

    <button class="bshell__fab" type="button" @click="showPreview = !showPreview">
      <span v-if="showPreview">✎ Kembali mengedit</span>
      <span v-else>◉ Lihat pratinjau</span>
    </button>
  </div>
</template>
```

- [ ] **Step 2: Tambah CSS di `src/portal/assets/builder.css`**

Cari selektor `.bshell__device` (bingkai HP). Tambahkan aturan mode desktop & segmen toggle di akhir file:

```css
/* Toggle ukuran pratinjau */
.bshell__seg { display: inline-flex; border: 1px solid rgba(201,162,75,.3); border-radius: 40px; overflow: hidden; }
.bshell__seg button { min-height: 34px; padding: .3rem .8rem; border: none; background: transparent; color: #a99d80; font-family: 'Jost', sans-serif; font-size: .76rem; cursor: pointer; }
.bshell__seg button.is-on { background: rgba(201,162,75,.18); color: #f1e7cf; }
.bshell__seg button:focus-visible { outline: 2px solid #e9c97e; outline-offset: -2px; }

/* Mode desktop: pratinjau lebar penuh tanpa bingkai HP */
.bshell.dev-desktop .bshell__device { max-width: none; width: 100%; height: 100%; aspect-ratio: auto; border-radius: 12px; padding: 0; }
.bshell.dev-desktop .bshell__notch { display: none; }
```

Catatan: bila `.bshell__device` di `builder.css` memakai `max-width`/`aspect-ratio`/`padding` untuk membentuk HP, override `dev-desktop` di atas menetralkannya. Sesuaikan properti yang benar-benar dipakai setelah membaca selektor aslinya.

- [ ] **Step 3: Verifikasi build + QA manual**

Run: `npm run build`
`npm run dev` → editor: klik HP/Desktop, panggung berubah lebar; notch hilang saat desktop.

- [ ] **Step 4: Commit**

```bash
git add src/portal/components/builder/BuilderShell.vue src/portal/assets/builder.css
git commit -m "feat(portal): toggle pratinjau HP/Desktop di editor"
```

---

### Task 3.4: Sambungkan toast + ConfirmModal ke Dashboard & Editor

**Files:**
- Modify: `src/portal/pages/PortalDashboard.vue`
- Modify: `src/portal/pages/PortalEditor.vue`

- [ ] **Step 1: Dashboard — pasang ConfirmModal + toast**

Di `PortalDashboard.vue`:
- Import: `import ConfirmModal from '../components/portal/ConfirmModal.vue'`, `import ToastHost from '../components/portal/ToastHost.vue'`, `import { useToast } from '../composables/useToast.js'`.
- `const toast = useToast()`; `const pendingDelete = ref(null)`.
- Ganti `removeInvite` menjadi minta konfirmasi via modal:

```js
function askDelete(inv) { pendingDelete.value = inv }
async function confirmDelete() {
  const inv = pendingDelete.value; pendingDelete.value = null
  if (!inv) return
  try { await deleteInvite(inv.id); await refresh(); toast.success('Undangan dihapus') }
  catch { toast.error('Gagal menghapus undangan') }
}
```

- Tombol Hapus: `@click="askDelete(inv)"` (ganti `removeInvite`).
- Di `duplicate()` ganti `alert(...)` → `toast.error('Gagal menduplikat undangan.')`, dan setelah sukses tambah `toast.success('Undangan diduplikat ✓')`.
- Template (sebelum `</div>` penutup `.db`): tambah

```vue
<ConfirmModal :open="!!pendingDelete" title="Hapus undangan?"
  :message="pendingDelete ? `“${pendingDelete.slug}.lavelle.my.id” akan dihapus permanen.` : ''"
  confirm-label="Hapus" danger @confirm="confirmDelete" @cancel="pendingDelete = null" />
<ToastHost />
```

- [ ] **Step 2: Editor — toast error simpan + terbit**

Di `PortalEditor.vue`:
- Import `ToastHost` + `useToast`; `const toast = useToast()`.
- Di `doSave()` pada blok `catch`: setelah `saveState.value = 'error'`, panggil `toast.error('Gagal menyimpan', { retry: doSave })`.
- Di akhir `publish()` sukses: `toast.success('Undangan terbit ✓')`.
- Tambah `<ToastHost />` di dalam root template (mis. setelah `</BuilderShell>` bila ada wrapper, atau bungkus template dengan fragment + ToastHost).

- [ ] **Step 3: Verifikasi build + QA manual**

Run: `npm run build`
`npm run dev`: hapus undangan → muncul modal → konfirmasi → toast; duplikat → toast; matikan jaringan lalu edit → toast error "Coba lagi".

- [ ] **Step 4: Commit**

```bash
git add src/portal/pages/PortalDashboard.vue src/portal/pages/PortalEditor.vue
git commit -m "feat(portal): sambungkan toast & modal konfirmasi ke dashboard & editor"
```

---

## FASE 4 — Panduan & bantuan

### Task 4.1: `Hint.vue` (tooltip bantuan)

**Files:**
- Create: `src/portal/components/portal/Hint.vue`

**Interfaces:**
- Produces: prop `{ text:String }`; slot default opsional (isi tooltip kaya).

- [ ] **Step 1: Buat komponen**

```vue
<script setup>
import { ref } from 'vue'
defineProps({ text: { type: String, default: '' } })
const on = ref(false)
</script>

<template>
  <span class="hint" @mouseenter="on = true" @mouseleave="on = false">
    <button type="button" class="hint__btn" aria-label="Bantuan"
            @focus="on = true" @blur="on = false" @click.prevent="on = !on">?</button>
    <transition name="hint">
      <span v-if="on" class="hint__pop" role="tooltip"><slot>{{ text }}</slot></span>
    </transition>
  </span>
</template>

<style scoped>
.hint { position: relative; display: inline-flex; vertical-align: middle; margin-left: .35rem; }
.hint__btn { width: 18px; height: 18px; border-radius: 50%; border: 1px solid rgba(201,162,75,.45); background: rgba(201,162,75,.12); color: #d8b25e; font-size: .68rem; line-height: 1; cursor: help; display: grid; place-items: center; padding: 0; }
.hint__btn:focus-visible { outline: 2px solid #e9c97e; outline-offset: 2px; }
.hint__pop { position: absolute; bottom: 140%; left: 50%; transform: translateX(-50%); z-index: 20; width: max-content; max-width: 240px;
  background: #1c150c; color: #f1e7cf; border: 1px solid rgba(201,162,75,.3); border-radius: 9px; padding: .5rem .65rem; font-size: .74rem; line-height: 1.45; box-shadow: 0 14px 30px -14px rgba(0,0,0,.8); font-family: 'Jost', sans-serif; }
.hint-enter-active, .hint-leave-active { transition: opacity .15s; }
.hint-enter-from, .hint-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .hint-enter-active, .hint-leave-active { transition: none; } }
</style>
```

- [ ] **Step 2: Verifikasi build + Commit**

```bash
npm run build
git add src/portal/components/portal/Hint.vue
git commit -m "feat(portal): komponen Hint (tooltip bantuan aksesibel)"
```

---

### Task 4.2: `WelcomeModal.vue` + pemicu login pertama

**Files:**
- Create: `src/portal/components/portal/WelcomeModal.vue`
- Modify: `src/portal/pages/PortalDashboard.vue`

**Interfaces:**
- Produces: prop `{ open:Boolean, name:String }`; emit `close`.

- [ ] **Step 1: Buat komponen**

```vue
<script setup>
defineProps({ open: { type: Boolean, default: false }, name: { type: String, default: '' } })
const emit = defineEmits(['close'])
const STEPS = [
  { n: '1', t: 'Isi seksi undangan', d: 'Buka tiap seksi (Mempelai, Acara, dst). Bar progres di editor menandai yang sudah/belum diisi.' },
  { n: '2', t: 'Cek pratinjau langsung', d: 'Panel kanan menampilkan hasil real-time — bisa dilihat mode HP atau Desktop.' },
  { n: '3', t: 'Atur alamat & terbitkan', d: 'Tentukan alamat (mis. dina-agus), lalu klik Terbitkan. Subdomain aktif otomatis.' },
]
</script>

<template>
  <transition name="wm">
    <div v-if="open" class="wm" @click.self="emit('close')">
      <div class="wm__box" role="dialog" aria-modal="true" aria-label="Selamat datang">
        <p class="wm__kicker">Selamat datang{{ name ? ', ' + name : '' }} 👋</p>
        <h2 class="wm__title">Bikin undangan dalam 3 langkah</h2>
        <ul class="wm__steps">
          <li v-for="s in STEPS" :key="s.n" class="wm__step">
            <span class="wm__n">{{ s.n }}</span>
            <span><b class="wm__st">{{ s.t }}</b><span class="wm__sd">{{ s.d }}</span></span>
          </li>
        </ul>
        <div class="wm__row">
          <button type="button" class="wm__skip" @click="emit('close')">Lewati</button>
          <button type="button" class="wm__ok" @click="emit('close')">Mengerti, mulai</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.wm { position: fixed; inset: 0; z-index: 65; display: grid; place-items: center; padding: 1.2rem; background: rgba(6,4,2,.7); backdrop-filter: blur(5px); }
.wm__box { width: min(94vw, 460px); background: #14100b; border: 1px solid rgba(201,162,75,.28); border-radius: 18px; padding: 1.6rem 1.6rem 1.4rem; box-shadow: 0 30px 70px -24px rgba(0,0,0,.85); }
.wm__kicker { font-size: .78rem; color: #d8b25e; }
.wm__title { font-family: 'Fraunces', serif; font-size: 1.4rem; color: #f1e7cf; margin-top: .25rem; }
.wm__steps { list-style: none; margin: 1.1rem 0 0; padding: 0; display: flex; flex-direction: column; gap: .9rem; }
.wm__step { display: flex; gap: .8rem; }
.wm__n { flex: none; width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg,#e9c97e,#d3ad55); color: #201907; font-family: 'Fraunces', serif; font-size: .85rem; display: grid; place-items: center; }
.wm__st { display: block; color: #f1e7cf; font-family: 'Jost', sans-serif; font-size: .92rem; }
.wm__sd { display: block; color: #b6ab8a; font-family: 'Jost', sans-serif; font-size: .8rem; line-height: 1.5; margin-top: .15rem; }
.wm__row { display: flex; justify-content: flex-end; gap: .6rem; margin-top: 1.5rem; }
.wm__skip { min-height: 42px; padding: .5rem 1.1rem; border: 1px solid rgba(201,162,75,.3); border-radius: 10px; background: none; color: #a99d80; font-family: 'Jost', sans-serif; font-size: .86rem; cursor: pointer; }
.wm__ok { min-height: 42px; padding: .5rem 1.4rem; border: none; border-radius: 10px; background: #d3ad55; color: #201907; font-family: 'Jost', sans-serif; font-weight: 600; font-size: .86rem; cursor: pointer; }
.wm__skip:focus-visible, .wm__ok:focus-visible { outline: 2px solid #e9c97e; outline-offset: 2px; }
.wm-enter-active, .wm-leave-active { transition: opacity .25s; }
.wm-enter-from, .wm-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .wm-enter-active, .wm-leave-active { transition: none; } }
</style>
```

- [ ] **Step 2: Picu di Dashboard (login pertama, flag localStorage)**

Di `PortalDashboard.vue`:
- Import `WelcomeModal`.
- Tambah state `const showWelcome = ref(false)`.
- Di akhir `onMounted` (setelah `refresh()`), setelah `profile.value` terisi:

```js
try {
  const key = 'lavelle_tour_v1_' + (profile.value && profile.value.id)
  if (typeof localStorage !== 'undefined' && !localStorage.getItem(key)) showWelcome.value = true
} catch { /* localStorage tak tersedia → lewati */ }
```

- Fungsi tutup:

```js
function closeWelcome() {
  showWelcome.value = false
  try { localStorage.setItem('lavelle_tour_v1_' + profile.value.id, '1') } catch { /* */ }
}
```

- Template: `<WelcomeModal :open="showWelcome" :name="profile?.name || ''" @close="closeWelcome" />`

- [ ] **Step 3: Verifikasi build + QA manual**

Run: `npm run build`
`npm run dev`: hapus flag (`localStorage.removeItem('lavelle_tour_v1_<uid>')`) lalu reload dashboard → modal muncul sekali; setelah ditutup tak muncul lagi saat reload.

- [ ] **Step 4: Commit**

```bash
git add src/portal/components/portal/WelcomeModal.vue src/portal/pages/PortalDashboard.vue
git commit -m "feat(portal): welcome modal onboarding sekali-tampil untuk karyawan"
```

---

### Task 4.3: Pasang `<Hint>` di field yang sering membingungkan

**Files:**
- Modify: `src/portal/components/builder/sections/SectionMusik.vue`
- Modify: `src/portal/components/builder/sections/SectionHadiah.vue`
- Modify: `src/portal/components/builder/sections/SectionAcara.vue`

- [ ] **Step 1: Baca ketiga seksi & temukan label field kunci**

Run: baca file untuk menemukan label input link YouTube (Musik), QRIS/rekening (Hadiah), tanggal/waktu (Acara).

- [ ] **Step 2: Tambah `<Hint>` di sebelah label terkait**

Pola (contoh Musik, di sebelah label link YouTube):

```vue
<!-- import di <script setup>: import Hint from '../../portal/Hint.vue' -->
<label>Link YouTube <Hint text="Salin URL video YouTube (mis. https://youtu.be/xxxx). Lagu diputar otomatis sebagai latar." /></label>
```

- Musik: link YouTube — teks seperti di atas.
- Hadiah: QRIS — `<Hint text="Unggah gambar QRIS statis dari m-banking/dashboard merchant. Tamu tinggal scan untuk transfer." />`; rekening — `<Hint text="Isi nama bank, nomor rekening, dan atas nama. Tombol salin muncul otomatis di undangan." />`.
- Acara: tanggal — `<Hint text="Pilih tanggal acara. Format tampil otomatis di undangan." />`.

- [ ] **Step 3: Verifikasi build + QA manual**

Run: `npm run build`
`npm run dev`: ikon `?` muncul di sebelah label; hover/focus menampilkan tooltip; tak menutup input.

- [ ] **Step 4: Commit**

```bash
git add src/portal/components/builder/sections/SectionMusik.vue src/portal/components/builder/sections/SectionHadiah.vue src/portal/components/builder/sections/SectionAcara.vue
git commit -m "feat(portal): tooltip bantuan (Hint) di field musik, amplop & acara"
```

---

## Self-Review (diisi penulis rencana)

**Spec coverage:** Modul 1 → Task 1.1–1.3 ✓; Modul 3 → Task 2.1–2.2 ✓; Modul 4 (pratinjau/polish) → Task 3.1–3.4 ✓; Modul 2 (panduan) → Task 4.1–4.3 ✓. Prinsip a11y/reduced-motion tertanam di tiap komponen.

**Placeholder scan:** Tak ada TBD/TODO; tiap step berisi kode nyata. Dua catatan "sesuaikan setelah baca selektor asli" (BuilderShell CSS `dev-desktop`, dan penempatan `<ToastHost>` di Editor) adalah instruksi konkret, bukan placeholder — nilai persisnya bergantung isi `builder.css` yang harus dibaca saat eksekusi.

**Type consistency:** `computeProgress`/`useInviteProgress` konsisten (Task 1.1, dipakai 1.3 via getter — 1.3 Step 3 memperbarui signature agar menerima getter). `useToast` API (`success/error/info/dismiss/toasts`) konsisten antara store, ToastHost, Dashboard, Editor. `duplicateInvite(sourceId, ownerId)` konsisten antara 2.1 dan 2.2.
