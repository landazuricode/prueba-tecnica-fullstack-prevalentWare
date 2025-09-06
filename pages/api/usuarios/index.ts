import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Obtiene la lista de todos los usuarios del sistema. Requiere autenticación y rol de administrador.
 *     tags: [Usuarios]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuarios obtenidos exitosamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "No autorizado"
 *               error: "Debe estar autenticado para acceder a este recurso"
 *       403:
 *         description: Acceso denegado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Acceso denegado"
 *               error: "Solo los administradores pueden acceder a este recurso"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Error interno del servidor"
 *               error: "Error al obtener usuarios"
 *   put:
 *     summary: Actualizar usuario
 *     description: Actualiza los datos de un usuario existente. Requiere autenticación y rol de administrador.
 *     tags: [Usuarios]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del usuario a actualizar
 *                 example: "clx1234567890abcdef"
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del usuario
 *                 example: "Juan Carlos Pérez"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *                 description: Nuevo rol del usuario
 *                 example: "ADMIN"
 *             required:
 *               - id
 *           examples:
 *             updateUser:
 *               summary: Actualizar usuario
 *               value:
 *                 id: "clx1234567890abcdef"
 *                 name: "Juan Carlos Pérez"
 *                 role: "ADMIN"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Faltan campos requeridos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Faltan campos requeridos"
 *               error: "El ID del usuario es requerido"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Acceso denegado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Usuario no encontrado"
 *               error: "El usuario especificado no existe"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Helper function to get session
const getSession = async (req: NextApiRequest) => {
  try {
    return await auth.api.getSession({
      headers: new Headers(req.headers as Record<string, string>),
    });
  } catch {
    return null;
  }
};

// Helper function to handle GET request
const handleGet = async (res: NextApiResponse) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      message: 'Usuarios obtenidos exitosamente',
      data: users,
    });
  } catch {
    res.status(500).json({
      message: 'Error interno del servidor',
      error: 'Error al obtener usuarios',
    });
  }
};

// Helper function to validate user update data
const validateUserUpdateData = (data: {
  id: string;
  name: string;
  role: string;
}) => {
  const { id, name, role } = data;

  if (!id) {
    return {
      isValid: false,
      error: {
        message: 'Faltan campos requeridos',
        error: 'El ID del usuario es requerido',
      },
    };
  }

  return {
    isValid: true,
    data: { id, name, role } as { id: string; name?: string; role?: string },
  };
};

// Helper function to handle PUT request
const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const validation = validateUserUpdateData(req.body);

    if (!validation.isValid) {
      return res.status(400).json(validation.error);
    }

    const { id, name, role } = validation.data!;

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
        error: 'El usuario especificado no existe',
      });
    }

    // Actualizar el usuario
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: 'Usuario actualizado exitosamente',
      data: updatedUser,
    });
  } catch {
    res.status(500).json({
      message: 'Error interno del servidor',
      error: 'Error al actualizar usuario',
    });
  }
};

const UsuariosHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  // Verificar autenticación
  const session = await getSession(req);

  if (!session) {
    return res.status(401).json({
      message: 'No autorizado',
      error: 'Error de autenticación',
    });
  }

  // Verificar que sea administrador
  if (session.user.role !== 'ADMIN') {
    return res.status(403).json({
      message: 'Acceso denegado',
      error: 'Solo los administradores pueden acceder a este recurso',
    });
  }

  switch (method) {
    case 'GET':
      return handleGet(res);
    case 'PUT':
      return handlePut(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).json({
        message: 'Método no permitido',
        error: `Método ${method} no permitido`,
      });
  }
};

export default UsuariosHandler;
