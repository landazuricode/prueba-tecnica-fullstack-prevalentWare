import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '../../lib/auth/client';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute = ({ children, redirectTo = '/' }: PublicRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (hasChecked) return;

    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data?.session) {
          setIsAuthenticated(true);
          if (router.pathname !== redirectTo) {
            router.push(redirectTo);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        setHasChecked(true);
      }
    };

    checkAuth();
  }, [router, redirectTo, hasChecked]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default PublicRoute;
