import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión Financiera',
      version: '1.0.0',
      description:
        'API para gestión de usuarios, movimientos financieros y reportes',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'jlandazuri73@gmail.com',
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_URL + '/api'
            : 'http://localhost:3000/api',
        description:
          process.env.NODE_ENV === 'production'
            ? 'Servidor de Producción'
            : 'Servidor de Desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'better-auth.session_token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del usuario',
              example: 'clx1234567890abcdef',
            },
            name: {
              type: 'string',
              description: 'Nombre completo del usuario',
              example: 'Juan Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del usuario',
              example: 'juan.perez@ejemplo.com',
            },
            phone: {
              type: 'string',
              nullable: true,
              description: 'Número de teléfono del usuario',
              example: '+57 300 123 4567',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'USER'],
              description: 'Rol del usuario en el sistema',
              example: 'USER',
            },
            emailVerified: {
              type: 'boolean',
              description: 'Indica si el email ha sido verificado',
              example: true,
            },
            image: {
              type: 'string',
              nullable: true,
              description: 'URL de la imagen de perfil',
              example: 'https://github.com/usuario.png',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del usuario',
              example: '2024-01-15T10:30:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
              example: '2024-01-15T10:30:00Z',
            },
          },
          required: [
            'id',
            'name',
            'email',
            'role',
            'emailVerified',
            'createdAt',
            'updatedAt',
          ],
        },
        Movement: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del movimiento',
              example: 'mov_1234567890abcdef',
            },
            concept: {
              type: 'string',
              description: 'Concepto del movimiento',
              example: 'Venta de producto',
            },
            amount: {
              type: 'number',
              format: 'float',
              description: 'Monto del movimiento',
              example: 150000.5,
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha del movimiento',
              example: '2024-01-15T10:30:00Z',
            },
            type: {
              type: 'string',
              enum: ['INCOME', 'EXPENSE'],
              description: 'Tipo de movimiento',
              example: 'INCOME',
            },
            userId: {
              type: 'string',
              description: 'ID del usuario que creó el movimiento',
              example: 'clx1234567890abcdef',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'clx1234567890abcdef',
                },
                name: {
                  type: 'string',
                  example: 'Juan Pérez',
                },
                email: {
                  type: 'string',
                  example: 'juan.perez@ejemplo.com',
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del movimiento',
              example: '2024-01-15T10:30:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
              example: '2024-01-15T10:30:00Z',
            },
          },
          required: [
            'id',
            'concept',
            'amount',
            'date',
            'type',
            'userId',
            'createdAt',
            'updatedAt',
          ],
        },
        LoginRequest: {
          type: 'object',
          properties: {
            githubCode: {
              type: 'string',
              description: 'Código de autorización de GitHub',
              example: 'abc123def456',
            },
            githubToken: {
              type: 'string',
              description: 'Token de acceso de GitHub',
              example: 'ghp_1234567890abcdef',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Hello World desde /api/auth/login - POST (GitHub)',
            },
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  description: 'Token de autenticación',
                  example: 'github-demo-token-12345',
                },
                expiresIn: {
                  type: 'string',
                  description: 'Tiempo de expiración del token',
                  example: '24h',
                },
              },
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de respuesta',
              example: 'Operación exitosa',
            },
            data: {
              type: 'object',
              description: 'Datos de respuesta',
            },
            error: {
              type: 'string',
              description: 'Mensaje de error (si aplica)',
              example: 'Error de validación',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error',
              example: 'Error interno del servidor',
            },
            error: {
              type: 'string',
              description: 'Descripción del error',
              example: 'Error al procesar la solicitud',
            },
          },
        },
        ReportData: {
          type: 'object',
          properties: {
            balance: {
              type: 'number',
              description: 'Saldo total',
              example: 2500000.75,
            },
            chartData: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: 'mov_1234567890abcdef',
                  },
                  concept: {
                    type: 'string',
                    example: 'Venta de producto',
                  },
                  amount: {
                    type: 'number',
                    example: 150000.5,
                  },
                  type: {
                    type: 'string',
                    enum: ['INCOME', 'EXPENSE'],
                    example: 'INCOME',
                  },
                  date: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-01-15T10:30:00Z',
                  },
                  user: {
                    type: 'string',
                    example: 'Juan Pérez',
                  },
                  index: {
                    type: 'number',
                    example: 1,
                  },
                },
              },
            },
            statistics: {
              type: 'object',
              properties: {
                totalIncome: {
                  type: 'number',
                  description: 'Total de ingresos',
                  example: 5000000.0,
                },
                totalExpense: {
                  type: 'number',
                  description: 'Total de gastos',
                  example: 2500000.25,
                },
                movementCount: {
                  type: 'number',
                  description: 'Número total de movimientos',
                  example: 150,
                },
              },
            },
            movements: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Movement',
              },
            },
          },
        },
      },
    },
    security: [
      {
        sessionAuth: [],
      },
    ],
  },
  apis: ['./pages/api/**/*.ts'], // Ruta a los archivos de API
};

export const swaggerSpec = swaggerJSDoc(options);
