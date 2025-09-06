import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../lib/auth';

const prisma = new PrismaClient();

const MovimientosHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
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
        const movements = await prisma.movement.findMany({
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
        });

        res.status(200).json({
          message: 'Movimientos obtenidos exitosamente',
          data: movements,
        });
      } catch (error) {
        console.error('Error al obtener movimientos:', error);
        res.status(500).json({
          message: 'Error interno del servidor',
          error: 'No se pudieron obtener los movimientos',
        });
      }
      break;

    case 'POST':
      try {
        // Verificar que el usuario sea administrador
        if (session.user.role !== 'ADMIN') {
          return res.status(403).json({
            message: 'Acceso denegado',
            error: 'Solo los administradores pueden crear movimientos',
          });
        }

        const { concept, amount, date, type } = req.body;

        if (!concept || !amount || !date || !type) {
          return res.status(400).json({
            message: 'Faltan campos requeridos',
            error: 'concept, amount, date y type son requeridos',
          });
        }

        // Validar tipo de movimiento
        if (!['INCOME', 'EXPENSE'].includes(type)) {
          return res.status(400).json({
            message: 'Tipo de movimiento inválido',
            error: 'El tipo debe ser INCOME o EXPENSE',
          });
        }

        // Crear movimiento en la base de datos
        const movement = await prisma.movement.create({
          data: {
            concept,
            amount: parseFloat(amount),
            date: new Date(date),
            type: type as 'INCOME' | 'EXPENSE',
            userId: session.user.id,
          },
          include: {
            user: true,
          },
        });

        res.status(201).json({
          message: 'Movimiento creado exitosamente',
          data: movement,
        });
      } catch (error) {
        console.error('Error al crear movimiento:', error);
        res.status(500).json({
          message: 'Error interno del servidor',
          error: 'No se pudo crear el movimiento',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        message: 'Método no permitido',
        error: `Método ${method} no permitido`,
      });
  }
};

export default MovimientosHandler;
