
import { useState, useEffect } from 'react'
import { supabaseAuth, getCurrentUser } from '@/lib/supabase/supabaseClientAuth'
import { supabaseApp, getAppData } from '@/lib/supabase/supabaseClientApp'
import type { User } from '@supabase/supabase-js'

export const useSupabaseClients = () => {
  const [user, setUser] = useState<User | null>(null)
  const [appData, setAppData] = useState<any>(null)

  useEffect(() => {
    // Subscribe to auth changes from the auth project
    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    // Initial user load
    getCurrentUser().then(currentUser => setUser(currentUser))

    return () => subscription.unsubscribe()
  }, [])

  // Example of fetching app data when user is authenticated
  useEffect(() => {
    if (user) {
      getAppData(user.id).then(data => setAppData(data))
    }
  }, [user])

  return {
    user,
    appData,
    authClient: supabaseAuth,
    appClient: supabaseApp
  }
}
