// ===================================================
// Sistem tema /demo/royale/ — 6 tema premium, ganti instan tanpa reload.
// Tiap tema = satu set CSS custom properties (warna, font, filter foto).
// Reaktif via composable (bukan Zustand). SSR-safe: window/localStorage
// hanya disentuh lewat initTheme() di onMounted.
// ===================================================
import { ref, computed } from 'vue'

// Kontrak variabel (dipakai semua komponen section):
//   --bg --surface --surface-2 --ink --ink-soft --line
//   --accent --accent-2 --accent-ink --deep --hero-overlay --photo-filter
//   --font-display --font-serif --font-script --font-sans
export const THEMES = [
  {
    id: 'ivory', name: 'Ivory Gold', mode: 'light', swatch: ['#b8912f', '#f7f1e6'],
    vars: {
      '--bg': '#f7f1e6', '--surface': '#fffdf8', '--surface-2': '#f2e9d6',
      '--ink': '#3a3122', '--ink-soft': '#7c6c4f', '--line': 'rgba(184,145,47,.28)',
      '--accent': '#b8912f', '--accent-2': '#d8b45e', '--accent-ink': '#2a2113', '--deep': '#463a22',
      '--hero-overlay': 'linear-gradient(180deg, rgba(40,30,10,.12), rgba(40,30,10,.58))',
      '--photo-filter': 'saturate(1.03) contrast(1.02) sepia(.05)',
      '--font-display': "'Fraunces', Georgia, serif", '--font-serif': "'Cormorant Garamond', Georgia, serif",
      '--font-script': "'Pinyon Script', cursive", '--font-sans': "'Jost', system-ui, sans-serif",
    },
  },
  {
    id: 'noir', name: 'Monochrome Noir', mode: 'dark', swatch: ['#e8e8ea', '#0a0a0b'],
    vars: {
      '--bg': '#0a0a0b', '--surface': '#141417', '--surface-2': '#1d1d21',
      '--ink': '#f2f2f2', '--ink-soft': '#a6a6aa', '--line': 'rgba(255,255,255,.14)',
      '--accent': '#eaeaec', '--accent-2': '#b6b6ba', '--accent-ink': '#0a0a0b', '--deep': '#050506',
      '--hero-overlay': 'linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.72))',
      '--photo-filter': 'grayscale(1) contrast(1.06) brightness(.98)',
      '--font-display': "'Poppins', system-ui, sans-serif", '--font-serif': "'Cormorant Garamond', Georgia, serif",
      '--font-script': "'Alex Brush', cursive", '--font-sans': "'Poppins', system-ui, sans-serif",
    },
  },
  {
    id: 'rose', name: 'Dusty Rose', mode: 'light', swatch: ['#b06b74', '#f4e9e9'],
    vars: {
      '--bg': '#f4e9e9', '--surface': '#fdf6f6', '--surface-2': '#efdcdd',
      '--ink': '#4a2f34', '--ink-soft': '#8a6169', '--line': 'rgba(176,107,116,.3)',
      '--accent': '#b06b74', '--accent-2': '#cf9aa2', '--accent-ink': '#fffafa', '--deep': '#6d3f48',
      '--hero-overlay': 'linear-gradient(180deg, rgba(70,30,40,.14), rgba(70,30,40,.52))',
      '--photo-filter': 'saturate(1.04) brightness(1.02) contrast(1.0)',
      '--font-display': "'Cormorant Upright', Georgia, serif", '--font-serif': "'Cormorant Garamond', Georgia, serif",
      '--font-script': "'Alex Brush', cursive", '--font-sans': "'Jost', system-ui, sans-serif",
    },
  },
  {
    id: 'forest', name: 'Forest Green', mode: 'light', swatch: ['#5c7a52', '#e9efe6'],
    vars: {
      '--bg': '#e9efe6', '--surface': '#f6faf2', '--surface-2': '#dce7d5',
      '--ink': '#25301e', '--ink-soft': '#55684c', '--line': 'rgba(92,122,82,.32)',
      '--accent': '#5c7a52', '--accent-2': '#86a074', '--accent-ink': '#f6faf2', '--deep': '#2f4229',
      '--hero-overlay': 'linear-gradient(180deg, rgba(20,40,20,.18), rgba(20,40,20,.56))',
      '--photo-filter': 'saturate(1.05) contrast(1.02)',
      '--font-display': "'Lora', Georgia, serif", '--font-serif': "'Lora', Georgia, serif",
      '--font-script': "'Alex Brush', cursive", '--font-sans': "'Jost', system-ui, sans-serif",
    },
  },
  {
    id: 'navy', name: 'Royal Navy', mode: 'dark', swatch: ['#c9a24b', '#0e1730'],
    vars: {
      '--bg': '#0e1730', '--surface': '#16223f', '--surface-2': '#1d2c4e',
      '--ink': '#eef1f8', '--ink-soft': '#a7b2c8', '--line': 'rgba(201,162,75,.32)',
      '--accent': '#c9a24b', '--accent-2': '#e0c47f', '--accent-ink': '#0e1730', '--deep': '#0a1122',
      '--hero-overlay': 'linear-gradient(180deg, rgba(8,14,30,.32), rgba(8,14,30,.76))',
      '--photo-filter': 'saturate(1.02) contrast(1.03) brightness(.96)',
      '--font-display': "'Marcellus', Georgia, serif", '--font-serif': "'Cormorant Garamond', Georgia, serif",
      '--font-script': "'Pinyon Script', cursive", '--font-sans': "'Jost', system-ui, sans-serif",
    },
  },
  {
    id: 'champagne', name: 'Blush Champagne', mode: 'light', swatch: ['#c2a173', '#f6efe8'],
    vars: {
      '--bg': '#f6efe8', '--surface': '#fdf8f3', '--surface-2': '#efe3d5',
      '--ink': '#4a3c34', '--ink-soft': '#897463', '--line': 'rgba(200,169,126,.32)',
      '--accent': '#c2a173', '--accent-2': '#ddc2a0', '--accent-ink': '#3a2e22', '--deep': '#6a5544',
      '--hero-overlay': 'linear-gradient(180deg, rgba(60,45,30,.12), rgba(60,45,30,.46))',
      '--photo-filter': 'brightness(1.04) saturate(1.02) contrast(.99)',
      '--font-display': "'Tenor Sans', system-ui, sans-serif", '--font-serif': "'Cormorant Garamond', Georgia, serif",
      '--font-script': "'Pinyon Script', cursive", '--font-sans': "'Jost', system-ui, sans-serif",
    },
  },
]

const STORE_KEY = 'lavelle-royale-theme'
const active = ref('ivory') // state modul, dibagi ke semua konsumen

export function useTheme() {
  const theme = computed(() => THEMES.find((t) => t.id === active.value) || THEMES[0])
  const styleVars = computed(() => theme.value.vars)
  const isDark = computed(() => theme.value.mode === 'dark')

  function setTheme(id) {
    if (!THEMES.some((t) => t.id === id)) return
    active.value = id
    if (typeof localStorage !== 'undefined') { try { localStorage.setItem(STORE_KEY, id) } catch { /* diabaikan */ } }
  }
  function initTheme() {
    if (typeof window === 'undefined') return
    let pick = null
    try { pick = new URLSearchParams(location.search).get('theme') || localStorage.getItem(STORE_KEY) } catch { pick = null }
    if (pick && THEMES.some((t) => t.id === pick)) active.value = pick
  }

  return { THEMES, active, theme, styleVars, isDark, setTheme, initTheme }
}
