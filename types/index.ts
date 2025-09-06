import { MovementType, UserRole } from './constants';

// =============================================================================
// TIPOS BASE
// =============================================================================

export type {
  UserRole,
  MovementType,
  ButtonVariant,
  ButtonSize,
  IconPosition,
} from './constants';

// =============================================================================
// TIPOS DE USUARIO
// =============================================================================

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseUser {
  role: UserRole;
}

export interface UserWithRole extends BaseUser {
  role: UserRole;
}

// =============================================================================
// TIPOS DE SESIÓN
// =============================================================================

export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
  user: UserWithRole;
}

export interface SessionWithRole {
  session: Session;
  user: UserWithRole;
}

// =============================================================================
// TIPOS DE MOVIMIENTOS
// =============================================================================

export interface Movement {
  id: string;
  concept: string;
  amount: number;
  date: Date;
  type: MovementType;
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
  type: MovementType;
}

export interface UpdateMovementData extends Partial<CreateMovementData> {
  id: string;
}

// =============================================================================
// TIPOS DE API
// =============================================================================

export interface ApiResponse<T = any> {
  data: T;
  message: string;
  error?: string;
}

export interface ApiError {
  message: string;
  error: string;
  statusCode?: number;
}

// =============================================================================
// TIPOS DE COMPONENTES
// =============================================================================

export interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export interface MenuItem {
  href: string;
  label: string;
  icon: React.ReactElement;
  section: string;
  target?: string;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

// =============================================================================
// TIPOS DE HOOKS
// =============================================================================

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export interface UseUserRoleReturn {
  role: UserRole | null;
  user: UserWithRole | null;
  isLoading: boolean;
  isAdmin: boolean;
  isUser: boolean;
  permissions?: {
    canManageUsers: boolean;
    canCreateMovements: boolean;
    canViewReports: boolean;
    canViewMovements: boolean;
    canManageOwnProfile: boolean;
  } | null;
}

// =============================================================================
// TIPOS DE AUTENTICACIÓN
// =============================================================================

export interface AuthContextType {
  session: { data: Session | null; error: any } | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

// =============================================================================
// TIPOS DE FORMULARIOS
// =============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface MovementFormData {
  concept: string;
  amount: number;
  date: string;
  type: MovementType;
}

// =============================================================================
// TIPOS DE REPORTES
// =============================================================================

export interface ReportData {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  movementsByType: {
    income: number;
    expense: number;
  };
  movementsByMonth: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
}

// =============================================================================
// TIPOS DE NAVEGACIÓN
// =============================================================================

export interface NavigationCard {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  bgPattern: string;
  iconColor: string;
  available: boolean;
  target?: string;
}

// =============================================================================
// TIPOS DE UTILIDADES
// =============================================================================

export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[];

export interface FormatOptions {
  locale?: string;
  currency?: string;
  dateFormat?: Intl.DateTimeFormatOptions;
}

// =============================================================================
// RE-EXPORTAR TIPOS DE PRISMA
// =============================================================================

export type {
  UserWithMovements,
  MovementWithUser,
  MovementCreateInput,
  MovementUpdateInput,
  UserCreateInput,
  UserUpdateInput,
  PaginationParams,
  MovementFilters,
  UserFilters,
  MovementStats,
  MonthlyStats,
  UserStats,
} from './prisma';
