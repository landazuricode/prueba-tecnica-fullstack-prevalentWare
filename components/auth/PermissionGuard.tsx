import { ReactNode } from 'react';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { UserRole } from '@/types';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions?: {
    canManageUsers?: boolean;
    canCreateMovements?: boolean;
    canViewReports?: boolean;
    canViewMovements?: boolean;
    canManageOwnProfile?: boolean;
  };
  requiredRoles?: UserRole[];
  fallback?: ReactNode;
  showFallback?: boolean;
}

/**
 * Componente que verifica permisos específicos antes de renderizar contenido
 */
const PermissionGuard = ({
  children,
  requiredPermissions = {},
  requiredRoles = [],
  fallback = null,
  showFallback = false,
}: PermissionGuardProps) => {
  const { permissions, role, isLoading } = useUserRole();

  // Mostrar loading mientras se cargan los permisos
  if (isLoading) {
    return showFallback ? (
      <div className='animate-pulse bg-gray-200 rounded h-4 w-full' />
    ) : null;
  }

  // Si no hay permisos, no mostrar nada
  if (!permissions || !role) {
    return showFallback ? <>{fallback}</> : null;
  }

  // Verificar roles requeridos
  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return showFallback ? <>{fallback}</> : null;
  }

  // Verificar permisos específicos
  const hasRequiredPermissions = Object.entries(requiredPermissions).every(
    ([permission, required]) => {
      if (required === undefined) return true;
      return permissions[permission as keyof typeof permissions] === required;
    }
  );

  if (!hasRequiredPermissions) {
    return showFallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default PermissionGuard;
