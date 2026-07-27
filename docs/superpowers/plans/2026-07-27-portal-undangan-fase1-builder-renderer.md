# Portal Undangan — Fase 1a: Renderer Sinema Berbasis Data + Kerangka Builder (Lokal) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. UI/tampilan digarap dengan skill `frontend-design`.

**Goal:** Membangun renderer template **Sinema berbasis data** (bisa ganti warna via paket tema) + **kerangka builder dua-panel dengan pratinjau live**, berjalan **100% lokal tanpa backend/akun** — sebagai fondasi visual Portal Undangan Lavelle.

**Architecture:** Template Sinema "dipromosikan" dari file `client-001` yang gitignored menjadi file portal bersih & committable (`src/portal/**`), diparameter oleh objek `invite` (data) + `theme` (paket warna berbasis CSS custom properties). Builder = shell dua-panel: kiri form reaktif, kanan `<InviteSinema :data :theme>` yang sama persis dengan hasil akhir. State disimpan di memori + `localStorage` (belum ada server). Supabase & deploy = fase berikutnya (plan terpisah).

**Tech Stack:** Vue 3 (`<script setup>`), Vite 6, Vue Router, Tailwind 4, GSAP, Vitest (ditambah di plan ini untuk unit test util murni).

## Global Constraints

- **JANGAN sentuh apa pun milik Fuji / client-001:** `src/pages/DemoClient001*.vue`, `src/data/client001.js`, `src/assets/client001-*.css`, `src/composables/useSinema.js`, `src/pages/ClientLuxeBase.vue`. File-file itu boleh **dibaca** sebagai sumber untuk digeneralisasi, **tidak boleh diubah**.
- **JANGAN deploy / redeploy** apa pun di plan ini (murni lokal). Tak ada `wrangler`, tak ada perubahan produksi Fuji.
- **Hanya perubahan aditif** pada komponen bersama `src/components/royale/*` bila benar-benar perlu (default: pakai apa adanya lewat prop).
- **Bahasa UI:** Bahasa Indonesia, ramah non-coder.
- **Tema = CSS custom properties**, bukan warna hardcode — semua warna template dari variabel yang di-set paket tema.
- **File fokus & kecil**: satu tanggung jawab per file (lihat File Structure).
- Commit sering, pesan commit Bahasa Indonesia, **identitas git = pemilik**, TANPA `Co-authored-by`.

---

## File Structure

Semua baru, di bawah `src/portal/` (area portal terisolasi):

- `src/portal/lib/slug.js` — validasi slug + daftar subdomain reserved. Murni.
- `src/portal/lib/compressImage.js` — kompres foto client-side (canvas) + helper hitung dimensi target. Murni + DOM.
- `src/portal/data/themes.js` — definisi paket warna preset (peta CSS var). Murni.
- `src/portal/data/schema.js` — bentuk default objek `invite` + `mergeInvite()` (deep-merge default+partial). Murni.
- `src/portal/data/sampleInvite.js` — contoh data undangan untuk render awal/preview.
- `src/portal/assets/sinema-template.css` — gaya Sinema berbasis variabel (hasil generalisasi `client001-foundation.css` + `client001-sinema.css`), **committable**.
- `src/portal/composables/useSinemaTemplate.js` — motion Sinema (hasil generalisasi `useSinema.js`), **committable**.
- `src/portal/components/InviteSinema.vue` — renderer Sinema berbasis data (generalisasi `Opsi5.vue`), menerima `data` + `theme`, memakai ulang komponen `royale/*`.
- `src/portal/components/builder/BuilderShell.vue` — layout dua-panel (form | preview).
- `src/portal/components/builder/BuilderForm.vue` — kontainer form ber-seksi (accordion).
- `src/portal/components/builder/sections/SectionMempelai.vue`
- `src/portal/components/builder/sections/SectionAcara.vue`
- `src/portal/components/builder/sections/SectionGaleri.vue`
- `src/portal/components/builder/sections/SectionTema.vue`
- `src/portal/components/builder/PhotoInput.vue` — input 1 foto: pilih → kompres → thumbnail + object URL.
- `src/portal/pages/PortalBuilder.vue` — halaman rute `/portal/` (mengikat state `invite` ke form + preview + persist localStorage).
- `src/router.js` — **modifikasi**: tambah rute `/portal/`.
- `vitest.config.js` — **baru**: konfigurasi Vitest (environment jsdom).
- `package.json` — **modifikasi**: devDep `vitest` + `jsdom`, script `test`.
- Test colocated: `*.test.js` di sebelah util yang diuji.

Dependensi antar-tugas: Task 1 (Vitest) → 2–5 (util+test). Task 6–9 (template) memakai 3–5. Task 10–14 (builder) memakai semuanya.

---

## Task 1: Setup Vitest

**Files:**
- Modify: `package.json` (devDependencies + script)
- Create: `vitest.config.js`
- Create: `src/portal/lib/__smoke__.test.js` (dihapus di akhir task)

**Interfaces:**
- Produces: perintah `npm run test` yang menjalankan Vitest (jsdom).

- [ ] **Step 1: Pasang dependensi**

Run:
```bash
npm i -D vitest jsdom
```

- [ ] **Step 2: Buat `vitest.config.js`**

```js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: { environment: 'jsdom', globals: true, include: ['src/**/*.test.js'] },
})
```

- [ ] **Step 3: Tambah script test di `package.json`**

Tambahkan ke `"scripts"`: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 4: Smoke test**

Tulis `src/portal/lib/__smoke__.test.js`:
```js
import { describe, it, expect } from 'vitest'
describe('smoke', () => { it('runs', () => { expect(1 + 1).toBe(2) }) })
```

- [ ] **Step 5: Jalankan → harus PASS**

Run: `npm run test`
Expected: 1 passed.

- [ ] **Step 6: Hapus smoke test + commit**

```bash
rm src/portal/lib/__smoke__.test.js
git add package.json package-lock.json vitest.config.js
git commit -m "chore(portal): setup Vitest (jsdom) untuk unit test"
```

---

## Task 2: Util slug + daftar reserved

**Files:**
- Create: `src/portal/lib/slug.js`
- Test: `src/portal/lib/slug.test.js`

**Interfaces:**
- Produces:
  - `RESERVED: string[]` — subdomain terlarang.
  - `slugify(input: string): string` — normalisasi ke url-safe (huruf kecil, `-`).
  - `validateSlug(input: string): { ok: boolean, error?: string }` — aturan: 3–40 char, `^[a-z0-9-]+$`, tak diawali/diakhiri `-`, bukan reserved.

- [ ] **Step 1: Tulis test yang gagal**

```js
import { describe, it, expect } from 'vitest'
import { slugify, validateSlug, RESERVED } from './slug.js'

describe('slugify', () => {
  it('menormalkan spasi & kapital', () => { expect(slugify('Fuji Ryan')).toBe('fuji-ryan') })
  it('membuang karakter aneh', () => { expect(slugify('Dina & Agus!!')).toBe('dina-agus') })
})
describe('validateSlug', () => {
  it('menerima slug valid', () => { expect(validateSlug('dina-agus').ok).toBe(true) })
  it('menolak terlalu pendek', () => { expect(validateSlug('ab').ok).toBe(false) })
  it('menolak karakter ilegal', () => { expect(validateSlug('Dina_Agus').ok).toBe(false) })
  it('menolak reserved', () => {
    expect(RESERVED).toContain('fuji-ryan')
    expect(validateSlug('portal').ok).toBe(false)
    expect(validateSlug('fuji-ryan').ok).toBe(false)
  })
})
```

- [ ] **Step 2: Jalankan → FAIL** (`Cannot find module './slug.js'`). Run: `npm run test`.

- [ ] **Step 3: Implementasi minimal**

```js
export const RESERVED = ['portal', 'www', 'api', 'admin', 'mail', 'app', 'assets', 'cdn', 'fuji-ryan']

export function slugify(input) {
  return String(input || '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function validateSlug(input) {
  const s = String(input || '')
  if (s.length < 3 || s.length > 40) return { ok: false, error: 'Slug 3–40 karakter.' }
  if (!/^[a-z0-9-]+$/.test(s)) return { ok: false, error: 'Hanya huruf kecil, angka, dan tanda hubung.' }
  if (/^-|-$/.test(s)) return { ok: false, error: 'Tak boleh diawali/diakhiri tanda hubung.' }
  if (RESERVED.includes(s)) return { ok: false, error: 'Slug ini dipakai sistem, pilih lain.' }
  return { ok: true }
}
```

- [ ] **Step 4: Jalankan → PASS.** Run: `npm run test`.

- [ ] **Step 5: Commit**

```bash
git add src/portal/lib/slug.js src/portal/lib/slug.test.js
git commit -m "feat(portal): util slug + validasi + daftar subdomain reserved"
```

---

## Task 3: Paket tema warna (preset)

**Files:**
- Create: `src/portal/data/themes.js`
- Test: `src/portal/data/themes.test.js`

**Interfaces:**
- Produces:
  - `THEMES: Record<string, { label: string, swatch: [string,string], vars: Record<string,string> }>`
  - `themeVars(id: string): Record<string,string>` — kembalikan `vars` tema (fallback ke tema pertama bila id tak ada).
  - `THEME_IDS: string[]`.
- Kunci `vars` yang WAJIB ada tiap tema (dipakai `sinema-template.css`): `--bg --ink --ink-soft --surface --line --accent --accent-2 --accent-ink --marun`.

- [ ] **Step 1: Tulis test yang gagal**

```js
import { describe, it, expect } from 'vitest'
import { THEMES, THEME_IDS, themeVars } from './themes.js'

const REQUIRED = ['--bg','--ink','--ink-soft','--surface','--line','--accent','--accent-2','--accent-ink','--marun']

describe('themes', () => {
  it('punya minimal 4 paket', () => { expect(THEME_IDS.length).toBeGreaterThanOrEqual(4) })
  it('tiap tema punya semua CSS var wajib', () => {
    for (const id of THEME_IDS) for (const k of REQUIRED) expect(THEMES[id].vars[k]).toBeTruthy()
  })
  it('themeVars fallback ke tema pertama bila id salah', () => {
    expect(themeVars('ngawur')).toEqual(THEMES[THEME_IDS[0]].vars)
  })
})
```

- [ ] **Step 2: Jalankan → FAIL.**

- [ ] **Step 3: Implementasi minimal** (nilai warna boleh dipoles saat `frontend-design`; yang penting struktur & kelengkapan var)

```js
export const THEMES = {
  'marun-emas': { label: 'Marun–Emas', swatch: ['#5c1020', '#c9a24b'], vars: {
    '--bg': '#161210', '--ink': '#f4ecdd', '--ink-soft': '#c9bda6', '--surface': '#20191४'.replace('४','4'),
    '--line': '#3a2e22', '--accent': '#c9a24b', '--accent-2': '#e6c877', '--accent-ink': '#1a1206', '--marun': '#5c1020' } },
  'navy-emas': { label: 'Navy–Emas', swatch: ['#12233d', '#c9a24b'], vars: {
    '--bg': '#0e1626', '--ink': '#eaf0f8', '--ink-soft': '#aebccf', '--surface': '#16223a',
    '--line': '#26364f', '--accent': '#c9a24b', '--accent-2': '#e6c877', '--accent-ink': '#0b1220', '--marun': '#12233d' } },
  'sage-krem': { label: 'Sage–Krem', swatch: ['#5a6b52', '#d9c9a3'], vars: {
    '--bg': '#f6f3ea', '--ink': '#2e332a', '--ink-soft': '#5e675a', '--surface': '#ffffff',
    '--line': '#e2dccb', '--accent': '#5a6b52', '--accent-2': '#7e9070', '--accent-ink': '#ffffff', '--marun': '#4a5a44' } },
  'dusty-rose': { label: 'Dusty Rose', swatch: ['#a86b6b', '#e8d5cf'], vars: {
    '--bg': '#f7efe c'.replace(' ',''), '--ink': '#3a2a2a', '--ink-soft': '#7a5f5f', '--surface': '#ffffff',
    '--line': '#ecdcd6', '--accent': '#a86b6b', '--accent-2': '#c98f8f', '--accent-ink': '#ffffff', '--marun': '#8a4f4f' } },
  'hitam-emas': { label: 'Hitam–Emas', swatch: ['#111111', '#c9a24b'], vars: {
    '--bg': '#0d0d0d', '--ink': '#f0e9db', '--ink-soft': '#b8ac97', '--surface': '#171717',
    '--line': '#2c2c2c', '--accent': '#c9a24b', '--accent-2': '#e6c877', '--accent-ink': '#0d0d0d', '--marun': '#3a2a12' } },
}
export const THEME_IDS = Object.keys(THEMES)
export function themeVars(id) { return (THEMES[id] || THEMES[THEME_IDS[0]]).vars }
```

> Catatan implementer: JANGAN salin trik `.replace()` di atas — itu hanya untuk menghindari karakter aneh di dokumen. Tulis nilai hex bersih langsung (mis. `'--surface': '#201914'`, `'--bg': '#f7efec'`). Poles palet final saat `frontend-design`.

- [ ] **Step 4: Jalankan → PASS.**

- [ ] **Step 5: Commit**

```bash
git add src/portal/data/themes.js src/portal/data/themes.test.js
git commit -m "feat(portal): paket tema warna preset (peta CSS custom properties)"
```

---

## Task 4: Skema & default objek invite

**Files:**
- Create: `src/portal/data/schema.js`
- Test: `src/portal/data/schema.test.js`

**Interfaces:**
- Produces:
  - `defaultInvite(): object` — objek invite lengkap berisi field kosong/aman, mengikuti bentuk `client001.js` (hero, quote, opening, bride, groom, story[4], events[2], mapsQuery, dressCode, family, gallery[], galleryFull[], gifts[], music{src,start}, closing). **Selalu kembalikan salinan baru** (bukan referensi bersama).
  - `mergeInvite(partial: object): object` — deep-merge `partial` di atas `defaultInvite()` (array di-`partial` menimpa penuh; objek digabung dalam).

- [ ] **Step 1: Tulis test yang gagal**

```js
import { describe, it, expect } from 'vitest'
import { defaultInvite, mergeInvite } from './schema.js'

describe('defaultInvite', () => {
  it('punya struktur inti', () => {
    const d = defaultInvite()
    expect(d.hero).toBeTruthy()
    expect(Array.isArray(d.events)).toBe(true)
    expect(Array.isArray(d.gallery)).toBe(true)
    expect(d.music).toHaveProperty('start')
  })
  it('mengembalikan salinan baru tiap panggil', () => {
    const a = defaultInvite(); a.hero.bride = 'X'
    expect(defaultInvite().hero.bride).not.toBe('X')
  })
})
describe('mergeInvite', () => {
  it('menimpa dalam tanpa menghapus field lain', () => {
    const m = mergeInvite({ hero: { bride: 'Fuji' } })
    expect(m.hero.bride).toBe('Fuji')
    expect(m.hero).toHaveProperty('groom')
  })
  it('array diganti penuh', () => {
    const m = mergeInvite({ events: [{ tag: 'Akad' }] })
    expect(m.events).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Jalankan → FAIL.**

- [ ] **Step 3: Implementasi minimal**

```js
export function defaultInvite() {
  return {
    hero: { kicker: 'The Wedding Of', bride: '', groom: '', date: '', dateText: '', photo: '' },
    quote: { text: '', ref: '' },
    opening: { photo: '' },
    bride: { name: '', role: 'Putri dari', parents: '', photo: '', socials: [] },
    groom: { name: '', role: 'Putra dari', parents: '', photo: '', socials: [] },
    story: [
      { year: 'Bab 01', title: '', desc: '', photo: '' },
      { year: 'Bab 02', title: '', desc: '', photo: '' },
      { year: 'Bab 03', title: '', desc: '', photo: '' },
      { year: 'Bab 04', title: '', desc: '', photo: '' },
    ],
    events: [
      { tag: 'Akad Nikah', date: '', time: '', place: '', dress: '' },
      { tag: 'Resepsi', date: '', time: '', place: '', dress: '' },
    ],
    mapsQuery: '',
    dressCode: { note: '', colors: [] },
    family: { note: '', bride: [], groom: [], alsoInviting: [] },
    gallery: [], galleryCats: ['Semua'],
    galleryFull: [], galleryFullCats: ['Semua'],
    gifts: [], qris: null, giftConfirmWa: '',
    music: { src: '', start: 0 },
    closing: { quote: '', ref: '', signoff: '', photo: '' },
  }
}

function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v) }
function deepMerge(base, over) {
  const out = Array.isArray(base) ? [...base] : { ...base }
  for (const k in over) {
    if (isObj(base?.[k]) && isObj(over[k])) out[k] = deepMerge(base[k], over[k])
    else out[k] = over[k]                       // array & primitif: timpa penuh
  }
  return out
}
export function mergeInvite(partial) { return deepMerge(defaultInvite(), partial || {}) }
```

- [ ] **Step 4: Jalankan → PASS.**

- [ ] **Step 5: Commit**

```bash
git add src/portal/data/schema.js src/portal/data/schema.test.js
git commit -m "feat(portal): skema default invite + mergeInvite (deep-merge)"
```

---

## Task 5: Util kompres foto (client-side)

**Files:**
- Create: `src/portal/lib/compressImage.js`
- Test: `src/portal/lib/compressImage.test.js`

**Interfaces:**
- Produces:
  - `fitDimensions(w: number, h: number, maxEdge: number): { w: number, h: number }` — skala proporsional agar sisi terpanjang ≤ `maxEdge` (tak memperbesar). **Murni & diuji.**
  - `compressImage(file: File, opts?: { maxEdge?: number, quality?: number, type?: string }): Promise<Blob>` — resize+encode via canvas. Default `maxEdge=1600, quality=0.82, type='image/jpeg'`. (Diverifikasi manual di builder, bukan unit test — butuh canvas asli.)

- [ ] **Step 1: Tulis test yang gagal (fungsi murni saja)**

```js
import { describe, it, expect } from 'vitest'
import { fitDimensions } from './compressImage.js'

describe('fitDimensions', () => {
  it('mengecilkan sisi terpanjang ke maxEdge (landscape)', () => {
    expect(fitDimensions(3200, 1600, 1600)).toEqual({ w: 1600, h: 800 })
  })
  it('mengecilkan potrait', () => {
    expect(fitDimensions(1600, 3200, 1600)).toEqual({ w: 800, h: 1600 })
  })
  it('tidak memperbesar gambar kecil', () => {
    expect(fitDimensions(800, 600, 1600)).toEqual({ w: 800, h: 600 })
  })
})
```

- [ ] **Step 2: Jalankan → FAIL.**

- [ ] **Step 3: Implementasi**

```js
export function fitDimensions(w, h, maxEdge) {
  const longest = Math.max(w, h)
  if (longest <= maxEdge) return { w, h }
  const s = maxEdge / longest
  return { w: Math.round(w * s), h: Math.round(h * s) }
}

export function compressImage(file, opts = {}) {
  const { maxEdge = 1600, quality = 0.82, type = 'image/jpeg' } = opts
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const { w, h } = fitDimensions(img.naturalWidth, img.naturalHeight, maxEdge)
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h
      cv.getContext('2d').drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      cv.toBlob((b) => (b ? resolve(b) : reject(new Error('kompres gagal'))), type, quality)
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('gambar tak terbaca')) }
    img.src = url
  })
}
```

- [ ] **Step 4: Jalankan → PASS.**

- [ ] **Step 5: Commit**

```bash
git add src/portal/lib/compressImage.js src/portal/lib/compressImage.test.js
git commit -m "feat(portal): util kompres foto client-side (canvas) + fitDimensions"
```

---

## Task 6: Promosikan gaya Sinema → `sinema-template.css` (berbasis tema)

**Files:**
- Read (sumber, JANGAN ubah): `src/assets/client001-foundation.css`, `src/assets/client001-sinema.css`, `src/assets/royale.css`
- Create: `src/portal/assets/sinema-template.css`

**Interfaces:**
- Produces: kelas root `.invite-sinema` (pengganti `.c001 .sinema`) yang seluruh warnanya berasal dari CSS custom properties (di-set oleh `InviteSinema` dari `themeVars`).

- [ ] **Step 1:** Baca ketiga file sumber. Salin aturan Sinema/foundation yang relevan ke `sinema-template.css`, dengan transformasi:
  - Ganti selector scoping `.c001` / `.sinema` / `.c001 .sinema` → `.invite-sinema`.
  - Ganti setiap **warna hardcode** yang berkaitan tema dengan `var(--…)` yang sesuai (mis. gold `#c9a24b` → `var(--accent)`, marun `#5c1020` → `var(--marun)`, bg gelap → `var(--bg)`, teks → `var(--ink)` / `var(--ink-soft)`, garis → `var(--line)`, panel → `var(--surface)`).
  - Pertahankan aturan non-warna apa adanya (layout hero scrim/vignette, story frame `3/4`, pinned story `.sn-story`, dll).
  - **Jangan** ikutkan aturan spesifik-Fuji yang tak relevan (mis. penyembunyian elemen tertentu) kecuali memang bagian template.
- [ ] **Step 2:** Pastikan file valid (tanpa `@import` ke file client-001). 
- [ ] **Step 3: Verifikasi ringan** — `npx stylelint` bila ada; jika tidak, cek manual tak ada sisa `.c001`/`.sinema` selector & tak ada `#c9a24b`/`#5c1020` hardcode yang lolos.

Run:
```bash
grep -nE "\.c001|\.sinema[ .{]|#c9a24b|#5c1020" src/portal/assets/sinema-template.css || echo "bersih"
```
Expected: `bersih` (atau hanya kecocokan yang memang disengaja & sudah divar-kan).

- [ ] **Step 4: Commit**

```bash
git add src/portal/assets/sinema-template.css
git commit -m "feat(portal): sinema-template.css — gaya Sinema berbasis CSS var (committable)"
```

---

## Task 7: Promosikan motion → `useSinemaTemplate.js`

**Files:**
- Read (sumber, JANGAN ubah): `src/composables/useSinema.js`
- Create: `src/portal/composables/useSinemaTemplate.js`

**Interfaces:**
- Consumes: elemen root `.invite-sinema` (dari Task 8).
- Produces: `useSinemaTemplate(rootEl: HTMLElement): () => void` — pasang GSAP/ScrollTrigger (hero parallax, pinned story `.sn-on`, reveal) & kembalikan fungsi cleanup. Harus **SSR/dev-safe** & hormati `prefers-reduced-motion`.

- [ ] **Step 1:** Salin `useSinema.js` ke `useSinemaTemplate.js`, ubah nama fungsi ekspor → `useSinemaTemplate`, sesuaikan selector scoping bila mengacu `.c001`/`.sinema` → `.invite-sinema`. Tak ada dependensi ke file client-001.
- [ ] **Step 2: Verifikasi** tak ada import dari path `client001`/`useSinema` lama.

Run:
```bash
grep -nE "client001|useSinema[^T]" src/portal/composables/useSinemaTemplate.js || echo "bersih"
```
Expected: `bersih`.

- [ ] **Step 3: Commit**

```bash
git add src/portal/composables/useSinemaTemplate.js
git commit -m "feat(portal): useSinemaTemplate — motion Sinema committable (parallax + pinned story)"
```

---

## Task 8: `InviteSinema.vue` — renderer berbasis data

**Files:**
- Read (sumber, JANGAN ubah): `src/pages/DemoClient001Opsi5.vue`
- Create: `src/portal/components/InviteSinema.vue`
- Reuse (apa adanya): `src/components/royale/*` (HeroCover, OpeningSection, CoupleProfile, LoveStory, EventDetails, DressCode, GallerySection, DigitalEnvelope, RsvpForm, WishesFeed, FamilySection, ClosingSection, MusicPlayer, EnvelopeGate, ScrollProgress, QuickNav)

**Interfaces:**
- Consumes: `defaultInvite`/`mergeInvite` (Task 4), `themeVars` (Task 3), `sinema-template.css` (Task 6), `useSinemaTemplate` (Task 7).
- Produces: komponen `<InviteSinema :data :theme :preview />`:
  - `data: object` — objek invite (dilewatkan `mergeInvite` internal agar aman bila sebagian).
  - `theme: string` — id paket warna (default `THEME_IDS[0]`).
  - `preview?: boolean` — bila true, lewati gerbang amplop & autoplay musik (untuk pratinjau builder).
  - Root `<div class="invite-sinema" :style="themeVars(theme)">`.

- [ ] **Step 1:** Salin struktur `Opsi5.vue` ke `InviteSinema.vue`. Transformasi:
  - Hapus `import { client001 as r }` → gunakan `const r = computed(() => mergeInvite(props.data))` (pakai `r.value.*` di template atau destruktur reaktif via computed per-bagian).
  - Ganti import CSS `client001-*.css` → `../assets/sinema-template.css`.
  - Ganti `useSinema` → `useSinemaTemplate`.
  - Ganti class root `c001 …` → `invite-sinema`, set `:style` dari `themeVars(props.theme)`.
  - Prop `preview`: bila true → `skipGate=true` & jangan autoplay (panggil `play()` hanya jika bukan preview).
  - Pertahankan pemasangan foto: nilai `photo` sekarang berupa **URL** (object URL / URL storage), bukan nama file. Pastikan komponen `royale/*` menerima src apa adanya (cek `HeroCover`/`GallerySection` menerima path/URL — sudah berbasis prop).
- [ ] **Step 2:** Untuk pemakaian Buku Tamu/RSVP di fase lokal ini: sembunyikan atau non-aktifkan submit (belum ada backend) — lewatkan prop `api=''` sehingga komponen fallback ke mode lokal (tanpa kirim). *(Integrasi Supabase = plan Fase 1b.)*
- [ ] **Step 3: Verifikasi build**

Run: `npm run build`
Expected: `[vite-ssg] Build finished.` tanpa error. (InviteSinema belum dipakai rute mana pun; ini memastikan file valid & impor benar.)

- [ ] **Step 4: Commit**

```bash
git add src/portal/components/InviteSinema.vue
git commit -m "feat(portal): InviteSinema.vue — renderer Sinema berbasis data + tema"
```

---

## Task 9: Data contoh untuk pratinjau

**Files:**
- Create: `src/portal/data/sampleInvite.js`

**Interfaces:**
- Consumes: `mergeInvite` (Task 4).
- Produces: `sampleInvite: object` — invite terisi contoh netral (nama "Rara & Bagus", tanggal, 2 acara, 6 foto placeholder dari `/demo/sinema/...` atau URL `https://picsum.photos/...`), untuk render awal builder. **Bukan** data klien nyata.

- [ ] **Step 1:** Tulis `sampleInvite.js`:
```js
import { mergeInvite } from './schema.js'
export const sampleInvite = mergeInvite({
  hero: { bride: 'Rara', groom: 'Bagus', date: '2026-12-20', dateText: 'Minggu, 20 Desember 2026', photo: 'https://picsum.photos/seed/hero/1200/1600' },
  bride: { name: 'Rara Contoh', parents: 'Bapak A & Ibu B', photo: 'https://picsum.photos/seed/bride/900/1200' },
  groom: { name: 'Bagus Contoh', parents: 'Bapak C & Ibu D', photo: 'https://picsum.photos/seed/groom/900/1200' },
  events: [
    { tag: 'Akad Nikah', date: 'Sabtu, 19 Desember 2026', time: '08.00 WIB', place: 'Masjid Contoh' },
    { tag: 'Resepsi', date: 'Minggu, 20 Desember 2026', time: '11.00 WIB – Selesai', place: 'Gedung Contoh' },
  ],
  gallery: [1,2,3,4,5,6].map((n) => ({ src: `https://picsum.photos/seed/g${n}/800/800`, cat: 'Prewedding' })),
  music: { src: '', start: 0 },
})
```
- [ ] **Step 2: Commit**

```bash
git add src/portal/data/sampleInvite.js
git commit -m "feat(portal): data contoh (sampleInvite) untuk pratinjau builder"
```

---

## Task 10: Rute `/portal/` + shell dua-panel

**Files:**
- Modify: `src/router.js` (tambah rute)
- Create: `src/portal/pages/PortalBuilder.vue`
- Create: `src/portal/components/builder/BuilderShell.vue`

**Interfaces:**
- Consumes: `InviteSinema` (Task 8), `defaultInvite` (Task 4), `sampleInvite` (Task 9).
- Produces: rute bernama `portal-builder` di `/portal/`. `BuilderShell` = slot `form` (kiri) + `preview` (kanan) responsif.

- [ ] **Step 1:** Tambah rute di `src/router.js` (dekat rute lain, jangan ubah yang ada):
```js
{ path: '/portal/', name: 'portal-builder', component: () => import('./portal/pages/PortalBuilder.vue') },
```
- [ ] **Step 2:** Bila `src/router.js` / SSG punya `includedRoutes`, pastikan `/portal/` **dikecualikan** dari prerender (SPA). (Cek pola pengecualian rute client yang sudah ada; ikuti pola itu.)
- [ ] **Step 3:** `BuilderShell.vue` — layout: desktop dua kolom (`form` lebar ~420px, `preview` sisanya, preview `position: sticky`/scroll sendiri); mobile satu kolom + tombol "Pratinjau". Gunakan slot `#form` & `#preview`.
- [ ] **Step 4:** `PortalBuilder.vue` — state `const invite = reactive(structuredClone(sampleInvite))`; render `<BuilderShell>` dengan preview `<InviteSinema :data="invite" :theme="theme" preview />` dan (sementara) form kosong/placeholder. `const theme = ref('marun-emas')`.
- [ ] **Step 5: Verifikasi visual**

Run: `npm run dev` → buka `http://localhost:5173/portal/`
Expected: halaman dua-panel; kanan menampilkan undangan Sinema contoh (Rara & Bagus) yang ter-render penuh & bisa di-scroll.

- [ ] **Step 6: Commit**

```bash
git add src/router.js src/portal/pages/PortalBuilder.vue src/portal/components/builder/BuilderShell.vue
git commit -m "feat(portal): rute /portal + shell dua-panel dengan pratinjau Sinema live"
```

---

## Task 11: `PhotoInput.vue` — unggah + kompres + thumbnail

**Files:**
- Create: `src/portal/components/builder/PhotoInput.vue`

**Interfaces:**
- Consumes: `compressImage` (Task 5).
- Produces: `<PhotoInput v-model="urlString" label="..." />` — pilih file → `compressImage` → `URL.createObjectURL(blob)` → emit `update:modelValue` (object URL) + tampilkan thumbnail. Simpan blob di memori (untuk fase unggah nanti) via emit event `blob` opsional.

- [ ] **Step 1:** Implementasi input: `<input type="file" accept="image/*">`, saat change → `compressImage(file)` → object URL → `emit('update:modelValue', url)`. Tampilkan thumbnail `modelValue` bila ada, tombol ganti/hapus, state "mengompres…".
- [ ] **Step 2:** Bersihkan object URL lama saat diganti (`URL.revokeObjectURL`).
- [ ] **Step 3: Verifikasi visual** (dipakai penuh di Task 12; di sini cukup pastikan komponen mengompilasi).

Run: `npm run build`
Expected: build sukses.

- [ ] **Step 4: Commit**

```bash
git add src/portal/components/builder/PhotoInput.vue
git commit -m "feat(portal): PhotoInput — unggah foto + kompres + thumbnail (v-model object URL)"
```

---

## Task 12: Seksi form inti (Mempelai, Acara, Galeri, Tema)

**Files:**
- Create: `src/portal/components/builder/BuilderForm.vue`
- Create: `src/portal/components/builder/sections/SectionMempelai.vue`
- Create: `src/portal/components/builder/sections/SectionAcara.vue`
- Create: `src/portal/components/builder/sections/SectionGaleri.vue`
- Create: `src/portal/components/builder/sections/SectionTema.vue`
- Modify: `src/portal/pages/PortalBuilder.vue` (pasang form)

**Interfaces:**
- Consumes: `PhotoInput` (Task 11), `THEMES`/`THEME_IDS` (Task 3), objek `invite` reaktif + `theme` (dari PortalBuilder).
- Produces: form yang mengedit `invite` **secara reaktif** (two-way) sehingga preview kanan langsung berubah.

- [ ] **Step 1:** `SectionMempelai.vue` — input untuk `hero.bride`, `hero.groom`, `hero.date`, `hero.dateText`, `bride.name/parents`, `groom.name/parents`, + `PhotoInput` untuk `hero.photo`, `bride.photo`, `groom.photo`. Terima `:invite` (objek reaktif), edit langsung propertinya (`v-model="invite.hero.bride"`).
- [ ] **Step 2:** `SectionAcara.vue` — untuk tiap `invite.events[i]`: `tag`, `date`, `time`, `place`; + `mapsQuery`.
- [ ] **Step 3:** `SectionGaleri.vue` — daftar `invite.gallery`: tiap item `PhotoInput` (untuk `.src`) + tombol tambah/hapus foto (maks 12). Jaga `galleryFull` sinkron sederhana (samakan dengan gallery untuk fase ini).
- [ ] **Step 4:** `SectionTema.vue` — grid swatch dari `THEMES` (label + 2 warna `swatch`), klik → `emit('update:theme', id)`. Tandai terpilih.
- [ ] **Step 5:** `BuilderForm.vue` — accordion 4 seksi (buka/tutup), teruskan `:invite` & `theme`.
- [ ] **Step 6:** `PortalBuilder.vue` — pasang `<BuilderForm :invite="invite" :theme="theme" @update:theme="theme = $event" />` di slot `#form`.
- [ ] **Step 7: Verifikasi visual (end-to-end lokal)**

Run: `npm run dev` → `/portal/`
Expected: ubah nama mempelai → judul di preview berubah **seketika**; ganti foto hero via PhotoInput → hero preview berubah; klik swatch tema → seluruh warna undangan berganti; edit acara → detail acara berubah.

- [ ] **Step 8: Commit**

```bash
git add src/portal/components/builder/
git commit -m "feat(portal): form inti (mempelai/acara/galeri/tema) reaktif ke pratinjau live"
```

---

## Task 13: Persistensi localStorage (draft lokal)

**Files:**
- Modify: `src/portal/pages/PortalBuilder.vue`

**Interfaces:**
- Produces: state `invite` + `theme` disimpan ke `localStorage` (key `lavelle-portal-draft`) saat berubah (debounce ~400ms) & dipulihkan saat muat.

- [ ] **Step 1:** Saat mount: coba `JSON.parse(localStorage['lavelle-portal-draft'])`; bila ada → `Object.assign(invite, mergeInvite(saved.invite))` + `theme.value = saved.theme`.
- [ ] **Step 2:** `watch([invite, theme], debouncedSave, { deep: true })` → simpan `{ invite, theme }`. Tambah tombol "Reset ke contoh" (buang draft → muat `sampleInvite`).
- [ ] **Step 3: Verifikasi** — edit sesuatu → refresh → hasil edit tetap ada.

Run: `npm run dev` → edit → reload → cek tetap.

- [ ] **Step 4: Commit**

```bash
git add src/portal/pages/PortalBuilder.vue
git commit -m "feat(portal): simpan draft builder ke localStorage + pulihkan saat muat"
```

---

## Task 14: Pemeriksaan akhir milestone

**Files:** (tanpa file baru — verifikasi menyeluruh)

- [ ] **Step 1:** `npm run test` → semua unit test PASS.
- [ ] **Step 2:** `npm run build` → build sukses, tanpa error.
- [ ] **Step 3:** `npm run dev` → `/portal/` end-to-end: isi form + foto + tema → pratinjau live benar. Buka rute lama (`/`, `/undangan/` bila ada lokal) → tetap normal (tak ada regresi).
- [ ] **Step 4:** Konfirmasi **tak ada file client-001/Fuji yang berubah**:

Run:
```bash
git status --porcelain | grep -E "client001|DemoClient001|client-001|ClientLuxeBase|useSinema\.js" && echo "AWAS: ada file Fuji berubah" || echo "aman: Fuji tak tersentuh"
```
Expected: `aman: Fuji tak tersentuh`.

- [ ] **Step 5: Commit penutup (bila ada sisa)**

```bash
git add -A src/portal docs/superpowers/plans
git commit -m "chore(portal): tutup Fase 1a — builder & renderer Sinema lokal siap" || echo "tak ada perubahan"
```

---

## Self-Review (diisi penulis plan)

**1. Cakupan spec (Fase 1a):**
- Renderer Sinema berbasis data → Task 6–9 ✅
- Paket warna preset → Task 3 + 12 ✅
- Builder dua-panel + pratinjau live → Task 10, 12 ✅
- Unggah + kompres foto → Task 5, 11 ✅
- Isolasi dari Fuji → Global Constraints + Task 14 ✅
- (Login/Supabase, subdomain wildcard, buku tamu/RSVP backend, kelola akun → **Fase 1b/1c**, di luar plan ini — disengaja.)

**2. Placeholder scan:** Tak ada "TBD/nanti". Nilai warna final & palet "boleh dipoles saat frontend-design" — struktur & kontrak var sudah pasti (diuji Task 3). Trik `.replace()` di Task 3 sudah diberi catatan tegas agar tidak disalin.

**3. Konsistensi tipe:** `defaultInvite`/`mergeInvite` (Task 4) dipakai konsisten di Task 8/9/13. `themeVars(id)` (Task 3) dipakai di Task 8/12. `compressImage`/`fitDimensions` (Task 5) dipakai di Task 11. `InviteSinema` prop `{data, theme, preview}` konsisten Task 8/10. Nama kelas root `.invite-sinema` sama di Task 6/7/8.

**Catatan risiko untuk implementer:** Task 8 (generalisasi `Opsi5.vue`) adalah tugas terbesar & paling rawan — kerjakan dengan membuka file sumber, ubah mekanis (import data, CSS, composable, class root, prop preview), lalu verifikasi via `npm run build` + render di `/portal/`. Jangan mengarang; ikuti struktur asli.
