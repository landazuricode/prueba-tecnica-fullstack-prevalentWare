import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePost } from '@/lib/hooks/useApi';
import { MOVEMENT_TYPES } from '@/types/constants';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

// Esquema de validación con Zod
const movementSchema = z.object({
  concept: z
    .string()
    .min(1, 'El concepto es requerido')
    .max(255, 'El concepto no puede exceder 255 caracteres'),
  amount: z
    .number()
    .min(0.01, 'El monto debe ser mayor a 0')
    .max(999999999.99, 'El monto es demasiado grande'),
  date: z.string().min(1, 'La fecha es requerida'),
  type: z.enum(['INCOME', 'EXPENSE'] as const),
});

type MovementFormData = z.infer<typeof movementSchema>;

const NuevoMovimientoPage = () => {
  const router = useRouter();

  const form = useForm<MovementFormData>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      concept: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0] || '',
      type: 'INCOME' as const,
    },
  });

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

  const onSubmit = (data: MovementFormData) => {
    createMovement(data);
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['ADMIN']}>
        <Layout title='Nuevo Movimiento'>
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <div className='flex items-center space-x-4'>
                  <Link href='/movimientos'>
                    <Button variant='outline' size='icon'>
                      <ArrowLeft className='h-4 w-4' />
                    </Button>
                  </Link>
                  <div>
                    <CardTitle>Nuevo Movimiento</CardTitle>
                    <CardDescription className='mt-2'>
                      Registra un nuevo ingreso o egreso en el sistema
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-3'
                  >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      {/* Campo Monto */}
                      <FormField
                        control={form.control}
                        name='amount'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monto *</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                step='0.01'
                                min='0'
                                placeholder='0.00'
                                autoComplete='off'
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Campo Fecha */}
                      <FormField
                        control={form.control}
                        name='date'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha *</FormLabel>
                            <FormControl>
                              <Input type='date' {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Campo Concepto */}
                    <FormField
                      control={form.control}
                      name='concept'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Concepto *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Descripción del movimiento'
                              {...field}
                              autoComplete='off'
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Campo Tipo */}
                    <FormField
                      control={form.control}
                      name='type'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Movimiento *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Selecciona el tipo' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={MOVEMENT_TYPES.INCOME}>
                                <div className='flex items-center space-x-2'>
                                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                  <span>Ingreso</span>
                                </div>
                              </SelectItem>
                              <SelectItem value={MOVEMENT_TYPES.EXPENSE}>
                                <div className='flex items-center space-x-2'>
                                  <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                                  <span>Egreso</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Error de API */}
                    {createError && (
                      <div className='p-4 bg-destructive/10 border border-destructive/20 rounded-md'>
                        <p className='text-sm text-destructive'>
                          Error al crear el movimiento: {createError}
                        </p>
                      </div>
                    )}

                    {/* Botones */}
                    <div className='flex justify-end space-x-4'>
                      <Link href='/movimientos'>
                        <Button type='button' variant='outline'>
                          Cancelar
                        </Button>
                      </Link>
                      <Button type='submit' disabled={isCreating}>
                        {isCreating ? (
                          <>
                            <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className='mr-2 h-4 w-4' />
                            Guardar Movimiento
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default NuevoMovimientoPage;
