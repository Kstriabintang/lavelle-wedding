// Kustomisasi bebas per-undangan (kebebasan kreatif karyawan): pasangan font, ukuran teks,
// warna aksen bebas, & tampil/sembunyikan seksi. Diterapkan lewat CSS var + prop ke template.
// Font memakai keluarga yang SUDAH di-load di index.html (tak perlu load tambahan).

export const FONT_PAIRS = {
  default: { label: 'Bawaan', desc: 'Fraunces × Jost (elegan modern)', serif: "'Fraunces'", script: "'Great Vibes'", sans: "'Jost'", body: "'Cormorant Garamond'" },
  klasik:  { label: 'Klasik',  desc: 'Marcellus × Lora (anggun, formal)', serif: "'Marcellus'", script: "'Pinyon Script'", sans: "'Tenor Sans'", body: "'Lora'" },
  modern:  { label: 'Modern',  desc: 'Tenor Sans × Poppins (bersih, tegas)', serif: "'Tenor Sans'", script: "'Alex Brush'", sans: "'Poppins'", body: "'Poppins'" },
  romantis:{ label: 'Romantis', desc: 'Cormorant × Alex Brush (lembut, syahdu)', serif: "'Cormorant Upright'", script: "'Alex Brush'", sans: "'Jost'", body: "'Cormorant Garamond'" },
  tegas:   { label: 'Tegas',   desc: 'Marcellus × Jost (kokoh, berkelas)', serif: "'Marcellus'", script: "'Great Vibes'", sans: "'Jost'", body: "'Jost'" },
}
export const FONT_KEYS = Object.keys(FONT_PAIRS)

export const SIZES = { kecil: 0.92, sedang: 1, besar: 1.1 }
export const SIZE_KEYS = ['kecil', 'sedang', 'besar']
export const SIZE_LABELS = { kecil: 'Kecil', sedang: 'Sedang', besar: 'Besar' }

// Seksi yang boleh disembunyikan (kunci cocok dg data & guard di tiap template).
export const HIDEABLE = [
  { k: 'story', label: 'Kisah Cinta' },
  { k: 'gallery', label: 'Galeri Foto' },
  { k: 'gifts', label: 'Hadiah / Amplop' },
  { k: 'dress', label: 'Dress Code' },
]

export function defaultStyle() {
  return { font: 'default', size: 'sedang', accent: '', hide: {} }
}

// Font vars — kosong utk 'default' (pakai fallback asli template).
export function fontVars(fontKey) {
  const p = FONT_PAIRS[fontKey]
  if (!p || fontKey === 'default') return {}
  return { '--inv-serif': p.serif, '--inv-script': p.script, '--inv-sans': p.sans, '--inv-body': p.body }
}

// Override warna aksen (kosong = pakai tema). Ditaruh di root template agar menang atas themeVars.
export function accentOverrideVars(accent) {
  if (!accent) return {}
  // --rose/--rose-soft khusus Luxe (yang meresolusi warna utamanya sendiri).
  return { '--accent': accent, '--accent-2': accent, '--marun': accent, '--rose': accent, '--rose-soft': accent, '--accent-ink': '#ffffff' }
}

export function zoomVal(size) { return SIZES[size] || 1 }

// section tersembunyi?
export function isHidden(hide, key) { return !!(hide && hide[key]) }
