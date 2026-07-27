# Portal Undangan Lavelle — Dokumen Desain

- **Tanggal:** 2026-07-27
- **Status:** Disetujui pemilik (menunggu review spec) → lanjut ke rencana implementasi
- **Pemilik produk:** Ksatria Bintang Samudra (Lavelle)

---

## 1. Ringkasan & Tujuan

Alat **no-code internal** agar karyawan Lavelle (yang tidak bisa coding) dapat membuat
undangan pernikahan digital dari **template Sinema** hanya dengan: mengisi form,
mengunggah foto, memilih **paket warna preset**, melihat **pratinjau live**, lalu
**menerbitkan** ke **subdomain per klien** (`nama-klien.lavelle.my.id`).

Undangan produksi **Fuji & Ryan dibekukan 100%** — portal dibangun tanpa mengubah
deploy Fuji sama sekali.

## 2. Sasaran & Bukan-Sasaran

**Sasaran**
- Karyawan membuat 1 undangan penuh dari nol sampai live tanpa menyentuh kode.
- Pratinjau live saat mengedit.
- Paket warna preset (bukan color picker bebas) → kualitas selalu terjaga.
- Optimasi foto otomatis (tanpa karyawan tahu crop/kompres manual).
- Buku Tamu & RSVP otomatis per undangan (tersimpan di backend, dimoderasi dari portal).
- Setiap undangan dapat subdomain sendiri via wildcard.
- Peran: **admin** (pemilik, lihat semua) & **karyawan** (lihat miliknya).

**Bukan-Sasaran (untuk sekarang)**
- Banyak template/layout (hanya **Sinema**).
- Color picker bebas.
- Custom domain milik klien (hanya `*.lavelle.my.id`).
- Mengubah/menyentuh undangan Fuji & Ryan atau file `client-001`.

## 3. Arsitektur

Satu aplikasi **Vue 3 + Vite** di **Cloudflare Pages**, melayani **dua peran** yang
dibedakan berdasarkan **hostname**:

- `portal.lavelle.my.id` → **Builder** (di balik login).
- `<slug>.lavelle.my.id` (subdomain lain apa pun) → **Renderer** undangan (publik, `noindex`).

**Routing berdasarkan hostname** (saat app dimuat, periksa `window.location.hostname`):
- subdomain `portal` → rute builder.
- selain itu → perlakukan subdomain sebagai **slug undangan** → ambil data dari
  Supabase → render Sinema. Slug tak ditemukan/belum terbit → halaman "tidak ditemukan"
  yang anggun (bukan error).

**Backend: Supabase** (satu platform)
- **Postgres** — tabel data undangan, buku tamu, RSVP, profil/peran.
- **Storage** — foto & musik.
- **Auth** — email + password.
- **Row-Level Security (RLS)** — karyawan hanya akses miliknya; admin akses semua.

**DNS / Cloudflare — KRITIS untuk keamanan Fuji**
- `*.lavelle.my.id` (wildcard) diarahkan ke **Pages project portal** (satu setup).
- Subdomain **eksplisit** tetap menang atas wildcard (Cloudflare mengutamakan match
  paling spesifik). Jadi:
  - `fuji-ryan.lavelle.my.id` → tetap ke **Pages project `fuji-ryan`** (BEKU, tak diubah).
  - `lavelle.my.id` / `www` → tetap ke situs utama.
  - `portal.lavelle.my.id` → Pages project portal (builder).
  - semua slug lain → wildcard → Pages project portal (renderer).
- **Daftar subdomain "reserved"** yang tak boleh dipakai sebagai slug undangan:
  `portal`, `www`, `fuji-ryan`, `@`, `api`, `admin`, `mail`, dsb. Divalidasi saat
  karyawan mengetik slug.

## 4. Model Data (Supabase)

**Tabel**
- `profiles` — `id` (→ `auth.users`), `role` (`admin` | `staff`), `name`, `email`.
- `invites` — `id`, `slug` (UNIK, url-safe), `owner_id` (→ `profiles`),
  `status` (`draft` | `published`), `theme` (nama paket warna),
  `data` (JSONB — seluruh isi undangan), `created_at`, `updated_at`, `published_at`.
- `guestbook` — `id`, `invite_id`, `guest_token`, `name`, `attendance`, `message`,
  `sticker`, `show` (BOOL, moderasi), `created_at`.
- `rsvp` — `id`, `invite_id`, `guest_token`, `name`, `attendance`, `guests` (INT),
  `created_at`.

**Kolom `data` (JSONB)** menampung seluruh konten undangan, mengikuti struktur
`client001.js` yang sudah terbukti: `hero`, `quote`, `opening`, `bride`, `groom`,
`story[]`, `events[]`, `mapsQuery`, `dressCode`, `family`, `gallery[]`,
`galleryFull[]`, `gifts[]`, `music{src,start}`, `closing`. JSONB dipilih agar skema
fleksibel dan mudah berkembang tanpa migrasi tiap tambah field.

**Storage** — bucket `invite-assets`: foto & musik. Path per undangan
(`<invite_id>/hero.jpg`, dst). URL disimpan di `invites.data`.

## 5. Renderer Undangan (Sinema berbasis data)

- **Generalisasi** halaman Sinema (`DemoClient001Opsi5.vue`) menjadi komponen
  **berbasis data** `InviteSinema.vue` yang menerima prop `data` (JSON undangan) +
  `theme`. **`Opsi5.vue` milik Fuji TIDAK diubah** — `InviteSinema` adalah salinan yang
  digeneralisasi.
- **Menggunakan ulang komponen royale yang sudah ada** (`GallerySection`, `MusicPlayer`,
  `LoveStory`, `EventDetails`, dll) — semuanya sudah berbasis prop, jadi aman dipakai
  ulang. Perubahan pada komponen bersama hanya bersifat **aditif** (tak merusak Fuji).
- Memuat data dari Supabase berdasarkan slug; **gerbang amplop** menutupi waktu muat.
- Komponen Buku Tamu & RSVP berbicara ke **Supabase** (scoped `invite_id`), menggantikan
  Apps Script. (Undangan Fuji tetap memakai Google Sheet-nya sendiri — tak diusik.)

## 6. Builder UI/UX

**Prinsip:** elegan, tenang, editorial — selaras estetika Lavelle. Label & teks bantuan
Bahasa Indonesia yang ramah untuk non-coder. Empty state, validasi, dan panduan yang jelas.
UI/UX digarap dengan skill `frontend-design`.

**Tata letak**
- Desktop: **dua panel** — kiri = form (seksi accordion), kanan = **pratinjau live**
  (render app yang sama, reaktif terhadap data yang sedang diisi).
- Mobile: form + tombol **"Pratinjau"** (layar penuh).

**Seksi form**
Mempelai · Acara · Cerita · Galeri · Hadiah · Musik · Tema Warna.

**Unggah foto**
- Tap/drag → **kompres di browser** (canvas: resize maks ~1600px, kualitas ~0.82,
  target ~200 KB) sebelum diunggah → hemat storage, tetap tajam.
- Thumbnail pratinjau + progres unggah. Slot per foto (hero, bride, groom, story ×4,
  galeri, closing).

**Pemilih tema**
- Swatch preset (Marun–Emas, Navy–Emas, Sage–Krem, Dusty Rose, Hitam–Emas, …) → 1 klik
  → pratinjau berubah serempak. Paket baru bisa ditambah kapan saja.

**Slug & status**
- Field slug: divalidasi (unik, url-safe, bukan subdomain reserved) + cek ketersediaan.
- **Simpan (draft)** + **Terbitkan (live)**. Autosave draft.

## 7. Autentikasi & Peran

- **Supabase Auth** email + password.
- **Admin** (pemilik): dashboard berisi **semua** undangan + kelola akun karyawan.
- **Karyawan**: dashboard berisi undangan **miliknya**.
- **RLS** menegakkan isolasi data (staff: `owner_id = auth.uid()`; admin: semua).

## 8. Foto & Musik

- **Kompresi client-side** sebelum unggah (browser) — tanpa pemrosesan server (cukup
  untuk tier gratis).
- **Musik**: unggah mp3 + set **detik mulai** (default 0). Memakai ulang logika
  `MusicPlayer` (`start` + Media Fragment `#t=` + jaring `timeupdate`) yang sudah ada.

## 9. Buku Tamu & RSVP (per undangan, otomatis)

- Tersimpan di Supabase, **scoped `invite_id`** — tak perlu setup Google Sheet/Apps Script
  tiap undangan.
- Tamu submit (publik) dengan dedup 1-per-perangkat (`guest_token`) + bisa edit.
- Admin/karyawan **melihat & memoderasi** (toggle `show`) dari portal.

## 10. Penerbitan & Subdomain

- **Terbitkan** → `status = published`. Renderer melayani slug mana pun yang ada &
  terbit.
- **Wildcard `*.lavelle.my.id`** → Pages project portal (setup sekali). Subdomain
  eksplisit (Fuji, portal, www) menang atas wildcard → Fuji aman.
- Slug tak ada / belum terbit → halaman "tidak ditemukan" yang anggun.

## 11. Keamanan & Privasi

- Undangan `noindex`.
- Data di balik **RLS** Supabase.
- Bucket Storage: **baca-publik** untuk aset undangan (foto perlu dilihat tamu; tak rahasia
  begitu link dibagikan), **tulis** hanya untuk karyawan terautentikasi.
- Tulis Buku Tamu/RSVP: publik tapi scoped `invite_id`; dedup via `guest_token`.

## 12. Biaya

- **Mulai: GRATIS** — tier gratis Supabase (Postgres + 1 GB storage + Auth) + Cloudflare
  Pages cukup untuk puluhan undangan.
- Skala besar (ratusan undangan/foto) → **Supabase Pro ±$25/bulan** (100 GB). Alternatif
  hemat: pindahkan foto ke Cloudflare R2 (10 GB gratis) bila perlu.

## 13. Rencana Bertahap

- **Fase 1 (MVP):** Setup Supabase + wildcard DNS; login; CRUD undangan (slug + data inti:
  Mempelai, Acara, Galeri, Tema); unggah+kompres foto; renderer Sinema berbasis data;
  pratinjau live; terbitkan → subdomain jalan **end-to-end**.
- **Fase 2:** Cerita, Hadiah, Musik (detik-mulai), Buku Tamu + RSVP di Supabase + moderasi
  di portal.
- **Fase 3:** Manajemen akun (admin buat akun karyawan), dashboard admin, poles UI/UX,
  paket warna tambahan.

## 14. Yang TIDAK Disentuh 🔒

- Deploy `fuji-ryan` (Pages project + subdomain) & Apps Script buku-tamunya.
- File `client-001/*`, `src/data/client001.js`, `src/pages/DemoClient001*.vue`,
  `src/pages/ClientLuxeBase.vue`, `src/composables/useSinema.js`,
  `src/assets/client001-*.css` (semua gitignored, LOKAL).
- Situs utama `lavelle.my.id`.

## 15. Asumsi & Pertanyaan Terbuka

- **Asumsi:** domain `lavelle.my.id` dikelola di Cloudflare (benar — deploy saat ini
  sudah lewat Cloudflare). Tim kecil (segelintir karyawan). Foto baca-publik dapat diterima.
- **Terbuka (bisa diputuskan saat implementasi):** nama paket warna final; apakah portal
  jadi project Pages baru terpisah (disarankan, agar isolasi dari situs utama & Fuji jelas).
