import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth/client';
import type { UserWithRole, UserRole, UseUserRoleReturn } from '@/types';
import { getRolePermissions } from '@/lib/auth/client-utils';

export const useUserRole = (): UseUserRoleReturn => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserWithRole | null>(null);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const session = await authClient.getSession();

        if (session.data?.user) {
          const userRole = (session.data.user as UserWithRole).role || 'ADMIN';
          setRole(userRole);
          setUser(session.data.user as UserWithRole);
        } else {
          setRole(null);
          setUser(null);
        }
      } catch {
        setRole(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUserRole();
  }, []);

  const permissions = role ? getRolePermissions(role) : null;

  return {
    role,
    user,
    isLoading,
    isAdmin: role === 'ADMIN',
    isUser: role === 'USER',
    permissions,
  };
};
