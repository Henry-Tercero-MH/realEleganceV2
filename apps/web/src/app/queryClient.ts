import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api';

/**
 * Configuración global de React Query.
 *
 * Las decisiones de aquí son de producto, no de librería: cuántas veces
 * reintentar antes de dar por perdida una consulta y cuándo revalidar.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      // Volver a la pestaña no debería disparar una tormenta de peticiones;
      // reconectar, sí: probablemente los datos ya no valen.
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        // 4xx son culpa nuestra o del dato, no de la red: reintentar no arregla nada.
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    },
    mutations: {
      retry: false,
    },
  },
});
