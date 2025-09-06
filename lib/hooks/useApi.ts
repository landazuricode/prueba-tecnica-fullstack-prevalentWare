import { useState, useCallback, useEffect } from 'react';
import type { UseApiOptions } from '../../types';

export const useApi = <T = unknown>(
  endpoint: string,
  options: UseApiOptions = {
    immediate: true,
  }
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(options.immediate !== false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (config?: RequestInit) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            ...config?.headers,
          },
          ...config,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', response.status, errorData);
          const errorMessage =
            errorData.error ||
            `Error ${response.status}: ${response.statusText}`;
          setError(errorMessage);
          options.onError?.(errorMessage);
          throw new Error(errorMessage);
        }

        const responseData = await response.json();

        // Si la respuesta tiene la estructura { data, message }, usar data
        const result =
          responseData.data !== undefined ? responseData.data : responseData;
        setData(result);
        options.onSuccess?.(result);

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        console.error(`Error in ${endpoint}:`, err);
        setError(errorMessage);
        options.onError?.(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, options.onSuccess, options.onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Ejecutar automáticamente si immediate es true
  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
    // Solo ejecutar una vez al montar, no cuando execute cambie
  }, [endpoint, options.immediate]);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
};

// Hook específico para GET requests
export const useGet = <T = unknown>(
  endpoint: string,
  options: UseApiOptions = {}
) => {
  const api = useApi<T>(endpoint, options);

  const fetch = useCallback(() => {
    return api.execute({ method: 'GET' });
  }, [api.execute]);

  return {
    ...api,
    fetch,
  };
};

// Hook específico para POST requests
export const usePost = <T = unknown>(
  endpoint: string,
  options: UseApiOptions = {}
) => {
  const api = useApi<T>(endpoint, options);

  const post = useCallback(
    (body: unknown) => {
      return api.execute({
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
    [api.execute]
  );

  return {
    ...api,
    post,
  };
};

// Hook específico para PUT requests
export const usePut = <T = unknown>(
  endpoint: string,
  options: UseApiOptions = {}
) => {
  const api = useApi<T>(endpoint, options);

  const put = useCallback(
    (body: unknown) => {
      return api.execute({
        method: 'PUT',
        body: JSON.stringify(body),
      });
    },
    [api.execute]
  );

  return {
    ...api,
    put,
  };
};

// Hook específico para DELETE requests
export const useDelete = <T = unknown>(
  endpoint: string,
  options: UseApiOptions = {}
) => {
  const api = useApi<T>(endpoint, options);

  const del = useCallback(() => {
    return api.execute({ method: 'DELETE' });
  }, [api.execute]);

  return {
    ...api,
    delete: del,
  };
};
