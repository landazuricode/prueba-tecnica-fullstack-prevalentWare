'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from './client';
import type { AuthContextType, Session } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<{
    data: Session | null;
    error: Error | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener la sesión inicial
    const getInitialSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        if (sessionData?.data) {
          // Extract the session from the Better Auth response structure
          const { session } = sessionData.data;
          setSession({
            data: session as Session | null,
            error: null,
          });
        } else {
          setSession({ data: null, error: null });
        }
      } catch (error) {
        setSession({
          data: null,
          error: error instanceof Error ? error : new Error('Unknown error'),
        });
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, []);

  const signIn = async () => {
    // El inicio de sesión social de Better-Auth redirige automáticamente
    // No es necesario gestionar la actualización de la sesión aquí, ya que se gestionará al recargar la página tras la devolución de llamada de OAuth.
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/',
    });
  };

  const signOut = async () => {
    await authClient.signOut();
    setSession({ data: null, error: null });
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
