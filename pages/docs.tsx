import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Importar SwaggerWrapper dinámicamente para evitar problemas de SSR
const SwaggerWrapper = dynamic(() => import('../components/SwaggerWrapper'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
        <p className='mt-4 text-gray-600'>Cargando documentación...</p>
      </div>
    </div>
  ),
});

interface DocsPageProps {
  spec: any;
}

export default function DocsPage({ spec }: DocsPageProps) {
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
        <style jsx global>{`
          /* Estilos personalizados para Swagger UI */
          .swagger-ui {
            font-family:
              -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
              sans-serif;
          }

          .swagger-ui .topbar {
            display: none;
          }

          .swagger-ui .info {
            margin: 20px 0;
          }

          .swagger-ui .info .title {
            color: white !important;
            font-size: 2rem;
            font-weight: 700;
          }

          .swagger-ui .info .description {
            color: white !important;
            font-size: 1.1rem;
            margin-top: 0.5rem;
          }

          .swagger-ui .scheme-container {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
          }

          .swagger-ui .opblock {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin: 16px 0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .swagger-ui .opblock.opblock-get {
            border-left: 4px solid #10b981;
          }

          .swagger-ui .opblock.opblock-post {
            border-left: 4px solid #3b82f6;
          }

          .swagger-ui .opblock.opblock-put {
            border-left: 4px solid #f59e0b;
          }

          .swagger-ui .opblock.opblock-delete {
            border-left: 4px solid #ef4444;
          }

          .swagger-ui .opblock .opblock-summary {
            padding: 16px;
            background: #ffffff;
            border-radius: 8px 8px 0 0;
          }

          .swagger-ui .opblock .opblock-summary:hover {
            background: #f9fafb;
          }

          .swagger-ui .opblock .opblock-summary-description {
            color: #6b7280;
            font-size: 0.9rem;
            margin-top: 4px;
          }

          .swagger-ui .opblock .opblock-section-header {
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            padding: 12px 16px;
          }

          .swagger-ui .opblock .opblock-section-header h4 {
            color: #374151;
            font-weight: 600;
            margin: 0;
          }

          .swagger-ui .opblock .opblock-section {
            padding: 16px;
          }

          .swagger-ui .btn {
            background: #3b82f6;
            border: none;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            padding: 8px 16px;
            transition: background-color 0.2s;
          }

          .swagger-ui .btn:hover {
            background: #2563eb;
          }

          .swagger-ui .btn.execute {
            background: #10b981;
          }

          .swagger-ui .btn.execute:hover {
            background: #059669;
          }

          .swagger-ui .parameter__name {
            color: #374151;
            font-weight: 600;
          }

          .swagger-ui .parameter__type {
            color: #6b7280;
            font-size: 0.9rem;
          }

          .swagger-ui .parameter__description {
            color: #6b7280;
            font-size: 0.9rem;
            margin-top: 4px;
          }

          .swagger-ui .response-col_status {
            color: #374151;
            font-weight: 600;
          }

          .swagger-ui .response-col_description {
            color: #6b7280;
          }

          .swagger-ui .model {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 12px;
            margin: 8px 0;
          }

          .swagger-ui .model-title {
            color: #374151;
            font-weight: 600;
            margin-bottom: 8px;
          }

          .swagger-ui .model .property {
            color: #6b7280;
            font-size: 0.9rem;
          }

          .swagger-ui .model .property.primitive {
            color: #059669;
          }

          .swagger-ui .model .property.primitive::before {
            content: '• ';
            color: #10b981;
            font-weight: bold;
          }

          /* Ocultar warnings de React */
          .swagger-ui * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}</style>
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
            <SwaggerWrapper spec={spec} />
          </div>
        </div>
      </div>
    </>
  );
}

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
  } catch (error) {
    console.error('Error loading API spec:', error);
    return {
      props: {
        spec: {},
      },
    };
  }
};
