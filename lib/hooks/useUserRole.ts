import { useState, useEffect } from 'react';
import { authClient } from '../auth/client';
import { UserWithRole } from '../auth/types';

export const useUserRole = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserWithRole | null>(null);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const session = await authClient.getSession();

        if (session.data?.user) {
          const userRole = (session.data.user as any).role || 'ADMIN';
          setRole(userRole);
          setUser(session.data.user as UserWithRole);
        } else {
          setRole(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting user role:', error);
        setRole(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUserRole();
  }, []);

  return {
    role,
    user,
    isLoading,
    isAdmin: role === 'ADMIN',
    isUser: role === 'USER',
  };
};
