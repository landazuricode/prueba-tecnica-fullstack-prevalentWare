'use client';

import { ChevronRight, Github, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/provider';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const { signIn, session, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Redirigir si ya ha iniciado sesión
  useEffect(() => {
    if (session?.data && !authLoading) {
      router.push('/');
    }
  }, [session, authLoading, router]);

  const handleGitHubLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Comprueba si GitHub OAuth está configurado
      if (!process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID) {
        setError(
          'GitHub OAuth no está configurado. Por favor, configura las variables de entorno.'
        );
        setIsLoading(false);
        return;
      }

      // Esto redirigirá a GitHub OAuth
      await signIn();
    } catch (error) {
      console.error('Login error:', error);
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
      setIsLoading(false);
    }
    // Nota: No actualizo isLoading como falso aquí porque la página redireccionará
  };

  // Mostrar carga si auth está todavía cargando
  if (authLoading) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div className='flex items-center space-x-3'>
          <Loader2 className='w-6 h-6 animate-spin text-white' />
          <span className='text-white text-lg'>Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <img
            src='https://www.prevalentware.com/wp-content/uploads/2024/07/logo-prevalentware.png'
            alt='PrevalentWare'
            className=' mx-auto'
          />
          <p className='mt-6 text-lg text-gray-300'></p>
        </div>

        <div className='bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700'>
          {error && (
            <div className='mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                <p className='text-red-300 text-sm'>{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className='mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <p className='text-green-300 text-sm'>{success}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className='w-full flex items-center justify-center space-x-3 py-4 px-6 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed border border-gray-600 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg group disabled:hover:shadow-none'
          >
            {isLoading ? (
              <>
                <Loader2 className='w-6 h-6 animate-spin' />
                <span className='text-lg'>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <Github className='w-6 h-6' />
                <span className='text-lg'>Continuar con GitHub</span>
                <ChevronRight className='w-6 h-6 group-hover:translate-x-1 transition-transform text-gray-500 group-hover:text-white duration-200' />
              </>
            )}
          </button>

          <div className='mt-8 flex items-center'>
            <div className='flex-1 border-t border-gray-600'></div>
            <span className='px-4 text-sm text-gray-400'>o</span>
            <div className='flex-1 border-t border-gray-600'></div>
          </div>

          <div className='mt-8 p-6 bg-gray-700 rounded-xl text-center border border-gray-600'>
            <div className='flex items-center justify-center mb-3'>
              <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center'>
                <span className='text-white text-xl animate-wave origin-[70%_70%]'>
                  👋
                </span>
              </div>
            </div>
            <p className='text-gray-200 text-lg font-medium mb-2'>
              Bienvenido, inicia sesión con tu cuenta de GitHub! 🔐
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
