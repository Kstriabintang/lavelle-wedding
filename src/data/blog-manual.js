/* Artikel blog yang ditulis manual (bukan hasil ekstraksi).
   Tambah artikel baru cukup di array POSTS bawah — pakai helper makePost. */

const SITE = 'https://lavelle.my.id'

function faqHtml(faq) {
  if (!faq || !faq.length) return ''
  const items = faq.map((f) => `
                <details>
                    <summary>${f.q}</summary>
                    <p>${f.a}</p>
                </details>`).join('')
  return `\n            <h2>Pertanyaan yang sering ditanyakan</h2>\n            <div class="faq-list">${items}\n            </div>`
}

function ctaHtml() {
  return `
            <div class="cta-box">
                <h3>Wujudkan undangan digital impianmu</h3>
                <p>RSVP, buku ucapan, galeri, hingga amplop digital — semua siap dalam satu link elegan dari Lavelle.</p>
                <a href="/#paket" class="btn btn--gold">Lihat Paket</a>
                <a href="/#demo" class="btn btn--ghost" style="margin-left:.6rem;">Lihat Demo</a>
            </div>`
}

function moreHtml(related) {
  if (!related || !related.length) return ''
  const links = related.map((r) => `\n                <a href="/blog/${r.slug}/">${r.label}</a>`).join('')
  return `\n            <div class="post-more">\n                <h4>Baca juga</h4>${links}\n            </div>`
}

function jsonLd(o) {
  const url = `${SITE}/blog/${o.slug}/`
  const img = `${SITE}${o.cover}`
  const graph = [
    {
      '@type': 'BlogPosting', headline: o.title, description: o.desc, image: img,
      datePublished: o.iso, dateModified: o.iso,
      author: { '@type': 'Organization', name: 'Lavelle', url: `${SITE}/` },
      publisher: { '@type': 'Organization', name: 'Lavelle', logo: { '@type': 'ImageObject', url: `${SITE}/img/lavelle-logo.png` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/` },
        { '@type': 'ListItem', position: 3, name: o.crumb },
      ],
    },
  ]
  if (o.faq && o.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: o.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } })),
    })
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}

function makePost(o) {
  const url = `${SITE}/blog/${o.slug}/`
  const post = {
    slug: o.slug,
    title: `${o.title} | Lavelle`,
    description: o.desc,
    keywords: o.keywords,
    canonical: url,
    ogTitle: o.title,
    ogDescription: o.desc,
    ogImage: `${SITE}${o.cover}`,
    twitterDescription: o.desc,
    category: o.cat,
    heading: o.title,
    articleMeta: `Oleh Lavelle · ${o.date} · ${o.read} menit baca`,
    breadcrumb: o.crumb,
    cover: o.cover,
    coverAlt: o.coverAlt || o.title,
    jsonLd: jsonLd(o),
    body: `${o.body}${faqHtml(o.faq)}${ctaHtml()}${moreHtml(o.related)}`,
  }
  const card = { slug: o.slug, image: o.cover, category: o.cat, title: o.title, excerpt: o.desc, meta: `${o.date} · ${o.read} menit baca` }
  return { post, card }
}

const POSTS = [
  makePost({
    slug: 'susunan-acara-pernikahan-digital',
    title: 'Susunan Acara Pernikahan: Panduan & Contoh Lengkap',
    crumb: 'Susunan Acara Pernikahan',
    cat: 'Panduan', date: '7 Juli 2026', iso: '2026-07-07', read: 6,
    desc: 'Contoh susunan acara akad & resepsi pernikahan yang rapi, plus cara menampilkannya dengan elegan di undangan digital.',
    keywords: 'susunan acara pernikahan, rundown pernikahan, jadwal acara nikah, undangan digital',
    cover: '/img/mentahan/pasangan-utama.jpeg', coverAlt: 'Susunan acara pernikahan',
    body: `
            <p>Susunan acara yang tertata membuat hari pernikahan berjalan lancar dan tamu tahu kapan harus hadir. Di undangan digital, rundown ini bisa ditampilkan rapi lengkap dengan waktu, lokasi, dan tombol navigasi.</p>

            <h2>Contoh susunan acara akad nikah</h2>
            <ol>
                <li><strong>08.00</strong> — Tamu & keluarga berkumpul</li>
                <li><strong>08.30</strong> — Pembukaan & pembacaan ayat suci</li>
                <li><strong>09.00</strong> — Ijab kabul</li>
                <li><strong>09.30</strong> — Doa & penyerahan mahar</li>
                <li><strong>10.00</strong> — Ramah tamah & foto bersama</li>
            </ol>

            <h2>Contoh susunan acara resepsi</h2>
            <ol>
                <li><strong>11.00</strong> — Tamu memasuki ruangan</li>
                <li><strong>11.30</strong> — Kedua mempelai memasuki pelaminan</li>
                <li><strong>12.00</strong> — Sambutan keluarga</li>
                <li><strong>12.30</strong> — Hiburan & jamuan makan</li>
                <li><strong>14.00</strong> — Sesi foto & penutup</li>
            </ol>

            <h2>Tips menampilkan susunan acara di undangan digital</h2>
            <ul>
                <li>Kelompokkan per sesi (akad & resepsi) agar mudah dibaca.</li>
                <li>Sertakan tombol <strong>Google Maps</strong> di tiap lokasi.</li>
                <li>Tambahkan <strong>hitung mundur</strong> agar tamu ingat tanggalnya.</li>
                <li>Gunakan ikon kecil (cincin, jamuan) untuk memperjelas tiap sesi.</li>
            </ul>

            <blockquote>Susunan acara bukan sekadar jadwal — ia membantu setiap tamu merasa menjadi bagian dari momen bahagiamu.</blockquote>`,
    faq: [
      { q: 'Apakah susunan acara wajib ada di undangan?', a: 'Sangat disarankan. Susunan acara membantu tamu mengatur waktu kedatangan dan mengikuti jalannya acara.' },
      { q: 'Bagaimana jika akad dan resepsi beda hari?', a: 'Tampilkan dua kartu acara terpisah dengan tanggal, waktu, dan lokasi masing-masing agar tidak membingungkan tamu.' },
    ],
    related: [
      { slug: 'fitur-wajib-undangan-pernikahan-digital', label: '7 Fitur Wajib di Undangan Pernikahan Digital' },
      { slug: 'panduan-membuat-undangan-pernikahan-digital', label: 'Panduan Lengkap Membuat Undangan Pernikahan Digital' },
    ],
  }),

  makePost({
    slug: 'checklist-persiapan-pernikahan',
    title: 'Checklist Persiapan Pernikahan: Timeline 6 Bulan',
    crumb: 'Checklist Persiapan Pernikahan',
    cat: 'Panduan', date: '7 Juli 2026', iso: '2026-07-07', read: 7,
    desc: 'Timeline persiapan pernikahan 6 bulan yang praktis — dari menentukan tanggal, vendor, hingga menyebar undangan digital.',
    keywords: 'checklist pernikahan, persiapan pernikahan, timeline nikah, to do list wedding',
    cover: '/img/mentahan/pernikahan-marissa-derek.jpeg', coverAlt: 'Checklist persiapan pernikahan',
    body: `
            <p>Persiapan pernikahan terasa ringan bila dibagi ke dalam tahapan. Berikut timeline 6 bulan yang bisa kamu sesuaikan dengan kebutuhan.</p>

            <h2>6 bulan sebelum hari-H</h2>
            <ul>
                <li>Tentukan tanggal, konsep, dan anggaran.</li>
                <li>Susun daftar tamu awal.</li>
                <li>Survei venue akad & resepsi.</li>
            </ul>

            <h2>4–3 bulan sebelum</h2>
            <ul>
                <li>Booking vendor: fotografer, katering, rias, dekorasi.</li>
                <li>Jadwalkan sesi <strong>prewedding</strong>.</li>
                <li>Pilih desain dan pesan <strong>undangan digital</strong>.</li>
            </ul>

            <h2>2–1 bulan sebelum</h2>
            <ul>
                <li>Finalisasi susunan acara dan daftar tamu.</li>
                <li>Kirim <strong>save the date</strong> lalu undangan resmi.</li>
                <li>Fitting busana & gladi bersih.</li>
            </ul>

            <h2>1 minggu sebelum</h2>
            <ul>
                <li>Konfirmasi ulang semua vendor.</li>
                <li>Pantau <strong>RSVP</strong> dari undangan digital.</li>
                <li>Siapkan perlengkapan & istirahat cukup.</li>
            </ul>

            <blockquote>Kunci persiapan yang tenang adalah memulai lebih awal dan mencatat setiap progres.</blockquote>`,
    faq: [
      { q: 'Kapan waktu terbaik menyebar undangan?', a: 'Sebar save the date 2 bulan sebelumnya, lalu undangan resmi 3–4 minggu sebelum hari-H agar tamu punya waktu mengatur jadwal.' },
      { q: 'Berapa lama membuat undangan digital?', a: 'Di Lavelle umumnya 1–3 hari kerja setelah data lengkap diterima, jadi cukup fleksibel dengan timeline persiapanmu.' },
    ],
    related: [
      { slug: 'cara-menyebar-undangan-digital-whatsapp', label: 'Cara Menyebar Undangan Digital lewat WhatsApp' },
      { slug: 'susunan-acara-pernikahan-digital', label: 'Susunan Acara Pernikahan: Panduan & Contoh' },
    ],
  }),

  makePost({
    slug: 'tema-warna-pernikahan-2026',
    title: 'Tema Warna Pernikahan 2026 yang Elegan & Tren',
    crumb: 'Tema Warna Pernikahan 2026',
    cat: 'Inspirasi', date: '7 Juli 2026', iso: '2026-07-07', read: 6,
    desc: 'Inspirasi palet warna pernikahan 2026 yang elegan — dari sage & gold hingga dusty rose — beserta tips menyelaraskannya dengan undangan digital.',
    keywords: 'tema warna pernikahan, palet warna wedding 2026, warna undangan pernikahan, sage gold',
    cover: '/img/mentahan/pasangan-estetik-instagram.jpeg', coverAlt: 'Tema warna pernikahan 2026',
    body: `
            <p>Warna adalah jiwa dari sebuah pernikahan. Palet yang tepat membuat dekorasi, busana, dan undangan terasa menyatu. Berikut tema warna yang elegan dan tetap tren di 2026.</p>

            <h2>1. Sage &amp; Gold</h2>
            <p>Hijau sage yang menenangkan dipadu aksen emas hangat — natural, mewah, dan cocok untuk konsep taman maupun indoor.</p>

            <h2>2. Dusty Rose &amp; Cream</h2>
            <p>Merah muda lembut dengan krem memberi kesan romantis dan feminin tanpa berlebihan.</p>

            <h2>3. Terracotta &amp; Sand</h2>
            <p>Nuansa tanah yang hangat, sangat pas untuk pernikahan outdoor bertema rustic atau boho.</p>

            <h2>4. Midnight &amp; Gold</h2>
            <p>Biru tua pekat berpadu emas — pilihan berkelas untuk resepsi malam yang dramatis.</p>

            <h2>Menyelaraskan warna dengan undangan digital</h2>
            <ul>
                <li>Pilih tema undangan yang paletnya sejalan dengan dekorasi.</li>
                <li>Gunakan satu warna utama + satu aksen agar tidak ramai.</li>
                <li>Selaraskan warna busana mempelai dengan tone undangan untuk foto yang serasi.</li>
            </ul>

            <blockquote>Warna yang konsisten dari undangan hingga pelaminan menciptakan kesan pernikahan yang benar-benar direncanakan dengan hati.</blockquote>`,
    faq: [
      { q: 'Berapa banyak warna ideal untuk satu pernikahan?', a: 'Cukup 2–3 warna: satu warna utama, satu aksen, dan satu netral. Terlalu banyak warna membuat tampilan ramai.' },
      { q: 'Apakah warna undangan harus sama persis dengan dekorasi?', a: 'Tidak harus persis, tetapi sebaiknya berada dalam satu palet agar keseluruhan acara terasa menyatu.' },
    ],
    related: [
      { slug: 'ide-tema-undangan-pernikahan-digital', label: '10 Ide Tema Undangan Pernikahan Digital yang Elegan' },
      { slug: 'tips-memilih-undangan-pernikahan-digital', label: 'Tips Memilih Undangan Pernikahan Digital yang Tepat' },
    ],
  }),

  makePost({
    slug: 'save-the-date-digital',
    title: 'Save the Date Digital: Apa Itu & Cara Membuatnya',
    crumb: 'Save the Date Digital',
    cat: 'Edukasi', date: '7 Juli 2026', iso: '2026-07-07', read: 5,
    desc: 'Apa itu save the date, kapan mengirimnya, dan cara membuat save the date digital yang cantik sebelum undangan resmi.',
    keywords: 'save the date, save the date digital, pengumuman pernikahan, undangan digital',
    cover: '/img/mentahan/pasangan-tatapan.jpeg', coverAlt: 'Save the date digital',
    body: `
            <p><strong>Save the date</strong> adalah pengumuman awal berisi tanggal pernikahan, dikirim sebelum undangan resmi agar tamu bisa mengosongkan jadwal jauh-jauh hari.</p>

            <h2>Kapan mengirim save the date?</h2>
            <p>Idealnya <strong>2–4 bulan</strong> sebelum hari-H, terutama bila banyak tamu dari luar kota yang perlu mengatur perjalanan.</p>

            <h2>Apa saja isinya?</h2>
            <ul>
                <li>Nama kedua mempelai.</li>
                <li>Tanggal pernikahan (kota/lokasi boleh menyusul).</li>
                <li>Kalimat "undangan resmi menyusul".</li>
                <li>Satu foto prewedding yang manis.</li>
            </ul>

            <h2>Save the date vs undangan resmi</h2>
            <div class="table-wrap">
                <table>
                    <thead><tr><th></th><th>Save the Date</th><th>Undangan Resmi</th></tr></thead>
                    <tbody>
                        <tr><td>Waktu kirim</td><td>2–4 bulan sebelum</td><td>3–4 minggu sebelum</td></tr>
                        <tr><td>Isi</td><td>Tanggal & nama</td><td>Detail lengkap acara</td></tr>
                        <tr><td>Tujuan</td><td>Amankan jadwal tamu</td><td>Undangan formal</td></tr>
                    </tbody>
                </table>
            </div>

            <blockquote>Save the date adalah "kabar bahagia" pertama — sederhana, tapi membuat tamu merasa dinanti kehadirannya.</blockquote>`,
    faq: [
      { q: 'Apakah save the date wajib?', a: 'Tidak wajib, tapi sangat membantu jika tamu perlu mengatur cuti atau perjalanan jauh.' },
      { q: 'Apakah bisa digabung dengan undangan digital?', a: 'Bisa. Save the date dapat dibuat sebagai halaman ringkas, lalu diperbarui menjadi undangan lengkap saat detail sudah final.' },
    ],
    related: [
      { slug: 'checklist-persiapan-pernikahan', label: 'Checklist Persiapan Pernikahan: Timeline 6 Bulan' },
      { slug: 'tips-foto-prewedding-undangan-digital', label: 'Tips Memilih Foto Prewedding untuk Undangan Digital' },
    ],
  }),

  makePost({
    slug: 'musik-latar-undangan-pernikahan',
    title: 'Ide Musik Latar untuk Undangan Pernikahan Digital',
    crumb: 'Musik Latar Undangan',
    cat: 'Inspirasi', date: '7 Juli 2026', iso: '2026-07-07', read: 5,
    desc: 'Rekomendasi genre dan tips memilih musik latar undangan pernikahan digital agar suasana terasa syahdu tanpa mengganggu.',
    keywords: 'musik undangan pernikahan, backsound undangan digital, lagu pernikahan, musik latar wedding',
    cover: '/img/mentahan/pasangan-romantis.jpeg', coverAlt: 'Musik latar undangan pernikahan',
    body: `
            <p>Musik latar yang tepat membuat undangan digital terasa hidup dan menyentuh sejak tamu membukanya. Kuncinya: lembut, tidak mengganggu, dan sesuai nuansa.</p>

            <h2>Genre yang cocok</h2>
            <ul>
                <li><strong>Instrumental piano</strong> — netral, elegan, aman untuk semua tema.</li>
                <li><strong>Cover biola/akustik</strong> — hangat dan romantis.</li>
                <li><strong>Lagu religi lembut</strong> — untuk undangan bernuansa islami.</li>
                <li><strong>Lagu kenangan berdua</strong> — personal dan bermakna.</li>
            </ul>

            <h2>Tips memilih musik latar</h2>
            <ul>
                <li>Pilih versi instrumental agar vokal tidak menutupi teks.</li>
                <li>Mulai dari bagian lagu yang paling menyentuh (lewati intro panjang).</li>
                <li>Atur volume sedang dengan <strong>fade-in</strong> yang halus.</li>
                <li>Selalu sediakan tombol mute untuk kenyamanan tamu.</li>
            </ul>

            <blockquote>Musik yang tepat bukan yang paling keras, melainkan yang membuat tamu ikut merasakan momen bahagiamu.</blockquote>`,
    faq: [
      { q: 'Apakah musik otomatis diputar saat undangan dibuka?', a: 'Umumnya musik mulai setelah tamu menekan tombol "Buka Undangan", sesuai kebijakan browser, dan selalu bisa dimatikan.' },
      { q: 'Bolehkah memakai lagu favorit sendiri?', a: 'Boleh. Pilih bagian yang paling menyentuh dan gunakan versi yang jernih agar nyaman didengar.' },
    ],
    related: [
      { slug: 'fitur-wajib-undangan-pernikahan-digital', label: '7 Fitur Wajib di Undangan Pernikahan Digital' },
      { slug: 'ide-tema-undangan-pernikahan-digital', label: '10 Ide Tema Undangan Pernikahan Digital yang Elegan' },
    ],
  }),

  makePost({
    slug: 'undangan-pernikahan-islami-digital',
    title: 'Undangan Pernikahan Islami Digital: Adab & Contoh',
    crumb: 'Undangan Pernikahan Islami',
    cat: 'Panduan', date: '7 Juli 2026', iso: '2026-07-07', read: 6,
    desc: 'Panduan membuat undangan pernikahan islami digital yang santun — pilihan ayat, kalimat pembuka, hingga adab menyebarnya.',
    keywords: 'undangan pernikahan islami, undangan digital islami, ayat undangan nikah, walimatul ursy',
    cover: '/img/mentahan/pernikahan-alina-bohdan.jpeg', coverAlt: 'Undangan pernikahan islami digital',
    body: `
            <p>Undangan pernikahan islami mengedepankan kesantunan, doa, dan niat baik. Versi digital tetap bisa menjaga nilai tersebut sekaligus praktis.</p>

            <h2>Ayat & kalimat pembuka yang sering dipakai</h2>
            <p>Salah satu yang populer adalah <em>QS. Ar-Rum ayat 21</em> tentang pasangan yang menenteramkan. Bisa juga dibuka dengan <em>bismillah</em> dan salam.</p>

            <h2>Struktur undangan islami</h2>
            <ul>
                <li>Pembuka: bismillah, salam, dan ayat.</li>
                <li>Nama mempelai beserta nama orang tua.</li>
                <li>Waktu & tempat akad (ijab kabul) dan resepsi (walimatul 'ursy).</li>
                <li>Doa dan harapan restu.</li>
            </ul>

            <h2>Adab menyebar undangan digital</h2>
            <ul>
                <li>Sertakan salam dan sapaan yang santun saat mengirim.</li>
                <li>Personalisasi nama tamu sebagai bentuk penghormatan.</li>
                <li>Sampaikan amplop digital sebagai <em>pilihan</em>, bukan keharusan.</li>
            </ul>

            <blockquote>Undangan yang baik adalah yang mengundang dengan hormat dan mendoakan kebaikan bagi setiap yang membacanya.</blockquote>`,
    faq: [
      { q: 'Apakah undangan digital diperbolehkan dalam Islam?', a: 'Undangan digital pada dasarnya boleh, karena tujuannya menyampaikan undangan dengan cara yang santun dan bermanfaat.' },
      { q: 'Ayat apa yang cocok untuk undangan pernikahan?', a: 'QS. Ar-Rum: 21 paling sering digunakan karena berbicara tentang ketenteraman dan kasih sayang dalam pernikahan.' },
    ],
    related: [
      { slug: 'contoh-kata-kata-undangan-pernikahan-digital', label: '40+ Contoh Kata-Kata Undangan Pernikahan Digital' },
      { slug: 'amplop-digital-pernikahan', label: 'Amplop Digital: Cara Menerima Kado Pernikahan secara Online' },
    ],
  }),
]

export const manualPostList = POSTS.map((x) => x.card)
export const manualPostsMap = Object.fromEntries(POSTS.map((x) => [x.post.slug, x.post]))
