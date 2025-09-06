// =============================================================================
// TIPOS DE PRISMA - GENERADOS AUTOMÁTICAMENTE
// =============================================================================

import type { User, Movement } from '@prisma/client';

// =============================================================================
// TIPOS DE USUARIO CON RELACIONES
// =============================================================================

export interface UserWithMovements extends User {
  movements: Movement[];
}

// =============================================================================
// TIPOS DE MOVIMIENTO CON RELACIONES
// =============================================================================

export interface MovementWithUser extends Movement {
  user: User;
}

// =============================================================================
// TIPOS DE CONSULTAS PRISMA
// =============================================================================

export interface MovementCreateInput {
  concept: string;
  amount: number;
  date: Date;
  type: 'INCOME' | 'EXPENSE';
  userId: string;
}

export interface MovementUpdateInput {
  concept?: string;
  amount?: number;
  date?: Date;
  type?: 'INCOME' | 'EXPENSE';
}

export interface UserCreateInput {
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'USER';
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'ADMIN' | 'USER';
}

// =============================================================================
// TIPOS DE FILTROS Y PAGINACIÓN
// =============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}

export interface MovementFilters {
  type?: 'INCOME' | 'EXPENSE';
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  concept?: string;
}

export interface UserFilters {
  role?: 'ADMIN' | 'USER';
  search?: string;
}

// =============================================================================
// TIPOS DE RESPUESTAS DE CONSULTAS
// =============================================================================

export interface MovementStats {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  count: number;
}

export interface MonthlyStats {
  month: string;
  year: number;
  income: number;
  expense: number;
  net: number;
}

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  activeUsers: number;
}
