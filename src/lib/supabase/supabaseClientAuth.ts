
import { createClient } from '@supabase/supabase-js'

// Auth-specific Supabase client
const supabaseUrl = import.meta.env.VITE_AUTH_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_AUTH_SUPABASE_ANON_KEY

export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for auth
export const getCurrentUser = async () => {
  const { data: { user } } = await supabaseAuth.auth.getUser()
  return user
}
