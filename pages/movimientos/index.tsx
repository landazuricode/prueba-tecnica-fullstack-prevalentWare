import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { useUserRole } from '@/lib/hooks/useUserRole';

const MovementsPage = () => {
  const { isAdmin } = useUserRole();

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['ADMIN', 'USER']}>
        <Layout title='Gestión de Movimientos'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Lista de Ingresos y Egresos
              </h2>
              {isAdmin && <Button>+ Nuevo Movimiento</Button>}
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
                  <tr>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      Hello World - Ejemplo de ingreso
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium'>
                      +$1,000.00
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      2024-01-15
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      Usuario Demo
                    </td>
                  </tr>
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
