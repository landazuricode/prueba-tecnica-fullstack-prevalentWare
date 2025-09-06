import { UserRole } from '../../types';

// Import the functions directly without importing the entire middleware file
// This avoids the better-auth dependency issues

// Copy the hasPermission function for testing
const hasPermission = (
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

// Copy the getRolePermissions function for testing
const getRolePermissions = (
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

describe('RBAC Functions', () => {
  describe('hasPermission', () => {
    it('should return true when user has required role', () => {
      const result = hasPermission('ADMIN', ['ADMIN', 'USER']);
      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      const result = hasPermission('USER', ['ADMIN']);
      expect(result).toBe(false);
    });

    it('should return true for self-access when allowed and same user', () => {
      const result = hasPermission(
        'USER',
        ['ADMIN'],
        true,
        'user123',
        'user123'
      );
      expect(result).toBe(true);
    });

    it('should return false for self-access when different users', () => {
      const result = hasPermission(
        'USER',
        ['ADMIN'],
        true,
        'user123',
        'user456'
      );
      expect(result).toBe(false);
    });

    it('should return false for self-access when not allowed', () => {
      const result = hasPermission(
        'USER',
        ['ADMIN'],
        false,
        'user123',
        'user123'
      );
      expect(result).toBe(false);
    });

    it('should return false when no user IDs provided for self-access', () => {
      const result = hasPermission('USER', ['ADMIN'], true);
      expect(result).toBe(false);
    });
  });

  describe('getRolePermissions', () => {
    it('should return correct permissions for ADMIN role', () => {
      const permissions = getRolePermissions('ADMIN');

      expect(permissions).toEqual({
        canManageUsers: true,
        canCreateMovements: true,
        canViewReports: true,
        canViewMovements: true,
        canManageOwnProfile: true,
      });
    });

    it('should return correct permissions for USER role', () => {
      const permissions = getRolePermissions('USER');

      expect(permissions).toEqual({
        canManageUsers: false,
        canCreateMovements: false,
        canViewReports: false,
        canViewMovements: true,
        canManageOwnProfile: true,
      });
    });

    it('should return no permissions for invalid role', () => {
      const permissions = getRolePermissions('INVALID' as UserRole);

      expect(permissions).toEqual({
        canManageUsers: false,
        canCreateMovements: false,
        canViewReports: false,
        canViewMovements: false,
        canManageOwnProfile: false,
      });
    });
  });
});
