
import { createClient } from '@supabase/supabase-js'

// App-specific Supabase client
const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY

export const supabaseApp = createClient(supabaseUrl, supabaseAnonKey)

// Example of an app-specific function
export const getAppData = async (userId: string) => {
  const { data, error } = await supabaseApp
    .from('app_data')
    .select('*')
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}
