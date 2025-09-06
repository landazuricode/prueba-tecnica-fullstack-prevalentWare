import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGet, usePut } from '@/lib/hooks/useApi';
import { formatDate } from '@/lib/utils';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateUserData {
  name: string;
  phone: string;
}

const MiCuentaPage = () => {
  const [formData, setFormData] = useState<UpdateUserData>({
    name: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Obtener datos del usuario actual
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useGet<UserData>('/api/mi-cuenta', {
    immediate: true,
  });

  // Actualizar usuario
  const {
    put: updateUser,
    isLoading: isUpdating,
    error: updateError,
  } = usePut('/api/mi-cuenta', {
    immediate: false,
    onSuccess: () => {
      // Recargar la página para mostrar los cambios
      window.location.reload();
    },
  });

  // Cargar datos del usuario cuando se obtengan
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateUser(formData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (isLoadingUser) {
    return (
      <ProtectedRoute>
        <Layout title='Mi Cuenta'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            <div className='flex justify-center items-center h-64'>
              <div className='text-gray-500'>Cargando perfil...</div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (userError || !user) {
    return (
      <ProtectedRoute>
        <Layout title='Mi Cuenta'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            <div className='flex flex-col justify-center items-center h-64 space-y-4'>
              <div className='text-red-500 text-center'>
                <div className='font-semibold'>Error al cargar perfil</div>
                <div className='text-sm mt-2'>
                  {userError || 'Usuario no encontrado'}
                </div>
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
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout title='Mi Cuenta'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-8'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              <div className='lg:col-span-1'>
                <div className='text-center'>
                  <div className='mb-6'>
                    {user.image ? (
                      <img
                        src={user.image}
                        alt='Foto de perfil'
                        className='w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200'
                      />
                    ) : (
                      <div className='w-32 h-32 rounded-full mx-auto bg-gray-200 flex items-center justify-center border-4 border-gray-200'>
                        <svg
                          className='w-16 h-16 text-gray-400'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-lg font-semibold text-gray-800'>
                        {user.name}
                      </h3>
                      <p className='text-sm text-gray-600'>{user.email}</p>
                    </div>

                    <div className='space-y-2 text-sm'>
                      <div className='flex justify-between'>
                        <span className='font-medium text-gray-600'>Rol:</span>
                        <span className='text-gray-800'>
                          {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-medium text-gray-600'>
                          Estado:
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.emailVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {user.emailVerified ? 'Verificado' : 'Pendiente'}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-medium text-gray-600'>
                          Miembro desde:
                        </span>
                        <span className='text-gray-800'>
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='lg:col-span-2'>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='space-y-4'>
                    <div>
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
                        placeholder='Tu nombre completo'
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

                    <div>
                      <label
                        htmlFor='phone'
                        className='block text-sm font-semibold text-gray-700 mb-2'
                      >
                        Número de Celular
                      </label>
                      <Input
                        id='phone'
                        type='tel'
                        autoComplete='off'
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                        placeholder='Tu número de celular'
                        className='focus:ring-blue-500'
                      />
                      <p className='mt-1 text-xs text-gray-500'>
                        Opcional - Agrega tu número de celular para contacto
                      </p>
                    </div>

                    <div className='bg-gray-50 rounded-lg p-4 space-y-3'>
                      <h4 className='text-sm font-semibold text-gray-700'>
                        Información del Sistema
                      </h4>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                        <div>
                          <span className='font-medium text-gray-600'>
                            Email:
                          </span>
                          <p className='text-gray-800'>{user.email}</p>
                          <p className='text-xs text-gray-500 mt-1'>
                            No se puede cambiar desde aquí
                          </p>
                        </div>
                        <div>
                          <span className='font-medium text-gray-600'>
                            ID de Usuario:
                          </span>
                          <p className='text-gray-800 font-mono text-xs'>
                            {user.id}
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
                        <div>
                          <span className='font-medium text-gray-600'>
                            Imagen de Perfil:
                          </span>
                          <p className='text-gray-800'>
                            {user.image ? 'Configurada' : 'No configurada'}
                          </p>
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
                          Error al actualizar perfil
                        </h3>
                        <p className='text-sm text-red-600 mt-1'>
                          {updateError}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className='flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200'>
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
                        'Guardar cambios'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default MiCuentaPage;
