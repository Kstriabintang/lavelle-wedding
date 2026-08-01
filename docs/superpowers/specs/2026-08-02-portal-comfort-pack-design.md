# Portal Comfort Pack — Desain

**Tanggal:** 2026-08-02
**Cabang:** rebuild/world-class
**Tujuan:** Mempoles Portal Undangan (`portal.lavelle.my.id`) agar karyawan lebih nyaman bekerja — tanpa merombak alur yang sudah dikenal.

## Ringkasan

Portal sudah matang: Dashboard (kartu undangan + picker template), Editor split-view
(`BuilderForm` accordion 9-seksi + pratinjau live iframe dalam bingkai HP, auto-save debounce).
Paket ini menambah **4 modul poles berlapis** di atas struktur yang ada. Tidak ada rewrite.

Pendekatan terpilih: **A — Poles berlapis** (editor accordion tetap). Ditolak: B (wizard
Next/Back, merombak BuilderForm & menghilangkan kebebasan scroll-edit) dan C (tur spotlight
ala driver.js, rawan meleset di layar kecil/scroll).

## Sasaran & Non-sasaran

**Sasaran**
- Karyawan tahu progres pengisian & bisa lompat antar-seksi dengan cepat.
- Karyawan baru terpandu tanpa perlu diajari manual.
- Bikin banyak undangan jadi cepat (duplikat + cari/filter).
- Umpan balik & konfirmasi terasa halus (bukan pop-up browser mentah).

**Non-sasaran**
- Tidak mengubah kontrak data `invite` (`schema.js`) maupun tampilan undangan publik.
- Tidak menyentuh backend/RLS Supabase.
- Bukan tur spotlight; bukan wizard bertahap.

## Urutan rilis (bertahap, tiap fase bisa diuji sendiri)

1. **Modul 1** — Navigasi editor & progres (dampak kenyamanan terbesar)
2. **Modul 3** — Efisiensi bikin massal (duplikat + cari/filter)
3. **Modul 4** — Pratinjau & polish rasa (toggle HP/desktop, modal, toast)
4. **Modul 2** — Panduan & bantuan (welcome modal + hints)

---

## Modul 1 — Navigasi editor & progres

**Unit baru: `src/portal/composables/useInviteProgress.js`**
Input: objek `invite` reaktif. Output computed:
`{ sections: [{ k, label, num, filled }], filledCore, coreTotal, pct }`.

Heuristik "terisi" (berdasar `schema.js`):

| Seksi | Inti? | Terisi bila |
|-------|-------|-------------|
| `mempelai` | ✓ | `hero.bride` && `hero.groom` && (`hero.date` \|\| `hero.dateText`) |
| `kisah` | ✓ | ada `story[i]` dengan `title` atau `desc` |
| `acara` | ✓ | ada `events[i].place` terisi |
| `galeri` | ✓ | `gallery.length` \|\| `galleryFull.length` |
| `keluarga` | ✓ | `family.note` \|\| `family.bride/groom/alsoInviting` ada isi |
| `hadiah` | ✓ | `gifts.length` \|\| `qris` |
| `musik` | ✓ | `music.link` \|\| `music.src` |
| `tema` | — (opsional) | selalu dianggap oke (punya default) |
| `gaya` | — (opsional) | selalu dianggap oke (punya default) |

`coreTotal = 7`. `pct = filledCore / coreTotal`.

**Unit baru: `src/portal/components/builder/SectionNav.vue`**
Header lengket di dalam panel form `BuilderForm`. Isi:
- Bar kelengkapan: teks `Kelengkapan {{filledCore}}/{{coreTotal}} seksi inti` + progress bar tipis (warna emas `--pa-acc`/aksen builder).
- Barisan **chip 9 seksi**: nomor + judul singkat + penanda status (`✓` terisi / `○` kosong). Chip seksi yang sedang terbuka ter-highlight.
- Klik chip → `emit('jump', k)`.

**Suntingan: `src/portal/components/builder/BuilderForm.vue`**
- Import `useInviteProgress(props.invite)` dan render `<SectionNav>` di atas daftar accordion.
- Tangani `@jump="goTo"`: `open.value = k`, lalu `nextTick` → scroll header seksi ke atas.
  Elemen seksi diberi `:ref` (array) atau `data-sec="k"`; scroll via `el.scrollIntoView({ block: 'start', behavior })`.
- `behavior` = `'auto'` bila `prefers-reduced-motion`, selain itu `'smooth'`.
- Karena accordion hanya membuka satu seksi, "aktif" = seksi yang `open` (tak perlu IntersectionObserver).

**Tes:** `useInviteProgress.test.js` — invite kosong → 0/7; isi sebagian → hitung benar; tema/gaya tak menambah core.

---

## Modul 3 — Efisiensi bikin massal

**Suntingan: `src/portal/lib/invites.js`** — fungsi baru:
```
duplicateInvite(sourceId, ownerId) →
  1. src = getInvite(sourceId)
  2. slug baru unik (pola `undangan-<base36>`; ulang bila slugTaken)
  3. createInvite(slug, ownerId, structuredClone(src.data), src.theme) dengan status 'draft'
  4. return baris baru
```
Catatan foto: URL foto disalin apa adanya (URL storage publik). Menghapus undangan asal
tak merusak duplikat (delete hanya menghapus baris DB, objek storage tetap ada).

**Suntingan: `src/portal/pages/PortalDashboard.vue`**
- Aksi **"Duplikat"** pada tiap `db__card` (di samping Edit/Hapus). Saat sukses →
  tetap di dashboard, `refresh()`, dan toast "Undangan diduplikat ✓" (kartu baru muncul
  sebagai draft di grid — tidak auto-pindah ke editor supaya tak mengagetkan).
- **Pencarian + filter**:
  - Kotak cari (`type="search"`, `autocomplete="off"`) → filter `coupleName(inv)` + `inv.slug` (case-insensitive).
  - Tab status: **Semua / Terbit / Draft** (highlight aktif; guideline UX "active state").
  - Keduanya computed sisi-klien atas `invites.value`. Grid memakai daftar terfilter.
  - Empty state saat hasil kosong: "Tak ada undangan cocok — coba kata kunci lain."

---

## Modul 4 — Pratinjau & polish rasa

**Suntingan: `src/portal/components/builder/BuilderShell.vue`**
- Toggle **HP / Desktop** di `bshell__toolbar`. `device = ref('phone')`.
  `phone` → bingkai HP seperti sekarang; `desktop` → `bshell__device` lebar penuh tanpa notch.
- Tombol pakai `aria-pressed`, min-target 44×44, transisi 150–300ms.

**Unit baru: `src/portal/components/portal/ConfirmModal.vue`**
- Dialog dark-luxury (judul, pesan, tombol Batal + tombol aksi/bahaya). Fokus terjebak,
  `Esc` menutup, klik overlay menutup, hormati `prefers-reduced-motion`.
- Ganti `confirm()` di Dashboard (hapus undangan) dan `alert()` gagal-hapus.

**Unit baru: `src/portal/composables/useToast.js` + `src/portal/components/portal/ToastHost.vue`**
- API: `toast.success(msg)`, `toast.error(msg, { retry })`, `toast.info(msg)`.
- Toast pojok, auto-hilang ~3.5s, bisa ditutup manual. Error simpan menampilkan tombol
  **Coba lagi** (memanggil ulang `doSave`).
- `ToastHost` dipasang di tiap halaman yang memakainya — `PortalDashboard.vue` dan
  `PortalEditor.vue` (portal tak punya layout root bersama; tiap route komponen sendiri).
  Store toast bersifat modul-singleton di `useToast.js` sehingga antar-halaman konsisten.
- Umpan balik: "Undangan diduplikat ✓", "Terbit ✓", "Gagal simpan — Coba lagi".

**Suntingan: `src/portal/pages/PortalEditor.vue`**
- Saat `saveState === 'error'` → panggil `toast.error('Gagal menyimpan', { retry: doSave })`.
- Toast "Terbit ✓" setelah publish sukses.

---

## Modul 2 — Panduan & bantuan

**Unit baru: `src/portal/components/portal/WelcomeModal.vue`**
- Tampil sekali saat pertama kali (flag `localStorage`: `lavelle_tour_v1_<uid>`).
- 3 langkah ringkas (teks + ikon): **Isi seksi → Cek pratinjau → Atur alamat & Terbitkan**.
- Tombol **Lewati** dan **Mengerti** (set flag). Hormati reduced-motion.
- Dipicu di Dashboard pada login pertama (uid dari `profile.value.id`).

**Unit baru: `src/portal/components/portal/Hint.vue`**
- Ikon `?` mungil dengan tooltip aksesibel (`aria-describedby`, dapat fokus keyboard,
  muncul saat hover/focus). Bukan hanya hover (guideline touch).
- Dipasang di field yang sering bikin bingung: format tanggal (Mempelai/Acara),
  cara ambil link YouTube (Musik), apa itu QRIS & cara unggah (Amplop).

---

## Prinsip lintas-modul (dari ui-ux-pro-max)

- Kontras teks ≥ 4.5:1; fokus keyboard terlihat; target sentuh ≥ 44×44.
- Transisi 150–300ms; semua animasi hormati `prefers-reduced-motion`.
- Ikon = SVG/glyph, bukan emoji sebagai ikon fungsional.
- Warna ikut variabel portal yang ada (`--pa-*` / aksen builder), tak ada hex mentah baru
  yang keluar dari sistem.

## Strategi tes & verifikasi

- Unit: `useInviteProgress.test.js` (vitest, mengikuti pola `*.test.js` repo).
- Manual QA per fase di editor + dashboard: chip lompat & highlight, progress akurat,
  duplikat menghasilkan draft baru, cari/filter, toggle HP/desktop, modal hapus, toast +
  retry, welcome modal sekali tampil.
- Cek `prefers-reduced-motion` (nonaktifkan animasi) & keyboard nav.

## Berkas

**Baru:** `composables/useInviteProgress.js`, `composables/useInviteProgress.test.js`,
`components/builder/SectionNav.vue`, `components/portal/WelcomeModal.vue`,
`components/portal/Hint.vue`, `components/portal/ConfirmModal.vue`,
`composables/useToast.js`, `components/portal/ToastHost.vue`

**Disunting:** `components/builder/BuilderForm.vue`, `components/builder/BuilderShell.vue`,
`pages/PortalDashboard.vue`, `pages/PortalEditor.vue`, `lib/invites.js`
