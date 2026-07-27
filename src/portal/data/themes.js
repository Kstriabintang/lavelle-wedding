// Paket warna preset untuk template Sinema. Tiap tema = peta CSS custom properties
// yang di-set di root .invite-sinema. Kunci var WAJIB ada semua (dipakai sinema-template.css).
export const THEMES = {
  'marun-emas': {
    label: 'Marun–Emas', swatch: ['#5c1020', '#c9a24b'],
    vars: {
      '--bg': '#161210', '--ink': '#f4ecdd', '--ink-soft': '#c9bda6', '--surface': '#201914',
      '--line': '#3a2e22', '--accent': '#c9a24b', '--accent-2': '#e6c877', '--accent-ink': '#1a1206', '--marun': '#5c1020',
    },
  },
  'navy-emas': {
    label: 'Navy–Emas', swatch: ['#12233d', '#c9a24b'],
    vars: {
      '--bg': '#0e1626', '--ink': '#eaf0f8', '--ink-soft': '#aebccf', '--surface': '#16223a',
      '--line': '#26364f', '--accent': '#c9a24b', '--accent-2': '#e6c877', '--accent-ink': '#0b1220', '--marun': '#12233d',
    },
  },
  'sage-krem': {
    label: 'Sage–Krem', swatch: ['#5a6b52', '#d9c9a3'],
    vars: {
      '--bg': '#f6f3ea', '--ink': '#2e332a', '--ink-soft': '#5e675a', '--surface': '#ffffff',
      '--line': '#e2dccb', '--accent': '#5a6b52', '--accent-2': '#7e9070', '--accent-ink': '#ffffff', '--marun': '#4a5a44',
    },
  },
  'dusty-rose': {
    label: 'Dusty Rose', swatch: ['#a86b6b', '#e8d5cf'],
    vars: {
      '--bg': '#f7efec', '--ink': '#3a2a2a', '--ink-soft': '#7a5f5f', '--surface': '#ffffff',
      '--line': '#ecdcd6', '--accent': '#a86b6b', '--accent-2': '#c98f8f', '--accent-ink': '#ffffff', '--marun': '#8a4f4f',
    },
  },
  'hitam-emas': {
    label: 'Hitam–Emas', swatch: ['#111111', '#c9a24b'],
    vars: {
      '--bg': '#0d0d0d', '--ink': '#f0e9db', '--ink-soft': '#b8ac97', '--surface': '#171717',
      '--line': '#2c2c2c', '--accent': '#c9a24b', '--accent-2': '#e6c877', '--accent-ink': '#0d0d0d', '--marun': '#3a2a12',
    },
  },
}
export const THEME_IDS = Object.keys(THEMES)
export function themeVars(id) { return (THEMES[id] || THEMES[THEME_IDS[0]]).vars }
