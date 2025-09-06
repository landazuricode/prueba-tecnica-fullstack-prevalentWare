import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../lib/auth';

const prisma = new PrismaClient();

const UsuarioHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { id } = req.query;

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

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      message: 'ID de usuario requerido',
      error: 'El ID del usuario es requerido',
    });
  }

  switch (method) {
    case 'GET':
      try {
        // Obtener usuario específico por ID
        const user = await prisma.user.findUnique({
          where: { id },
        });

        if (!user) {
          return res.status(404).json({
            message: 'Usuario no encontrado',
            error: 'El usuario especificado no existe',
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

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).json({
        message: 'Método no permitido',
        error: `Método ${method} no permitido`,
      });
  }
};

export default UsuarioHandler;
