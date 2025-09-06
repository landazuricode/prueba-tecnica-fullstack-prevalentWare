import { auth } from './index';

// Re-exportar tipos centralizados para mantener compatibilidad
export type Session = typeof auth.$Infer.Session;
export type {
  UserWithRole,
  SessionWithRole,
  Movement,
  CreateMovementData,
} from '@/types';
