import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../lib/auth';

const prisma = new PrismaClient();

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
const UsuariosHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  // Verificar autenticación
  let session;
  try {
    session = await auth.api.getSession({
      headers: req.headers as any,
    });
  } catch (error) {
    console.error('Error getting session:', error);
    return res.status(401).json({
      message: 'No autorizado',
      error: 'Error de autenticación',
    });
  }

  if (!session) {
    return res.status(401).json({
      message: 'No autorizado',
      error: 'Debe estar autenticado para acceder a este recurso',
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
      try {
        // Obtener todos los usuarios de la base de datos
        const users = await prisma.user.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });

        res.status(200).json({
          message: 'Usuarios obtenidos exitosamente',
          data: users,
        });
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
          message: 'Error interno del servidor',
          error: 'Error al obtener usuarios',
        });
      }
      break;

    case 'PUT':
      try {
        const { id, name, role } = req.body;

        if (!id) {
          return res.status(400).json({
            message: 'Faltan campos requeridos',
            error: 'El ID del usuario es requerido',
          });
        }

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
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
          message: 'Error interno del servidor',
          error: 'Error al actualizar usuario',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).json({
        message: 'Método no permitido',
        error: `Método ${method} no permitido`,
      });
  }
};

export default UsuariosHandler;
