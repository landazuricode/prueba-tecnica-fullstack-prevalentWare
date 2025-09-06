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

// Helper function to check if user has required roles
const hasRequiredRoles = (
  userRole: UserRole,
  requiredRoles: UserRole[]
): boolean => requiredRoles.length === 0 || requiredRoles.includes(userRole);

// Helper function to check if user has required permissions
const hasRequiredPermissions = (
  userPermissions: Record<string, boolean>,
  requiredPermissions: Record<string, boolean | undefined>
): boolean =>
  Object.entries(requiredPermissions).every(([permission, required]) => {
    if (required === undefined) return true;
    return userPermissions[permission] === required;
  });

// Helper function to render fallback or null
const renderFallback = (
  showFallback: boolean,
  fallback: ReactNode
): ReactNode => (showFallback ? <>{fallback}</> : null);

// Helper function to render loading state
const renderLoading = (showFallback: boolean): ReactNode =>
  showFallback ? (
    <div className='animate-pulse bg-gray-200 rounded h-4 w-full' />
  ) : null;

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
    return renderLoading(showFallback);
  }

  // Si no hay permisos, no mostrar nada
  if (!permissions || !role) {
    return renderFallback(showFallback, fallback);
  }

  // Verificar roles requeridos
  if (!hasRequiredRoles(role, requiredRoles)) {
    return renderFallback(showFallback, fallback);
  }

  // Verificar permisos específicos
  if (!hasRequiredPermissions(permissions, requiredPermissions)) {
    return renderFallback(showFallback, fallback);
  }

  return <>{children}</>;
};

export { PermissionGuard };
