import { createClient } from '@supabase/supabase-js'

// URL + anon key AMAN di frontend (publik by design; data diamankan RLS).
// Service role key TIDAK PERNAH dipakai di frontend.
export const SUPABASE_URL = 'https://sfjijfxfhgakaxfoyyfc.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmamlqZnhmaGdha2F4Zm95eWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNTk3OTUsImV4cCI6MjEwMDczNTc5NX0.BaqtHujo84EPGMYrfWTFGqzZI_N48VpSoFLsspFjnsM'

export const supabase = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
})
