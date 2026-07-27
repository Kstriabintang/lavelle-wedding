// Panggil Pages Function untuk mengaktifkan subdomain undangan saat Terbitkan.
// Berjalan same-origin di portal.lavelle.my.id → /api/activate-domain.
export async function activateDomain(slug) {
  try {
    const r = await fetch('/api/activate-domain', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    return await r.json().catch(() => ({ ok: false }))
  } catch { return { ok: false } }
}
