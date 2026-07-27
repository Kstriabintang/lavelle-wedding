// Registry TEMPLATE (gaya layout undangan). Tema warna terpisah (themes.js).
// Tambah template baru = tambah entri di sini + komponen renderer-nya.
export const TEMPLATES = {
  sinema: {
    id: 'sinema',
    name: 'Sinema',
    desc: 'Sinematik — foto full-bleed, nama pecah per-huruf, kisah horizontal ter-pin, motion scroll dramatis.',
    tag: 'Dramatis',
  },
  royale: {
    id: 'royale',
    name: 'Royale',
    desc: 'Klasik elegan — multi-seksi rapi, timeline kisah zig-zag, profil arched, whitespace lega.',
    tag: 'Klasik',
  },
  luxe: {
    id: 'luxe',
    name: 'Luxe',
    desc: 'Editorial romantis — base ivory hangat, aksen emas-mawar, foto arch, sampul buka undangan, lightbox galeri.',
    tag: 'Romantis',
  },
  adat: {
    id: 'adat',
    name: 'Adat Nusantara',
    desc: 'Undangan adat per-suku (Minang/Jawa/Sunda/Bugis) — motif tenun, karikatur busana adat, prosesi, & musik gamelan khas daerah.',
    tag: 'Tradisional',
  },
}
export const TEMPLATE_IDS = Object.keys(TEMPLATES)
export const DEFAULT_TEMPLATE = 'sinema'
export function templateName(id) { return (TEMPLATES[id] || TEMPLATES[DEFAULT_TEMPLATE]).name }
