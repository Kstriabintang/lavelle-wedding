import { supabase } from './supabase.js'
import { compressImage } from './compressImage.js'

// Simpan field profil ke user_metadata (merge — tak menimpa field lain).
export async function updateProfileMeta(fields) {
  const { data: { user } } = await supabase.auth.getUser()
  const merged = { ...(user?.user_metadata || {}), ...fields }
  const { error } = await supabase.auth.updateUser({ data: merged })
  if (error) throw error
}

// Ganti password (user yang sedang login) — tanpa email.
export async function changePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}

// Unggah foto profil → storage → URL publik.
export async function uploadAvatar(file) {
  const { data: { user } } = await supabase.auth.getUser()
  const blob = await compressImage(file, { maxEdge: 400, quality: 0.86 })
  const path = `avatars/${user.id}-${Date.now().toString(36)}.jpg`
  const { error } = await supabase.storage.from('invite-assets').upload(path, blob, { contentType: 'image/jpeg', upsert: true })
  if (error) throw error
  return supabase.storage.from('invite-assets').getPublicUrl(path).data.publicUrl
}
