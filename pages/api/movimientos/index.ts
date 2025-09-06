import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../lib/auth';
import type {
  CreateMovementData,
  MovementType,
  ApiError,
} from '../../../types';
import {
  MOVEMENT_TYPES,
  HTTP_STATUS,
  API_MESSAGES,
} from '../../../types/constants';

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

        res.status(HTTP_STATUS.OK).json({
          message: API_MESSAGES.SUCCESS.MOVEMENTS_FOUND,
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

        const { concept, amount, date, type }: CreateMovementData = req.body;

        if (!concept || !amount || !date || !type) {
          const error: ApiError = {
            message: API_MESSAGES.ERROR.MISSING_FIELDS,
            error: 'concept, amount, date y type son requeridos',
          };
          return res.status(HTTP_STATUS.BAD_REQUEST).json(error);
        }

        // Validar tipo de movimiento
        if (!Object.values(MOVEMENT_TYPES).includes(type)) {
          const error: ApiError = {
            message: API_MESSAGES.ERROR.INVALID_MOVEMENT_TYPE,
            error: `El tipo debe ser ${MOVEMENT_TYPES.INCOME} o ${MOVEMENT_TYPES.EXPENSE}`,
          };
          return res.status(HTTP_STATUS.BAD_REQUEST).json(error);
        }

        // Crear movimiento en la base de datos
        const movement = await prisma.movement.create({
          data: {
            concept,
            amount: parseFloat(amount.toString()),
            date: new Date(date),
            type: type as MovementType,
            userId: session.user.id,
          },
          include: {
            user: true,
          },
        });

        res.status(HTTP_STATUS.CREATED).json({
          message: API_MESSAGES.SUCCESS.MOVEMENT_CREATED,
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
