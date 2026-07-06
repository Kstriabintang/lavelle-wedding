/* =========================================================
   Lavelle — Demo "Modern 3D" (Three.js, scroll sinematik)
   config.js — SEMUA data yang mudah diganti per klien ada di sini.
   Namespace global: window.M3D
   ========================================================= */
window.M3D = {
    cfg: {
        couple: { full: "Anindya & Bima", a: "Anindya", b: "Bima" },
        dateText: "14 . 02 . 2027",        // tampilan di scene pembuka
        dateLong: "14 Februari 2027",       // tampilan di kartu acara
        target: "2027-02-14T09:00:00+07:00",// hitung mundur
        venue: "Grand Ballroom, Bandung",
        akad: "09.00 - 11.00 WIB",
        resepsi: "12.00 - 15.00 WIB",
        brand: "Lavelle",
        audio: "../modern/audio/marry-you-violin.mp3",
        audioStartAt: 0,
        photoPath: "../../img/mentahan/",
        photoExt: ".jpeg",
        sectionNames: ["Pembuka", "Hitung Mundur", "Our Story", "Acara", "RSVP"],
        photos: [
            "momen-bahagia", "pasangan-bukit-sunset", "pasangan-candid", "pasangan-duduk", "pasangan-estetik-instagram",
            "pasangan-hitam-putih", "pasangan-jalan", "pasangan-kaizen-yvaine", "pasangan-outdoor-1", "pasangan-outdoor-2",
            "pasangan-outdoor-3", "pasangan-outdoor-4", "pasangan-outdoor-5", "pasangan-pantai-senja", "pasangan-pantai",
            "pasangan-pelukan-1", "pasangan-pelukan-2", "pasangan-pelukan-3", "pasangan-pose-romantis", "pasangan-romantis",
            "pasangan-tatapan-dekat", "pasangan-tatapan", "pasangan-utama", "pernikahan-alina-bohdan", "pernikahan-bithia-noah",
            "pernikahan-marissa-derek", "potret-estetik", "summer-1", "summer-2", "summer-3", "summer-4"
        ]
    },
    // diisi oleh modul lain saat runtime
    util: {}, sections: {}, particles: {}, ui: {}, redraws: [], state: { fitK: 1 }
};
M3D.photoURLs = M3D.cfg.photos.map(function (n) { return M3D.cfg.photoPath + n + M3D.cfg.photoExt; });
