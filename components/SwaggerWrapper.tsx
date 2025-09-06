import { useRef } from 'react';
// @ts-expect-error - swagger-ui-react doesn't have proper TypeScript declarations
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerWrapperProps {
  spec: Record<string, unknown>;
}

const SwaggerWrapper = ({ spec }: SwaggerWrapperProps) => {
  const swaggerRef = useRef<HTMLDivElement>(null);

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
        requestInterceptor={(request: { headers: Record<string, string> }) => {
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
};

export { SwaggerWrapper };
