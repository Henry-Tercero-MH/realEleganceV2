/**
 * Acceso tipado a `localStorage` que no explota en SSR, en modo incógnito con
 * la cuota llena, ni cuando el usuario bloquea el almacenamiento.
 */

const PREFIX = 're.';

function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    // Safari en modo privado deja leer pero lanza al escribir: lo comprobamos.
    const probe = `${PREFIX}__probe__`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStorage<T>(key: string, fallback: T): T {
  const store = safeStorage();
  if (!store) return fallback;
  try {
    const raw = store.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    // Valor corrupto de una versión anterior: lo descartamos en silencio.
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown): void {
  const store = safeStorage();
  if (!store) return;
  try {
    store.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Cuota llena: no es motivo para romper la interfaz.
  }
}

export function removeStorage(key: string): void {
  safeStorage()?.removeItem(PREFIX + key);
}

/** Claves usadas por la app, en un solo sitio para evitar colisiones. */
export const STORAGE_KEYS = {
  theme: 'theme',
  language: 'language',
  cart: 'cart',
  cartSession: 'cart-session',
  auth: 'auth',
} as const;
