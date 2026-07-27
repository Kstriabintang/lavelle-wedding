import { supabase } from './supabase.js'
import { compressImage } from './compressImage.js'

const BUCKET = 'invite-assets'

// Unggah 1 foto: kompres → upload ke storage → kembalikan URL publik (https).
export async function uploadPhoto(inviteId, key, file) {
  const blob = await compressImage(file, { maxEdge: 1600, quality: 0.82 })
  const path = `${inviteId}/${key}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.jpg`
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg', upsert: true })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

// Unggah audio musik (mp3)
export async function uploadMusic(inviteId, file) {
  const path = `${inviteId}/music-${Date.now().toString(36)}.mp3`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: 'audio/mpeg', upsert: true })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
