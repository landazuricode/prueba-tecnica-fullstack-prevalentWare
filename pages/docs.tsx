import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Importar SwaggerWrapper dinámicamente para evitar problemas de SSR
const SwaggerWrapper = dynamic(
  () => import('../components/SwaggerWrapper' as unknown as never),
  {
    ssr: false,
    loading: () => (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando documentación...</p>
        </div>
      </div>
    ),
  }
);

const DocsPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando documentación...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Documentación de API - Gestión Financiera</title>
        <meta
          name='description'
          content='Documentación completa de la API de Gestión Financiera'
        />
      </Head>
      <div className='min-h-screen bg-gray-50'>
        <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 px-6 shadow-lg'>
          <div className='max-w-7xl mx-auto'>
            <h1 className='text-3xl font-bold'>Documentación de API</h1>
            <p className='text-blue-100 mt-2 text-lg'>
              API de Gestión Financiera - Documentación completa de endpoints
            </p>
          </div>
        </div>
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
            <SwaggerWrapper />
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Obtener la especificación OpenAPI desde la API
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_URL
        : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/docs`);
    const spec = await response.json();

    return {
      props: {
        spec,
      },
    };
  } catch {
    return {
      props: {
        spec: {},
      },
    };
  }
};

export default DocsPage;
