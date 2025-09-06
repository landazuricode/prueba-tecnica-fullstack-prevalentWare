// =============================================================================
// CONSTANTES DE TIPOS - EVITAR MAGIC STRINGS
// =============================================================================

// =============================================================================
// ROLES DE USUARIO
// =============================================================================

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// =============================================================================
// TIPOS DE MOVIMIENTO
// =============================================================================

export const MOVEMENT_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export type MovementType = (typeof MOVEMENT_TYPES)[keyof typeof MOVEMENT_TYPES];

// =============================================================================
// VARIANTES DE BOTÓN
// =============================================================================

export const BUTTON_VARIANTS = {
  DEFAULT: 'default',
  DESTRUCTIVE: 'destructive',
  OUTLINE: 'outline',
  SECONDARY: 'secondary',
  GHOST: 'ghost',
  LINK: 'link',
} as const;

export type ButtonVariant =
  (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];

// =============================================================================
// TAMAÑOS DE BOTÓN
// =============================================================================

export const BUTTON_SIZES = {
  DEFAULT: 'default',
  SM: 'sm',
  LG: 'lg',
  ICON: 'icon',
} as const;

export type ButtonSize = (typeof BUTTON_SIZES)[keyof typeof BUTTON_SIZES];

// =============================================================================
// POSICIONES DE ÍCONO
// =============================================================================

export const ICON_POSITIONS = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export type IconPosition = (typeof ICON_POSITIONS)[keyof typeof ICON_POSITIONS];

// =============================================================================
// CÓDIGOS DE ESTADO HTTP
// =============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// =============================================================================
// MENSAJES DE API
// =============================================================================

export const API_MESSAGES = {
  SUCCESS: {
    USER_CREATED: 'Usuario creado exitosamente',
    USER_UPDATED: 'Usuario actualizado exitosamente',
    USER_DELETED: 'Usuario eliminado exitosamente',
    USER_FOUND: 'Usuario obtenido exitosamente',
    MOVEMENT_CREATED: 'Movimiento creado exitosamente',
    MOVEMENT_UPDATED: 'Movimiento actualizado exitosamente',
    MOVEMENT_DELETED: 'Movimiento eliminado exitosamente',
    MOVEMENTS_FOUND: 'Movimientos obtenidos exitosamente',
    REPORT_GENERATED: 'Reporte generado exitosamente',
  },
  ERROR: {
    UNAUTHORIZED: 'No autorizado',
    FORBIDDEN: 'Acceso denegado',
    NOT_FOUND: 'Recurso no encontrado',
    VALIDATION_ERROR: 'Error de validación',
    SERVER_ERROR: 'Error interno del servidor',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    USER_NOT_FOUND: 'Usuario no encontrado',
    MOVEMENT_NOT_FOUND: 'Movimiento no encontrado',
    INVALID_MOVEMENT_TYPE: 'Tipo de movimiento inválido',
    MISSING_FIELDS: 'Faltan campos requeridos',
    INVALID_ROLE: 'Rol de usuario inválido',
  },
} as const;

// =============================================================================
// VALIDACIONES
// =============================================================================

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s-()]+$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 100,
  MAX_CONCEPT_LENGTH: 255,
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999999.99,
} as const;

// =============================================================================
// CONFIGURACIÓN DE PAGINACIÓN
// =============================================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// =============================================================================
// CONFIGURACIÓN DE FORMATEO
// =============================================================================

export const FORMAT_CONFIG = {
  CURRENCY: {
    LOCALE: 'es-CO',
    CURRENCY: 'COP',
  },
  DATE: {
    LOCALE: 'es-CO',
    OPTIONS: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    } as Intl.DateTimeFormatOptions,
  },
} as const;
