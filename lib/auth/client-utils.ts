import type { UserRole } from '@/types';

/**
 * Obtener el nivel de permisos de un rol (versión cliente)
 * Esta función es idéntica a la del middleware pero sin dependencias del servidor
 */
export const getRolePermissions = (
  role: UserRole
): {
  canManageUsers: boolean;
  canCreateMovements: boolean;
  canViewReports: boolean;
  canViewMovements: boolean;
  canManageOwnProfile: boolean;
} => {
  switch (role) {
    case 'ADMIN':
      return {
        canManageUsers: true,
        canCreateMovements: true,
        canViewReports: true,
        canViewMovements: true,
        canManageOwnProfile: true,
      };
    case 'USER':
      return {
        canManageUsers: false,
        canCreateMovements: false,
        canViewReports: false,
        canViewMovements: true,
        canManageOwnProfile: true,
      };
    default:
      return {
        canManageUsers: false,
        canCreateMovements: false,
        canViewReports: false,
        canViewMovements: false,
        canManageOwnProfile: false,
      };
  }
};

/**
 * Verificar si un usuario tiene permisos para acceder a un recurso (versión cliente)
 * Esta función es idéntica a la del middleware pero sin dependencias del servidor
 */
export const hasPermission = (
  userRole: UserRole,
  requiredRoles: UserRole[],
  allowSelfAccess: boolean = false,
  userId?: string,
  resourceUserId?: string
): boolean => {
  // Verificar si tiene uno de los roles requeridos
  if (requiredRoles.includes(userRole)) {
    return true;
  }

  // Verificar acceso propio si está permitido
  if (
    allowSelfAccess &&
    userId &&
    resourceUserId &&
    userId === resourceUserId
  ) {
    return true;
  }

  return false;
};
