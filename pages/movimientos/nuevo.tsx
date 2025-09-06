import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePost } from '@/lib/hooks/useApi';
import { CreateMovementData } from '@/lib/auth/types';

const NuevoMovimientoPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateMovementData>({
    concept: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0] || '', // Fecha actual en formato YYYY-MM-DD
    type: 'INCOME',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    post: createMovement,
    isLoading: isCreating,
    error: createError,
  } = usePost('/api/movimientos', {
    immediate: false,
    onSuccess: () => {
      // Redirigir a la lista de movimientos después de crear
      router.push('/movimientos');
    },
  });

  const handleInputChange = (
    field: keyof CreateMovementData,
    value: string | number
  ) => {
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

    if (!formData.concept.trim()) {
      newErrors.concept = 'El concepto es requerido';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
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
      await createMovement(formData);
    } catch (error) {
      console.error('Error creating movement:', error);
    }
  };

  const handleCancel = () => {
    router.push('/movimientos');
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['ADMIN']}>
        <Layout title='Ingresos y Egresos'>
          <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* Form Card */}
            <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-8'>
              <div className='text-center mb-8'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                  Nuevo Movimiento de Dinero
                </h2>
                <p className='text-gray-600'>
                  Complete los datos para registrar un nuevo movimiento
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Form Fields Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Campo Monto */}
                  <div className='md:col-span-2'>
                    <label
                      htmlFor='amount'
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      Monto *
                    </label>
                    <Input
                      id='amount'
                      type='number'
                      step='0.01'
                      min='0'
                      autoComplete='off'
                      value={formData.amount || ''}
                      onChange={(e) =>
                        handleInputChange(
                          'amount',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder='0.00'
                      className={`${errors.amount ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    />
                    {errors.amount && (
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
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  {/* Campo Concepto */}
                  <div className='md:col-span-2'>
                    <label
                      htmlFor='concept'
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      Concepto *
                    </label>
                    <Input
                      id='concept'
                      type='text'
                      autoComplete='off'
                      value={formData.concept}
                      onChange={(e) =>
                        handleInputChange('concept', e.target.value)
                      }
                      placeholder='Descripción del movimiento'
                      className={`${errors.concept ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    />
                    {errors.concept && (
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
                        {errors.concept}
                      </p>
                    )}
                  </div>

                  {/* Campo Fecha */}
                  <div>
                    <label
                      htmlFor='date'
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      Fecha *
                    </label>
                    <Input
                      id='date'
                      type='date'
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange('date', e.target.value)
                      }
                      className={`${errors.date ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    />
                    {errors.date && (
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
                        {errors.date}
                      </p>
                    )}
                  </div>

                  {/* Campo Tipo */}
                  <div>
                    <label
                      htmlFor='type'
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      Tipo de Movimiento
                    </label>
                    <select
                      id='type'
                      value={formData.type}
                      onChange={(e) =>
                        handleInputChange(
                          'type',
                          e.target.value as 'INCOME' | 'EXPENSE'
                        )
                      }
                      className='w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                    >
                      <option value='INCOME'>💰 Ingreso</option>
                      <option value='EXPENSE'>💸 Egreso</option>
                    </select>
                  </div>
                </div>

                {/* Error Message */}
                {createError && (
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
                        Error al crear movimiento
                      </h3>
                      <p className='text-sm text-red-600 mt-1'>{createError}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleCancel}
                    disabled={isCreating}
                    className='w-full sm:w-auto'
                  >
                    Cancelar
                  </Button>
                  <Button
                    type='submit'
                    disabled={isCreating}
                    className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white'
                  >
                    {isCreating ? (
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
                        Creando...
                      </>
                    ) : (
                      'Crear Movimiento'
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

export default NuevoMovimientoPage;
