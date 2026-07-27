// Pages Function: aktifkan subdomain undangan saat Terbitkan.
// Di-deploy BERSAMA project Pages (pakai token Pages). PENGAMAN: project di-HARDCODE
// 'lavelle-portal' → mustahil menyentuh project lain. Verifikasi slug = published dulu.
const PROJECT = 'lavelle-portal'
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json', ...CORS } })

export function onRequestOptions() { return new Response(null, { headers: CORS }) }

export async function onRequestPost(context) {
  const { request, env } = context
  if (!env.CF_TOKEN || !env.CF_ACCOUNT) return json({ error: 'belum dikonfigurasi' }, 500)

  let slug
  try { ({ slug } = await request.json()) } catch { return json({ error: 'bad json' }, 400) }
  slug = String(slug || '').toLowerCase()
  if (!/^[a-z0-9-]{3,40}$/.test(slug)) return json({ error: 'invalid slug' }, 400)

  // 1) Slug wajib = undangan PUBLISHED di Supabase (cegah penyalahgunaan)
  const chk = await fetch(`${env.SUPABASE_URL}/rest/v1/invites?slug=eq.${slug}&status=eq.published&select=slug`, {
    headers: { apikey: env.SUPABASE_ANON, Authorization: `Bearer ${env.SUPABASE_ANON}` },
  })
  const rows = await chk.json().catch(() => null)
  if (!Array.isArray(rows) || !rows.length) return json({ error: 'bukan undangan published' }, 404)

  // 2) Tambah custom domain HANYA ke project lavelle-portal
  const r = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT}/pages/projects/${PROJECT}/domains`,
    { method: 'POST', headers: { Authorization: `Bearer ${env.CF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: `${slug}.lavelle.my.id` }) },
  )
  const res = await r.json().catch(() => ({}))
  const already = res.errors && res.errors.some((e) => /already|exist/i.test(e.message || ''))
  if (res.success || already) return json({ ok: true, domain: `${slug}.lavelle.my.id` })
  return json({ ok: false, error: res.errors || 'gagal' }, 502)
}
