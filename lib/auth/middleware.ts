import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from './index';
import { UserRole } from '../../types';

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string;
  };
}

export interface AuthMiddlewareOptions {
  requiredRoles?: UserRole[];
  allowSelfAccess?: boolean;
  resourceUserId?: string;
}

export interface AuthResult {
  success: boolean;
  session?: AuthSession;
  error?: {
    message: string;
    statusCode: number;
  };
}

/**
 * Middleware de autenticación y autorización
 * Verifica la sesión del usuario y valida los permisos según el rol
 */
export async function authMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  options: AuthMiddlewareOptions = {}
): Promise<AuthResult> {
  const {
    requiredRoles = [],
    allowSelfAccess = false,
    resourceUserId,
  } = options;

  try {
    // Verificar autenticación
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return {
        success: false,
        error: {
          message: 'No autorizado',
          statusCode: 401,
        },
      };
    }

    const userSession: AuthSession = {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as any).role || 'ADMIN',
        image: session.user.image,
      },
    };

    // Si no se requieren roles específicos, solo verificar autenticación
    if (requiredRoles.length === 0) {
      return {
        success: true,
        session: userSession,
      };
    }

    // Verificar si el usuario tiene uno de los roles requeridos
    const hasRequiredRole = requiredRoles.includes(userSession.user.role);

    if (!hasRequiredRole) {
      // Si se permite acceso propio y el usuario está accediendo a su propio recurso
      if (
        allowSelfAccess &&
        resourceUserId &&
        userSession.user.id === resourceUserId
      ) {
        return {
          success: true,
          session: userSession,
        };
      }

      return {
        success: false,
        error: {
          message: 'Acceso denegado',
          statusCode: 403,
        },
      };
    }

    return {
      success: true,
      session: userSession,
    };
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return {
      success: false,
      error: {
        message: 'Error de autenticación',
        statusCode: 401,
      },
    };
  }
}

/**
 * Wrapper para endpoints que requieren autenticación
 */
export function withAuth(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: AuthSession
  ) => Promise<void>,
  options: AuthMiddlewareOptions = {}
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authResult = await authMiddleware(req, res, options);

    if (!authResult.success) {
      return res.status(authResult.error!.statusCode).json({
        message: authResult.error!.message,
        error: authResult.error!.message,
      });
    }

    return handler(req, res, authResult.session!);
  };
}

/**
 * Wrapper para endpoints que requieren rol de administrador
 */
export function withAdminAuth(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: AuthSession
  ) => Promise<void>
) {
  return withAuth(handler, { requiredRoles: ['ADMIN'] });
}

/**
 * Wrapper para endpoints que requieren autenticación pero permiten todos los roles
 */
export function withUserAuth(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: AuthSession
  ) => Promise<void>
) {
  return withAuth(handler, { requiredRoles: ['ADMIN', 'USER'] });
}

/**
 * Verificar si un usuario tiene permisos para acceder a un recurso
 */
export function hasPermission(
  userRole: UserRole,
  requiredRoles: UserRole[],
  allowSelfAccess: boolean = false,
  userId?: string,
  resourceUserId?: string
): boolean {
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
}

/**
 * Obtener el nivel de permisos de un rol
 */
export function getRolePermissions(role: UserRole): {
  canManageUsers: boolean;
  canCreateMovements: boolean;
  canViewReports: boolean;
  canViewMovements: boolean;
  canManageOwnProfile: boolean;
} {
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
}
