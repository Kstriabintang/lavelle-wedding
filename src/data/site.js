// Konfigurasi Lavelle — ubah di sini bila nomor/paket/link berubah.
export const WA_1 = '6285264402640' // Admin 1
export const WA_2 = '6282299913592' // Admin 2
export const IG = 'https://instagram.com/lavelle.ld'
export const EMAIL = 'lavelle.weddingku@gmail.com'

const WA_TEXT = 'Halo Admin Lavelle, saya ingin berkonsultasi mengenai pembuatan undangan pernikahan digital. Boleh dibantu informasinya?'
export const wa = (number = WA_1, text = WA_TEXT) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`

export const waPlan = (plan) =>
  wa(WA_1, `Halo Admin Lavelle, saya tertarik dengan paket *${plan}* untuk undangan pernikahan digital. Boleh dibantu informasi selengkapnya?`)

export const demos = [
  {
    key: 'klasik', href: '/demo/klasik/?to=Tamu%20Undangan',
    thumb: 'demo__thumb--klasik', frame: 'mk--frame',
    names: 'Kayla & Raka', date: '20 . 12 . 2026', btn: 'Buka Undangan',
    tag: 'Klasik — Blush & Sage', title: 'Tema Klasik', flag: '',
    desc: 'Hangat dan lembut dengan animasi yang halus — cocok untuk pernikahan adat maupun modern.',
    cardClass: 'demo--klasik',
  },
  {
    key: 'modern', href: '/demo/modern/?to=Tamu%20Undangan',
    thumb: 'demo__thumb--modern', frame: 'mk--frame-d',
    names: 'Anindya & Bima', date: '14 . 02 . 2027', btn: 'Buka Undangan',
    tag: 'Modern — Midnight & Gold', title: 'Tema Modern', flag: '',
    desc: 'Mewah dan minimalis, lengkap dengan RSVP, buku ucapan, dan amplop digital.',
    cardClass: '',
  },
  {
    key: 'sinema', href: '/demo/sinema/?to=Tamu%20Undangan',
    thumb: 'demo__thumb--sinema', frame: 'mk--frame-d',
    names: 'Kirana & Arsa', date: '12 . 06 . 2027', btn: 'Buka Undangan',
    tag: 'Sinema — Velvet & Gold', title: 'Tema Sinema', flag: 'Eksklusif',
    desc: 'Pengalaman sinematik: tirai teater membuka, dedaunan berjatuhan, bingkai berornamen, dan animasi 3D yang hidup di setiap scroll.',
    cardClass: '',
  },
  {
    key: 'modern3d', href: '/demo/modern-3d/?to=Tamu%20Undangan',
    thumb: 'demo__thumb--3d', frame: 'mk--frame-d',
    names: 'Anindya & Bima', date: '14 . 02 . 2027', btn: 'Jelajahi 3D',
    tag: 'Modern 3D — Three.js', title: 'Tema Modern 3D', flag: '',
    desc: 'Undangan 3D berbasis scroll — kamera menembus konstelasi foto bertabur partikel emas. Dibangun dengan Three.js (WebGL).',
    cardClass: '',
  },
]
