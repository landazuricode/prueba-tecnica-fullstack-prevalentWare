import { auth } from './index';

export type Session = typeof auth.$Infer.Session;

// Extender el tipo de usuario para incluir el campo role
export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extender el tipo de sesión para incluir el usuario con rol
export interface SessionWithRole {
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string;
    userAgent?: string;
    userId: string;
    user: UserWithRole;
  };
  user: UserWithRole;
}
