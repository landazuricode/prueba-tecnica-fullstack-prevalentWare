import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout/Layout';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import RoleGuard from '../../../components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGet, usePut } from '@/lib/hooks/useApi';
import { UserWithRole } from '@/lib/auth/types';
import { formatDate } from '@/lib/utils';

interface UpdateUserData {
  name: string;
  role: 'ADMIN' | 'USER';
}

const EditarUsuarioPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<UpdateUserData>({
    name: '',
    role: 'USER',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Obtener datos del usuario
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useGet<UserWithRole>(`/api/usuarios/${id}`, {
    immediate: !!id,
  });

  // Actualizar usuario
  const {
    put: updateUser,
    isLoading: isUpdating,
    error: updateError,
  } = usePut(`/api/usuarios`, {
    immediate: false,
    onSuccess: () => {
      // Redirigir a la lista de usuarios después de actualizar
      router.push('/usuarios');
    },
  });

  // Cargar datos del usuario cuando se obtengan
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        role: (user.role as 'ADMIN' | 'USER') || 'USER',
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UpdateUserData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.role) {
      newErrors.role = 'El rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateUser({
        id: id as string,
        ...formData,
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancel = () => {
    router.push('/usuarios');
  };

  if (isLoadingUser) {
    return (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ADMIN']}>
          <Layout title='Editar Usuario'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex justify-center items-center h-64'>
                <div className='text-gray-500'>Cargando usuario...</div>
              </div>
            </div>
          </Layout>
        </RoleGuard>
      </ProtectedRoute>
    );
  }

  if (userError || !user) {
    return (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ADMIN']}>
          <Layout title='Editar Usuario'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex flex-col justify-center items-center h-64 space-y-4'>
                <div className='text-red-500 text-center'>
                  <div className='font-semibold'>Error al cargar usuario</div>
                  <div className='text-sm mt-2'>
                    {userError || 'Usuario no encontrado'}
                  </div>
                </div>
                <button
                  onClick={() => router.push('/usuarios')}
                  className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                >
                  Volver a Usuarios
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
        <Layout title='Editar Usuario'>
          <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-8'>
              <div className='text-center mb-8'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                  Editar Usuario
                </h2>
                <p className='text-gray-600'>
                  Modifique los datos del usuario seleccionado
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='md:col-span-2'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      Nombre Completo *
                    </label>
                    <Input
                      id='name'
                      type='text'
                      autoComplete='off'
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      placeholder='Nombre completo del usuario'
                      className={`${errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    />
                    {errors.name && (
                      <p className='mt-2 text-sm text-red-600 flex items-center'>
                        <svg
                          className='w-4 h-4 mr-1'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className='md:col-span-2'>
                    <label
                      htmlFor='role'
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      Rol del Usuario *
                    </label>
                    <select
                      id='role'
                      value={formData.role}
                      onChange={(e) =>
                        handleInputChange(
                          'role',
                          e.target.value as 'ADMIN' | 'USER'
                        )
                      }
                      className={`w-full h-10 px-3 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        errors.role
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    >
                      <option value='USER'>👤 Usuario</option>
                      <option value='ADMIN'>👑 Administrador</option>
                    </select>
                    {errors.role && (
                      <p className='mt-2 text-sm text-red-600 flex items-center'>
                        <svg
                          className='w-4 h-4 mr-1'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {errors.role}
                      </p>
                    )}
                  </div>

                  <div className='md:col-span-2'>
                    <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                      <h3 className='text-sm font-semibold text-gray-700 mb-3'>
                        Información del Usuario
                      </h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                        <div>
                          <span className='font-medium text-gray-600'>
                            Email:
                          </span>
                          <p className='text-gray-800'>{user.email}</p>
                        </div>
                        <div>
                          <span className='font-medium text-gray-600'>
                            Teléfono:
                          </span>
                          <p className='text-gray-800'>
                            {user.phone || 'No especificado'}
                          </p>
                        </div>
                        <div>
                          <span className='font-medium text-gray-600'>
                            Fecha de Registro:
                          </span>
                          <p className='text-gray-800'>
                            {formatDate(user.createdAt)}
                          </p>
                        </div>
                        <div>
                          <span className='font-medium text-gray-600'>
                            Última Actualización:
                          </span>
                          <p className='text-gray-800'>
                            {formatDate(user.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {updateError && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-start'>
                    <svg
                      className='w-5 h-5 text-red-400 mr-3 mt-0.5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <div>
                      <h3 className='text-sm font-medium text-red-800'>
                        Error al actualizar usuario
                      </h3>
                      <p className='text-sm text-red-600 mt-1'>{updateError}</p>
                    </div>
                  </div>
                )}

                <div className='flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className='w-full sm:w-auto'
                  >
                    Cancelar
                  </Button>
                  <Button
                    type='submit'
                    disabled={isUpdating}
                    className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white'
                  >
                    {isUpdating ? (
                      <>
                        <svg
                          className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Actualizando...
                      </>
                    ) : (
                      'Actualizar Usuario'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Layout>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default EditarUsuarioPage;
