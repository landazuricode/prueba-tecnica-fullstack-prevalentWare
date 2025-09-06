'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from './client';
import type { AuthContextType } from '../../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<{ data: any; error: any } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener la sesión inicial
    const getInitialSession = async () => {
      try {
        const session = await authClient.getSession();
        setSession(session);
      } catch (error) {
        console.error('Error getting session:', error);
        setSession({ data: null, error: null });
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, []);

  const signIn = async () => {
    try {
      // El inicio de sesión social de Better-Auth redirige automáticamente
      // No es necesario gestionar la actualización de la sesión aquí, ya que se gestionará al recargar la página tras la devolución de llamada de OAuth.
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      setSession({ data: null, error: null });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
