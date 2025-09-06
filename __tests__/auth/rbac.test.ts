import { getRolePermissions, hasPermission } from '../../lib/auth/middleware';
import { UserRole } from '../../types';

describe('RBAC System', () => {
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

  describe('hasPermission', () => {
    it('should return true when user has required role', () => {
      const result = hasPermission('ADMIN', ['ADMIN', 'USER']);
      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      const result = hasPermission('USER', ['ADMIN']);
      expect(result).toBe(false);
    });

    it('should return true for self-access when allowed', () => {
      const result = hasPermission(
        'USER',
        ['ADMIN'],
        true, // allowSelfAccess
        'user123',
        'user123' // same user
      );
      expect(result).toBe(true);
    });

    it('should return false for self-access when not allowed', () => {
      const result = hasPermission(
        'USER',
        ['ADMIN'],
        false, // allowSelfAccess
        'user123',
        'user123' // same user
      );
      expect(result).toBe(false);
    });

    it('should return false for self-access with different users', () => {
      const result = hasPermission(
        'USER',
        ['ADMIN'],
        true, // allowSelfAccess
        'user123',
        'user456' // different user
      );
      expect(result).toBe(false);
    });
  });
});
