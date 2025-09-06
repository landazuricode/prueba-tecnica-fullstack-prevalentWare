import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { useGet } from '@/lib/hooks/useApi';
import { UserWithRole } from '@/lib/auth/types';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/auth/provider';
import Link from 'next/link';

const UsuariosPage = () => {
  const { session } = useAuth();
  const {
    data: users = [],
    isLoading,
    error,
  } = useGet<UserWithRole[]>('/api/usuarios', {
    immediate: true,
  });

  const currentUserId = session?.data?.user?.id;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ADMIN']}>
          <Layout title='Gestión de Usuarios'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex justify-center items-center h-64'>
                <div className='text-gray-500'>Cargando usuarios...</div>
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
        <RoleGuard allowedRoles={['ADMIN']}>
          <Layout title='Gestión de Usuarios'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex flex-col justify-center items-center h-64 space-y-4'>
                <div className='text-red-500 text-center'>
                  <div className='font-semibold'>Error al cargar usuarios</div>
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
      <RoleGuard allowedRoles={['ADMIN']}>
        <Layout title='Gestión de Usuarios'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Lista de Usuarios
              </h2>
            </div>

            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Nombre
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Correo
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Teléfono
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Rol
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Fecha de Registro
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {users?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className='px-6 py-8 text-center text-gray-500'
                      >
                        No hay usuarios registrados
                      </td>
                    </tr>
                  ) : (
                    users?.map((user) => (
                      <tr key={user?.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {user?.name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {user?.email}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {user?.phone || 'No especificado'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user?.role === 'ADMIN'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {user?.role === 'ADMIN'
                              ? 'Administrador'
                              : 'Usuario'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {formatDate(user?.createdAt)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <Link
                            href={
                              user?.id === currentUserId
                                ? '/mi-cuenta'
                                : `/usuarios/editar/${user?.id}`
                            }
                          >
                            <Button
                              size='sm'
                              variant='outline'
                              className='text-indigo-600 hover:text-indigo-900 border-indigo-300 hover:border-indigo-400'
                            >
                              Editar
                            </Button>
                          </Link>
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

export default UsuariosPage;
