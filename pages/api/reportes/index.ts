import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../lib/auth';

const prisma = new PrismaClient();

const ReportesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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
        // Obtener todos los movimientos
        const movements = await prisma.movement.findMany({
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            date: 'asc',
          },
        });

        // Calcular el saldo total
        const totalBalance = movements.reduce((balance, movement) => {
          if (movement.type === 'INCOME') {
            return balance + movement.amount;
          } else {
            return balance - movement.amount;
          }
        }, 0);

        // Preparar datos para el gráfico (últimos 12 movimientos)
        const chartData = movements.slice(-12).map((movement, index) => ({
          id: movement.id,
          concept: movement.concept,
          amount:
            movement.type === 'INCOME' ? movement.amount : -movement.amount,
          type: movement.type,
          date: movement.date,
          user: movement.user.name,
          index: index + 1,
        }));

        // Estadísticas adicionales
        const totalIncome = movements
          .filter((m) => m.type === 'INCOME')
          .reduce((sum, m) => sum + m.amount, 0);

        const totalExpense = movements
          .filter((m) => m.type === 'EXPENSE')
          .reduce((sum, m) => sum + m.amount, 0);

        const movementCount = movements.length;

        res.status(200).json({
          message: 'Reporte obtenido exitosamente',
          data: {
            balance: totalBalance,
            chartData,
            statistics: {
              totalIncome,
              totalExpense,
              movementCount,
            },
            movements,
          },
        });
      } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({
          message: 'Error interno del servidor',
          error: 'Error al obtener reporte',
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

export default ReportesHandler;
