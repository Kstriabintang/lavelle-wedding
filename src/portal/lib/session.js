import { ref } from 'vue'
import { supabase } from './supabase.js'

// session: undefined = belum dicek, null = belum login, object = login.
export const session = ref(undefined)
export const profile = ref(null)

async function loadProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { profile.value = null; return }
  const { data } = await supabase.from('profiles').select('id,email,name,role').eq('id', user.id).maybeSingle()
  profile.value = data || { id: user.id, email: user.email, name: (user.email || '').split('@')[0], role: 'staff' }
}

let started = false
export async function initSession() {
  if (started) { return }
  started = true
  const { data } = await supabase.auth.getSession()
  session.value = data.session || null
  if (session.value) await loadProfile()
  supabase.auth.onAuthStateChange(async (_e, s) => {
    session.value = s || null
    if (s) await loadProfile(); else profile.value = null
  })
}
