import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useGet } from '@/lib/hooks/useApi';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
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
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex justify-center items-center h-64'>
                <div className='text-gray-500'>Cargando movimientos...</div>
              </div>
            </div>
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
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex flex-col justify-center items-center h-64 space-y-4'>
                <div className='text-red-500 text-center'>
                  <div className='font-semibold'>
                    Error al cargar movimientos
                  </div>
                  <div className='text-sm mt-2'>{error}</div>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                >
                  Reintentar
                </button>
              </div>
            </div>
          </Layout>
        </RoleGuard>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['ADMIN', 'USER']}>
        <Layout title='Gestión de Movimientos'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Lista de Ingresos y Egresos
              </h2>
              {isAdmin && (
                <Link href='/movimientos/nuevo'>
                  <Button>+ Nuevo Movimiento</Button>
                </Link>
              )}
            </div>

            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Concepto
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Monto
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Fecha
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Usuario
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {movements?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className='px-6 py-8 text-center text-gray-500'
                      >
                        No hay movimientos registrados
                      </td>
                    </tr>
                  ) : (
                    movements?.map((movement) => (
                      <tr key={movement?.id}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {movement?.concept}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            movement?.type === 'INCOME'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {movement?.type === 'INCOME' ? '+' : '-'}
                          {formatCurrency(Math.abs(movement.amount))}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {formatDate(movement?.date)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {movement?.user?.name}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Layout>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default MovementsPage;
