import { supabase } from './supabase.js'

// Daftar undangan (RLS: staff → miliknya, admin → semua)
export async function listInvites() {
  const { data, error } = await supabase
    .from('invites').select('id,slug,status,theme,data,updated_at')
    .order('updated_at', { ascending: false })
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

export async function createInvite(slug, ownerId, initial) {
  const { data, error } = await supabase.from('invites')
    .insert({ slug, owner_id: ownerId, theme: 'marun-emas', data: initial || {} })
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
