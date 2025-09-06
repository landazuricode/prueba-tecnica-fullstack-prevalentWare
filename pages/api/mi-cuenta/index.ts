import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../lib/auth';

const prisma = new PrismaClient();

const MiCuentaHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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

  switch (method) {
    case 'GET':
      try {
        // Obtener datos del usuario actual
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
      } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
          message: 'Error interno del servidor',
          error: 'Error al obtener usuario',
        });
      }
      break;

    case 'PUT':
      try {
        const { name, phone } = req.body;

        // Validar campos requeridos
        if (!name || name.trim() === '') {
          return res.status(400).json({
            message: 'Faltan campos requeridos',
            error: 'El nombre es requerido',
          });
        }

        // Actualizar solo los campos permitidos
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
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
          message: 'Error interno del servidor',
          error: 'Error al actualizar perfil',
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

export default MiCuentaHandler;
