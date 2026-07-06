// ===================================================
// Konfigurasi undangan ADAT (data-driven, lintas suku)
// Dipakai oleh src/pages/DemoAdat.vue via route /demo/adat/:suku/
// Tambah suku baru = tambah entri di sini (otomatis jadi demo).
// Karikatur pasangan = ganti field `caricatureBride/Groom` dgn path
// PNG transparan saat aset tersedia (mis. /img/karikatur/minang-pria.png).
// ===================================================

export const adat = {
  minang: {
    slug: 'minang',
    suku: 'Minangkabau',
    tagline: 'Songket & Marawa',
    // palet: marun rumah gadang + emas songket + gading
    palette: {
      deep: '#3a0c14', primary: '#6e1423', primary2: '#8b1e2f',
      gold: '#c9a227', goldSoft: '#e6c565', gold2: '#a8801a',
      cream: '#f7edd8', paper: '#fbf5e8', ink: '#3a2417', inkSoft: '#7a5a44',
    },
    motif: 'songket',
    salam: 'Assalamu’alaikum Warahmatullahi Wabarakatuh',
    quote: 'Dan di antara tanda-tanda kekuasaan-Nya diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.',
    quoteRef: 'QS. Ar-Rum : 21',
    bride: 'Annisa Putri', brideFull: 'Annisa Putri Rangkayo',
    brideParents: 'Putri dari Bapak H. Zainal Abidin & Ibu Hj. Syamsidar',
    groom: 'Fadhil Rahman', groomFull: 'Fadhil Rahman Sutan Bagindo',
    groomParents: 'Putra dari Bapak H. Marlis Datuk & Ibu Hj. Rosnida',
    caricatureBride: '', caricatureGroom: '',
    date: '2027-09-12', dateText: 'Sabtu, 12 September 2027',
    akadTime: '08.00 WIB', resepsiTime: '11.00 – 14.00 WIB',
    venue: 'Rumah Gadang — Bukittinggi, Sumatera Barat',
    mapsQuery: 'Jam Gadang Bukittinggi',
    prosesi: [
      { icon: 'fa-hands-holding-circle', title: 'Manjapuik Marapulai', desc: 'Penjemputan mempelai pria oleh keluarga mempelai wanita sesuai adat.' },
      { icon: 'fa-crown', title: 'Basandiang', desc: 'Kedua mempelai bersanding di pelaminan bertahtakan songket dan emas.' },
      { icon: 'fa-bowl-rice', title: 'Makan Bajamba', desc: 'Jamuan adat menikmati hidangan bersama dalam kebersamaan.' },
    ],
    accent: 'Marawa · Suntiang · Songket',
  },

  jawa: {
    slug: 'jawa',
    suku: 'Jawa',
    tagline: 'Sogan & Parang',
    palette: {
      deep: '#241609', primary: '#6b4423', primary2: '#4a2f18',
      gold: '#b08d3c', goldSoft: '#d8b45e', gold2: '#8a6b2a',
      cream: '#f3e9d6', paper: '#faf3e4', ink: '#2f2013', inkSoft: '#6e553c',
    },
    motif: 'parang',
    salam: 'Nuwun, Bismillahirrahmanirrahim',
    quote: 'Sesungguhnya telah Kami ciptakan kalian berpasang-pasangan agar saling menyayangi dan menenteramkan hati.',
    quoteRef: 'QS. Ar-Rum : 21',
    bride: 'Ratna Dewi', brideFull: 'Rr. Ratna Dewi Kusuma',
    brideParents: 'Putri dari Bapak R. Suryo Wibowo & Ibu R.Ay. Sumarni',
    groom: 'Bagus Prasetyo', groomFull: 'R. Bagus Prasetyo Adiningrat',
    groomParents: 'Putra dari Bapak R. Hadi Susanto & Ibu R.Ay. Wulandari',
    caricatureBride: '', caricatureGroom: '',
    date: '2027-08-21', dateText: 'Sabtu, 21 Agustus 2027',
    akadTime: '09.00 WIB', resepsiTime: '11.00 – 15.00 WIB',
    venue: 'Pendhapa Agung — Yogyakarta',
    mapsQuery: 'Pendopo Ndalem Yogyakarta',
    prosesi: [
      { icon: 'fa-droplet', title: 'Siraman', desc: 'Prosesi memandikan calon pengantin sebagai simbol penyucian diri.' },
      { icon: 'fa-dove', title: 'Panggih', desc: 'Pertemuan kedua pengantin dengan rangkaian upacara adat Jawa.' },
      { icon: 'fa-hand-holding-heart', title: 'Ngunduh Mantu', desc: 'Penerimaan mempelai di kediaman keluarga pengantin pria.' },
    ],
    accent: 'Blangkon · Kebaya · Batik Parang',
  },

  sunda: {
    slug: 'sunda',
    suku: 'Sunda',
    tagline: 'Mega Mendung',
    palette: {
      deep: '#0d2b26', primary: '#1f5d50', primary2: '#2f7a68',
      gold: '#caa53d', goldSoft: '#e4c96b', gold2: '#a8842a',
      cream: '#eef3ea', paper: '#f6faf2', ink: '#1c2b25', inkSoft: '#4d6158',
    },
    motif: 'megamendung',
    salam: 'Assalamu’alaikum Warahmatullahi Wabarakatuh',
    quote: 'Di antara tanda kekuasaan-Nya, Dia menciptakan pasangan untukmu agar kamu hidup tenteram dan penuh kasih sayang.',
    quoteRef: 'QS. Ar-Rum : 21',
    bride: 'Siti Nurjanah', brideFull: 'Nyi Siti Nurjanah',
    brideParents: 'Putri dari Bapak H. Dadang Suherman & Ibu Hj. Euis Komariah',
    groom: 'Asep Ramdani', groomFull: 'Kang Asep Ramdani',
    groomParents: 'Putra dari Bapak H. Ujang Suryana & Ibu Hj. Nining Yuningsih',
    caricatureBride: '', caricatureGroom: '',
    date: '2027-07-18', dateText: 'Minggu, 18 Juli 2027',
    akadTime: '08.30 WIB', resepsiTime: '11.00 – 14.00 WIB',
    venue: 'Gedung Sabilulungan — Bandung, Jawa Barat',
    mapsQuery: 'Gedung Sabilulungan Bandung',
    prosesi: [
      { icon: 'fa-leaf', title: 'Ngeuyeuk Seureuh', desc: 'Prosesi memohon restu orang tua dengan tuntunan sesepuh.' },
      { icon: 'fa-coins', title: 'Sawer', desc: 'Menyawer beras, uang, dan permen sebagai simbol keberkahan.' },
      { icon: 'fa-fire', title: 'Meuleum Harupat', desc: 'Membakar lidi sebagai lambang keteguhan membina rumah tangga.' },
    ],
    accent: 'Siger · Kebaya · Mega Mendung',
  },

  bugis: {
    slug: 'bugis',
    suku: 'Bugis – Makassar',
    tagline: 'Lipa Sabbe',
    palette: {
      deep: '#2a0810', primary: '#7a1420', primary2: '#9c1f2c',
      gold: '#d4af37', goldSoft: '#efd07a', gold2: '#ad8a20',
      cream: '#f6ecd6', paper: '#fbf4e2', ink: '#331410', inkSoft: '#7c4c40',
    },
    motif: 'lipasabbe',
    salam: 'Assalamu’alaikum Warahmatullahi Wabarakatuh',
    quote: 'Dan di antara tanda-tanda kekuasaan-Nya, Dia menciptakan pasangan-pasangan untukmu agar kamu tenteram dan saling mengasihi.',
    quoteRef: 'QS. Ar-Rum : 21',
    bride: 'Andi Tenri', brideFull: 'Andi Tenri Abeng',
    brideParents: 'Putri dari Bapak Andi Muh. Yusuf & Ibu Andi Besse Kaharuddin',
    groom: 'Andi Baso', groomFull: 'Andi Baso Mappanyukki',
    groomParents: 'Putra dari Bapak H. Andi Pangeran & Ibu Hj. Andi Sitti',
    caricatureBride: '', caricatureGroom: '',
    date: '2027-10-03', dateText: 'Sabtu, 3 Oktober 2027',
    akadTime: '10.00 WITA', resepsiTime: '13.00 – 16.00 WITA',
    venue: 'Baruga Sangiaseri — Makassar, Sulawesi Selatan',
    mapsQuery: 'Baruga Sangiaseri Makassar',
    prosesi: [
      { icon: 'fa-hand-holding-droplet', title: 'Mappacci', desc: 'Malam pemberian daun pacar sebagai simbol kesucian menjelang akad.' },
      { icon: 'fa-gift', title: 'Mappenre Botting', desc: 'Prosesi mengantar mempelai pria menuju kediaman mempelai wanita.' },
      { icon: 'fa-crown', title: 'Mappasikarawa', desc: 'Sentuhan pertama kedua mempelai penuh makna dan doa.' },
    ],
    accent: 'Baju Bodo · Songkok · Lipa Sabbe',
  },
}

// urutan tampil + galeri default (pakai foto yang sudah ada di /img/mentahan)
export const adatOrder = ['minang', 'jawa', 'sunda', 'bugis']
export const adatGallery = [
  'pasangan-utama', 'pasangan-pose-romantis', 'pasangan-pelukan-1',
  'pasangan-outdoor-3', 'pasangan-tatapan-dekat', 'pasangan-candid',
]
export const adatSlugs = adatOrder
