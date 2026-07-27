// Preset WALLPAPER latar portal (semua gelap, beragam nuansa) — dipilih per-karyawan di
// Pengaturan (user_metadata.bg_pref). Setiap preset menyetel DUA hal:
//  1) latar hidup: base + 4 orb aurora TRI-TONE (berkilau) + 2 sapuan cahaya  → var --pb-*
//  2) AKSEN UI: warna kartu/border/tombol/teks/judul di SELURUH portal        → var --pa-*
// Jadi ganti wallpaper = seluruh tampilan (bukan cuma background) ikut menyesuaikan.
export const PORTAL_BGS = {
  'aurora-emas': {
    label: 'Aurora Emas', desc: 'Emas hangat & marun',
    preview: 'linear-gradient(135deg, #140f08, #7a242c 55%, #c9a24b)',
    base: 'radial-gradient(130% 120% at 18% 4%, #1c150d 0%, #130d08 46%, #0a0705 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(212,170,80,.36), transparent 66%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(168,92,40,.34), transparent 66%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(138,38,58,.30), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(240,206,132,.20), transparent 66%)',
    sheen: 'rgba(240,206,132,.07)', shine: 'rgba(212,170,80,.10)',
    acc: '#d3ad55', acc2: '#e9c97e', ink: '#201907', txt: '#f0e6cf', mut: '#b6ab8a',
    surf: 'rgba(28,21,12,.72)', surf2: 'rgba(0,0,0,.26)', bd: 'rgba(211,173,85,.22)', bd2: 'rgba(211,173,85,.5)', glow: 'rgba(211,173,85,.4)',
  },
  'safir-malam': {
    label: 'Safir Malam', desc: 'Safir, indigo & teal',
    preview: 'linear-gradient(135deg, #081018, #2a3fa0 55%, #6fb0e8)',
    base: 'radial-gradient(130% 120% at 18% 4%, #0c1626 0%, #080f1c 46%, #05080f 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(74,132,214,.38), transparent 66%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(96,84,196,.32), transparent 66%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(34,146,156,.30), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(150,196,236,.20), transparent 66%)',
    sheen: 'rgba(172,206,240,.07)', shine: 'rgba(96,150,224,.10)',
    acc: '#5b9bd6', acc2: '#94c4ee', ink: '#07131f', txt: '#dde8f5', mut: '#9bb0c8',
    surf: 'rgba(13,22,36,.74)', surf2: 'rgba(0,0,0,.28)', bd: 'rgba(91,155,214,.24)', bd2: 'rgba(91,155,214,.55)', glow: 'rgba(91,155,214,.42)',
  },
  'zamrud-hutan': {
    label: 'Zamrud Hutan', desc: 'Zamrud, teal & lumut',
    preview: 'linear-gradient(135deg, #08130d, #1c7a52 55%, #8fd6a4)',
    base: 'radial-gradient(130% 120% at 18% 4%, #0c1913 0%, #08120d 46%, #050b08 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(52,176,116,.36), transparent 66%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(34,138,128,.32), transparent 66%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(120,164,72,.28), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(176,216,158,.18), transparent 66%)',
    sheen: 'rgba(186,226,178,.07)', shine: 'rgba(70,190,130,.10)',
    acc: '#3fae74', acc2: '#7ad39e', ink: '#06160f', txt: '#daefe2', mut: '#9bbaa5',
    surf: 'rgba(11,24,17,.74)', surf2: 'rgba(0,0,0,.28)', bd: 'rgba(63,174,116,.24)', bd2: 'rgba(63,174,116,.55)', glow: 'rgba(63,174,116,.42)',
  },
  'mawar-anggur': {
    label: 'Mawar Anggur', desc: 'Anggur, mawar & plum',
    preview: 'linear-gradient(135deg, #140a0e, #8a2440 55%, #e0a0b0)',
    base: 'radial-gradient(130% 120% at 18% 4%, #1c0f14 0%, #150a0f 46%, #0b0508 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(196,88,112,.34), transparent 66%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(138,42,64,.32), transparent 66%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(126,48,116,.28), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(228,170,184,.18), transparent 66%)',
    sheen: 'rgba(236,186,196,.07)', shine: 'rgba(206,110,138,.10)',
    acc: '#cf6d84', acc2: '#e8a3b3', ink: '#1a0a10', txt: '#f3dee4', mut: '#c69ba7',
    surf: 'rgba(28,15,20,.74)', surf2: 'rgba(0,0,0,.28)', bd: 'rgba(207,109,132,.24)', bd2: 'rgba(207,109,132,.55)', glow: 'rgba(207,109,132,.42)',
  },
  'amethyst-senja': {
    label: 'Amethyst Senja', desc: 'Amethyst, magenta & indigo',
    preview: 'linear-gradient(135deg, #100b1a, #4a2f8a 55%, #bd9aec)',
    base: 'radial-gradient(130% 120% at 18% 4%, #150f22 0%, #0f0a18 46%, #07050d 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(150,96,214,.34), transparent 66%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(186,64,150,.30), transparent 66%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(92,72,180,.30), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(198,168,232,.18), transparent 66%)',
    sheen: 'rgba(206,182,238,.07)', shine: 'rgba(160,110,224,.10)',
    acc: '#a074d8', acc2: '#c8a6f0', ink: '#120b1e', txt: '#e8dff5', mut: '#b3a3cc',
    surf: 'rgba(21,15,33,.74)', surf2: 'rgba(0,0,0,.28)', bd: 'rgba(160,116,216,.24)', bd2: 'rgba(160,116,216,.55)', glow: 'rgba(160,116,216,.42)',
  },
  'laut-teal': {
    label: 'Laut Malam', desc: 'Teal, pirus & cyan',
    preview: 'linear-gradient(135deg, #06120f, #0e7a72 55%, #6fd6c8)',
    base: 'radial-gradient(130% 120% at 18% 4%, #081815 0%, #051110 46%, #030a09 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(44,168,158,.36), transparent 66%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(40,124,168,.30), transparent 66%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(44,158,116,.28), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(156,222,212,.18), transparent 66%)',
    sheen: 'rgba(166,228,220,.07)', shine: 'rgba(60,196,182,.10)',
    acc: '#35b0a6', acc2: '#74d5c9', ink: '#05120f', txt: '#d8efec', mut: '#95bcb6',
    surf: 'rgba(8,23,21,.74)', surf2: 'rgba(0,0,0,.28)', bd: 'rgba(53,176,166,.24)', bd2: 'rgba(53,176,166,.55)', glow: 'rgba(53,176,166,.42)',
  },
  'tembaga-senja': {
    label: 'Tembaga Senja', desc: 'Tembaga, jingga & emas',
    preview: 'linear-gradient(135deg, #150c07, #a24e1e 55%, #e8ac6e)',
    base: 'radial-gradient(130% 120% at 18% 4%, #19110a 0%, #130b07 46%, #090503 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(200,116,56,.38), transparent 66%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(158,74,34,.32), transparent 66%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(202,152,64,.28), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(240,186,126,.20), transparent 66%)',
    sheen: 'rgba(242,192,142,.07)', shine: 'rgba(216,140,76,.10)',
    acc: '#d98a4e', acc2: '#ecad74', ink: '#180c04', txt: '#f3e1d0', mut: '#c6ab91',
    surf: 'rgba(25,17,11,.74)', surf2: 'rgba(0,0,0,.28)', bd: 'rgba(217,138,78,.24)', bd2: 'rgba(217,138,78,.55)', glow: 'rgba(217,138,78,.42)',
  },
  'onyx-mono': {
    label: 'Onyx', desc: 'Hitam pekat, aksen emas',
    preview: 'linear-gradient(135deg, #0c0c0c, #2a2a2a 55%, #c9a24b)',
    base: 'radial-gradient(130% 120% at 18% 4%, #171717 0%, #0e0e0e 46%, #050505 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(201,162,75,.18), transparent 66%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(120,120,120,.16), transparent 66%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(80,80,80,.16), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(224,204,154,.12), transparent 66%)',
    sheen: 'rgba(224,214,192,.06)', shine: 'rgba(201,162,75,.08)',
    acc: '#c9a24b', acc2: '#e2c580', ink: '#161206', txt: '#ececec', mut: '#a7a29a',
    surf: 'rgba(21,21,21,.74)', surf2: 'rgba(0,0,0,.3)', bd: 'rgba(201,162,75,.2)', bd2: 'rgba(201,162,75,.46)', glow: 'rgba(201,162,75,.36)',
  },
}
export const PORTAL_BG_IDS = Object.keys(PORTAL_BGS)
export const DEFAULT_PORTAL_BG = 'aurora-emas'
function get(id) { return PORTAL_BGS[id] || PORTAL_BGS[DEFAULT_PORTAL_BG] }

// Var latar (dipakai PortalBackground)
export function portalBgVars(id) {
  const b = get(id)
  return { '--pb-base': b.base, '--pb-o1': b.o1, '--pb-o2': b.o2, '--pb-o3': b.o3, '--pb-o4': b.o4, '--pb-sheen': b.sheen, '--pb-shine': b.shine }
}
// Var AKSEN UI (dipakai root .db / .pf → mengalir ke seluruh kartu/tombol/teks)
export function portalAccentVars(id) {
  const b = get(id)
  return {
    '--pa-acc': b.acc, '--pa-acc2': b.acc2, '--pa-ink': b.ink, '--pa-txt': b.txt, '--pa-mut': b.mut,
    '--pa-surf': b.surf, '--pa-surf2': b.surf2, '--pa-bd': b.bd, '--pa-bd2': b.bd2, '--pa-glow': b.glow,
  }
}
