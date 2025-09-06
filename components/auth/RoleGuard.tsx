import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const RoleGuard = ({
  children,
  allowedRoles,
  fallback = null,
  redirectTo = '/',
}: RoleGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data?.user) {
          const role =
            ((session.data.user as Record<string, unknown>).role as string) ||
            'ADMIN';
          setUserRole(role);

          if (allowedRoles.includes(role)) {
            setHasAccess(true);
          } else {
            setHasAccess(false);
            if (redirectTo) {
              router.push(redirectTo);
            }
          }
        } else {
          setHasAccess(false);
          router.push('/login');
        }
      } catch {
        setHasAccess(false);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkRole();
  }, [allowedRoles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      fallback || (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <div className='text-red-500 text-6xl mb-4'>🚫</div>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Acceso Denegado
            </h1>
            <p className='text-gray-600 mb-4'>
              No tienes permisos para acceder a esta sección.
            </p>
            <p className='text-sm text-gray-500'>
              Tu rol actual: <span className='font-semibold'>{userRole}</span>
            </p>
            <button
              onClick={() => router.push('/')}
              className='mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

export { RoleGuard };
