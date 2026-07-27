// Registry TEMPLATE (gaya layout undangan). Tema warna terpisah (themes.js).
// Tambah template baru = tambah entri di sini + komponen renderer-nya.
export const TEMPLATES = {
  sinema: {
    id: 'sinema',
    name: 'Sinema',
    desc: 'Sinematik — foto full-bleed, nama pecah per-huruf, kisah horizontal ter-pin, motion scroll dramatis.',
    tag: 'Dramatis',
    thumb: '/portal/thumbs/sinema.jpg',
  },
  royale: {
    id: 'royale',
    name: 'Royale',
    desc: 'Klasik elegan — multi-seksi rapi, timeline kisah zig-zag, profil arched, whitespace lega.',
    tag: 'Klasik',
    thumb: '/portal/thumbs/royale.jpg',
  },
  luxe: {
    id: 'luxe',
    name: 'Luxe',
    desc: 'Editorial romantis — base ivory hangat, aksen emas-mawar, foto arch, sampul buka undangan, lightbox galeri.',
    tag: 'Romantis',
    thumb: '/portal/thumbs/luxe.jpg',
  },
  adat: {
    id: 'adat',
    name: 'Adat Nusantara',
    desc: 'Undangan adat per-suku (Minang/Jawa/Sunda/Bugis) — motif tenun, karikatur busana adat, prosesi, & musik gamelan khas daerah.',
    tag: 'Tradisional',
    thumb: '/portal/thumbs/adat.jpg',
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    desc: 'Minimalis kontemporer — tipografi bersih (Tenor Sans × Poppins), whitespace lega, ornamen halus, kesan profesional & clean.',
    tag: 'Minimalis',
    thumb: '/portal/thumbs/modern.jpg',
  },
}
export const TEMPLATE_IDS = Object.keys(TEMPLATES)
export const DEFAULT_TEMPLATE = 'sinema'
export function templateName(id) { return (TEMPLATES[id] || TEMPLATES[DEFAULT_TEMPLATE]).name }
