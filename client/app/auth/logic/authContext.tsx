import { createContext, ReactNode, useContext } from 'react';
import { useAuth } from './useAuth';

type AuthContextType = {
  id_token: string;
  refresh_token: string;
  nickname: string | null;
  handleLogin: () => never;
  handleSignUp: () => never;
  handleLogout: (id_token: string, refresh_token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
