# Homepage Craft Elevation — Design Spec

**Tanggal:** 2026-07-22
**Branch:** `rebuild/world-class`
**Surface:** Marketing homepage (`lavelle.my.id` — `src/pages/Home.vue` + `src/assets/design.css` + komponen homepage)
**Pendekatan:** A — *Craft Elevation* (pertahankan brand "Golden Garden", naikkan craft ke level editorial/world-class + motion GSAP sinematik)

---

## 1. Tujuan & konteks

Homepage sudah **fitur-lengkap** (13 section) dan live (commit `59c9de7`), tapi masih terasa "lengkap tapi datar" sesuai diagnosa `plan.md §0`. Target: elevasi dari *selesai* → *benar-benar profesional* sehingga calon klien langsung merasa "ini mahal" dan terdorong memesan.

**Bukan** redesign/rombak layout (itu pendekatan B yang ditolak). Ini **elevasi craft** di atas struktur yang sudah ada.

### Akar masalah yang diperbaiki (dari `plan.md §0`)
1. Skala tipografi kurang dramatis (kontras display↔label kecil).
2. Whitespace masih padat.
3. Emas tersebar (kurang *restraint*).
4. Motion standar/seragam (belum sinematik).
5. Foto masih terasa "di dalam kartu berbingkai".

---

## 2. Non-negotiable guardrails

Semua ini **tidak boleh rusak** oleh perubahan apa pun:

- ✅ **6 tema** (ivory · noir · rose · forest · navy · champagne) + **dark mode** tetap jalan.
- ✅ Responsif **320px–1920px**, layout beda per breakpoint (bukan sekadar scale-down). Uji titik: 320/375/768/1024/1440.
- ✅ **0 `console.error`** — termasuk saat GSAP init & autoplay musik diblok browser.
- ✅ `prefers-reduced-motion: reduce` dihormati penuh → matikan parallax/scrub/magnetic, sisakan fade sederhana.
- ✅ Aksesibilitas: focus ring visible, kontras teks ≥ 4.5:1 (body) / ≥ 3:1 (teks besar), aria-label pada kontrol ikon.
- ✅ **SSG-safe** (vite-ssg): semua GSAP client-only, di-guard `onMounted` + cek `window`, cleanup penuh di `onUnmounted`.
- ✅ Tidak menyentuh **Adat / diorama / gamelan** (FROZEN), juga tidak menyentuh undangan (royale/luxe), blog, panel.
- ✅ Performa 60fps: hanya animasikan `transform` & `opacity`, pakai `will-change` seperlunya, hindari animasi `width/height/top/left`.

---

## 3. Design tokens — sistem skala baru

Ditambahkan/ditimpa di `design.css` (blok akhir, via CSS variables agar diwarisi 6 tema & dark mode).

### 3a. Tipografi (kontras skala = kunci)
| Token | Nilai sekarang | Nilai baru |
|---|---|---|
| `--fs-display` (hero title) | `clamp(2.8rem, 8vw, 6rem)` | `clamp(3rem, 8vw, 6.5rem)`, tracking `-0.02em` |
| `--fs-h2` (`.section__title`) | `clamp(2rem, 4.5vw, 3.1rem)` | `clamp(2.4rem, 5.5vw, 4.25rem)` |
| `--fs-eyebrow` (label) | `0.72rem` / `0.35em` | `0.7rem` / `0.38em`, weight 600 |
| body | `1–1.125rem` / lh `1.7` | *tetap* |

Target: rasio lompatan display→body naik dari ~2.8× menjadi **~4×**. Terapkan `text-wrap: balance` pada heading.

### 3b. Spacing rhythm
| Token | Sekarang | Baru |
|---|---|---|
| `--space-section` (`.section` padding-block) | `clamp(70px, 10vw, 120px)` | `clamp(88px, 12vw, 160px)` |
| `.section__head` margin-bottom | `3.6rem` | `4.5–5rem` (via token `--space-head`) |
| Lebar teks naratif | ada `--container--narrow: 760px` | dikunci **≤ 640px** untuk blok naratif |

### 3c. Motion tokens
- `--ease-cinematic: cubic-bezier(.16, 1, .3, 1)` (setara `power3.out`).
- `--dur-reveal: .9s`; stagger antar-anak `90–120ms`.

---

## 4. Warna — disiplin (restraint)

Palet inti (cream `#f4ecdd` · olive `#4a5436` · gold `#c2954f`) **tidak diubah**. Yang diubah adalah **pemakaian**: emas dikembalikan ke peran *hairline + 1 aksen*, bukan disebar.

Contoh konkret:
- Kurangi glow/emas ganda pada hover kartu; pertahankan aksen garis emas `.card::before` sebagai satu-satunya "kilau".
- Hover border-emas dibuat lebih halus (opacity turun) agar tidak ramai.
- Kontras teks tetap diverifikasi lolos di 6 tema (khusus cek Noir & Navy yang gelap).

---

## 5. Motion sinematik (GSAP + ScrollTrigger)

Bintang utama. Ease konsisten `--ease-cinematic`, durasi `0.8–1.1s`, **tanpa bounce/spring** (sesuai brief pernikahan). Semua di-guard `prefers-reduced-motion`.

| # | Elemen | Motion |
|---|---|---|
| 1 | Hero background | Parallax scrub saat scroll (di atas Ken Burns yang sudah ada) |
| 2 | Hero konten | Timeline masuk berurutan: eyebrow → title → sub → CTA → meta |
| 3 | Hero meta | Count-up angka (6 / ∞ / 1–3) saat load |
| 4 | Section reveal | ScrollTrigger: heading + children stagger (`grid:'auto'`), `y:32→0`, opacity |
| 5 | Katalog tema | Kartu phone-mockup masuk berurutan; opsi 1 *beat* pinned halus untuk statement |
| 6 | Pricing | Count-up harga (sudah ada, dirapikan) + kartu featured naik lembut |
| 7 | CTA buttons | Magnetic hover halus (subtle) |
| 8 | Galeri | Reveal masonry stagger; lightbox zoom-in (sudah ada) |

### Arsitektur motion (isolasi & clarity)
- **Composable baru `src/composables/useCinematic.js`** — satu unit dengan tanggung jawab tunggal: setup/teardown GSAP+ScrollTrigger untuk homepage.
  - Input: opsi (root, daftar target/section).
  - Perilaku: cek `window` & `prefers-reduced-motion`; jika reduced → tidak mendaftarkan animasi (biarkan CSS fallback). Jika normal → daftarkan timeline + ScrollTrigger; panggil `ScrollTrigger.refresh()` setelah gambar hero load.
  - Cleanup: `kill()` semua trigger + timeline; dipanggil `onUnmounted`.
  - Tidak mengubah kontrak komponen lain — Home.vue cukup memanggil `useCinematic()` di `onMounted`.
- **Fallback berlapis:** CSS `.reveal`/`.r-reveal` (yang sudah ada) tetap jadi lapisan dasar untuk no-JS & reduced-motion. GSAP hanya *meng-enhance* saat tersedia.

---

## 6. Refinement per-section (ringkas)

- **Hero** — title diperbesar (`--fs-display`), napas antar elemen dilonggarkan, hierarki CTA dipertegas (1 primary gold + 1 ghost). Parallax + timeline masuk.
- **Value props / Features** — kurangi kesan "kotak-kotak", angka diperbesar, stagger masuk.
- **Katalog tema** — kartu masuk berurutan; heading dramatis.
- **Galeri** — rhythm lebih editorial, grading foto konsisten.
- **Pricing** — hierarki tier lebih jelas, whitespace, angka lebih dramatis, count-up dirapikan.
- **About / CTA** — whitespace + tipografi dramatis; foto membingkai lebih kuat.
- **Nav / Footer** — polish micro-interaction agar konsisten dengan ritme baru.

---

## 7. Ruang lingkup file

**Disentuh:**
- `src/assets/design.css` — tokens skala/spacing/motion + polish restraint.
- `src/pages/Home.vue` — penyesuaian struktur/kelas + hook `useCinematic`.
- `src/composables/useCinematic.js` — **baru**, unit motion GSAP homepage.
- Komponen homepage bila perlu: `src/components/SiteNav.vue`, `src/components/HomeThemeCatalog.vue`.

**Tidak disentuh:** undangan (`royale`, `luxe`), `DemoAdat`/`AdatScene`/gamelan (FROZEN), blog, panel, data.

---

## 8. Definisi "Premium Done" (bar keberhasilan)

Dari `plan.md §7` — homepage dianggap selesai bila:
- [ ] Whitespace terasa lega (lolos "uji napas").
- [ ] Kontras tipografi dramatis (heading besar ↔ label mungil letter-spaced).
- [ ] Foto terasa full-bleed / membingkai, grading konsisten.
- [ ] Motion lambat & berbobot (0.8–1.1s, `--ease-cinematic`), 60fps, hormati reduced-motion.
- [ ] Ornamen/emas minimal (restraint menang atas filigree).
- [ ] Jalan mulus di 6 tema & 320–1920px; layout beda per breakpoint.
- [ ] **Zero `console.error`**.
- [ ] Uji akhir: buka di HP, scroll pelan → spontan terasa "mahal".

---

## 9. Verifikasi (sebelum dianggap beres)

- Build `npm run build` sukses (SSG pre-render tiap route tanpa error).
- `npm run dev` — cek homepage di viewport 320/375/768/1024/1440.
- Konsol bersih (0 error) saat load, scroll penuh, dan pindah route.
- Toggle dark mode + cek beberapa tema → tidak ada kontras rusak.
- Aktifkan `prefers-reduced-motion` (emulate) → parallax/scrub/magnetic mati, konten tetap tampil.

---

*Prinsip pemandu: craft menang atas kelengkapan. Elevasi ini menaikkan "rasa mahal" tanpa membuang kerja yang sudah live, dan menjaga seluruh guardrail brand.*
