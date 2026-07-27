// Bentuk objek `invite` untuk template Sinema — mengikuti kontrak data yang sudah terbukti.
// defaultInvite() SELALU kembalikan salinan baru (tak ada state bersama).
export function defaultInvite() {
  return {
    hero: { kicker: 'The Wedding Of', bride: '', groom: '', date: '', dateText: '', photo: '' },
    quote: { text: '', ref: '' },
    opening: { photo: '' },
    bride: { name: '', role: 'Putri dari', parents: '', photo: '', socials: [] },
    groom: { name: '', role: 'Putra dari', parents: '', photo: '', socials: [] },
    story: [
      { year: 'Bab 01', title: '', desc: '', photo: '' },
      { year: 'Bab 02', title: '', desc: '', photo: '' },
      { year: 'Bab 03', title: '', desc: '', photo: '' },
      { year: 'Bab 04', title: '', desc: '', photo: '' },
    ],
    events: [
      { tag: 'Akad Nikah', date: '', time: '', place: '', dress: '' },
      { tag: 'Resepsi', date: '', time: '', place: '', dress: '' },
    ],
    mapsQuery: '',
    dressCode: { note: '', colors: [] },
    family: { note: '', bride: [], groom: [], alsoInviting: [] },
    gallery: [], galleryCats: ['Semua'],
    galleryFull: [], galleryFullCats: ['Semua'],
    gifts: [], qris: null, giftConfirmWa: '',
    music: { src: '', link: '', start: 0 },   // link = URL YouTube (auto-play latar); src = file audio
    closing: { quote: '', ref: '', signoff: '', photo: '' },
    template: 'sinema',
    adat: { suku: 'minang' },   // khusus template Adat: pilihan suku (minang/jawa/sunda/bugis)
    style: { font: 'default', size: 'sedang', accent: '', hide: {} },   // kustomisasi bebas (font/ukuran/aksen/sembunyi seksi)
  }
}

function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v) }
function deepMerge(base, over) {
  const out = Array.isArray(base) ? [...base] : { ...base }
  for (const k in over) {
    if (isObj(base?.[k]) && isObj(over[k])) out[k] = deepMerge(base[k], over[k])
    else out[k] = over[k]                       // array & primitif: timpa penuh
  }
  return out
}
export function mergeInvite(partial) { return deepMerge(defaultInvite(), partial || {}) }
