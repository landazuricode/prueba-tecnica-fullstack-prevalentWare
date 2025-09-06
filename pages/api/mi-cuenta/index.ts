import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';
import { Session } from '@/lib/auth/types';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/mi-cuenta:
 *   get:
 *     summary: Obtener perfil del usuario actual
 *     description: Obtiene los datos del perfil del usuario autenticado actualmente.
 *     tags: [Mi Cuenta]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario obtenido exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
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
 *               error: "El usuario no existe"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Actualizar perfil del usuario actual
 *     description: Actualiza los datos del perfil del usuario autenticado actualmente.
 *     tags: [Mi Cuenta]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre completo del usuario
 *                 example: "Juan Carlos Pérez"
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 description: Número de teléfono del usuario
 *                 example: "+57 300 123 4567"
 *             required:
 *               - name
 *           examples:
 *             updateProfile:
 *               summary: Actualizar perfil
 *               value:
 *                 name: "Juan Carlos Pérez"
 *                 phone: "+57 300 123 4567"
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Perfil actualizado exitosamente"
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
 *               error: "El nombre es requerido"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
const handleGet = async (session: Session, res: NextApiResponse) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
        error: 'El usuario no existe',
      });
    }

    res.status(200).json({
      message: 'Usuario obtenido exitosamente',
      data: user,
    });
  } catch {
    res.status(500).json({
      message: 'Error interno del servidor',
      error: 'Error al obtener usuario',
    });
  }
};

// Helper function to handle PUT request
const handlePut = async (
  req: NextApiRequest,
  session: Session,
  res: NextApiResponse
) => {
  try {
    const { name, phone } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        message: 'Faltan campos requeridos',
        error: 'El nombre es requerido',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      data: updatedUser,
    });
  } catch {
    res.status(500).json({
      message: 'Error interno del servidor',
      error: 'Error al actualizar perfil',
    });
  }
};

const MiCuentaHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  // Verificar autenticación
  const session = await getSession(req);

  if (!session) {
    return res.status(401).json({
      message: 'No autorizado',
      error: 'Error de autenticación',
    });
  }

  switch (method) {
    case 'GET':
      return handleGet(session, res);
    case 'PUT':
      return handlePut(req, session, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).json({
        message: 'Método no permitido',
        error: `Método ${method} no permitido`,
      });
  }
};

export default MiCuentaHandler;
