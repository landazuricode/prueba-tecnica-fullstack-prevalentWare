import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/reportes:
 *   get:
 *     summary: Obtener reporte financiero
 *     description: Obtiene un reporte completo con estadísticas financieras, datos para gráficos y lista de movimientos. Requiere autenticación y rol de administrador.
 *     tags: [Reportes]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Reporte obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reporte obtenido exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/ReportData'
 *             examples:
 *               success:
 *                 summary: Reporte exitoso
 *                 value:
 *                   message: "Reporte obtenido exitosamente"
 *                   data:
 *                     balance: 2500000.75
 *                     chartData:
 *                       - id: "mov_1234567890abcdef"
 *                         concept: "Venta de producto"
 *                         amount: 150000.50
 *                         type: "INCOME"
 *                         date: "2024-01-15T10:30:00Z"
 *                         user: "Juan Pérez"
 *                         index: 1
 *                     statistics:
 *                       totalIncome: 5000000.00
 *                       totalExpense: 2500000.25
 *                       movementCount: 150
 *                     movements:
 *                       - id: "mov_1234567890abcdef"
 *                         concept: "Venta de producto"
 *                         amount: 150000.50
 *                         date: "2024-01-15T10:30:00Z"
 *                         type: "INCOME"
 *                         userId: "clx1234567890abcdef"
 *                         user:
 *                           id: "clx1234567890abcdef"
 *                           name: "Juan Pérez"
 *                           email: "juan.perez@ejemplo.com"
 *                         createdAt: "2024-01-15T10:30:00Z"
 *                         updatedAt: "2024-01-15T10:30:00Z"
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
 *               error: "Error al obtener reporte"
 */
const ReportesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  // Verificar autenticación
  let session;
  try {
    session = (await auth.api.getSession({
      headers: req.headers as Headers | unknown as Headers,
    })) as unknown as { user: { role: string } };
  } catch {
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
      } catch {
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
