import { ref } from 'vue'
import { supabase } from './supabase.js'
import { DEFAULT_PORTAL_BG } from '../data/portalBackgrounds.js'

// session: undefined = belum dicek, null = belum login, object = login.
export const session = ref(undefined)
export const profile = ref(null)
// Wallpaper latar portal aktif (reaktif → PortalBackground ikut; live-preview di Pengaturan).
export const portalBg = ref(DEFAULT_PORTAL_BG)
export function setPortalBg(id) { portalBg.value = id }

async function loadProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { profile.value = null; return }
  const { data: row } = await supabase.from('profiles').select('id,email,name,role').eq('id', user.id).maybeSingle()
  const m = user.user_metadata || {}
  profile.value = {
    id: user.id,
    email: user.email,
    role: (row && row.role) || 'staff',
    name: m.name || (row && row.name) || (user.email || '').split('@')[0],
    contact: m.contact || '',
    avatar: m.avatar || '',
    themePref: m.theme_pref || 'marun-emas',
    portalBg: m.bg_pref || DEFAULT_PORTAL_BG,
  }
  portalBg.value = profile.value.portalBg
}

// Muat ulang profil (dipanggil setelah simpan pengaturan)
export async function refreshProfile() { await loadProfile() }

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
