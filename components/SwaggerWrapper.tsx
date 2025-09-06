import { useEffect, useRef } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerWrapperProps {
  spec: any;
}

export default function SwaggerWrapper({ spec }: SwaggerWrapperProps) {
  const swaggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Suprimir warnings de React en la consola
    const originalWarn = console.warn;
    console.warn = (message: string, ...args: any[]) => {
      if (
        message.includes('UNSAFE_componentWillReceiveProps') ||
        message.includes('componentWillReceiveProps') ||
        message.includes('ModelCollapse') ||
        message.includes('OperationContainer')
      ) {
        return;
      }
      originalWarn(message, ...args);
    };

    // Limpiar warnings después de un tiempo
    const timer = setTimeout(() => {
      console.warn = originalWarn;
    }, 5000);

    return () => {
      clearTimeout(timer);
      console.warn = originalWarn;
    };
  }, []);

  return (
    <div ref={swaggerRef} className='swagger-wrapper'>
      <SwaggerUI
        spec={spec}
        docExpansion='list'
        defaultModelsExpandDepth={2}
        defaultModelExpandDepth={2}
        displayRequestDuration={true}
        tryItOutEnabled={true}
        supportedSubmitMethods={['get', 'post', 'put', 'delete', 'patch']}
        requestInterceptor={(request) => {
          // Agregar headers de autenticación si están disponibles
          if (typeof window !== 'undefined') {
            const token = localStorage.getItem('better-auth.session_token');
            if (token) {
              request.headers.Authorization = `Bearer ${token}`;
            }
          }
          return request;
        }}
        onComplete={() => {
          // Ocultar elementos problemáticos después de cargar
          if (swaggerRef.current) {
            const problematicElements = swaggerRef.current.querySelectorAll(
              '[class*="ModelCollapse"], [class*="OperationContainer"]'
            );
            problematicElements.forEach((element) => {
              (element as HTMLElement).style.display = 'none';
            });
          }
        }}
      />
    </div>
  );
}
