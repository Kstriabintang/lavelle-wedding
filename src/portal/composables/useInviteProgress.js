// Menghitung kelengkapan pengisian undangan per-seksi (untuk bar progres & chip navigasi).
// computeProgress = fungsi murni (bisa diuji tanpa Vue). useInviteProgress = pembungkus reaktif.
import { computed } from 'vue'

function nonEmpty(v) { return typeof v === 'string' && v.trim().length > 0 }
function anyItem(arr) { return Array.isArray(arr) && arr.length > 0 }

// Definisi seksi + apakah "inti" + predikat terisi (berdasar schema.js)
const DEFS = [
  { k: 'mempelai', num: '01', label: 'Mempelai', core: true,
    test: (d) => nonEmpty(d.hero?.bride) && nonEmpty(d.hero?.groom) && (nonEmpty(d.hero?.date) || nonEmpty(d.hero?.dateText)) },
  { k: 'kisah', num: '02', label: 'Kisah', core: true,
    test: (d) => (d.story || []).some((s) => nonEmpty(s.title) || nonEmpty(s.desc)) },
  { k: 'acara', num: '03', label: 'Acara', core: true,
    test: (d) => (d.events || []).some((e) => nonEmpty(e.place)) },
  { k: 'galeri', num: '04', label: 'Galeri', core: true,
    test: (d) => anyItem(d.gallery) || anyItem(d.galleryFull) },
  { k: 'keluarga', num: '05', label: 'Keluarga', core: true,
    test: (d) => nonEmpty(d.family?.note) || anyItem(d.family?.bride) || anyItem(d.family?.groom) || anyItem(d.family?.alsoInviting) },
  { k: 'hadiah', num: '06', label: 'Amplop', core: true,
    test: (d) => anyItem(d.gifts) || !!d.qris },
  { k: 'musik', num: '07', label: 'Musik', core: true,
    test: (d) => nonEmpty(d.music?.link) || nonEmpty(d.music?.src) },
  { k: 'tema', num: '08', label: 'Tema', core: false, test: () => true },
  { k: 'gaya', num: '09', label: 'Gaya', core: false, test: () => true },
]

export function computeProgress(inviteData) {
  const d = inviteData || {}
  const sections = DEFS.map((def) => ({
    k: def.k, num: def.num, label: def.label, core: def.core,
    filled: !!def.test(d),
  }))
  const coreSecs = sections.filter((s) => s.core)
  const coreTotal = coreSecs.length
  const filledCore = coreSecs.filter((s) => s.filled).length
  return { sections, filledCore, coreTotal, pct: coreTotal ? filledCore / coreTotal : 0 }
}

// Menerima ref ATAU getter (() => invite) agar fleksibel dipakai dari komponen.
export function useInviteProgress(src) {
  return computed(() => computeProgress(typeof src === 'function' ? src() : src.value))
}
