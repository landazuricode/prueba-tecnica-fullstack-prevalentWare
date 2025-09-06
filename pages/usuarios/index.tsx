import Image from 'next/image';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGet } from '@/lib/hooks/useApi';
import { UserWithRole } from '@/lib/auth/types';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/auth/provider';
import {
  Edit,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

// Component for user avatar section
const UserAvatar = ({ user }: { user: UserWithRole }) => (
  <div className='flex items-center space-x-3'>
    <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center'>
      <Image
        src={user?.image || '/default-avatar.png'}
        alt={`Avatar de ${user?.name}`}
        width={32}
        height={32}
        className='h-full w-full rounded-full object-cover'
      />
    </div>
    <div>
      <div className='font-medium'>{user?.name}</div>
    </div>
  </div>
);

// Component for user contact information
const UserContact = ({ user }: { user: UserWithRole }) => (
  <div className='space-y-1'>
    <div className='flex items-center space-x-2 text-sm'>
      <Mail className='h-3 w-3 text-muted-foreground' />
      <span>{user?.email}</span>
    </div>
    {user?.phone && (
      <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
        <Phone className='h-3 w-3' />
        <span>{user.phone}</span>
      </div>
    )}
  </div>
);

// Component for user role badge
const UserRoleBadge = ({ user }: { user: UserWithRole }) => (
  <Badge
    variant={user?.role === 'ADMIN' ? 'default' : 'secondary'}
    className='flex items-center space-x-1 w-fit'
  >
    {user?.role === 'ADMIN' ? (
      <Shield className='h-3 w-3' />
    ) : (
      <UserCheck className='h-3 w-3' />
    )}
    <span>{user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}</span>
  </Badge>
);

// Component for user registration date
const UserRegistrationDate = ({ user }: { user: UserWithRole }) => (
  <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
    <Calendar className='h-3 w-3' />
    <span>{formatDate(user?.createdAt)}</span>
  </div>
);

// Component for user actions
const UserActions = ({
  user,
  currentUserId,
}: {
  user: UserWithRole;
  currentUserId?: string | undefined;
}) => (
  <Link
    href={
      user?.id === currentUserId ? '/mi-cuenta' : `/usuarios/editar/${user?.id}`
    }
  >
    <Button size='sm' variant='outline' className='flex items-center space-x-1'>
      <Edit className='h-3 w-3' />
      <span>Editar</span>
    </Button>
  </Link>
);

// Component for individual user table row
const UserTableRow = ({
  user,
  currentUserId,
}: {
  user: UserWithRole;
  currentUserId?: string | undefined;
}) => (
  <TableRow key={user?.id} className='hover:bg-muted/50'>
    <TableCell>
      <UserAvatar user={user} />
    </TableCell>
    <TableCell>
      <UserContact user={user} />
    </TableCell>
    <TableCell>
      <UserRoleBadge user={user} />
    </TableCell>
    <TableCell>
      <UserRegistrationDate user={user} />
    </TableCell>
    <TableCell>
      <UserActions user={user} currentUserId={currentUserId} />
    </TableCell>
  </TableRow>
);

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
            <Card>
              <CardContent className='flex justify-center items-center h-64'>
                <div className='text-muted-foreground'>
                  Cargando usuarios...
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
        <RoleGuard allowedRoles={['ADMIN']}>
          <Layout title='Gestión de Usuarios'>
            <Card>
              <CardContent className='flex flex-col justify-center items-center h-64 space-y-4'>
                <div className='text-destructive text-center'>
                  <div className='font-semibold'>Error al cargar usuarios</div>
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
      <RoleGuard allowedRoles={['ADMIN']}>
        <Layout title='Gestión de Usuarios'>
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <div className='flex items-center space-x-4'>
                  <div className='p-2 bg-primary/10 rounded-lg'>
                    <User className='h-6 w-6 text-primary' />
                  </div>
                  <div>
                    <CardTitle>Lista de Usuarios</CardTitle>
                    <CardDescription className='mt-2'>
                      Gestiona todos los usuarios del sistema y sus roles
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Registro</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className='text-center py-8 text-muted-foreground'
                          >
                            No hay usuarios registrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        users?.map((user) => (
                          <UserTableRow
                            key={user?.id}
                            user={user}
                            currentUserId={currentUserId}
                          />
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

export default UsuariosPage;
