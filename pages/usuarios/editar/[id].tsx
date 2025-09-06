import { useEffect } from 'react';
import { NextRouter, useRouter } from 'next/router';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';
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
import { Badge } from '@/components/ui/badge';
import { useGet, usePut } from '@/lib/hooks/useApi';
import { UserWithRole } from '@/lib/auth/types';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

// Esquema de validación con Zod
const userSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  role: z.enum(['ADMIN', 'USER'] as const),
});

type UserFormData = z.infer<typeof userSchema>;

// Helper component for loading state
const LoadingState = () => (
  <ProtectedRoute>
    <RoleGuard allowedRoles={['ADMIN']}>
      <Layout title='Editar Usuario'>
        <Card>
          <CardContent className='flex justify-center items-center h-64'>
            <div className='text-muted-foreground'>Cargando usuario...</div>
          </CardContent>
        </Card>
      </Layout>
    </RoleGuard>
  </ProtectedRoute>
);

// Helper component for error state
const ErrorState = ({
  userError,
  router,
}: {
  userError: string | null;
  router: NextRouter;
}) => (
  <ProtectedRoute>
    <RoleGuard allowedRoles={['ADMIN']}>
      <Layout title='Editar Usuario'>
        <Card>
          <CardContent className='flex flex-col justify-center items-center h-64 space-y-4'>
            <div className='text-destructive text-center'>
              <div className='font-semibold'>Error al cargar usuario</div>
              <div className='text-sm mt-2'>
                {userError || 'Usuario no encontrado'}
              </div>
            </div>
            <Button onClick={() => router.push('/usuarios')} variant='default'>
              Volver a Usuarios
            </Button>
          </CardContent>
        </Card>
      </Layout>
    </RoleGuard>
  </ProtectedRoute>
);

// Helper component for user information card
const UserInfoCard = ({ user }: { user: UserWithRole }) => (
  <Card>
    <CardHeader>
      <CardTitle className='text-lg flex items-center space-x-2'>
        <User className='h-5 w-5' />
        <span>Información del Usuario</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-4'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Mail className='h-4 w-4 text-blue-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Email</p>
              <p className='text-sm'>{user.email}</p>
            </div>
          </div>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <Phone className='h-4 w-4 text-green-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Teléfono
              </p>
              <p className='text-sm'>{user.phone || 'No especificado'}</p>
            </div>
          </div>
        </div>
        <div className='space-y-4'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-purple-100 rounded-lg'>
              <Calendar className='h-4 w-4 text-purple-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Fecha de Registro
              </p>
              <p className='text-sm'>{formatDate(user.createdAt)}</p>
            </div>
          </div>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-orange-100 rounded-lg'>
              <Calendar className='h-4 w-4 text-orange-600' />
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Última Actualización
              </p>
              <p className='text-sm'>{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-6 pt-4 border-t'>
        <div className='flex items-center space-x-2'>
          <Badge
            variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
            className='flex items-center space-x-1'
          >
            {user.role === 'ADMIN' ? (
              <Shield className='h-3 w-3' />
            ) : (
              <UserCheck className='h-3 w-3' />
            )}
            <span>
              Rol actual: {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
            </span>
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Helper component for form fields
const FormFields = ({ form }: { form: UseFormReturn<UserFormData> }) => (
  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
    <FormField
      control={form.control}
      name='name'
      render={({ field }) => (
        <FormItem className='md:col-span-2'>
          <FormLabel>Nombre Completo *</FormLabel>
          <FormControl>
            <Input
              placeholder='Nombre completo del usuario'
              autoComplete='off'
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name='role'
      render={({ field }) => (
        <FormItem className='md:col-span-2'>
          <FormLabel>Rol del Usuario *</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Selecciona el rol' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value='USER'>
                <div className='flex items-center space-x-2'>
                  <UserCheck className='h-4 w-4' />
                  <span>Usuario</span>
                </div>
              </SelectItem>
              <SelectItem value='ADMIN'>
                <div className='flex items-center space-x-2'>
                  <Shield className='h-4 w-4' />
                  <span>Administrador</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

// Helper component for form buttons
const FormButtons = ({ isUpdating }: { isUpdating: boolean }) => (
  <div className='flex justify-end space-x-4'>
    <Link href='/usuarios'>
      <Button type='button' variant='outline' disabled={isUpdating}>
        Cancelar
      </Button>
    </Link>
    <Button type='submit' disabled={isUpdating}>
      {isUpdating ? (
        <>
          <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
          Actualizando...
        </>
      ) : (
        <>
          <Save className='mr-2 h-4 w-4' />
          Actualizar Usuario
        </>
      )}
    </Button>
  </div>
);

// Custom hook for form management
const useUserForm = (user: UserWithRole | null) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      role: 'USER',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        role: (user.role as 'ADMIN' | 'USER') || 'USER',
      });
    }
  }, [user, form]);

  return form;
};

// Custom hook for API operations
const useUserOperations = (id: string | string[] | undefined) => {
  const router = useRouter();

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useGet<UserWithRole>(`/api/usuarios/${id}`, {
    immediate: !!id,
  });

  const {
    put: updateUser,
    isLoading: isUpdating,
    error: updateError,
  } = usePut(`/api/usuarios`, {
    immediate: false,
    onSuccess: () => {
      router.push('/usuarios');
    },
  });

  return {
    user,
    isLoadingUser,
    userError,
    updateUser,
    isUpdating,
    updateError,
  };
};

// Helper component for main form content
const MainFormContent = ({
  form,
  user,
  updateError,
  isUpdating,
  onSubmit,
}: {
  form: UseFormReturn<UserFormData>;
  user: UserWithRole;
  updateError: string | null;
  isUpdating: boolean;
  onSubmit: (data: UserFormData) => void;
}) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
      <FormFields form={form} />
      <UserInfoCard user={user} />
      {updateError && (
        <div className='p-4 bg-destructive/10 border border-destructive/20 rounded-md'>
          <p className='text-sm text-destructive'>
            Error al actualizar usuario: {updateError}
          </p>
        </div>
      )}
      <FormButtons isUpdating={isUpdating} />
    </form>
  </Form>
);

const EditarUsuarioPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    user,
    isLoadingUser,
    userError,
    updateUser,
    isUpdating,
    updateError,
  } = useUserOperations(id);

  const form = useUserForm(user);

  const onSubmit = (data: UserFormData) => {
    updateUser({
      id: id as string,
      ...data,
    });
  };

  if (isLoadingUser) {
    return <LoadingState />;
  }

  if (userError || !user) {
    return <ErrorState userError={userError} router={router} />;
  }

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['ADMIN']}>
        <Layout title='Editar Usuario'>
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <div className='flex items-center space-x-4'>
                  <Link href='/usuarios'>
                    <Button variant='outline' size='icon'>
                      <ArrowLeft className='h-4 w-4' />
                    </Button>
                  </Link>
                  <div>
                    <CardTitle>Editar Usuario</CardTitle>
                    <CardDescription className='mt-2'>
                      Modifica los datos del usuario seleccionado
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <MainFormContent
                  form={form}
                  user={user}
                  updateError={updateError}
                  isUpdating={isUpdating}
                  onSubmit={onSubmit}
                />
              </CardContent>
            </Card>
          </div>
        </Layout>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default EditarUsuarioPage;
