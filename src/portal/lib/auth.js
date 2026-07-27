import { supabase } from './supabase.js'

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email: (email || '').trim(), password })
}
export async function signOut() { return supabase.auth.signOut() }

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session || null
}

// Profil + peran user sekarang (admin/staff)
export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('id,email,name,role').eq('id', user.id).maybeSingle()
  return data || { id: user.id, email: user.email, name: (user.email || '').split('@')[0], role: 'staff' }
}

export function onAuthChange(cb) {
  return supabase.auth.onAuthStateChange((_event, session) => cb(session))
}
