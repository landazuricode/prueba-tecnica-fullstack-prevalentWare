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

// Tipos para movimientos
export interface Movement {
  id: string;
  concept: string;
  amount: number;
  date: Date;
  type: 'INCOME' | 'EXPENSE';
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMovementData {
  concept: string;
  amount: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}
