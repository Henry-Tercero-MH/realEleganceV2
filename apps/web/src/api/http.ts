/**
 * Cliente HTTP de la app.
 *
 * Aunque en la fase de diseño los datos salen de `src/mocks`, el cliente vive
 * aquí ya configurado: cuando `apps/api` exista, basta con implementar las
 * funciones de `api/index.ts` sobre esta instancia. Los interceptores
 * (token, forma del error) no habrá que rehacerlos.
 */
import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';
import { CART_SESSION_HEADER } from '@real-elegance/shared';
import type { ApiErrorBody, ApiErrorCode } from '@real-elegance/shared';
import { readStorage, STORAGE_KEYS } from '@/lib/storage';

/** Error normalizado: todas las capas de arriba manejan esta forma y solo esta. */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details?: Array<{ path: string; message: string }>;

  constructor(
    code: ApiErrorCode,
    message: string,
    status = 500,
    details?: Array<{ path: string; message: string }>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Petición: adjunta el access token y el carrito de invitado ─────────────

http.interceptors.request.use((config) => {
  const session = readStorage<{ tokens?: { accessToken?: string } } | null>(STORAGE_KEYS.auth, null);
  const token = session?.tokens?.accessToken;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  const cartSession = readStorage<string | null>(STORAGE_KEYS.cartSession, null);
  if (cartSession) {
    config.headers.set(CART_SESSION_HEADER, cartSession);
  }

  return config;
});

// ── Respuesta: desenvuelve `{ data }` y normaliza el error ─────────────────

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response) {
      const body = error.response.data?.error;
      return Promise.reject(
        new ApiError(
          body?.code ?? 'INTERNAL_ERROR',
          body?.message ?? 'Ocurrió un error inesperado.',
          error.response.status,
          body?.details,
        ),
      );
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(
        new ApiError('INTERNAL_ERROR', 'La solicitud tardó demasiado. Inténtalo de nuevo.', 408),
      );
    }

    return Promise.reject(
      new ApiError('INTERNAL_ERROR', 'No pudimos conectar con el servidor.', 0),
    );
  },
);
