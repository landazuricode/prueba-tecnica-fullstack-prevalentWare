import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from './index';
import { UserRole } from '@/types';

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
 * Extraer datos del usuario de la sesión
 */
const extractUserData = (
  session: Record<string, unknown>
): AuthSession['user'] => {
  const user = session?.user as Record<string, unknown> | undefined;
  return {
    id: user?.id as string,
    name: user?.name as string,
    email: user?.email as string,
    role: (user?.role as UserRole) || 'ADMIN',
    image: (user?.image as string) || '',
  };
};

/**
 * Obtener la sesión del usuario desde la request
 */
const getUserSession = async (
  req: NextApiRequest
): Promise<AuthSession | null> => {
  const session = await auth.api.getSession({
    headers: req.headers as unknown as Headers,
  });

  if (!session) {
    return null;
  }

  return {
    user: extractUserData(session),
  };
};

/**
 * Verificar si el usuario tiene acceso basado en roles y permisos
 */
const checkUserAccess = (
  userSession: AuthSession,
  requiredRoles: UserRole[],
  allowSelfAccess: boolean,
  resourceUserId?: string
): AuthResult => {
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
};

/**
 * Middleware de autenticación y autorización
 * Verifica la sesión del usuario y valida los permisos según el rol
 */
export const authMiddleware = async (
  req: NextApiRequest,
  _res: NextApiResponse,
  options: AuthMiddlewareOptions = {}
): Promise<AuthResult> => {
  const {
    requiredRoles = [],
    allowSelfAccess = false,
    resourceUserId,
  } = options;

  try {
    const userSession = await getUserSession(req);

    if (!userSession) {
      return {
        success: false,
        error: {
          message: 'No autorizado',
          statusCode: 401,
        },
      };
    }

    return checkUserAccess(
      userSession,
      requiredRoles,
      allowSelfAccess,
      resourceUserId
    );
  } catch {
    return {
      success: false,
      error: {
        message: 'Error de autenticación',
        statusCode: 401,
      },
    };
  }
};

/**
 * Wrapper para endpoints que requieren autenticación
 */
export const withAuth =
  (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
      session: AuthSession
    ) => Promise<void>,
    options: AuthMiddlewareOptions = {}
  ): ((req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const authResult = await authMiddleware(req, res, options);

    if (!authResult.success) {
      return res.status(authResult.error!.statusCode).json({
        message: authResult.error!.message,
        error: authResult.error!.message,
      });
    }

    return handler(req, res, authResult.session!);
  };

/**
 * Wrapper para endpoints que requieren rol de administrador
 */
export const withAdminAuth = (
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: AuthSession
  ) => Promise<void>
): ((req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  withAuth(handler, { requiredRoles: ['ADMIN'] });

/**
 * Wrapper para endpoints que requieren autenticación pero permiten todos los roles
 */
export const withUserAuth = (
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: AuthSession
  ) => Promise<void>
): ((req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  withAuth(handler, { requiredRoles: ['ADMIN', 'USER'] });

/**
 * Verificar si un usuario tiene permisos para acceder a un recurso
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

/**
 * Obtener el nivel de permisos de un rol
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
