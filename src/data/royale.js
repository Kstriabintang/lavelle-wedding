// Data undangan flagship /demo/royale/ (placeholder sesuai brief).
// Foto memakai aset yang sudah ada di /public/img/mentahan.
export const royale = {
  hero: {
    kicker: 'The Wedding Of',
    bride: 'Anindya',
    groom: 'Rizky',
    date: '2027-02-20',
    dateText: 'Sabtu, 20 Februari 2027',
    photo: 'pasangan-utama',
  },
  // Kartu share 1200×630 (landscape 1.91:1) → preview besar di WhatsApp/Twitter.
  // Dibuat per-undangan oleh scripts/make-og-card.py; fallback ke foto hero bila kosong.
  share: {
    ogImage: '/demo/royale/og.jpg',
  },
  quote: {
    text: 'Cinta bukan tentang menemukan seseorang yang sempurna, melainkan belajar melihat orang yang tidak sempurna dengan sempurna.',
    ref: '— Sam Keen',
  },
  // Foto untuk section Pembuka (beda dari foto hero, satu grading).
  opening: { photo: 'pasangan-romantis' },
  bride: {
    name: 'Anindya Paramita',
    role: 'Putri',
    parents: 'Putri pertama dari Bapak Hendra Wijaya & Ibu Ratna Sari',
    photo: 'pasangan-tatapan-dekat',
    socials: [
      { icon: 'fa-instagram', url: 'https://instagram.com/anindya.p', label: '@anindya.p' },
      { icon: 'fa-tiktok', url: 'https://tiktok.com/@anindya', label: '@anindya' },
    ],
  },
  groom: {
    name: 'Rizky Ananda',
    role: 'Putra',
    parents: 'Putra kedua dari Bapak Surya Ananda & Ibu Melati Kusuma',
    photo: 'pasangan-candid',
    socials: [
      { icon: 'fa-instagram', url: 'https://instagram.com/rizky.ananda', label: '@rizky.ananda' },
      { icon: 'fa-x-twitter', url: 'https://x.com/rizkyananda', label: '@rizkyananda' },
    ],
  },
  story: [
    { year: '2019', title: 'Pertama Bertemu', desc: 'Kami dipertemukan di sebuah acara kampus, dan sebuah percakapan singkat mengubah segalanya.', photo: 'pasangan-jalan' },
    { year: '2021', title: 'Kencan Pertama', desc: 'Senja di tepi pantai menjadi saksi awal kisah yang kami rajut perlahan.', photo: 'pasangan-pantai-senja' },
    { year: '2024', title: 'Lamaran', desc: 'Di hadapan keluarga, sebuah janji diucapkan dengan penuh keyakinan dan doa.', photo: 'pasangan-romantis' },
    { year: '2026', title: 'Hari Bahagia', desc: 'Kini kami siap melangkah bersama menuju babak baru sebagai suami dan istri.', photo: 'pasangan-bukit-sunset' },
  ],
  events: [
    { tag: 'Akad Nikah', date: 'Sabtu, 20 Februari 2027', time: '08.00 – 10.00 WIB', place: 'Grha Cakrawala, Jl. Merdeka No. 10, Jakarta', dress: 'Formal · Earth Tone' },
    { tag: 'Resepsi', date: 'Sabtu, 20 Februari 2027', time: '11.00 – 14.00 WIB', place: 'Grha Cakrawala, Jl. Merdeka No. 10, Jakarta', dress: 'Formal · Earth Tone' },
    { tag: 'Ngunduh Mantu', date: 'Minggu, 21 Februari 2027', time: '10.00 – 13.00 WIB', place: 'Kediaman Mempelai Pria, Jl. Kenanga No. 4, Bandung', dress: 'Batik · Kasual' },
  ],
  mapsQuery: 'Monas Jakarta',
  dressCode: {
    note: 'Kami akan senang bila Anda mengenakan busana dengan nuansa warna berikut.',
    colors: [
      { name: 'Sage', hex: '#8a9a7b' },
      { name: 'Terracotta', hex: '#b7714f' },
      { name: 'Cream', hex: '#ece3d2' },
      { name: 'Dusty Brown', hex: '#7a5c47' },
    ],
  },
  liveStream: {
    note: 'Bagi keluarga & sahabat yang berhalangan hadir, acara dapat disaksikan secara langsung.',
    youtube: 'https://youtube.com/@lavelle',
    zoom: '',
  },
  family: {
    note: 'Merupakan suatu kebahagiaan & kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir & memberikan doa restu.',
    bride: ['Bapak Hendra Wijaya', 'Ibu Ratna Sari'],
    groom: ['Bapak Surya Ananda', 'Ibu Melati Kusuma'],
    alsoInviting: ['Keluarga Besar Wijaya', 'Keluarga Besar Ananda', 'Bapak/Ibu H. Soleh Mahmud', 'Rekan Alumni Universitas Indonesia'],
  },
  gallery: [
    { src: 'pasangan-utama', cat: 'Prewedding' },
    { src: 'pasangan-pose-romantis', cat: 'Prewedding' },
    { src: 'pasangan-pelukan-1', cat: 'Prewedding' },
    { src: 'pasangan-tatapan-dekat', cat: 'Candid' },
    { src: 'pasangan-outdoor-3', cat: 'Prewedding' },
    { src: 'pasangan-candid', cat: 'Candid' },
    { src: 'pasangan-bukit-sunset', cat: 'Prewedding' },
    { src: 'pasangan-duduk', cat: 'Candid' },
    { src: 'pasangan-romantis', cat: 'Prewedding' },
  ],
  galleryCats: ['Semua', 'Prewedding', 'Candid'],
  gifts: [
    { kind: 'bank', label: 'BCA', no: '1234 5678 90', raw: '1234567890', an: 'Anindya Paramita', brand: 'fa-cc-visa' },
    { kind: 'bank', label: 'Mandiri', no: '0987 6543 21', raw: '0987654321', an: 'Rizky Ananda', brand: 'fa-cc-mastercard' },
    { kind: 'ewallet', label: 'GoPay', no: '0812 3456 7890', raw: '081234567890', an: 'Anindya P.', brand: 'fa-wallet' },
    { kind: 'ewallet', label: 'OVO', no: '0812 3456 7890', raw: '081234567890', an: 'Rizky A.', brand: 'fa-wallet' },
  ],
  qris: { img: '/demo/royale/qris.png', merchant: 'Anindya & Rizky', nmid: 'ID10243178XXXX' },
  giftConfirmWa: '6281234567890',
  wishesSeed: [
    { name: 'Dinda & Reza', hadir: 'Hadir', msg: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.' },
    { name: 'Keluarga Wijaya', hadir: 'Hadir', msg: 'Bahagia selalu untuk kalian berdua. Kami turut berbahagia menyambut hari istimewa ini.' },
    { name: 'Bagas Pratama', hadir: 'Insya Allah Hadir', msg: 'Akhirnya! Selamat ya, semoga langgeng sampai kakek nenek. 🤍' },
    { name: 'Sarah Amelia', hadir: 'Hadir', msg: 'Dua insan terbaik akhirnya bersatu. Selamat berbahagia, teman-temanku sayang!' },
    { name: 'Om Budi & Tante Rina', hadir: 'Berhalangan', msg: 'Maaf belum bisa hadir, namun doa terbaik selalu menyertai perjalanan kalian.' },
    { name: 'Geng Kuliah', hadir: 'Hadir', msg: 'Dari yang dulu bareng ngerjain tugas, sekarang mau nikah. Bahagia terus ya!' },
    { name: 'Nadia Putri', hadir: 'Insya Allah Hadir', msg: 'Semoga menjadi pasangan yang saling menguatkan dalam suka dan duka. Aamiin.' },
    { name: 'Fajar Nugroho', hadir: 'Hadir', msg: 'Selamat menempuh hidup baru, semoga cintanya abadi selamanya!' },
    { name: 'Tante Melati', hadir: 'Hadir', msg: 'Cucu tante sudah besar dan menikah. Bahagia selalu, nak.' },
    { name: 'Rian & Sasa', hadir: 'Berhalangan', msg: 'Congrats you two! Doa kami menyertai dari jauh. Sampai ketemu nanti!' },
  ],
  closing: {
    quote: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.',
    ref: 'QS. Ar-Rum : 21',
    signoff: 'Anindya & Rizky',
  },
}
