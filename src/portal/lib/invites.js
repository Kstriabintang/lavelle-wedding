import { supabase } from './supabase.js'

// Daftar undangan: staff → HANYA miliknya (filter owner), admin → semua.
// (RLS mengizinkan baca published utk renderer publik, jadi filter owner wajib
//  di query dashboard agar staff tak lihat undangan published milik orang lain.)
export async function listInvites(ownerId, isAdmin) {
  let q = supabase.from('invites').select('id,slug,status,theme,data,updated_at,owner_id')
    .order('updated_at', { ascending: false })
  if (!isAdmin) q = q.eq('owner_id', ownerId)
  const { data, error } = await q
  if (error) throw error
  return data || []
}

export async function getInvite(id) {
  const { data, error } = await supabase.from('invites').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

// Renderer publik: hanya undangan berstatus published
export async function getInviteBySlug(slug) {
  const { data, error } = await supabase
    .from('invites').select('slug,status,theme,data')
    .eq('slug', slug).eq('status', 'published').maybeSingle()
  if (error) throw error
  return data
}

export async function slugTaken(slug, excludeId) {
  const { data, error } = await supabase.from('invites').select('id').eq('slug', slug)
  if (error) throw error
  return (data || []).some((r) => r.id !== excludeId)
}

export async function createInvite(slug, ownerId, initial, theme) {
  const { data, error } = await supabase.from('invites')
    .insert({ slug, owner_id: ownerId, theme: theme || 'marun-emas', data: initial || {} })
    .select().single()
  if (error) throw error
  return data
}

export async function saveInvite(id, patch) {
  const { data, error } = await supabase.from('invites')
    .update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteInvite(id) {
  const { error } = await supabase.from('invites').delete().eq('id', id)
  if (error) throw error
}

// Duplikat undangan: salin data + tema ke undangan BARU (slug otomatis, status draft).
// Foto memakai URL storage yang sama (aman; hapus asal tak merusak duplikat).
function genDupSlug() {
  return `undangan-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
}
export async function duplicateInvite(sourceId, ownerId) {
  const src = await getInvite(sourceId)
  let slug = genDupSlug()
  if (await slugTaken(slug)) slug = genDupSlug() + Math.random().toString(36).slice(2, 4)
  const data = typeof structuredClone === 'function'
    ? structuredClone(src.data || {})
    : JSON.parse(JSON.stringify(src.data || {}))
  return createInvite(slug, ownerId, data, src.theme)   // createInvite default status draft
}
