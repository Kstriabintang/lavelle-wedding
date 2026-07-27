// Preset WALLPAPER latar portal (semua gelap/dark, beragam nuansa) — dipilih per-karyawan
// di Pengaturan, disimpan di user_metadata.bg_pref. Dipakai PortalBackground.vue.
// Setiap preset: base gradient + 4 orb aurora (radial-gradient penuh) + warna sheen +
// `preview` (gradient mini untuk chip pemilih) + swatch.
export const PORTAL_BGS = {
  'aurora-emas': {
    label: 'Aurora Emas', desc: 'Emas hangat & marun',
    preview: 'linear-gradient(135deg, #140f08, #7a242c 62%, #c9a24b)',
    base: 'radial-gradient(130% 120% at 20% 6%, #1a140c 0%, #120d08 46%, #0a0705 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(201,162,75,.30), transparent 68%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(158,104,44,.30), transparent 68%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(122,36,44,.24), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(236,201,127,.18), transparent 68%)',
    sheen: 'rgba(236,201,127,.06)',
  },
  'safir-malam': {
    label: 'Safir Malam', desc: 'Biru safir & teal',
    preview: 'linear-gradient(135deg, #081018, #14507a 62%, #6fb0d8)',
    base: 'radial-gradient(130% 120% at 20% 6%, #0c1420 0%, #080e18 46%, #05080f 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(70,120,190,.32), transparent 68%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(40,90,140,.30), transparent 68%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(30,120,120,.24), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(150,190,230,.16), transparent 68%)',
    sheen: 'rgba(170,205,240,.06)',
  },
  'zamrud-hutan': {
    label: 'Zamrud Hutan', desc: 'Hijau zamrud & sage',
    preview: 'linear-gradient(135deg, #08110d, #1c6a48 62%, #8fce9f)',
    base: 'radial-gradient(130% 120% at 20% 6%, #0c1712 0%, #08110d 46%, #050b08 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(60,150,100,.30), transparent 68%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(40,110,80,.30), transparent 68%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(120,150,80,.22), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(170,210,150,.16), transparent 68%)',
    sheen: 'rgba(185,225,175,.06)',
  },
  'mawar-anggur': {
    label: 'Mawar Anggur', desc: 'Anggur marun & rosé',
    preview: 'linear-gradient(135deg, #140a0e, #8a2440 62%, #d8909f)',
    base: 'radial-gradient(130% 120% at 20% 6%, #1a0e12 0%, #140a0e 46%, #0b0508 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(180,80,105,.30), transparent 68%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(130,40,60,.30), transparent 68%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(90,30,70,.24), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(220,160,175,.16), transparent 68%)',
    sheen: 'rgba(232,182,192,.06)',
  },
  'amethyst-senja': {
    label: 'Amethyst Senja', desc: 'Ungu amethyst & magenta',
    preview: 'linear-gradient(135deg, #100b18, #4a2f7a 62%, #b58fd8)',
    base: 'radial-gradient(130% 120% at 20% 6%, #130e1e 0%, #0e0a16 46%, #07050d 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(138,92,192,.30), transparent 68%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(90,50,140,.30), transparent 68%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(150,50,120,.22), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(190,160,225,.16), transparent 68%)',
    sheen: 'rgba(200,175,235,.06)',
  },
  'laut-teal': {
    label: 'Laut Malam', desc: 'Teal & pirus dalam',
    preview: 'linear-gradient(135deg, #06120f, #0e6a66 62%, #6fd0c4)',
    base: 'radial-gradient(130% 120% at 20% 6%, #081614 0%, #05100f 46%, #030a09 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(40,150,140,.30), transparent 68%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(30,110,120,.30), transparent 68%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(30,80,110,.22), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(150,215,205,.16), transparent 68%)',
    sheen: 'rgba(160,225,215,.06)',
  },
  'tembaga-senja': {
    label: 'Tembaga Senja', desc: 'Tembaga & jingga bara',
    preview: 'linear-gradient(135deg, #150c07, #a24e1e 62%, #e8a86a)',
    base: 'radial-gradient(130% 120% at 20% 6%, #17100a 0%, #120b07 46%, #090503 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(190,110,50,.32), transparent 68%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(150,70,30,.30), transparent 68%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(110,40,30,.24), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(235,180,120,.18), transparent 68%)',
    sheen: 'rgba(240,190,140,.06)',
  },
  'onyx-mono': {
    label: 'Onyx', desc: 'Hitam pekat, aksen emas',
    preview: 'linear-gradient(135deg, #0c0c0c, #2a2a2a 62%, #c9a24b)',
    base: 'radial-gradient(130% 120% at 20% 6%, #161616 0%, #0e0e0e 46%, #050505 100%)',
    o1: 'radial-gradient(circle at 50% 50%, rgba(201,162,75,.16), transparent 68%)',
    o2: 'radial-gradient(circle at 50% 50%, rgba(120,120,120,.14), transparent 68%)',
    o3: 'radial-gradient(circle at 50% 50%, rgba(80,80,80,.14), transparent 70%)',
    o4: 'radial-gradient(circle at 50% 50%, rgba(220,200,150,.10), transparent 68%)',
    sheen: 'rgba(220,210,190,.05)',
  },
}
export const PORTAL_BG_IDS = Object.keys(PORTAL_BGS)
export const DEFAULT_PORTAL_BG = 'aurora-emas'
export function portalBgVars(id) {
  const b = PORTAL_BGS[id] || PORTAL_BGS[DEFAULT_PORTAL_BG]
  return { '--pb-base': b.base, '--pb-o1': b.o1, '--pb-o2': b.o2, '--pb-o3': b.o3, '--pb-o4': b.o4, '--pb-sheen': b.sheen }
}
