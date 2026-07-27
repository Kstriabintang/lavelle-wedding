import { mergeInvite } from './schema.js'

// Data CONTOH (netral, bukan klien nyata) untuk render awal & pratinjau builder.
export const sampleInvite = mergeInvite({
  hero: {
    bride: 'Rara', groom: 'Bagus', date: '2026-12-20',
    dateText: 'Minggu, 20 Desember 2026',
    photo: 'https://picsum.photos/seed/lavelle-hero/1200/1600',
  },
  quote: {
    text: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.',
    ref: '— QS. Ar-Rum : 21',
  },
  bride: { name: 'Rara Contoh Putri', parents: 'Putri dari Bapak A & Ibu B', photo: 'https://picsum.photos/seed/lavelle-bride/900/1200' },
  groom: { name: 'Bagus Contoh Putra', parents: 'Putra dari Bapak C & Ibu D', photo: 'https://picsum.photos/seed/lavelle-groom/900/1200' },
  story: [
    { year: 'Bab 01', title: 'Dipertemukan', desc: 'Awal yang sederhana, dari sebuah pertemuan yang tak terduga.', photo: 'https://picsum.photos/seed/lavelle-s1/800/1000' },
    { year: 'Bab 02', title: 'Semakin Dekat', desc: 'Waktu merajut kedekatan, menautkan dua hati dalam kebaikan.', photo: 'https://picsum.photos/seed/lavelle-s2/800/1000' },
    { year: 'Bab 03', title: 'Khitbah', desc: 'Sebuah pinangan diucapkan penuh adab di hadapan keluarga.', photo: 'https://picsum.photos/seed/lavelle-s3/800/1000' },
    { year: 'Bab 04', title: 'Menuju Halal', desc: 'Kini kami siap menyempurnakan separuh agama.', photo: 'https://picsum.photos/seed/lavelle-s4/800/1000' },
  ],
  events: [
    { tag: 'Akad Nikah', date: 'Sabtu, 19 Desember 2026', time: '08.00 WIB', place: 'Masjid Agung Contoh, Kota Contoh' },
    { tag: 'Resepsi', date: 'Minggu, 20 Desember 2026', time: '11.00 WIB – Selesai', place: 'Gedung Serbaguna Contoh, Kota Contoh' },
  ],
  dressCode: {
    note: 'Kami akan berbahagia bila Anda hadir dengan busana bernuansa berikut.',
    colors: [{ name: 'Marun', hex: '#5c1020' }, { name: 'Emas', hex: '#c9a24b' }, { name: 'Krem', hex: '#ece3d2' }],
  },
  family: {
    note: 'Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir & memberikan doa restu.',
    bride: ['Bapak A', 'Ibu B'], groom: ['Bapak C', 'Ibu D'], alsoInviting: ['Keluarga Besar Contoh'],
  },
  gallery: [1, 2, 3, 4, 5, 6].map((n) => ({ src: `https://picsum.photos/seed/lavelle-g${n}/800/800`, cat: 'Prewedding' })),
  galleryFull: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ src: `https://picsum.photos/seed/lavelle-g${n}/800/800`, cat: 'Prewedding' })),
  closing: {
    quote: 'Ya Allah, jadikanlah pernikahan ini penuh berkah dan kekalkanlah cinta kami hingga ke surga-Mu.',
    ref: 'Doa Pernikahan', signoff: 'Rara & Bagus', photo: 'https://picsum.photos/seed/lavelle-closing/1200/1600',
  },
  music: { src: '', start: 0 },
})
