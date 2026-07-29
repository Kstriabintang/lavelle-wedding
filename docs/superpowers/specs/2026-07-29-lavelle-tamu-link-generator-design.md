# Lavelle "Tamu" — Generator Tautan Undangan Per-Tamu

**Tanggal:** 2026-07-29
**Status:** Design disetujui, siap masuk plan
**Alamat produksi:** `https://tamu.lavelle.my.id`

## 1. Ringkasan & Tujuan

Alat mandiri (self-serve) untuk vendor/klien Lavelle membuat **link undangan yang
dipersonalisasi per tamu** secara massal, tanpa mengetik URL satu per satu.

Undangan Lavelle sudah membaca parameter `?to=Nama+Tamu` dan menampilkannya di
amplop (default "Tamu Undangan"). Yang hilang selama ini hanya **cara mudah
menghasilkan link tersebut untuk ratusan tamu**. Alat ini menutup celah itu.

**Satu kalimat:** tempel link undangan + daftar nama → keluar link + pesan WhatsApp
siap kirim untuk tiap tamu.

## 2. Pengguna & Konteks

- **Pengguna:** vendor/klien Lavelle (non-teknis). Membuka halaman, tak butuh
  bantuan developer lagi.
- **Frekuensi:** dipakai berulang; daftar tamu bertambah/berubah.
- **Perangkat:** HP dan laptop (mayoritas HP).
- **Reusable:** karena berbasis *tempel-link*, alat ini bekerja untuk undangan
  Lavelle mana pun (default terisi link Fuji & Ryan, bisa diganti).

## 3. Non-Tujuan (YAGNI)

- ❌ Tidak ada backend, database, atau akun login.
- ❌ Tidak menyimpan/mengirim data tamu ke server mana pun.
- ❌ Tidak ada kolom nomor WA / kirim otomatis massal (vendor salin-tempel manual).
- ❌ Tidak terintegrasi ke Portal (proyek terpisah; integrasi = langkah lain nanti).
- ❌ Tidak ada import CSV kompleks di v1 (cukup tempel teks; ekspor CSV tetap ada).

## 4. Arsitektur

- **Halaman statis tunggal, 100% client-side.** Semua logika di browser
  (vanilla JS + GSAP untuk motion). Tidak ada request jaringan yang membawa nama
  tamu — privasi total.
- **Self-contained** sebisa mungkin: satu `index.html` + aset (font/CSS/JS)
  disatukan agar ringan & mudah di-deploy.
- **Hosting:** proyek Cloudflare Pages **baru & terpisah** (`lavelle-tamu`),
  domain kustom `tamu.lavelle.my.id`. Tidak menyentuh proyek `ryan-fuji`
  (undangan) maupun `lavelle-portal`.
- **SSL:** otomatis via Cloudflare Universal SSL (HTTPS dipaksa).

### Modul logika (dipisah jelas, mudah diuji)
1. `parseNames(text)` — pecah per baris, trim, buang kosong, dedupe opsional.
2. `buildLink(baseUrl, name)` — bangun URL personalisasi (lihat §7).
3. `renderMessage(template, name, link)` — isi placeholder `{nama}`/`{link}`.
4. `renderResults(list)` — render kartu hasil (efisien, lihat §7 Performa).
5. `exporters` — salin tabel (TSV) & unduh CSV (Blob).
6. `clipboard` — Clipboard API + fallback + umpan balik "Tersalin ✓".
7. `motion/bg` — background live + orkestrasi masuk (GSAP) + reduced-motion.

## 5. Alur Pengguna

1. Buka `tamu.lavelle.my.id`. Background hidup, panel muncul dengan animasi halus.
2. **Kolom 1 — Link undangan:** sudah terisi default `https://ryan-fuji.lavelle.my.id/undangan/`
   (bisa diganti; diingat di `localStorage`).
3. **Kolom 2 — Daftar nama:** tempel/ketik, satu nama per baris (bisa ratusan).
4. **(Opsional) Template pesan WA:** dapat diedit, placeholder `{nama}` & `{link}`,
   default sopan (lihat §8), diingat di `localStorage`.
5. Klik **"Buat Link"** → daftar hasil muncul.
6. Tiap tamu: **🔗 Salin Link** · **💬 Salin Pesan WA**.
7. Toolbar hasil: **📋 Salin Tabel (Nama+Link)** · **⬇️ Unduh CSV** · penghitung
   total link.

## 6. Format Hasil

Per tamu (kartu):
- Nama tamu (judul kartu).
- Link personalisasi: `…/undangan/?to=Budi+Santoso`.
- Tombol **Salin Link**.
- Tombol **Salin Pesan WA** (teks penuh dari template + link).

Massal:
- **Salin Tabel** → format TSV (Nama⇥Link) untuk tempel ke Excel/Google Sheets.
- **Unduh CSV** → arsip / mail-merge.

## 7. Detail Teknis Kunci

### Pembentukan link (harus cocok dgn cara undangan membaca `?to=`)
Undangan melakukan: `URLSearchParams.get('to')` → `.replace(/\+/g,' ')` →
`decodeURIComponent(...)`. Maka generator:
- Gunakan `URL` API agar aman walau base sudah punya query
  (`const u = new URL(base); u.searchParams.set('to', name)`), lalu untuk link
  "cantik" ganti `%20`→`+` pada bagian query `to`.
- `encodeURIComponent(name)` menangani karakter khusus (`& # ? /` dst) sehingga
  `URLSearchParams.get` + `decodeURIComponent` di sisi undangan menghasilkan nama
  utuh. Uji kasus: spasi, titik ("M. Rizky"), "&", tanda kutip, huruf beraksen.
- Buang `?to=` lama bila base kebetulan sudah memuatnya.
- Validasi base: harus URL valid (http/https); kalau tidak → pesan error ramah.

### Persistensi ringan
`localStorage` menyimpan: base link terakhir & template pesan. Nama tamu **tidak**
disimpan (privasi + selalu segar).

### Performa (WAJIB ringan walau ratusan link)
- **Render satu-lintasan:** bangun semua kartu via `DocumentFragment` / satu
  `innerHTML`, bukan append per item.
- **Event delegation:** SATU listener di kontainer hasil (deteksi tombol via
  `closest`), bukan listener per kartu → 500 tamu tetap enteng.
- **Batasi animasi list:** kartu hasil pakai reveal CSS murah; stagger GSAP
  **dibatasi hanya kartu pertama yang terlihat** (mis. ≤24), sisanya tampil
  instan. Tidak menganimasikan 500 elemen sekaligus.
- Tak ada re-render penuh saat menyalin (hanya ubah teks tombol yang diklik).

### Motion (skill 3d-motion-ui)
- **GSAP** untuk orkestrasi masuk (eyebrow→judul→panel, stagger halus) dan
  mikro-interaksi tombol (hover magnetik lembut pada CTA utama, umpan salin).
- Semua motion **SSG/again-safe** & dibungkus guard; gagal-muat → UI tetap tampil.

### Background live (hidup tapi ringan)
- Pendekatan **GPU-friendly**: aurora/gradien beranimasi berbasis CSS `transform`
  + `opacity` (bukan animasi layout), lapisan grain tipis, mengambang lembut —
  seperti pola `PortalBackground` yang sudah terbukti ringan. Opsi partikel canvas
  sangat dibatasi (jumlah kecil, `requestAnimationFrame` di-pause saat tab hidden).
- **Hindari** WebGL berat/Three.js scene penuh demi menjaga "ringan di akses";
  motion premium dicapai lewat GSAP + CSS aurora, bukan render 3D mahal.
- Hormati `prefers-reduced-motion`: background jadi statis elegan, motion mati.

## 8. Desain Visual (skill ui-ux-pro-max)

Arah: **dark luxury** konsisten dengan brand Lavelle.
- **Palet:** dasar charcoal/hitam dalam (#0d0a06/#17120c), aksen emas
  (#c9a24b / #e0bd6a), teks ivory (#f4ecd9 / muted #b1a688), sentuh marun.
- **Tipografi:** display serif elegan (Marcellus / Cormorant) + sans bersih
  (Jost / Inter). Font disatukan (embed woff2 subset atau muat efisien) agar tak
  bergantung koneksi lambat.
- **Layout:** dua-panel di desktop (input kiri, hasil kanan), menumpuk di HP.
  Panel glassmorphism, glow emas lembut, spasi lega editorial.
- **Mikro-interaksi:** tombol salin → "Tersalin ✓" + getar halus; count-up total
  link; toast notifikasi; empty-state ramah sebelum generate.
- Terasa **istimewa & profesional**, tapi tetap cepat dan jelas dipakai.

Detail visual final digarap saat implementasi dengan skill **ui-ux-pro-max** &
**3d-motion-ui**.

## 9. Keamanan & Privasi

- **Tanpa egress data:** nama tamu tak pernah meninggalkan browser.
- **HTTPS/SSL** otomatis (Cloudflare Universal SSL).
- **Unlisted:** subdomain tak ditautkan dari undangan/portal. (Bila kelak butuh
  kunci sungguhan, bisa pasang Cloudflare Access — tak perlu untuk v1.)
- Tidak menyentuh proyek Pages lain (isolasi penuh).

## 10. Deploy (meniru resep `ryan-fuji`)

1. `wrangler pages project create lavelle-tamu --production-branch=main`
2. `wrangler pages deploy <dir> --project-name=lavelle-tamu --branch=main --commit-dirty=true`
3. Attach domain: `POST /accounts/{acc}/pages/projects/lavelle-tamu/domains {name: tamu.lavelle.my.id}`
4. CNAME `tamu` → `lavelle-tamu.pages.dev` **proxied** (zone `343c9e74fe8736e80f2128b38da138e2`).
5. Tambah `tamu` ke `RESERVED` di `src/portal/lib/slug.js` (pertahanan berlapis;
   DNS eksplisit sudah menang atas wildcard portal, konsisten dgn `ryan-fuji`).
- Token CF: pakai token kerja Pages:Edit+DNS. **Rotate/hapus token setelah selesai**
  (terekspos di chat).
- Account ID: `f6e777fc23bf32d482d8f9b47d8b7197`.

## 11. Verifikasi

- **Unit (Vitest bila praktis):** `buildLink` untuk kasus tepi (spasi, titik, "&",
  aksen, base ber-query); `parseNames`; `renderMessage`.
- **Fungsional (headless/manual):** tempel 3 nama → link benar & undangan membuka
  nama yang tepat (round-trip `?to=`); salin link/pesan; ekspor CSV/tabel.
- **Performa:** generate **500 nama** → render < ~1 detik, scroll mulus, salin
  tetap responsif (bukti bahwa delegation + fragment bekerja).
- **Motion & reduced-motion:** background hidup di normal; statis saat
  `prefers-reduced-motion`.
- **Live pasca-deploy:** `tamu.lavelle.my.id` 200 + SSL valid; `ryan-fuji` &
  `portal` tak terpengaruh.

## 12. Kriteria Sukses

1. Vendor bisa tempel link + daftar nama → dapat link/pesan per tamu tanpa bantuan.
2. Link yang dibuat membuka undangan dengan nama tamu yang benar (round-trip).
3. Terasa premium (background hidup, motion halus, layout profesional).
4. Ringan: ratusan link ter-generate & tergulir tanpa nge-lag.
5. Aman & privat: HTTPS, tanpa data tamu ke server.
6. Terisolasi: undangan Fuji & Ryan dan Portal tetap utuh.
