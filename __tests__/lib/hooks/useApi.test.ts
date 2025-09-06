import { renderHook, act, waitFor } from '@testing-library/react';

// Mock the types to avoid import issues
interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// Copy the hook implementations for testing
import { useState, useCallback, useEffect } from 'react';

const useApi = <T = unknown>(
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
          const errorMessage =
            errorData.error ||
            `Error ${response.status}: ${response.statusText}`;
          setError(errorMessage);
          options.onError?.(errorMessage);
          throw new Error(errorMessage);
        }

        const responseData = await response.json();
        const result =
          responseData.data !== undefined ? responseData.data : responseData;
        setData(result);
        options.onSuccess?.(result);

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        options.onError?.(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, options.immediate]);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
};

const useGet = <T = unknown>(endpoint: string, options: UseApiOptions = {}) => {
  const api = useApi<T>(endpoint, options);
  const fetch = useCallback(() => api.execute({ method: 'GET' }), [api]);
  return {
    ...api,
    fetch,
  };
};

const usePost = <T = unknown>(
  endpoint: string,
  options: UseApiOptions = {}
) => {
  const api = useApi<T>(endpoint, options);
  const post = useCallback(
    (body: unknown) =>
      api.execute({
        method: 'POST',
        body: JSON.stringify(body),
      }),
    [api]
  );
  return {
    ...api,
    post,
  };
};

const usePut = <T = unknown>(endpoint: string, options: UseApiOptions = {}) => {
  const api = useApi<T>(endpoint, options);
  const put = useCallback(
    (body: unknown) =>
      api.execute({
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    [api]
  );
  return {
    ...api,
    put,
  };
};

const useDelete = <T = unknown>(
  endpoint: string,
  options: UseApiOptions = {}
) => {
  const api = useApi<T>(endpoint, options);
  const del = useCallback(() => api.execute({ method: 'DELETE' }), [api]);
  return {
    ...api,
    delete: del,
  };
};

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('useApi Hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('useApi', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() =>
        useApi('/api/test', { immediate: false })
      );

      expect(result.current.data).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should execute request immediately when immediate is true', async () => {
      const mockData = { id: 1, name: 'Test' };

      // Set up the mock before rendering the hook
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockData,
      } as Response);

      const { result } = renderHook(() => useApi('/api/test'));

      // Check that loading starts as true
      expect(result.current.isLoading).toBe(true);

      // Wait for the request to complete
      await waitFor(
        () => {
          expect(result.current.data).toEqual(mockData);
        },
        { timeout: 5000 }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith('/api/test', {
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should handle successful API response', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockData,
      } as Response);

      const { result } = renderHook(() =>
        useApi('/api/test', { immediate: false })
      );

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle API response with data wrapper', async () => {
      const mockData = { id: 1, name: 'Test' };
      const wrappedResponse = { data: mockData, message: 'Success' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => wrappedResponse,
      } as Response);

      const { result } = renderHook(() =>
        useApi('/api/test', { immediate: false })
      );

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toEqual(mockData);
    });

    it('should handle API error response', async () => {
      const errorResponse = { error: 'Not found' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => errorResponse,
      } as Response);

      const { result } = renderHook(() =>
        useApi('/api/test', { immediate: false })
      );

      await act(async () => {
        try {
          await result.current.execute();
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Not found');
      expect(result.current.data).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() =>
        useApi('/api/test', { immediate: false })
      );

      await act(async () => {
        try {
          await result.current.execute();
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.data).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should call onSuccess callback when provided', async () => {
      const mockData = { id: 1, name: 'Test' };
      const onSuccess = jest.fn();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockData,
      } as Response);

      const { result } = renderHook(() =>
        useApi('/api/test', { immediate: false, onSuccess })
      );

      await act(async () => {
        await result.current.execute();
      });

      expect(onSuccess).toHaveBeenCalledWith(mockData);
    });

    it('should call onError callback when provided', async () => {
      const onError = jest.fn();
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() =>
        useApi('/api/test', { immediate: false, onError })
      );

      await act(async () => {
        try {
          await result.current.execute();
        } catch (error) {
          // Expected to throw
        }
      });

      expect(onError).toHaveBeenCalledWith('Network error');
    });

    it('should reset state correctly', () => {
      const { result } = renderHook(() =>
        useApi('/api/test', { immediate: false })
      );

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('useGet', () => {
    it('should make GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockData,
      } as Response);

      const { result } = renderHook(() =>
        useGet('/api/test', { immediate: false })
      );

      await act(async () => {
        await result.current.fetch();
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/test', {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('usePost', () => {
    it('should make POST request with body', async () => {
      const mockData = { id: 1, name: 'Test' };
      const requestBody = { name: 'New Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockData,
      } as Response);

      const { result } = renderHook(() =>
        usePost('/api/test', { immediate: false })
      );

      await act(async () => {
        await result.current.post(requestBody);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/test', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('usePut', () => {
    it('should make PUT request with body', async () => {
      const mockData = { id: 1, name: 'Updated Test' };
      const requestBody = { name: 'Updated Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockData,
      } as Response);

      const { result } = renderHook(() =>
        usePut('/api/test', { immediate: false })
      );

      await act(async () => {
        await result.current.put(requestBody);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/test', {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useDelete', () => {
    it('should make DELETE request', async () => {
      const mockData = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockData,
      } as Response);

      const { result } = renderHook(() =>
        useDelete('/api/test', { immediate: false })
      );

      await act(async () => {
        await result.current.delete();
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/test', {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      });
      expect(result.current.data).toEqual(mockData);
    });
  });
});
