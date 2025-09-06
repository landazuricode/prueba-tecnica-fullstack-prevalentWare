import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useGet } from '@/lib/hooks/useApi';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import type { Movement } from '@/types';

const MovementsPage = () => {
  const { isAdmin } = useUserRole();
  const {
    data: movements = [],
    isLoading,
    error,
  } = useGet<Movement[]>('/api/movimientos', {
    immediate: true,
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ADMIN', 'USER']}>
          <Layout title='Gestión de Movimientos'>
            <Card>
              <CardContent className='flex justify-center items-center h-64'>
                <div className='text-muted-foreground'>
                  Cargando movimientos...
                </div>
              </CardContent>
            </Card>
          </Layout>
        </RoleGuard>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ADMIN', 'USER']}>
          <Layout title='Gestión de Movimientos'>
            <Card>
              <CardContent className='flex flex-col justify-center items-center h-64 space-y-4'>
                <div className='text-destructive text-center'>
                  <div className='font-semibold'>
                    Error al cargar movimientos
                  </div>
                  <div className='text-sm mt-2'>{error}</div>
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  variant='default'
                >
                  Reintentar
                </Button>
              </CardContent>
            </Card>
          </Layout>
        </RoleGuard>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['ADMIN', 'USER']}>
        <Layout title='Gestión de Movimientos'>
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <div className='flex justify-between items-center'>
                  <div>
                    <CardTitle>Lista de Ingresos y Egresos</CardTitle>
                    <CardDescription className='mt-2'>
                      Gestiona todos los movimientos financieros del sistema
                    </CardDescription>
                  </div>
                  {isAdmin && (
                    <Link href='/movimientos/nuevo'>
                      <Button>
                        <Plus className='mr-2 h-4 w-4' />
                        Nuevo Movimiento
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Concepto</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Usuario</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movements?.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className='text-center py-8 text-muted-foreground'
                          >
                            No hay movimientos registrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        movements?.map((movement) => (
                          <TableRow key={movement?.id}>
                            <TableCell className='font-medium'>
                              {movement?.concept}
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center space-x-2'>
                                <span
                                  className={`font-medium ${
                                    movement?.type === 'INCOME'
                                      ? 'text-green-600'
                                      : 'text-red-600'
                                  }`}
                                >
                                  {movement?.type === 'INCOME' ? '+' : '-'}
                                  {formatCurrency(Math.abs(movement.amount))}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className='text-muted-foreground'>
                              {formatDate(movement?.date)}
                            </TableCell>
                            <TableCell className='text-muted-foreground'>
                              {movement?.user?.name}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default MovementsPage;
