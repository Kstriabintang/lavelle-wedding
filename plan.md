# LAVELLE — DESIGN DIRECTION BRIEF
## Dari "lengkap tapi datar" → premium yang bikin klien langsung beli

> Cara pakai: simpan file ini di repo (mis. `docs/LAVELLE_DESIGN_BRIEF.md`), lalu instruksikan agent:
> *"Baca `docs/LAVELLE_DESIGN_BRIEF.md`. Kerjakan HANYA FASE A dulu, berhenti, tunjukkan hasil untuk aku review sebelum lanjut."*
> Semua kerja di branch `rebuild/world-class`. Adat/diorama/gamelan tetap FROZEN.

---

## 0. KENAPA V1 TERASA GENERIC (baca dulu, ini akar masalahnya)

V1 mencentang semua fitur dengan benar — tapi "premium" bukan checklist fitur, itu **craft**. Lima hal ini yang membedakan template dari produk mahal, dan v1 lemah di semuanya:

1. **Whitespace** — v1 padat. Premium itu lega, banyak napas.
2. **Skala tipografi** — v1 "aman", kontras kecil. Premium punya lompatan dramatis: nama raksasa vs label mungil.
3. **Foto** — v1 masih "foto di dalam kartu berbingkai". Premium itu full-bleed, grading konsisten.
4. **Motion** — v1 kemungkinan standar/cepat. Premium itu lambat, berbobot, sinematik.
5. **Restraint** — v1 nambah emas/ornamen biar keliatan mewah. KEBALIK. Mewah itu justru mengurangi.

**Aturan proses paling penting:** jangan bangun 11 section sekaligus lagi. Sempurnakan **cover** dulu sampai benar-benar "wow", minta ACC, baru propagate pola craft-nya ke sisanya. (Lihat FASE eksekusi di bagian 4.)

---

## 1. PRINSIP PREMIUM — DENGAN ANGKA KONKRET

Jangan pakai nilai "kira-kira". Ini baseline, boleh diperhalus per tema:

### Spacing & layout
- Padding vertikal antar-section: **desktop 128–160px**, tablet 96–120px, **mobile 72–96px**. Jangan pelit.
- Lebar konten teks maksimal **narrow**: 560–640px, dipusatkan. Teks lebar penuh = murah.
- Grid gutter longgar. Biarkan ada ruang kosong yang disengaja — itu bukan "kurang konten", itu kemewahan.

### Tipografi (kontras skala = kunci)
- **Display / nama mempelai**: `clamp(3rem, 8vw, 7rem)`. Besar, percaya diri.
- **Label section** (mis. "BRIDE & GROOM", "LOVE STORY"): huruf kecil, **uppercase, letter-spacing 0.25–0.35em, ~0.75rem**, warna muted/aksen. Ini "signature" yang bikin editorial.
- **Body**: 1rem–1.125rem, **line-height 1.7–1.85**. Nyaman dibaca.
- Rasio lompatan display ke body minimal 1.5×; makin dramatis makin premium (asal terbaca).
- Maksimal **2 keluarga font** per tema (1 display/serif ekspresif + 1 penunjang bersih). Jangan lebih.

### Foto
- **Full-bleed** (edge-to-edge) atau margin longgar yang disengaja. HAPUS pola "foto kecil dalam bingkai emas".
- **Grading konsisten per tema** — semua foto dalam satu tema harus terasa dari "satu roll film" yang sama.
- Monochrome Noir: `filter: grayscale(100%) contrast(1.05)` dipaksa di semua foto.
- Hero: **Ken Burns** (slow zoom 1.0→1.08 selama 12–20s, loop) + parallax halus saat scroll.

### Warna (disiplin, bukan pelangi)
- Per tema: **1 warna latar dominan + 1 aksen + 1–2 netral**. Titik.
- Aksen dipakai **hemat** — untuk garis tipis, satu kata, satu tombol. Bukan disebar ke mana-mana.
- Kontras teks wajib lolos di SEMUA tema (cek Noir & Navy yang gelap).

### Ornamen — RESTRAINT
- Ornamen = **garis rambut tipis (hairline)**, satu motif kecil sebagai pembatas, bukan filigree ramai di tiap sudut.
- Kalau ragu antara "tambah ornamen" vs "tambah whitespace" → **selalu pilih whitespace**.

---

## 2. TEMUAN RISET invi.id (benchmark) — FLOW & FITUR

Diambil dari undangan live premium mereka (Monochrome 06). Ini **superset fitur** yang harus Lavelle capai untuk sejajar/lampaui.

### Urutan section undangan (yang tamu buka)
1. **Cover/Gerbang** — "The Wedding of" → nama → "Kepada Yth: [Nama Tamu dari `?to=`]" → tombol "Buka Undangan" → catatan maaf salah penulisan nama.
2. **Pembuka** — tanggal (angka besar bertumpuk 31·12·26), foto pasangan, kutipan (ayat/quote).
3. **Bride & Groom** — salam pembuka, lalu per orang: foto, nama lengkap, nama orang tua, **link sosmed (IG/FB/TikTok/X/YouTube) per mempelai**.
4. **Save The Date** — countdown (Hari/Jam/Menit/Detik) + **"Simpan di Kalender"** (Google Calendar + `.ics`).
5. **Detail Acara** — mendukung **3+ acara** (Akad, Resepsi, **Ngunduh Mantu**), tiap acara: hari, tanggal, jam, venue, alamat, **Google Maps embed** + tombol buka Maps.
6. **Dress Code** — anjuran warna dengan **swatch warna**.
7. **Live Streaming** — tombol "Gabung via YouTube/Zoom".
8. **Gallery** — pembatas tanggal + grid foto + **lightbox**.
9. **Love Story** — timeline: foto + tanggal + judul + deskripsi per milestone.
10. **Kado Digital** — kartu bank **digaya kartu ATM fisik** (grafis chip, nomor emboss), nama, tombol **"Salin"**, konfirmasi via WA.
11. **RSVP** — Nama, konfirmasi (Hadir/Tidak/Ragu), jumlah tamu (1–10), submit, **Edit RSVP**.
12. **Wishes/Ucapan** — Nama, pesan, **STICKER PICKER** (kucing, cincin, bouquet, dll), live feed.
13. **Terima Kasih** (penutup) — pesan, nama pasangan.
14. **Musik latar** — lagu asli (mereka pakai JVKE - Golden Hour), autoplay + toggle.
15. **Floating quick-nav** (bar bawah) — lompat: Cover/Couple/Event/Gallery/Love Story/Gift/RSVP.
16. **Keluarga Besar + Turut Mengundang** — kedua keluarga + pihak co-undang.

### FITUR YANG LAVELLE V1 BELUM PUNYA (WAJIB TAMBAH)
- [ ] **Sticker picker** di Ucapan  ← delight tinggi, prioritas
- [ ] **Kartu bank gaya ATM fisik** (chip + emboss)  ← upgrade visual amplop
- [ ] **Dress code + swatch warna**
- [ ] **Live streaming** (YouTube/Zoom)
- [ ] **Sosmed per mempelai**
- [ ] **Array acara fleksibel (3+)** — jangan hardcode 2
- [ ] **Floating quick-nav** bar bawah
- [ ] **Keluarga Besar + Turut Mengundang**
- [x] Personalisasi nama tamu `?to=` (Lavelle sudah punya)

### Kelemahan invi.id yang bisa Lavelle LAMPAUI
- Motion mereka relatif standar. Envelope & scroll-reveal Lavelle bisa lebih sinematik.
- **Theme-switch instan menyeluruh** (warna+font+ornamen+filter) langka — jadikan signature Lavelle.
- Foto-sentris + ornamen budaya autentik + gamelan orisinal → tak ada kompetitor yang punya.

---

## 3. SISTEM MOTION — KONKRET (ini yang fetch nggak bisa tangkap, jadi dikunci di sini)

Prinsip: **untuk pernikahan, gerakan itu lambat, berbobot, elegan. TIDAK bouncy, TIDAK cepat, TIDAK springy.**

### Scroll reveal (dipakai hampir semua section)
- Efek: `opacity 0→1` + `translateY(32px → 0)`.
- Durasi: **0.8–1.2s**. Easing: **`cubic-bezier(0.16, 1, 0.3, 1)`** (ease-out ekspresif).
- Stagger anak elemen: **90–120ms** antar item.
- Trigger saat elemen ~20% masuk viewport. Sekali jalan (jangan re-trigger tiap scroll).

### Envelope (gerbang pembuka) — pakai GSAP timeline, target 1.8–2.6s
1. Segel lilin "L" retak/pecah (scale + rotate kecil).
2. Flap amplop membuka — **3D `rotateX`** dengan perspective.
3. Kartu/surat naik keluar dari amplop (`translateY` + fade).
4. Tirai/overlay terangkat → hero muncul.
- Sekali per sesi (`sessionStorage`). Musik mulai saat gerbang dibuka.

### Hero
- Ken Burns pada foto latar (loop 12–20s).
- Parallax scroll: foto bergerak 10–20% lebih lambat dari konten.
- Countdown: angka **roll/flip** saat berubah (bukan ganti mendadak).

### Global
- Scroll progress bar tipis (2–3px) di atas.
- Lazy-load semua gambar + **blur-up** placeholder.
- **Wajib** hormati `prefers-reduced-motion` → matikan parallax/Ken Burns, sisakan fade sederhana.
- Target **60fps**: animasikan hanya `transform` & `opacity`, pakai `will-change`, hindari animasi `width/height/top/left`.

---

## 4. EKSEKUSI — DEPTH FIRST (INI PERBAIKAN UTAMA DARI V1)

Jangan kerjakan semua sekaligus. Ikuti urutan ini dan **BERHENTI di tiap gate untuk ACC**.

### FASE A — Nail the Cover (kerjakan ini SAJA dulu)
- Pilih **1 tema terkuat** sebagai acuan craft (rekomendasi: **Ivory Gold** atau **Monochrome Noir**).
- Bangun **Envelope + Cover + Pembuka** (2–3 layar) sampai standar bagian 1 & 3 terpenuhi total.
- Terapkan: whitespace penuh, skala tipografi dramatis, foto full-bleed, Ken Burns, envelope GSAP sinematik, restraint ornamen.
- **BERHENTI.** Tunjukkan ke Bos Revan untuk dibuka di HP. Jangan lanjut tanpa ACC.
- *Alasan: cover yang sempurna menetapkan standar. Semua section lain mewarisinya.*

### FASE B — Propagate ke section sisanya (setelah ACC cover)
- Terapkan **standar craft yang persis sama** ke section 2–14, satu per satu, **masih di tema acuan**.
- Sekalian tambahkan fitur yang hilang (bagian 2): sticker picker, kartu ATM, dress code, live streaming, sosmed, quick-nav, keluarga besar, array acara fleksibel.
- Update singkat tiap section beres; review borongan di akhir FASE B.

### FASE C — Propagate ke 5 tema lain
- Setelah 1 tema penuh & disetujui, replikasi ke tema lain via CSS variables + composable.
- Tiap tema: verifikasi kontras, grading foto, pasangan font, ornamen. Cek keenam tema di 320px & desktop.

### FASE D — Marketing site (lihat bagian 6)

**Gate wajib:** jangan pernah loncat gate. ACC ada di tangan Bos Revan, bukan di screenshot agent. Main tetap bersih sampai ACC final.

---

## 5. SPEC RINGKAS PER SECTION (acuan saat FASE B)

| # | Section | Poin premium yang wajib |
|---|---------|--------------------------|
| 1 | Cover/Envelope | Nama tamu `?to=`, envelope GSAP, foto full-bleed, tombol elegan |
| 2 | Pembuka | Tanggal angka besar bertumpuk, kutipan/ayat, foto pasangan |
| 3 | Bride & Groom | Foto per orang, orang tua, **sosmed per mempelai**, layout beda desktop/mobile |
| 4 | Save The Date | Countdown roll, Google Calendar + `.ics` |
| 5 | Detail Acara | **Array 3+ acara**, Maps embed + tombol, add-to-calendar |
| 6 | Dress Code | **Swatch warna** yang bisa diklik/salin hex |
| 7 | Live Streaming | Tombol YouTube/Zoom, tampil kondisional |
| 8 | Gallery | Grid bento/masonry, lightbox keyboard+swipe, lazy blur-up |
| 9 | Love Story | Timeline foto+tanggal+judul+deskripsi, scroll-reveal per node |
| 10 | Kado Digital | **Kartu ATM fisik** (chip, emboss), salin-clipboard, e-wallet + QRIS |
| 11 | RSVP | Validasi, Hadir/Tidak/Ragu, jumlah tamu, Edit RSVP, emit ke Wishes |
| 12 | Wishes | **Sticker picker**, live feed, slide-in ucapan baru |
| 13 | Penutup | Pesan terima kasih, nama, foto/ornamen |
| 14 | Musik + Quick-nav | Toggle mengambang + equalizer; floating nav bar bawah |
| 15 | Keluarga Besar | Kedua keluarga + Turut Mengundang |

Semua section: **komponen shared/reusable**, jalan mulus di **6 tema**, layout **beda per breakpoint** (bukan scale-down), data placeholder konsisten (Anindya & Rizky, no lorem ipsum).

---

## 6. MARKETING SITE (lavelle.my.id) — REFACTOR TERPISAH

Ini surface berbeda dari undangan. Benchmark: katalog invi.id — tapi jujur, **marketing site invi.id sendiri cukup polos (WordPress)**. Lavelle bisa dengan mudah melampauinya kalau menerapkan prinsip bagian 1.

Yang wajib:
- **Hero** satu layar yang benar-benar stunning (bukan cuma teks + tombol) — terapkan whitespace + skala tipografi + satu foto/motion kuat.
- **Katalog tema dalam phone-mockup**: tiap tema ditampilkan sebagai frame HP yang men-scroll undangan aslinya (invi.id pakai pola ini — efektif banget untuk closing).
- **Kategori tab**: Adat Nusantara / Klasik & Romantis / Modern (kamu sudah punya struktur ini).
- **Pricing jelas** + social proof / testimoni.
- **CTA "Pesan Sekarang"** yang menonjol, WhatsApp float.
- Konsistensi visual dengan undangan flagship (font, warna, feel yang sama).

Kerjakan **setelah** undangan flagship selesai — biar mockup di katalog menampilkan produk yang sudah premium, bukan yang lama.

---

## 7. DEFINISI "PREMIUM DONE" — BAR-nya

Sebuah section/tema baru dianggap selesai kalau:
- [ ] Whitespace terasa lega (bukan padat) — lolos "uji napas".
- [ ] Kontras tipografi dramatis (nama besar ↔ label mungil letter-spaced).
- [ ] Foto full-bleed, grading konsisten per tema.
- [ ] Motion lambat & berbobot (0.8–1.2s, easing ekspresif), 60fps, hormati reduced-motion.
- [ ] Ornamen minimal (restraint) — whitespace mengalahkan filigree.
- [ ] Jalan mulus di **6 tema** & **320px–1920px**, layout beda per breakpoint.
- [ ] **Zero `console.error`** — termasuk saat envelope jalan & autoplay musik diblok browser.
- [ ] Buka di HP beneran: apakah kamu merasa "ini mahal"? Kalau ragu, belum selesai.

**Uji akhir tunggal:** buka di HP, scroll pelan. Kalau tidak spontan terasa mahal → belum premium, ulang.

---

*Prioritas absolut: FASE A (cover) dulu, berhenti, review. Craft menang atas kelengkapan. Satu cover yang sempurna > sebelas section yang datar.*
