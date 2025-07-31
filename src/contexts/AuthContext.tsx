import { createContext, useContext, useEffect, useState } from 'react';
import { User, SignupData, AuthContextProps } from '@/types';
import { stackClientApp } from '@/stack';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Stack auth state listener
  useEffect(() => {
    const unsubscribe = stackClientApp.useUser((stackUser) => {
      if (stackUser) {
        // Map Stack user to your User type
        setUser({
          id: stackUser.id,
          email: stackUser.primaryEmail || '',
          name: stackUser.displayName || undefined,
          avatar: stackUser.profileImageUrl || undefined,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    await stackClientApp.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
