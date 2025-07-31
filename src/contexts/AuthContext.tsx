import { createContext, useContext, ReactNode, useEffect } from 'react';
import { User, SignupData, AuthContextProps } from '@/types';
import { useUser } from '@stackframe/stack';
import { stackClientApp } from '@/stack';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const stackUser = useUser();

  // Convert Stack user to our User type
  const user: User | null = stackUser ? {
    id: stackUser.id,
    email: stackUser.primaryEmail || '',
    name: stackUser.displayName || undefined,
    avatar: stackUser.profileImageUrl || undefined,
  } : null;

  // Sync user data with Supabase when Stack user changes
  useEffect(() => {
    const syncUserWithSupabase = async () => {
      if (stackUser) {
        // Upsert user profile in Supabase
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: stackUser.id,
            email: stackUser.primaryEmail,
            name: stackUser.displayName,
            avatar_url: stackUser.profileImageUrl,
            updated_at: new Date().toISOString(),
          });
        
        if (error) {
          console.error('Error syncing user with Supabase:', error);
        }
      }
    };

    syncUserWithSupabase();
  }, [stackUser]);

  const login = async (email: string, password: string) => {
    await stackClientApp.signInWithCredential({ email, password });
  };

  const signup = async (data: SignupData) => {
    const { email, password, name } = data;
    await stackClientApp.signUpWithCredential({ 
      email, 
      password,
      displayName: name 
    });
  };

  const logout = async () => {
    if (stackUser) {
      await stackUser.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading: false, // Stack handles loading internally
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
