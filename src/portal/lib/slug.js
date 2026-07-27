// Slug undangan = subdomain klien (nama-klien.lavelle.my.id). Harus url-safe & unik.
// Daftar RESERVED = subdomain milik sistem yang tak boleh dipakai sebagai slug.
export const RESERVED = ['portal', 'www', 'api', 'admin', 'mail', 'app', 'assets', 'cdn', 'fuji-ryan']

export function slugify(input) {
  return String(input || '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function validateSlug(input) {
  const s = String(input || '')
  if (s.length < 3 || s.length > 40) return { ok: false, error: 'Slug 3–40 karakter.' }
  if (!/^[a-z0-9-]+$/.test(s)) return { ok: false, error: 'Hanya huruf kecil, angka, dan tanda hubung.' }
  if (/^-|-$/.test(s)) return { ok: false, error: 'Tak boleh diawali/diakhiri tanda hubung.' }
  if (RESERVED.includes(s)) return { ok: false, error: 'Slug ini dipakai sistem, pilih lain.' }
  return { ok: true }
}
