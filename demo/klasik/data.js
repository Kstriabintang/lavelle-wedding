/* =========================================================
   Lavelle — Data Undangan (Tema KLASIK)
   ---------------------------------------------------------
   >> INI SATU-SATUNYA FILE YANG PERLU DIUBAH PER KLIEN <<
   Cukup ganti tulisan di dalam tanda kutip " ... ".
   Jangan hapus tanda koma, kurung, atau kurung siku.
   Setelah diubah, simpan lalu buka index.html-nya.
   ========================================================= */
window.LAVELLE = {

  /* --- Info dasar & judul tab browser --- */
  meta: {
    template: "klasik",
    brand: "Lavelle",
    title: "Kayla & Raka — Undangan Pernikahan",
    description: "Undangan pernikahan Kayla & Raka. Tema Klasik (Blush & Sage) oleh Lavelle."
  },

  /* --- Nama pasangan --- */
  couple: {
    // Nama pendek yang tampil besar (mis. di cover & hero)
    display: "Kayla & Raka",

    // Mempelai wanita
    bride: {
      name: "Kayla",                 // nama panggilan
      full: "Kayla Ayu Lestari",     // nama lengkap di bagian Mempelai
      initial: "K",                  // 1 huruf untuk lingkaran foto (kalau belum ada foto)
      photo: "",                     // (opsional) alamat foto, mis. "../../img/klien/kayla.jpeg"
      parents: "Putri pertama dari<br>Bapak Suryadi & Ibu Maryani",
      ig: ""                         // (opsional) link Instagram, kosongkan bila tidak ada
    },

    // Mempelai pria
    groom: {
      name: "Raka",
      full: "Raka Pratama",
      initial: "R",
      photo: "",
      parents: "Putra kedua dari<br>Bapak Hendra & Ibu Sulastri",
      ig: ""
    }
  },

  /* --- Tanggal & waktu acara --- */
  date: {
    display: "Sabtu, 20 Desember 2026",       // tulisan tanggal yang tampil
    iso: "2026-12-20T08:00:00+07:00",         // dipakai hitung mundur (format: TAHUN-BULAN-HARIjam)
    // Setelah tanggal ini, undangan otomatis berubah jadi mode "Kenangan/Dokumentasi".
    // Biasanya diisi 2-3 hari setelah hari-H.
    afterIso: "2026-12-23T00:00:00+07:00"
  },

  /* --- Ayat / kutipan pembuka --- */
  quote: {
    text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.",
    source: "QS. Ar-Rum: 21"
  },

  /* --- Rangkaian acara (boleh 1, 2, atau lebih) --- */
  events: [
    {
      title: "Akad Nikah",
      icon: "fa-ring",                         // ikon FontAwesome
      date: "Sabtu, 20 Desember 2026",
      time: "08.00 – 10.00 WIB",
      venue: "Masjid Agung, Jakarta",
      map: ""                                   // link Google Maps, kosongkan bila belum ada
    },
    {
      title: "Resepsi",
      icon: "fa-champagne-glasses",
      date: "Sabtu, 20 Desember 2026",
      time: "11.00 – 14.00 WIB",
      venue: "Ballroom Mawar, Jakarta",
      map: ""
    }
  ],

  /* --- Galeri foto (tampil sejak awal) --- */
  gallery: [
    "../../img/mentahan/summer-1.jpeg",
    "../../img/mentahan/summer-2.jpeg",
    "../../img/mentahan/summer-3.jpeg",
    "../../img/mentahan/summer-4.jpeg",
    "../../img/mentahan/pasangan-duduk.jpeg",
    "../../img/mentahan/pasangan-romantis.jpeg"
  ],

  /* --- Foto tambahan yang hanya muncul di mode Kenangan (setelah acara) --- */
  galleryAfter: [
    "../../img/mentahan/pasangan-outdoor-1.jpeg",
    "../../img/mentahan/pasangan-outdoor-4.jpeg",
    "../../img/mentahan/pasangan-outdoor-5.jpeg",
    "../../img/mentahan/pasangan-pantai.jpeg",
    "../../img/mentahan/pasangan-pelukan-1.jpeg",
    "../../img/mentahan/pasangan-pelukan-3.jpeg"
  ],

  /* --- Musik latar --- */
  music: {
    src: "./audio/until-i-found-you-violin.mp3",
    startAt: 31,        // mulai lagu dari detik ke- (untuk melewati intro)
    volume: 0.75        // 0 = diam, 1 = paling keras
  },

  /* --- Kalimat penutup --- */
  closing: "Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."
};

/* =========================================================
   MODE PREVIEW (dipakai oleh Panel Template — jangan diubah)
   Bila undangan dibuka dari panel dengan ?preview=1, data
   diambil dari panel supaya bisa dilihat langsung.
   ========================================================= */
(function () {
  try {
    var q = new URLSearchParams(location.search);
    if (q.get("preview") === "1") {
      var draft = sessionStorage.getItem("LAVELLE_PREVIEW");
      if (draft) window.LAVELLE = JSON.parse(draft);
    }
  } catch (e) { /* abaikan */ }
})();
